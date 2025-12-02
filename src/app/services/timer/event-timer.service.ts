// src/app/services/timer/event-timer.service.ts

import { Injectable, inject } from '@angular/core';
import { combineLatest, interval, map, Observable, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DateTime, Duration } from 'luxon';
import { EventTimerCategory, EventTimerChip, EventTimerDefinition } from '../../models';
import { EVENT_TIMERS } from '../../configs';
import { CustomTimerService } from './custom-timer.service';

@Injectable({ providedIn: 'root' })
export class EventTimerService {
  private readonly customTimers = inject(CustomTimerService);

  private readonly tick$ = interval(1000).pipe(startWith(0));

  // Convert signal to observable
  private readonly customTimers$ = toObservable(this.customTimers.customTimers$);

  /**
   * Stream of active event timer chips
   * Automatically filters out expired timers (if autoRemoveWhenExpired is true)
   * Sorted by: end date ascending, then seasons last
   */
  readonly eventTimerChips$: Observable<readonly EventTimerChip[]> = combineLatest([
    this.tick$,
    this.customTimers$,
  ]).pipe(
    map(([, customTimers]) => {
      const now = DateTime.utc();

      // Built-in event timers
      const builtInEvents = EVENT_TIMERS.map((def) => ({
        chip: this.buildEventTimerChip(def, now),
        def: { ...def, autoRemoveWhenExpired: def.autoRemoveWhenExpired ?? true },
      }));

      // Custom event timers
      const customEvents = customTimers
        .filter((t) => t.type === 'event' && t.endsAt)
        .map((t) => ({
          chip: this.buildCustomEventTimerChip(t, now),
          def: { autoRemoveWhenExpired: true }, // Custom events always auto-remove
        }));

      return [...builtInEvents, ...customEvents]
        .filter(({ chip, def }) => {
          // Remove expired timers if autoRemoveWhenExpired is true
          return !def.autoRemoveWhenExpired || !chip.isExpired;
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

          return 0;
        })
        .map(({ chip }) => chip);
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

  private buildCustomEventTimerChip(
    timer: {
      id: string;
      label: string;
      shortLabel: string;
      icon: string;
      endsAt?: string;
      category?: string;
    },
    now: DateTime,
  ): EventTimerChip {
    const endsAt = DateTime.fromISO(timer.endsAt!, { zone: 'utc' });
    const isExpired = now >= endsAt;

    let remaining: string;
    if (isExpired) {
      remaining = 'Expired';
    } else {
      const duration = endsAt.diff(now);
      remaining = this.formatEventRemaining(duration);
    }

    return {
      id: timer.id,
      label: timer.label,
      shortLabel: timer.shortLabel,
      icon: timer.icon,
      category: (timer.category as EventTimerCategory) || 'other',
      remaining,
      isExpired,
      endsAt,
    };
  }

  private parseEndDate(
    endsAt:
      | string
      | DateTime
      | { year: number; month: number; day: number; hour?: number; minute?: number },
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
