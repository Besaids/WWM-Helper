/**
 * Centralized configuration for daily and weekly reset times.
 * All reset logic should reference these constants.
 */
export const RESET_CONFIG = {
  DAILY_RESET_HOUR_UTC: 21,
  DAILY_RESET_MINUTE_UTC: 0,
  WEEKLY_RESET_DAY: 7, // Sunday (ISO weekday: 1=Mon, 7=Sun)
  WEEKLY_RESET_HOUR_UTC: 21,
  WEEKLY_RESET_MINUTE_UTC: 0,
} as const;
