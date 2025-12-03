import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimerService } from '../../services/timer/timer.service';
import { CustomTimerService } from '../../services/timer/custom-timer.service';
import { ChecklistStateService } from '../../services/checklist/checklist-state.service';
import { ChecklistRegistryService } from '../../services/checklist/checklist-registry.service';
import { CustomChecklistService } from '../../services/checklist/custom-checklist.service';
import { ChecklistItem, TimerChip, CustomTimerDefinition, ChecklistFrequency } from '../../models';
import { ChecklistToggleComponent } from '../ui';
import { DateTime } from 'luxon';
import { toSignal } from '@angular/core/rxjs-interop';

interface HomeSectionItem {
  label: string;
  description?: string;
}

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  items: HomeSectionItem[];
  routerLink: string;
  ctaLabel: string;
}

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
  private readonly checklistState = inject(ChecklistStateService);
  private readonly checklistRegistry = inject(ChecklistRegistryService);
  private readonly customChecklistService = inject(CustomChecklistService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Create a signal to trigger recomputation
  private readonly refreshTrigger = signal(0);

  // Convert timer chips to signal
  private readonly timerChips = toSignal(this.timerService.timerChips$, { initialValue: [] });

  // Event timers signal
  private readonly eventTimers = this.customTimerService.customTimers$;

  // Upcoming timers (max 4, includes custom event timers)
  readonly upcomingTimers = computed(() => {
    const chips = this.timerChips();
    const now = DateTime.utc();

    // Get event timers that haven't expired
    const events = this.eventTimers().filter((t) => {
      if (t.type !== 'event' || !t.endsAt) return false;
      const endsAt = DateTime.fromISO(t.endsAt);
      return now < endsAt; // Not expired
    });

    // Convert event timers to chips
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

    // Convert regular chips
    const withActiveFlag: TimerWithPriority[] = chips.map((chip) => {
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
      .slice(0, 4);
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

  readonly sections: HomeSection[] = [
    {
      id: 'timers',
      title: 'Timers',
      subtitle: 'Live UTC-based countdowns for daily and weekly resets plus key world events.',
      items: [
        {
          label: 'Reset tracking',
          description:
            'Daily and weekly resets with clear UTC times so you never guess when systems flip.',
        },
        {
          label: 'World & event timers',
          description:
            'Arena 1v1, Fireworks events, Trading week reset, Mirage Boat and other time-based content.',
        },
        {
          label: 'Custom strip',
          description:
            'Pick which timers appear in the top strip; preferences are saved per browser.',
        },
      ],
      routerLink: '/timers',
      ctaLabel: 'Open timers',
    },
    {
      id: 'checklist',
      title: 'Checklists',
      subtitle: "Track what you've actually done this cycle with daily and weekly task lists.",
      items: [
        {
          label: 'Daily & weekly lists',
          description:
            'Core priorities first, then optional extras; state resets automatically with the game.',
        },
        {
          label: 'Detailed or compact view',
          description:
            'Swap between full descriptions or a denser list depending on how much text you want.',
        },
        {
          label: 'Local storage only',
          description: 'Progress is stored in your browser; no login or external accounts needed.',
        },
      ],
      routerLink: '/checklist',
      ctaLabel: 'Open checklist',
    },
    {
      id: 'guides',
      title: 'Guides',
      subtitle: 'Long-form explanations for systems that deserve more than a tooltip.',
      items: [
        {
          label: 'Trading / Commerce',
          description:
            'How Trade Week works, Local vs Remote prices, mansion slots, and using guild tools.',
        },
        {
          label: 'Integrated with tools',
          description:
            'Guides reference related timers and checklist items so everything stays in sync.',
        },
        {
          label: 'Room to grow',
          description: 'Space reserved for future guides as new systems or events are added.',
        },
      ],
      routerLink: '/guides',
      ctaLabel: 'Browse guides',
    },
  ];

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
      label: 'Reddit Community r/wherewindsmeet_',
      href: 'https://www.reddit.com/r/wherewindsmeet_/',
    },
    {
      label: 'Reddit Community r/WhereWindsMeet',
      href: 'https://www.reddit.com/r/WhereWindsMeet/',
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
}
