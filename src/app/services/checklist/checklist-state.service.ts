import { Injectable } from '@angular/core';
import { loadJsonFromStorage, loadVersioned, saveVersioned } from '../../utils';
import { getDailyCycleId, getWeeklyCycleId } from '../../configs';
import { ChecklistItem, ChecklistPrefs } from '../../models';

type ChecklistTab = 'daily' | 'weekly';
type ChecklistState = Record<string, boolean>;

const CHECKLIST_PREFS_KEY = 'wwm-helper.checklist.prefs';

@Injectable({ providedIn: 'root' })
export class ChecklistStateService {
  private dailyState: ChecklistState = {};
  private weeklyState: ChecklistState = {};

  private currentDailyId = getDailyCycleId();
  private currentWeeklyId = getWeeklyCycleId();

  private pinned: Record<string, boolean> = {};
  private hidden: Record<string, boolean> = {};

  constructor() {
    this.loadState();
    this.loadPrefs();
  }

  // Public API

  isPinned(item: ChecklistItem): boolean {
    return !!this.pinned[item.id];
  }

  isHidden(item: ChecklistItem): boolean {
    return !!this.hidden[item.id];
  }

  togglePinned(item: ChecklistItem): void {
    const id = item.id;

    if (this.pinned[id]) {
      delete this.pinned[id];
    } else {
      this.pinned[id] = true;
      // if you pin, it shouldn't be hidden
      delete this.hidden[id];
    }

    this.savePrefs();
  }

  toggleHidden(item: ChecklistItem): void {
    const id = item.id;

    if (this.hidden[id]) {
      delete this.hidden[id];
    } else {
      this.hidden[id] = true;
      // if you "don't want it", unpin it
      delete this.pinned[id];
    }

    this.savePrefs();
  }

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

  // ---- prefs persistence (non-cycle) ----

  private loadPrefs(): void {
    const versioned = loadVersioned<ChecklistPrefs>(CHECKLIST_PREFS_KEY);
    const legacy = versioned?.data ?? loadJsonFromStorage<ChecklistPrefs>(CHECKLIST_PREFS_KEY);

    this.pinned = legacy?.pinned ?? {};
    this.hidden = legacy?.hidden ?? {};
  }

  private savePrefs(): void {
    const prefs: ChecklistPrefs = {
      pinned: this.pinned,
      hidden: this.hidden,
    };

    saveVersioned<ChecklistPrefs>(CHECKLIST_PREFS_KEY, prefs);
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
