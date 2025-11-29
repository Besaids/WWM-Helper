import { DateTime } from 'luxon';
import { RESET_CONFIG } from './reset-config';

export function getDailyCycleId(): string {
  const now = DateTime.utc();
  let resetBase = now.set({
    hour: RESET_CONFIG.DAILY_RESET_HOUR_UTC,
    minute: RESET_CONFIG.DAILY_RESET_MINUTE_UTC,
    second: 0,
    millisecond: 0,
  });
  if (now < resetBase) resetBase = resetBase.minus({ days: 1 });
  return resetBase.toISODate();
}

export function getWeeklyCycleId(): string {
  const now = DateTime.utc();
  let resetBase = now.set({
    weekday: RESET_CONFIG.WEEKLY_RESET_DAY,
    hour: RESET_CONFIG.WEEKLY_RESET_HOUR_UTC,
    minute: RESET_CONFIG.WEEKLY_RESET_MINUTE_UTC,
    second: 0,
    millisecond: 0,
  });
  if (now < resetBase) resetBase = resetBase.minus({ weeks: 1 });
  return resetBase.toISODate();
}
