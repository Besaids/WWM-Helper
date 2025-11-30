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
  // Arena / competitive
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
        { hour: 22, minute: 0 }, // 22:00–04:00
      ],
      windowHours: 6,
    },
  },

  // ========================
  // Fireworks hub – Kaifeng
  // ========================

  // Festival (Red Envelopes) – Every Saturday at 12:30 and Sunday at 00:30
  {
    id: 'fireworks-festival',
    label: 'Fireworks – Festival (Red Envelopes)',
    shortLabel: 'Fest',
    icon: 'bi-brightness-high',
    schedule: {
      type: 'weekly-times',
      times: [
        { weekday: 6, hour: 12, minute: 30 }, // Saturday 12:30
        { weekday: 7, hour: 0, minute: 30 }, // Sunday 00:30
      ],
    },
  },

  // Seats (Bidding) – Monday 1:00 → Friday 13:00
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

  // Big show – Every Friday & Saturday at 20:30
  {
    id: 'fireworks-show',
    label: 'Fireworks – Show (Big Night)',
    shortLabel: 'Show',
    icon: 'bi-stars',
    schedule: {
      type: 'weekly-multi',
      weekdays: [5, 6], // Friday, Saturday
      hour: 20,
      minute: 30,
    },
  },

  // ========================
  // Mirage Boat – Yellow River cruise
  // ========================

  {
    id: 'mirage-boat',
    label: 'Mirage Boat',
    shortLabel: 'Mirage',
    icon: 'bi-tsunami', // change if that icon doesn’t exist
    schedule: {
      type: 'weekly-times',
      times: [
        { weekday: 7, hour: 11, minute: 0 }, // Sunday 11:00
        { weekday: 7, hour: 23, minute: 0 }, // Sunday 23:00
      ],
    },
  },
];
