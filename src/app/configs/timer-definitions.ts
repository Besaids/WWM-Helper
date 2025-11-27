import { TimerDefinition } from "../models";

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
      hour: 21,
      minute: 0,
    },
  },
  {
    id: 'weekly-reset',
    label: 'Weekly Reset',
    shortLabel: 'Weekly',
    icon: 'bi-calendar-week',
    schedule: {
      type: 'weekly',
      weekday: 7, // Sunday
      hour: 21,
      minute: 0,
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

  // 1) Fireworks Festival – Every Saturday, Sunday at 12:30 (UTC)
  {
    id: 'fireworks-festival',
    label: 'Fireworks Festival',
    shortLabel: 'Festival',
    icon: 'bi-brightness-high',
    schedule: {
      type: 'weekly-multi',
      weekdays: [6, 7], // Sat, Sun
      hour: 12,
      minute: 30,
    },
  },

  // 2) Seats Bidding – Monday 1:00 → Friday 13:00 (UTC)
  //    One long weekly window, with “open” / “closed” state.
  {
    id: 'fireworks-seats',
    label: 'Fireworks Seats',
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

  // 3) Fireworks Show – Event Time: Every Friday, Saturday at 20:30 (UTC)
  {
    id: 'fireworks-show',
    label: 'Fireworks Show',
    shortLabel: 'Show',
    icon: 'bi-stars',
    schedule: {
      type: 'weekly-multi',
      weekdays: [5, 6], // Fri, Sat
      hour: 20,
      minute: 30,
    },
  },
];
