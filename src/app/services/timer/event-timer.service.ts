// src/app/services/timer/event-timer.service.ts

import { Injectable } from '@angular/core';
import { interval, map, Observable, startWith } from 'rxjs';
import { DateTime, Duration } from 'luxon';
import { EventTimerChip, EventTimerDefinition } from '../../models';
import { EVENT_TIMERS } from '../../configs';

@Injectable({ providedIn: 'root' })
export class EventTimerService {
  private readonly tick$ = interval(1000).pipe(startWith(0));

  /**
   * Stream of active event timer chips
   * Automatically filters out expired timers (if autoRemoveWhenExpired is true)
   * Sorted by: end date ascending, then seasons last
   */
  readonly eventTimerChips$: Observable<readonly EventTimerChip[]> = this.tick$.pipe(
    map(() => {
      const now = DateTime.utc();

      return EVENT_TIMERS.map((def) => ({
        chip: this.buildEventTimerChip(def, now),
        def,
      }))
        .filter(({ chip, def }) => {
          // Remove expired timers if autoRemoveWhenExpired is true (default)
          const shouldAutoRemove = def.autoRemoveWhenExpired ?? true;
          return !shouldAutoRemove || !chip.isExpired;
        })
        .sort((a, b) => {
          // Sort by end date first (soonest first)
          const timeDiff = a.chip.endsAt.toMillis() - b.chip.endsAt.toMillis();
          if (timeDiff !== 0) {
            return timeDiff;
          }

          // If end times are equal, put seasons last
          if (a.chip.category === 'season' && b.chip.category !== 'season') {
            return 1;
          }
          if (a.chip.category !== 'season' && b.chip.category === 'season') {
            return -1;
          }

          // Otherwise maintain original order
          return 0;
        })
        .map(({ chip }) => chip);
    }),
  );

  /**
   * Get all event timers including expired ones
   */
  readonly allEventTimerChips$: Observable<readonly EventTimerChip[]> = this.tick$.pipe(
    map(() => {
      const now = DateTime.utc();
      return EVENT_TIMERS.map((def) => this.buildEventTimerChip(def, now));
    }),
  );

  private buildEventTimerChip(def: EventTimerDefinition, now: DateTime): EventTimerChip {
    const endsAt = this.parseEndDate(def.endsAt);
    const isExpired = now >= endsAt;

    let remaining: string;
    if (isExpired) {
      remaining = 'Expired';
    } else {
      const duration = endsAt.diff(now);
      remaining = this.formatEventRemaining(duration);
    }

    return {
      id: def.id,
      label: def.label,
      shortLabel: def.shortLabel,
      icon: def.icon,
      category: def.category,
      remaining,
      isExpired,
      endsAt,
    };
  }

  private parseEndDate(
    endsAt: string | DateTime | { year: number; month: number; day: number; hour?: number; minute?: number },
  ): DateTime {
    if (typeof endsAt === 'string') {
      return DateTime.fromISO(endsAt, { zone: 'utc' });
    }

    if (DateTime.isDateTime(endsAt)) {
      return endsAt;
    }

    // Object format - default to daily reset time (21:00 UTC) if not specified
    return DateTime.utc(
      endsAt.year,
      endsAt.month,
      endsAt.day,
      endsAt.hour ?? 21,
      endsAt.minute ?? 0,
      0,
      0,
    );
  }

  /**
   * Format remaining time for event timers
   * Shows days for longer durations, full breakdown for shorter ones
   */
  private formatEventRemaining(duration: Duration): string {
    const totalSeconds = Math.max(0, Math.floor(duration.as('seconds')));

    const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    const days = Math.floor(totalSeconds / secondsInDay);
    const dayRemainder = totalSeconds % secondsInDay;

    const hours = Math.floor(dayRemainder / secondsInHour);
    const minutes = Math.floor((dayRemainder % secondsInHour) / secondsInMinute);
    const seconds = dayRemainder % secondsInMinute;

    // If more than 30 days, show in weeks and days
    if (days > 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      if (remainingDays === 0) {
        return `${weeks}w`;
      }
      return `${weeks}w ${remainingDays}d`;
    }

    // If more than 7 days, show days and hours
    if (days > 7) {
      return `${days}d ${hours}h`;
    }

    // If ≥ 1 day, show days, hours, minutes
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    // Less than 1 day: show hours, minutes, seconds
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
