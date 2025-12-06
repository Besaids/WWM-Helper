import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  CustomTimerService,
  EventTimerService,
  GuildEventConfig,
  GuildEventSlot,
  GuildEventTimersService,
  GuildTimerId,
  TimerPreferencesService,
  TimerService,
} from '../../services';
import {
  CustomTimerDefinition,
  CustomTimerFormData,
  EventTimerCategory,
  TimerChip,
  TimerDetails,
} from '../../models';
import { DiamondToggleComponent } from '../ui';
import { RouterModule } from '@angular/router';
import { TIMER_DETAILS_CONFIG } from '../../configs';
import { CustomTimerModalComponent } from './custom-timer-modal';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule, DiamondToggleComponent, RouterModule, CustomTimerModalComponent],
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimersComponent {
  private readonly timerService = inject(TimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);
  private readonly guildTimers = inject(GuildEventTimersService);
  private readonly eventTimerService = inject(EventTimerService);
  private readonly customTimerService = inject(CustomTimerService);

  // All timer chips (unfiltered)
  readonly timers$ = this.timerService.timerChips$;
  readonly eventTimers$ = this.eventTimerService.eventTimerChips$;

  // Enabled timer IDs (Set<string>)
  readonly enabledIds$ = this.timerPrefs.enabledTimerIds$;

  readonly guildConfigs$ = this.guildTimers.configs$;
  readonly guildUtcOffsets = Array.from({ length: 27 }, (_, i) => i - 12); // -12..14

  readonly guildHourOptions = Array.from({ length: 24 }, (_, i) => i); // 0..23
  readonly guildMinuteOptions = [0, 15, 30, 45];

  // Timer details config
  readonly timerDetailsConfig = TIMER_DETAILS_CONFIG;

  // Modal state
  readonly isModalOpen = signal(false);
  readonly editingCustomTimer = signal<CustomTimerDefinition | null>(null);

  // Custom timers
  readonly customTimers$ = this.customTimerService.customTimers$;

  // Which timer's details drawer is open in the settings list
  openTimerId: string | null = null;

  // Which timer has the long "show more" body expanded (inside the details drawer)
  longDetailsId: string | null = null;

  getChip(timers: readonly TimerChip[], id: string): TimerChip | undefined {
    return timers.find((t) => t.id === id);
  }

  getTimerDetails(id: string): TimerDetails | undefined {
    return this.timerDetailsConfig[id];
  }

  // Helper to safely get guild config by timer id
  getGuildConfig(
    configs: Partial<Record<GuildTimerId, GuildEventConfig>>,
    timerId: string,
  ): GuildEventConfig | undefined {
    return configs[timerId as GuildTimerId];
  }

  // Helper to check if a timer id is a guild timer
  isGuildTimerId(id: string): id is GuildTimerId {
    return id === 'guild-breaking-army' || id === 'guild-test-your-skills';
  }

  onToggleTimer(id: string): void {
    this.timerPrefs.toggle(id);
  }

  toggleInfo(id: string): void {
    const isOpening = this.openTimerId !== id;

    // Toggle which timer is open
    this.openTimerId = isOpening ? id : null;

    // If we are closing the currently-open one, also collapse the long body
    if (!this.openTimerId || this.openTimerId !== id) {
      this.longDetailsId = null;
    }

    // When *opening* a timer, gently scroll it into view on mobile
    if (isOpening) {
      // Wait for the DOM to update so the details block actually exists
      setTimeout(() => this.scrollTimerIntoView(id), 0);
    }
  }

  // Helper method for saving guild timer from template
  onSaveGuildTimer(
    timerId: string,
    tzHoursValue: string,
    day1: string,
    hour1: string,
    minute1: string,
    day2: string,
    hour2: string,
    minute2: string,
  ): void {
    if (!this.isGuildTimerId(timerId)) {
      return;
    }

    const timezoneOffsetMinutes = +tzHoursValue * 60;
    const slots = this.buildGuildSlots(day1, hour1, minute1, day2, hour2, minute2);

    this.saveGuildTimer(timerId, timezoneOffsetMinutes, slots);
  }

  // Helper for deleting guild timer from template
  onDeleteGuildTimer(timerId: string): void {
    if (!this.isGuildTimerId(timerId)) {
      return;
    }
    this.deleteGuildTimer(timerId);
  }

  saveGuildTimer(id: GuildTimerId, timezoneOffsetMinutes: number, slots: GuildEventSlot[]): void {
    this.guildTimers.upsertConfig(id, {
      timezoneOffsetMinutes,
      slots,
    });
  }

  deleteGuildTimer(id: GuildTimerId): void {
    this.guildTimers.deleteConfig(id);
  }

  buildGuildSlots(
    day1: string,
    hour1: string,
    minute1: string,
    day2: string,
    hour2: string,
    minute2: string,
  ): GuildEventSlot[] {
    const slots: GuildEventSlot[] = [];

    const s1 = this.parseSlot(day1, hour1, minute1);
    if (s1) slots.push(s1);

    const s2 = this.parseSlot(day2, hour2, minute2);
    if (s2) slots.push(s2);

    return slots;
  }

  getGuildTimezoneHours(config: GuildEventConfig | undefined | null): number {
    // Default to UTC+0 if we have no stored config yet
    return (config?.timezoneOffsetMinutes ?? 0) / 60;
  }

  private parseSlot(day: string, hour: string, minute: string): GuildEventSlot | null {
    const weekday = Number(day);
    if (!weekday) return null;

    const h = Number(hour);
    const m = Number(minute);

    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      weekday < 1 ||
      weekday > 7 ||
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59
    ) {
      return null;
    }

    return { weekday, hour: h, minute: m };
  }

  private scrollTimerIntoView(id: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Only do this on mobile-ish widths; avoid jumping desktop viewport
    if (window.innerWidth > 768) {
      return;
    }

    const el = document.getElementById(`timer-${id}`);
    if (!el) {
      return;
    }

    // Offset so the row sits nicely below the top nav / timers strip
    const headerOffset = 80; // tweak if needed

    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }

  toggleLongDetails(id: string): void {
    this.longDetailsId = this.longDetailsId === id ? null : id;
  }

  isEnabled(enabledIds: Set<string>, id: string): boolean {
    return enabledIds.has(id);
  }

  getCategoryLabel(category: EventTimerCategory): string {
    switch (category) {
      case 'battle-pass':
        return 'Battle Pass';
      case 'season':
        return 'Season';
      case 'gacha-standard':
        return 'Gacha Banner';
      case 'gacha-special':
        return 'Special Gacha';
      case 'limited-event':
        return 'Limited Event';
      default:
        return 'Event';
    }
  }

  openCreateModal(): void {
    this.editingCustomTimer.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(timer: CustomTimerDefinition): void {
    this.editingCustomTimer.set(timer);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingCustomTimer.set(null);
  }

  handleModalSave(formData: CustomTimerFormData): void {
    const editing = this.editingCustomTimer();

    if (editing) {
      // Update existing custom timer
      const updated = this.customTimerService.update(editing.id, formData);
      console.log('Custom timer updated:', updated);
    } else {
      // Create new custom timer
      const created = this.customTimerService.create(formData);
      console.log('Custom timer created:', created);
    }

    this.closeModal();
  }

  // Add these helper methods to TimersComponent

  isCustomTimer(timerId: string): boolean {
    return timerId.startsWith('custom-');
  }

  getCustomTimer(timerId: string): CustomTimerDefinition | undefined {
    return this.customTimerService.getById(timerId);
  }

  deleteCustomTimer(timerId: string): void {
    if (confirm('Are you sure you want to delete this timer?')) {
      const deleted = this.customTimerService.delete(timerId);
      if (deleted) {
        console.log('Custom timer deleted:', timerId);
        // Close details if this timer's details are open
        if (this.openTimerId === timerId) {
          this.openTimerId = null;
          this.longDetailsId = null;
        }
      }
    }
  }

  getCustomTimerSummary(timerId: string): string | null {
    const timer = this.getCustomTimer(timerId);
    return timer?.summary || null;
  }

  /**
   * Get the local time when the timer ends/resets, formatted as HH:mm
   * Rounds to nearest 30 minutes (XX:00 or XX:30)
   * Returns null if the remaining time cannot be parsed
   */
  getLocalEndTime(remaining: string): string | null {
    const seconds = this.parseRemainingToSeconds(remaining);
    if (seconds === null || seconds <= 0) {
      return null;
    }

    const endTime = DateTime.local().plus({ seconds });

    // Round to nearest 30 minutes
    const minute = endTime.minute;
    let roundedMinute: number;
    let hourAdjust = 0;

    if (minute < 15) {
      roundedMinute = 0;
    } else if (minute < 45) {
      roundedMinute = 30;
    } else {
      roundedMinute = 0;
      hourAdjust = 1;
    }

    const roundedTime = endTime
      .set({ minute: roundedMinute, second: 0, millisecond: 0 })
      .plus({ hours: hourAdjust });
    return roundedTime.toFormat('HH:mm');
  }

  /**
   * Parse remaining time string like "4h 20m 5s" or "8w 5d" to total seconds
   */
  private parseRemainingToSeconds(remaining: string): number | null {
    if (!remaining) return null;

    const lower = remaining.toLowerCase().trim();

    // Handle special states
    if (lower === 'open' || lower.includes('(open)') || lower.includes('now')) {
      return 0;
    }

    if (lower === 'not configured' || lower === 'expired') {
      return null;
    }

    let totalSeconds = 0;

    // Parse weeks
    const weekMatch = /(\d+)\s*w/.exec(lower);
    if (weekMatch) totalSeconds += Number(weekMatch[1]) * 7 * 86400;

    // Parse days
    const dayMatch = /(\d+)\s*d/.exec(lower);
    if (dayMatch) totalSeconds += Number(dayMatch[1]) * 86400;

    // Parse hours
    const hourMatch = /(\d+)\s*h/.exec(lower);
    if (hourMatch) totalSeconds += Number(hourMatch[1]) * 3600;

    // Parse minutes
    const minuteMatch = /(\d+)\s*m(?!s)/.exec(lower); // (?!s) to avoid matching 'ms'
    if (minuteMatch) totalSeconds += Number(minuteMatch[1]) * 60;

    // Parse seconds
    const secondMatch = /(\d+)\s*s/.exec(lower);
    if (secondMatch) totalSeconds += Number(secondMatch[1]);

    return totalSeconds > 0 ? totalSeconds : null;
  }

  /**
   * Get a "Why this matters" summary for a timer
   * Returns null if no meaningful summary can be derived
   */
  getWhyItMatters(timerId: string): string | null {
    const mattersMap: Record<string, string> = {
      'daily-reset': 'Regain Stamina, refresh errands and reset daily activities.',
      'weekly-reset': 'Raid lockouts, currency caps and weekly shop stock refresh.',
      'arena-1v1': 'Ranked 1v1 PvP window for climbing the ladder.',
      'trading-week-reset': 'Trade prices and commerce routes reset.',
      'trade-price-check': 'Check current trade prices before they rotate.',
      'mirage-boat': 'Limited-time event boat for exploration rewards.',
      'fireworks-show': 'Participate in the fireworks event for rewards.',
      'fireworks-festival': 'Festival activities and special rewards.',
      'fireworks-bidding': 'Bid on exclusive items during the event.',
      'guild-breaking-army': 'Guild group content for Treasure Tokens.',
      'guild-test-your-skills': 'Guild competitive event for rewards.',
    };

    return mattersMap[timerId] || null;
  }
}
