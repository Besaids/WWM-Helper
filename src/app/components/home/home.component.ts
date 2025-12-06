import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TimerService } from '../../services/timer/timer.service';
import { CustomTimerService } from '../../services/timer/custom-timer.service';
import { TimerPreferencesService } from '../../services/timer/timer-preferences.service';
import { ChecklistStateService } from '../../services/checklist/checklist-state.service';
import { ChecklistRegistryService } from '../../services/checklist/checklist-registry.service';
import { CustomChecklistService } from '../../services/checklist/custom-checklist.service';
import { ChecklistItem, TimerChip, CustomTimerDefinition, ChecklistFrequency } from '../../models';
import { ChecklistToggleComponent } from '../ui';
import { DateTime } from 'luxon';
import { toSignal } from '@angular/core/rxjs-interop';

interface TimerState {
  type: 'normal' | 'warning' | 'urgent' | 'active';
  warningProgress?: number; // 0-1 for gradient (0 = yellow at 30m, 1 = red at 0m)
}

interface TimerWithPriority extends TimerChip {
  isActive: boolean;
  isEvent: boolean;
  eventTimer?: CustomTimerDefinition;
  state: TimerState;
  warningStyle: Record<string, string>;
}

interface PinnedBucket {
  id: 'daily' | 'weekly' | 'seasonal-period';
  label: string;
  items: ChecklistItem[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChecklistToggleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly timerService = inject(TimerService);
  private readonly customTimerService = inject(CustomTimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);
  private readonly checklistState = inject(ChecklistStateService);
  private readonly checklistRegistry = inject(ChecklistRegistryService);
  private readonly customChecklistService = inject(CustomChecklistService);
  private readonly router = inject(Router);

  // Create a signal to trigger recomputation
  private readonly refreshTrigger = signal(0);

  // Convert timer chips to signal
  private readonly timerChips = toSignal(this.timerService.timerChips$, { initialValue: [] });

  // Event timers signal
  private readonly eventTimers = this.customTimerService.customTimers$;

  // Enabled timer IDs (shown in strip) - to filter out duplicates
  private readonly enabledTimerIds = toSignal(this.timerPrefs.enabledTimerIds$, {
    initialValue: new Set<string>(),
  });

  // Upcoming timers - excludes those already in the timer strip
  readonly upcomingTimers = computed(() => {
    const chips = this.timerChips();
    const enabledIds = this.enabledTimerIds();
    const now = DateTime.utc();

    // Get event timers that haven't expired
    const events = this.eventTimers().filter((t) => {
      if (t.type !== 'event' || !t.endsAt) return false;
      const endsAt = DateTime.fromISO(t.endsAt);
      return now < endsAt; // Not expired
    });

    // Convert event timers to chips (events are custom, so not in strip)
    const eventChips: TimerWithPriority[] = events.map((event) => {
      const endsAt = DateTime.fromISO(event.endsAt!);
      const diff = endsAt.diff(now);
      const remaining = this.formatDuration(diff.as('seconds'));
      const state = this.getTimerState(event.label, remaining);

      return {
        id: event.id,
        label: event.label,
        shortLabel: event.shortLabel,
        icon: event.icon,
        remaining,
        isActive: false,
        isEvent: true,
        eventTimer: event,
        state,
        warningStyle: this.getWarningStyle(state),
      };
    });

    // Convert regular chips, EXCLUDING those already in the timer strip
    const withActiveFlag: TimerWithPriority[] = chips
      .filter((chip) => !enabledIds.has(chip.id)) // Exclude timers shown in strip
      .map((chip) => {
        const isActive = chip.label.includes('(open)');
        const state = this.getTimerState(chip.label, chip.remaining);

        return {
          ...chip,
          isActive,
          isEvent: false,
          state,
          warningStyle: this.getWarningStyle(state),
        };
      });

    // Combine and sort
    const allTimers = [...eventChips, ...withActiveFlag];

    return allTimers
      .sort((a, b) => {
        // Push "Not configured" to end
        const aNotConfigured = a.remaining === 'Not configured';
        const bNotConfigured = b.remaining === 'Not configured';
        if (aNotConfigured !== bNotConfigured) {
          return aNotConfigured ? 1 : -1;
        }

        // Active timers first
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;

        // Then by remaining time
        return this.compareRemainingTime(a.remaining, b.remaining);
      })
      .slice(0, 6); // Allow more since we're filtering duplicates
  });

  // Pinned tasks organized by buckets
  readonly pinnedBuckets = computed((): PinnedBucket[] => {
    // Read the refresh trigger to make this reactive
    this.refreshTrigger();

    const buckets: PinnedBucket[] = [];

    // Helper to get pinned items for a frequency
    const getPinnedForFrequency = (frequencies: string[]): ChecklistItem[] => {
      const allItems: ChecklistItem[] = [];

      for (const freq of frequencies) {
        const items = this.checklistRegistry.getItemsForType(freq as ChecklistFrequency);
        const pinned = items.filter(
          (item) => this.checklistState.isPinned(item) && !this.checklistState.isChecked(item),
        );
        allItems.push(...pinned);
      }

      // Sort: custom items first, then by label
      return allItems.sort((a, b) => {
        if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
        return a.label.localeCompare(b.label);
      });
    };

    // Daily bucket (daily + seasonal-daily + custom daily)
    const dailyItems = getPinnedForFrequency(['daily', 'seasonal-daily']);
    const customDaily = this.customChecklistService
      .getAll()
      .filter((item) => item.importance === 'daily')
      .filter((item) => this.checklistState.isPinned(item) && !this.checklistState.isChecked(item));

    const allDaily = [...customDaily, ...dailyItems].sort((a, b) => {
      if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
      return a.label.localeCompare(b.label);
    });

    if (allDaily.length > 0) {
      buckets.push({ id: 'daily', label: 'Daily', items: allDaily });
    }

    // Weekly bucket (weekly + seasonal-weekly + custom weekly)
    const weeklyItems = getPinnedForFrequency(['weekly', 'seasonal-weekly']);
    const customWeekly = this.customChecklistService
      .getAll()
      .filter((item) => item.importance === 'weekly')
      .filter((item) => this.checklistState.isPinned(item) && !this.checklistState.isChecked(item));

    const allWeekly = [...customWeekly, ...weeklyItems].sort((a, b) => {
      if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
      return a.label.localeCompare(b.label);
    });

    if (allWeekly.length > 0) {
      buckets.push({ id: 'weekly', label: 'Weekly', items: allWeekly });
    }

    // Season goals bucket (seasonal-period only)
    const seasonalPeriod = getPinnedForFrequency(['seasonal-period']);
    if (seasonalPeriod.length > 0) {
      buckets.push({ id: 'seasonal-period', label: 'Season Goals', items: seasonalPeriod });
    }

    return buckets;
  });

  readonly hasPinnedItems = computed(() => this.pinnedBuckets().length > 0);

  readonly resourceLinks = [
    {
      label: 'Official Website',
      href: 'https://www.wherewindsmeetgame.com/',
    },
    {
      label: 'Official Discord',
      href: 'https://discord.gg/wherewindsmeet',
    },
    {
      label: 'Steam Page',
      href: 'https://store.steampowered.com/app/3564740/Where_Winds_Meet/',
    },
    {
      label: 'Reddit r/wherewindsmeet_',
      href: 'https://www.reddit.com/r/wherewindsmeet_/',
    },
    {
      label: 'Reddit r/WhereWindsMeet',
      href: 'https://www.reddit.com/r/WhereWindsMeet/',
    },
    {
      label: 'WWM Combos (PvP Database)',
      href: 'https://www.wwmcombos.com/',
    },
    {
      label: 'Map Genie',
      href: 'https://mapgenie.io/where-winds-meet/maps/world',
    },
  ];

  private formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Expired';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 && days === 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  }

  private compareRemainingTime(a: string, b: string): number {
    const parseTime = (str: string): number => {
      const match = str.match(/(\d+)d|(\d+)h|(\d+)m|(\d+)s/g);
      if (!match) return Infinity;

      let seconds = 0;
      for (const part of match) {
        const value = parseInt(part);
        if (part.includes('d')) seconds += value * 86400;
        if (part.includes('h')) seconds += value * 3600;
        if (part.includes('m')) seconds += value * 60;
        if (part.includes('s')) seconds += value;
      }
      return seconds;
    };

    return parseTime(a) - parseTime(b);
  }

  /**
   * Parse remaining time string to seconds
   */
  private parseRemaining(remaining: string | null | undefined): number {
    if (!remaining) return Infinity;

    const lower = remaining.toLowerCase().trim();

    // Treat open/now states as 0
    if (lower === 'open' || lower.includes('(open)') || lower.includes('now')) {
      return 0;
    }

    let totalSeconds = 0;

    const dayMatch = /(\d+)\s*d/.exec(lower);
    if (dayMatch) totalSeconds += Number(dayMatch[1]) * 86400;

    const hourMatch = /(\d+)\s*h/.exec(lower);
    if (hourMatch) totalSeconds += Number(hourMatch[1]) * 3600;

    const minuteMatch = /(\d+)\s*m/.exec(lower);
    if (minuteMatch) totalSeconds += Number(minuteMatch[1]) * 60;

    const secondMatch = /(\d+)\s*s/.exec(lower);
    if (secondMatch) totalSeconds += Number(secondMatch[1]);

    return totalSeconds || Infinity;
  }

  /**
   * Get timer state for styling (matches timer-strip logic)
   */
  private getTimerState(label: string, remaining: string | null | undefined): TimerState {
    // Check if active/open first
    if (label.toLowerCase().includes('(open)')) {
      return { type: 'active' };
    }

    const seconds = this.parseRemaining(remaining);

    // 30 minutes = 1800 seconds
    if (seconds <= 1800) {
      // Calculate gradient progress: 0 at 30m (yellow), 1 at 0m (red)
      const progress = 1 - seconds / 1800;
      return {
        type: seconds <= 600 ? 'urgent' : 'warning',
        warningProgress: Math.max(0, Math.min(1, progress)),
      };
    }

    return { type: 'normal' };
  }

  /**
   * Get CSS custom properties for warning gradient
   */
  private getWarningStyle(state: TimerState): Record<string, string> {
    if (
      (state.type === 'warning' || state.type === 'urgent') &&
      state.warningProgress !== undefined
    ) {
      // Interpolate from yellow (rgb(234, 179, 8)) to red (rgb(239, 68, 68))
      const progress = state.warningProgress;

      const r = Math.round(234 + (239 - 234) * progress);
      const g = Math.round(179 + (68 - 179) * progress);
      const b = Math.round(8 + (68 - 8) * progress);

      return {
        '--timer-warning-color': `rgb(${r}, ${g}, ${b})`,
      };
    }
    return {};
  }

  // Checklist toggle handlers
  isChecked(item: ChecklistItem): boolean {
    return this.checklistState.isChecked(item);
  }

  onToggleItem(checked: boolean, item: ChecklistItem): void {
    this.checklistState.toggle(item, checked);
    // Trigger recomputation of pinnedBuckets
    this.refreshTrigger.update((v) => v + 1);
  }

  /**
   * Navigate to a guide route, optionally with a section fragment
   */
  navigateToGuide(item: ChecklistItem): void {
    if (!item.route) return;

    if (item.section) {
      this.router.navigate([item.route], { fragment: item.section });
    } else {
      this.router.navigate([item.route]);
    }
  }
}
