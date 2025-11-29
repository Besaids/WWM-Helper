import { TimerDefinition } from '../models';
import { RESET_CONFIG } from './reset-config';

export const TIMER_DEFINITIONS: TimerDefinition[] = [
  // ========================
  // Core resets
  // ========================
  {
    id: 'daily-reset',
    label: 'Daily Reset',
    shortLabel: 'Daily',
    icon: 'bi-sunrise',
    schedule: {
      type: 'daily',
      hour: RESET_CONFIG.DAILY_RESET_HOUR_UTC,
      minute: RESET_CONFIG.DAILY_RESET_MINUTE_UTC,
    },
  },
  {
    id: 'weekly-reset',
    label: 'Weekly Reset',
    shortLabel: 'Weekly',
    icon: 'bi-calendar-week',
    schedule: {
      type: 'weekly',
      weekday: RESET_CONFIG.WEEKLY_RESET_DAY,
      hour: RESET_CONFIG.WEEKLY_RESET_HOUR_UTC,
      minute: RESET_CONFIG.WEEKLY_RESET_MINUTE_UTC,
    },
  },

  // ========================
  // Arena
  // ========================
  {
    id: 'arena-1v1',
    label: 'Arena 1v1',
    shortLabel: 'Arena',
    icon: 'bi-trophy',
    schedule: {
      type: 'daily-multi',
      times: [
        { hour: 10, minute: 0 }, // 10:00–16:00
        { hour: 22, minute: 0 }, // 22:00–04:00 (cross-midnight)
      ],
      windowHours: 6,
    },
  },

  // ========================
  // Fireworks hub – Kaifeng
  // ========================

  // 0) Fireworks – Solo (Zi hour) – every evening at Zi hour (~23:00 local)
  {
    id: 'fireworks-solo-zi',
    label: 'Fireworks – Solo (Zi hour)',
    shortLabel: 'Solo',
    icon: 'bi-moon-stars',
    schedule: {
      type: 'daily',
      hour: 23,
      minute: 0,
    },
  },

  // 1) Fireworks – Festival (Red Envelopes)
  // Leisure card: Every Saturday at 12:30 and Every Sunday at 0:30 (local time)
  // Modelled as a weekly window: open Sat 12:30, close Sun 0:30.
  {
    id: 'fireworks-festival',
    label: 'Fireworks – Festival (Red Envelopes)',
    shortLabel: 'Fest',
    icon: 'bi-brightness-high',
    schedule: {
      type: 'weekly-range',
      openWeekday: 6, // Saturday
      openHour: 12,
      openMinute: 30,
      closeWeekday: 7, // Sunday
      closeHour: 0,
      closeMinute: 30,
    },
  },

  // 2) Fireworks – Seats (Bidding)
  // Map: Every Monday 1:00 → Every Friday 13:00 (local time)
  {
    id: 'fireworks-seats',
    label: 'Fireworks – Seats (Bidding)',
    shortLabel: 'Seats',
    icon: 'bi-ticket-perforated',
    schedule: {
      type: 'weekly-range',
      openWeekday: 1, // Monday
      openHour: 1,
      openMinute: 0,
      closeWeekday: 5, // Friday
      closeHour: 13,
      closeMinute: 0,
    },
  },

  // 3) Fireworks – Show (Big Night)
  // Map: Event time Every Friday, Saturday at 20:30 (local time)
  {
    id: 'fireworks-show',
    label: 'Fireworks – Show (Big Night)',
    shortLabel: 'Show',
    icon: 'bi-stars',
    schedule: {
      type: 'weekly-multi',
      weekdays: [5, 6], // Fri, Sat
      hour: 20,
      minute: 30,
    },
  },

  // ========================
  // Mirage Boat – Yellow River cruise
  // ========================

  // Leisure card: Every Sunday at 11:00 (local time)
  {
    id: 'mirage-boat-11',
    label: 'Mirage Boat – 11:00',
    shortLabel: 'Mirage 11:00',
    icon: 'bi-tsunami',
    schedule: {
      type: 'weekly',
      weekday: 7, // Sunday
      hour: 11,
      minute: 0,
    },
  },

  // Leisure card: Every Sunday at 23:00 (local time)
  {
    id: 'mirage-boat-23',
    label: 'Mirage Boat – 23:00',
    shortLabel: 'Mirage 23:00',
    icon: 'bi-tsunami',
    schedule: {
      type: 'weekly',
      weekday: 7, // Sunday
      hour: 23,
      minute: 0,
    },
  },
];
