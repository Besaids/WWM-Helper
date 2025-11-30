// src/app/components/timer-strip/timer-strip.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { TimerService } from '../../services/timer/timer.service';
import { TimerPreferencesService } from '../../services/timer/timer-preferences.service';

@Component({
  selector: 'app-timer-strip',
  standalone: true,
  imports: [CommonModule], // gives @if, @for, AsyncPipe, ngClass, etc.
  templateUrl: './timer-strip.component.html',
  styleUrls: ['./timer-strip.component.scss'],
})
export class TimerStripComponent {
  private readonly timerService = inject(TimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);

  // Only show timers that the user has enabled,
  // and order them so the soonest event is on the left.
  readonly timers$ = combineLatest([
    this.timerService.timerChips$,
    this.timerPrefs.enabledTimerIds$,
  ]).pipe(
    map(([chips, enabledIds]) =>
      chips
        .filter((chip) => enabledIds.has(chip.id))
        .slice() // avoid mutating source array
        .sort(
          (a, b) => this.getRemainingSortKey(a.remaining) - this.getRemainingSortKey(b.remaining),
        ),
    ),
  );

  /**
   * Convert a human-readable remaining string like:
   *  - "6d 2h 20m"
   *  - "5h 10m 26s left"
   *  - "10m 5s"
   *  - "open"
   * into a numeric value in seconds for sorting.
   *
   * "open" (or similar) is treated as 0 seconds remaining.
   * Unparseable strings fall back to Infinity.
   */
  private getRemainingSortKey(remaining: string | null | undefined): number {
    if (!remaining) {
      return Number.POSITIVE_INFINITY;
    }

    const lower = remaining.toLowerCase().trim();

    // Treat open/now-ish states as the earliest.
    if (
      lower === 'open' ||
      lower.startsWith('open ') ||
      lower.includes(' open') ||
      lower.includes('now')
    ) {
      return 0;
    }

    let totalSeconds = 0;

    const dayMatch = /(\d+)\s*d/.exec(lower);
    if (dayMatch) {
      totalSeconds += Number(dayMatch[1]) * 24 * 60 * 60;
    }

    const hourMatch = /(\d+)\s*h/.exec(lower);
    if (hourMatch) {
      totalSeconds += Number(hourMatch[1]) * 60 * 60;
    }

    const minuteMatch = /(\d+)\s*m/.exec(lower);
    if (minuteMatch) {
      totalSeconds += Number(minuteMatch[1]) * 60;
    }

    const secondMatch = /(\d+)\s*s/.exec(lower);
    if (secondMatch) {
      totalSeconds += Number(secondMatch[1]);
    }

    // If we didn’t manage to parse anything but there is a number in there,
    // use that as a very rough fallback (still better than no ordering).
    if (totalSeconds === 0) {
      const firstNumber = /(\d+)/.exec(lower);
      if (firstNumber) {
        return Number(firstNumber[1]);
      }
      return Number.POSITIVE_INFINITY;
    }

    return totalSeconds;
  }

  /** Urgent if remaining time is ≤ 10 minutes (600 seconds). */
  isUrgent(remaining: string | null | undefined): boolean {
    return this.getRemainingSortKey(remaining) <= 600;
  }
}
