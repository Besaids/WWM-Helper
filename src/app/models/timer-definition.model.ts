export type TimerSchedule =
  | DailySchedule
  | WeeklySchedule
  | WeeklyMultiSchedule
  | WeeklyRangeSchedule
  | DailyMultiSchedule
  | WeeklyTimesSchedule;

export interface DailySchedule {
  type: 'daily';
  hour: number;
  minute: number;
}

export interface WeeklySchedule {
  type: 'weekly';
  /**
   * ISO weekday: 1 = Monday … 7 = Sunday
   */
  weekday: number;
  hour: number;
  minute: number;
}

export interface WeeklyMultiSchedule {
  type: 'weekly-multi';
  /**
   * ISO weekdays: 1 = Monday … 7 = Sunday
   */
  weekdays: number[];
  hour: number;
  minute: number;
}

export interface WeeklyRangeSchedule {
  type: 'weekly-range';
  openWeekday: number;
  openHour: number;
  openMinute: number;
  closeWeekday: number;
  closeHour: number;
  closeMinute: number;
}

export interface DailyMultiSchedule {
  type: 'daily-multi';
  times: { hour: number; minute: number }[];
  /**
   * Optional window length in hours during which the event is considered "open".
   * If omitted, windows are treated as instantaneous.
   */
  windowHours?: number;
}

/**
 * NEW: multiple explicit weekday + time pairs for the same event.
 * Example: Sat 12:30 and Sun 00:30 for the same festival.
 */
export interface WeeklyTimesSchedule {
  type: 'weekly-times';
  times: { weekday: number; hour: number; minute: number }[];
}

export interface TimerDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  schedule: TimerSchedule;
}
