import { Injectable } from '@angular/core';
import { loadJsonFromStorage, loadVersioned, saveVersioned } from '../../utils';
import { getDailyCycleId, getWeeklyCycleId } from '../../configs';
import { ChecklistItem } from '../../models';

type ChecklistTab = 'daily' | 'weekly';
type ChecklistState = Record<string, boolean>;

@Injectable({ providedIn: 'root' })
export class ChecklistStateService {
  private dailyState: ChecklistState = {};
  private weeklyState: ChecklistState = {};

  private currentDailyId = getDailyCycleId();
  private currentWeeklyId = getWeeklyCycleId();

  constructor() {
    this.loadState();
  }

  // Public API

  isChecked(item: ChecklistItem): boolean {
    const state = item.frequency === 'daily' ? this.dailyState : this.weeklyState;
    return !!state[item.id];
  }

  toggle(item: ChecklistItem, checked: boolean): void {
    const state = item.frequency === 'daily' ? this.dailyState : this.weeklyState;
    if (checked) {
      state[item.id] = true;
    } else {
      delete state[item.id];
    }
    this.saveState();
  }

  resetTab(tab: ChecklistTab): void {
    if (tab === 'daily') {
      this.dailyState = {};
    } else {
      this.weeklyState = {};
    }
    this.saveState();
  }

  // Lifecycle helpers

  refreshCycleIds(): { changed: boolean } {
    const nextDaily = getDailyCycleId();
    const nextWeekly = getWeeklyCycleId();
    const changed = nextDaily !== this.currentDailyId || nextWeekly !== this.currentWeeklyId;
    if (changed) {
      this.currentDailyId = nextDaily;
      this.currentWeeklyId = nextWeekly;
      this.loadState(); // Optionally reload state for the new cycle
    }
    return { changed };
  }

  // Persistence

  private loadState(): void {
    const dailyKey = `wwm-checklist-daily-${getDailyCycleId()}`;
    const weeklyKey = `wwm-checklist-weekly-${getWeeklyCycleId()}`;

    const dailyVersioned = loadVersioned<ChecklistState>(dailyKey);
    const weeklyVersioned = loadVersioned<ChecklistState>(weeklyKey);

    this.dailyState = dailyVersioned?.data ?? loadJsonFromStorage<ChecklistState>(dailyKey) ?? {};
    this.weeklyState =
      weeklyVersioned?.data ?? loadJsonFromStorage<ChecklistState>(weeklyKey) ?? {};
  }

  private saveState(): void {
    const dailyKey = `wwm-checklist-daily-${getDailyCycleId()}`;
    const weeklyKey = `wwm-checklist-weekly-${getWeeklyCycleId()}`;

    saveVersioned<ChecklistState>(dailyKey, this.dailyState);
    saveVersioned<ChecklistState>(weeklyKey, this.weeklyState);
  }
}
