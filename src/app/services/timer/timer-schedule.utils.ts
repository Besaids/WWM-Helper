import { DateTime, Duration } from 'luxon';
import { TimerSchedule } from '../../models';

/**
 * Returns the next upcoming boundary for a given schedule.
 * For range / multi schedules this is:
 *  - the next *open* time if currently closed
 *  - the next *close* time if currently open
 */
export function getNextBoundary(schedule: TimerSchedule, now: DateTime): DateTime {
  switch (schedule.type) {
    case 'daily':
      return getNextDailyBoundary(schedule, now);
    case 'weekly':
      return getNextWeeklyBoundary(schedule, now);
    case 'weekly-multi':
      return getNextWeeklyMultiBoundary(schedule, now);
    case 'weekly-range':
      return getWeeklyRangeBoundary(schedule, now).nextBoundary;
    case 'daily-multi':
      return getDailyMultiBoundary(schedule, now).nextBoundary;
    case 'weekly-times':
      return getWeeklyTimesBoundary(schedule, now);
    default:
      throw new Error('Unsupported schedule type');
  }
}

/**
 * Daily – next occurrence of hour:minute.
 */
function getNextDailyBoundary(
  schedule: Extract<TimerSchedule, { type: 'daily' }>,
  now: DateTime,
): DateTime {
  let candidate = now.set({
    hour: schedule.hour,
    minute: schedule.minute,
    second: 0,
    millisecond: 0,
  });

  if (candidate <= now) {
    candidate = candidate.plus({ days: 1 });
  }

  return candidate;
}

/**
 * Weekly – next occurrence of weekday @ hour:minute.
 */
function getNextWeeklyBoundary(
  schedule: Extract<TimerSchedule, { type: 'weekly' }>,
  now: DateTime,
): DateTime {
  const targetWeekday = schedule.weekday; // 1–7
  const todayWeekday = now.weekday; // 1–7

  const daysToAdd = (targetWeekday - todayWeekday + 7) % 7;
  let candidate = now
    .plus({ days: daysToAdd })
    .set({ hour: schedule.hour, minute: schedule.minute, second: 0, millisecond: 0 });

  if (candidate <= now) {
    candidate = candidate.plus({ days: 7 });
  }

  return candidate;
}

/**
 * Weekly-multi – same hour:minute on several weekdays.
 */
function getNextWeeklyMultiBoundary(
  schedule: Extract<TimerSchedule, { type: 'weekly-multi' }>,
  now: DateTime,
): DateTime {
  const candidates = schedule.weekdays.map((weekday) =>
    getNextWeeklyBoundary(
      { type: 'weekly', weekday, hour: schedule.hour, minute: schedule.minute },
      now,
    ),
  );

  return candidates.reduce((earliest, dt) => (dt < earliest ? dt : earliest));
}

/**
 * Weekly-range – open/close weekly window, supports cross-week ranges.
 */
export function getWeeklyRangeBoundary(
  schedule: Extract<TimerSchedule, { type: 'weekly-range' }>,
  now: DateTime,
): { nextBoundary: DateTime; isOpen: boolean } {
  const {
    openWeekday,
    openHour,
    openMinute,
    closeWeekday,
    closeHour,
    closeMinute,
  } = schedule;

  const computeWindow = (base: DateTime) => {
    const todayWeekday = base.weekday;

    const openOffset = (openWeekday - todayWeekday + 7) % 7;
    const closeOffset = (closeWeekday - todayWeekday + 7) % 7;

    const open = base
      .plus({ days: openOffset })
      .set({ hour: openHour, minute: openMinute, second: 0, millisecond: 0 });

    let close = base
      .plus({ days: closeOffset })
      .set({ hour: closeHour, minute: closeMinute, second: 0, millisecond: 0 });

    // If close <= open, treat close as next week
    if (close <= open) {
      close = close.plus({ days: 7 });
    }

    return { open, close };
  };

  const { open, close } = computeWindow(now);
  const isOpen = now >= open && now < close;

  let nextBoundary: DateTime;

  if (isOpen) {
    // currently inside window → countdown to close
    nextBoundary = close;
  } else if (now < open) {
    // before this week's open
    nextBoundary = open;
  } else {
    // after close → next week's open
    const { open: nextOpen } = computeWindow(now.plus({ days: 7 }));
    nextBoundary = nextOpen;
  }

  return { nextBoundary, isOpen };
}

/**
 * Daily-multi – several times per day; optional windowHours.
 */
export function getDailyMultiBoundary(
  schedule: Extract<TimerSchedule, { type: 'daily-multi' }>,
  now: DateTime,
): { nextBoundary: DateTime; isOpen: boolean } {
  const windowHours = schedule.windowHours ?? 0;
  const windows: { start: DateTime; end: DateTime }[] = [];

  for (const t of schedule.times) {
    let start = now.set({
      hour: t.hour,
      minute: t.minute,
      second: 0,
      millisecond: 0,
    });
    let end = start.plus({ hours: windowHours });

    // Handle cross-midnight window
    if (end <= start) {
      end = end.plus({ days: 1 });
    }

    // If this window is fully in the past for today, shift to tomorrow
    if (end <= now) {
      start = start.plus({ days: 1 });
      end = end.plus({ days: 1 });
    }

    windows.push({ start, end });
  }

  // Check if we're inside any window
  for (const w of windows) {
    if (now >= w.start && now < w.end) {
      return { nextBoundary: w.end, isOpen: true };
    }
  }

  // Otherwise the next boundary is the earliest upcoming start
  const nextStart = windows.reduce(
    (earliest, w) => (w.start < earliest ? w.start : earliest),
    windows[0].start,
  );

  return { nextBoundary: nextStart, isOpen: false };
}

/**
 * Weekly-times – multiple explicit weekday+time pairs for same event.
 * Example: Sat 12:30 and Sun 00:30.
 */
function getWeeklyTimesBoundary(
  schedule: Extract<TimerSchedule, { type: 'weekly-times' }>,
  now: DateTime,
): DateTime {
  const candidates: DateTime[] = [];

  for (const { weekday, hour, minute } of schedule.times) {
    const todayWeekday = now.weekday;
    const daysToAdd = (weekday - todayWeekday + 7) % 7;

    let candidate = now
      .plus({ days: daysToAdd })
      .set({ hour, minute, second: 0, millisecond: 0 });

    if (candidate <= now) {
      candidate = candidate.plus({ days: 7 });
    }

    candidates.push(candidate);
  }

  return candidates.reduce((earliest, dt) => (dt < earliest ? dt : earliest));
}

export function formatRemaining(duration: Duration): string {
  const totalSeconds = Math.max(0, Math.floor(duration.as('seconds')));

  const secondsInDay = 24 * 60 * 60;
  const secondsInHour = 60 * 60;
  const secondsInMinute = 60;

  const days = Math.floor(totalSeconds / secondsInDay);
  const dayRemainder = totalSeconds % secondsInDay;

  const hours = Math.floor(dayRemainder / secondsInHour);
  const minutes = Math.floor((dayRemainder % secondsInHour) / secondsInMinute);
  const seconds = dayRemainder % secondsInMinute;

  // ≥ 1 day: Xd Yh Zm
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  // < 1 day: Xh Ym Zs
  return `${hours}h ${minutes}m ${seconds}s`;
}

