import { getSafeLocalStorage, STORAGE_PREFIX } from './storage';
import { getDailyCycleId, getWeeklyCycleId } from '../configs';

/**
 * Keep only the current daily and weekly checklist entries in storage.
 *
 * This prevents unbounded growth of:
 * - wwm-checklist-daily-<cycleId>
 * - wwm-checklist-weekly-<cycleId>
 */
export function cleanupChecklistStorage(): void {
  const storage = getSafeLocalStorage();
  if (!storage) return;

  const currentDaily = getDailyCycleId();
  const currentWeekly = getWeeklyCycleId();

  const dailyPrefix = `${STORAGE_PREFIX}checklist-daily-`;
  const weeklyPrefix = `${STORAGE_PREFIX}checklist-weekly-`;

  // We collect keys first to avoid issues with changing storage.length while iterating.
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    keys.push(key);
  }

  for (const key of keys) {
    if (key.startsWith(dailyPrefix) && !key.endsWith(currentDaily)) {
      storage.removeItem(key);
    }

    if (key.startsWith(weeklyPrefix) && !key.endsWith(currentWeekly)) {
      storage.removeItem(key);
    }
  }
}
