import { Injectable } from '@angular/core';
import { DateTime, Duration } from 'luxon';
import { interval, map, startWith } from 'rxjs';
import { TimerDefinition, TimerSchedule } from '../models/timer-definition.model';
import { TimerChip } from '../models/timer-chip.model';
import { TIMER_DEFINITIONS } from '../configs';

type DailyMultiSchedule = Extract<TimerSchedule, { type: 'daily-multi' }>;
type WeeklyRangeSchedule = Extract<TimerSchedule, { type: 'weekly-range' }>;

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly tick$ = interval(1000).pipe(startWith(0));

  readonly timerChips$ = this.tick$.pipe(
    map(() => {
      const now = DateTime.utc();
      return TIMER_DEFINITIONS.map((def) => this.buildChip(def, now));
    }),
  );

  private buildChip(def: TimerDefinition, now: DateTime): TimerChip {
    const schedule = def.schedule;

    // Arena windows (daily-multi)
    if (schedule.type === 'daily-multi') {
      const { nextBoundary, isOpen } = this.getDailyMultiBoundary(schedule, now);
      const remaining = nextBoundary ? this.formatRemaining(nextBoundary.diff(now)) : '—';

      return {
        id: def.id,
        label: isOpen ? `${def.label} (open)` : def.label,
        shortLabel: def.shortLabel,
        icon: def.icon,
        remaining: isOpen ? `${remaining} left` : `in ${remaining}`,
      };
    }

    // Weekly range window (Seats bidding)
    if (schedule.type === 'weekly-range') {
      const { nextBoundary, isOpen } = this.getWeeklyRangeBoundary(schedule, now);
      const remaining = nextBoundary ? this.formatRemaining(nextBoundary.diff(now)) : '—';

      return {
        id: def.id,
        label: isOpen ? `${def.label} (open)` : def.label,
        shortLabel: def.shortLabel,
        icon: def.icon,
        remaining: isOpen ? `${remaining} left` : `in ${remaining}`,
      };
    }

    // Everything else: simple next boundary
    const next = this.getNextBoundary(schedule, now);
    const remaining = next ? this.formatRemaining(next.diff(now)) : '—';

    return {
      id: def.id,
      label: def.label,
      shortLabel: def.shortLabel,
      icon: def.icon,
      remaining,
    };
  }

  /**
   * Next boundary for daily / weekly / weekly-multi.
   */
  private getNextBoundary(schedule: TimerSchedule, now: DateTime): DateTime | null {
    switch (schedule.type) {
      case 'daily': {
        let next = now.set({
          hour: schedule.hour,
          minute: schedule.minute,
          second: 0,
          millisecond: 0,
        });

        if (next <= now) {
          next = next.plus({ days: 1 });
        }

        return next;
      }

      case 'weekly': {
        let next = now
          .set({
            hour: schedule.hour,
            minute: schedule.minute,
            second: 0,
            millisecond: 0,
          })
          .set({ weekday: schedule.weekday });

        if (next <= now) {
          next = next.plus({ weeks: 1 });
        }

        return next;
      }

      case 'weekly-multi': {
        let best: DateTime | null = null;

        for (const weekday of schedule.weekdays) {
          let dt = now
            .set({
              hour: schedule.hour,
              minute: schedule.minute,
              second: 0,
              millisecond: 0,
            })
            .set({ weekday });

          if (dt <= now) {
            dt = dt.plus({ weeks: 1 });
          }

          if (!best || dt < best) {
            best = dt;
          }
        }

        return best;
      }

      // daily-multi & weekly-range handled in dedicated helpers
      default:
        return null;
    }
  }

  /**
   * Daily multi-time windows (Arena).
   */
  private getDailyMultiBoundary(
    schedule: DailyMultiSchedule,
    now: DateTime,
  ): { nextBoundary: DateTime | null; isOpen: boolean } {
    const windowHours = schedule.windowHours ?? 0;

    if (!windowHours) {
      let best: DateTime | null = null;
      for (const t of schedule.times) {
        let candidate = now.set({
          hour: t.hour,
          minute: t.minute,
          second: 0,
          millisecond: 0,
        });

        if (candidate <= now) {
          candidate = candidate.plus({ days: 1 });
        }

        if (!best || candidate < best) {
          best = candidate;
        }
      }
      return { nextBoundary: best, isOpen: false };
    }

    const windows: { start: DateTime; end: DateTime }[] = [];

    for (const offset of [-1, 0, 1]) {
      const baseDay = now.plus({ days: offset });
      for (const t of schedule.times) {
        const start = baseDay.set({
          hour: t.hour,
          minute: t.minute,
          second: 0,
          millisecond: 0,
        });
        const end = start.plus({ hours: windowHours });
        windows.push({ start, end });
      }
    }

    let best: DateTime | null = null;
    let isOpen = false;

    for (const { start, end } of windows) {
      let candidate: DateTime | null = null;
      let currentlyOpen = false;

      if (now >= start && now < end) {
        candidate = end;
        currentlyOpen = true;
      } else if (now < start) {
        candidate = start;
        currentlyOpen = false;
      }

      if (candidate && candidate > now && (!best || candidate < best)) {
        best = candidate;
        isOpen = currentlyOpen;
      }
    }

    if (!best) {
      const firstTime = schedule.times[0];
      best = now.plus({ days: 1 }).set({
        hour: firstTime.hour,
        minute: firstTime.minute,
        second: 0,
        millisecond: 0,
      });
      isOpen = false;
    }

    return { nextBoundary: best, isOpen };
  }

  /**
   * Weekly window (e.g. Seats bidding: Mon 01:00 → Fri 13:00).
   */
  private getWeeklyRangeBoundary(
    schedule: WeeklyRangeSchedule,
    now: DateTime,
  ): { nextBoundary: DateTime | null; isOpen: boolean } {
    const startThisWeek = now.set({
      weekday: schedule.openWeekday,
      hour: schedule.openHour,
      minute: schedule.openMinute,
      second: 0,
      millisecond: 0,
    });

    let endThisWeek = now.set({
      weekday: schedule.closeWeekday,
      hour: schedule.closeHour,
      minute: schedule.closeMinute,
      second: 0,
      millisecond: 0,
    });

    // If end <= start, the range wraps into next week
    if (endThisWeek <= startThisWeek) {
      endThisWeek = endThisWeek.plus({ weeks: 1 });
    }

    // Case 1: before this week's open → next boundary is open
    if (now < startThisWeek) {
      return { nextBoundary: startThisWeek, isOpen: false };
    }

    // Case 2: inside this week's window → next boundary is close
    if (now >= startThisWeek && now < endThisWeek) {
      return { nextBoundary: endThisWeek, isOpen: true };
    }

    // Case 3: after this week's close → look at next week's open
    const startNextWeek = startThisWeek.plus({ weeks: 1 });
    return { nextBoundary: startNextWeek, isOpen: false };
  }

  /**
   * Formatting:
   * - "Xd Yh Zm" when days > 0
   * - "Xh Ym Zs" when hours > 0
   * - "Xm Zs" otherwise
   */
  private formatRemaining(duration: Duration): string {
    const totalSeconds = Math.max(Math.floor(duration.as('seconds')), 0);

    const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    const days = Math.floor(totalSeconds / secondsInDay);
    const hours = Math.floor((totalSeconds % secondsInDay) / secondsInHour);
    const minutes = Math.floor((totalSeconds % secondsInHour) / secondsInMinute);
    const seconds = totalSeconds % secondsInMinute;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  }
}
