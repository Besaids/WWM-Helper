import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GuildEventConfig,
  GuildEventSlot,
  GuildEventTimersService,
  GuildTimerId,
  TimerPreferencesService,
  TimerService,
} from '../../services';
import { TimerChip } from '../../models';
import { DiamondToggleComponent } from '../ui';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule, DiamondToggleComponent, RouterModule],
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimersComponent {
  private readonly timerService = inject(TimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);
  private readonly guildTimers = inject(GuildEventTimersService);

  // All timer chips (unfiltered)
  readonly timers$ = this.timerService.timerChips$;

  // Enabled timer IDs (Set<string>)
  readonly enabledIds$ = this.timerPrefs.enabledTimerIds$;

  readonly guildConfigs$ = this.guildTimers.configs$;
  readonly guildUtcOffsets = Array.from({ length: 27 }, (_, i) => i - 12); // -12..14

  readonly guildHourOptions = Array.from({ length: 24 }, (_, i) => i); // 0..23
  readonly guildMinuteOptions = [0, 15, 30, 45];

  // Which timer's details drawer is open in the settings list
  openTimerId: string | null = null;

  // Which timer has the long "show more" body expanded (inside the details drawer)
  longDetailsId: string | null = null;

  getChip(timers: readonly TimerChip[], id: string): TimerChip | undefined {
    return timers.find((t) => t.id === id);
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
}
