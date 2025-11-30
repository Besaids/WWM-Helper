import { DateTime } from 'luxon';
import { TimerChip, TimerDefinition, TimerSchedule } from '../../models';
import { formatRemaining, getDailyMultiBoundary, getNextBoundary, getWeeklyRangeBoundary } from './timer-schedule.utils';

/**
 * Build a TimerChip from a TimerDefinition and current UTC time.
 * Pure function — no side-effects.
 */
export function buildTimerChip(def: TimerDefinition, now: DateTime): TimerChip {
  const schedule = def.schedule;

  // daily-multi (Arena windows)
  if (schedule.type === 'daily-multi') {
    const { nextBoundary, isOpen } = getDailyMultiBoundary(schedule, now);
    const remaining = nextBoundary ? formatRemaining(nextBoundary.diff(now)) : '—';
    return {
      id: def.id,
      label: isOpen ? `${def.label} (open)` : def.label,
      shortLabel: def.shortLabel,
      icon: def.icon,
      remaining: isOpen ? `${remaining} left` : `in ${remaining}`,
    };
  }

  // weekly-range (Seats bidding)
  if (schedule.type === 'weekly-range') {
    const { nextBoundary, isOpen } = getWeeklyRangeBoundary(schedule, now);
    const remaining = nextBoundary ? formatRemaining(nextBoundary.diff(now)) : '—';
    return {
      id: def.id,
      label: isOpen ? `${def.label} (open)` : def.label,
      shortLabel: def.shortLabel,
      icon: def.icon,
      remaining: isOpen ? `${remaining} left` : `in ${remaining}`,
    };
  }

  // simple boundaries (daily / weekly / weekly-multi)
  const next = getNextBoundary(schedule as TimerSchedule, now);
  const remaining = next ? formatRemaining(next.diff(now)) : '—';

  return {
    id: def.id,
    label: def.label,
    shortLabel: def.shortLabel,
    icon: def.icon,
    remaining,
  };
}
