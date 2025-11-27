import type { WeekdayNumbers } from 'luxon';

export type TimerSchedule =
  | {
      type: 'daily'; // once per day at fixed time
      hour: number; // 0–23 (UTC)
      minute: number; // 0–59
    }
  | {
      type: 'weekly'; // once per week at fixed day/time
      weekday: WeekdayNumbers; // 1=Mon ... 7=Sun
      hour: number; // UTC
      minute: number; // UTC
    }
  | {
      type: 'weekly-multi'; // several weekdays per week at same time
      weekdays: WeekdayNumbers[]; // e.g. [5, 6] for Fri & Sat
      hour: number; // UTC
      minute: number; // UTC
    }
  | {
      // Weekly window: open at (weekday+time), close at (weekday+time)
      type: 'weekly-range';
      openWeekday: WeekdayNumbers;
      openHour: number;
      openMinute: number;
      closeWeekday: WeekdayNumbers;
      closeHour: number;
      closeMinute: number;
    }
  | {
      type: 'daily-multi'; // several times per day (Arena windows)
      times: { hour: number; minute: number }[]; // window starts (UTC)
      windowHours?: number; // duration of each window in hours
    };

export interface TimerDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: string; // bootstrap icon class
  schedule: TimerSchedule;
}
