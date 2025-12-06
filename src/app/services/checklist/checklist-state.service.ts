import { inject, Injectable } from '@angular/core';
import { loadJsonFromStorage, loadVersioned, saveVersioned } from '../../utils';
import { DEFAULT_PINNED_IDS, getDailyCycleId, getWeeklyCycleId } from '../../configs';
import { ChecklistFrequency, ChecklistItem, ChecklistPrefs } from '../../models';
import { ChecklistRegistryService } from './checklist-registry.service';

type ChecklistTab = 'daily' | 'weekly';
type ChecklistState = Record<string, boolean>;
type CompletionCounts = Record<string, number>;

const CHECKLIST_PREFS_KEY = 'wwm-helper.checklist.prefs';

@Injectable({ providedIn: 'root' })
export class ChecklistStateService {
  private readonly registry = inject(ChecklistRegistryService);

  private stateByType = new Map<ChecklistFrequency, Record<string, boolean>>();
  private completionCountsByType = new Map<ChecklistFrequency, CompletionCounts>();

  private dailyState: ChecklistState = {};
  private weeklyState: ChecklistState = {};

  private currentDailyId = getDailyCycleId();
  private currentWeeklyId = getWeeklyCycleId();

  private pinned: Record<string, boolean> = {};
  private hidden: Record<string, boolean> = {};
  private completionCounts: Record<string, number> = {}; // Global completion counts (non-cycle)

  constructor() {
    this.loadAllStates();
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
    const state = this.getStateForType(item.frequency);
    return !!state[item.id];
  }

  toggle(item: ChecklistItem, checked: boolean): void {
    const state = this.getStateForType(item.frequency);
    const wasChecked = !!state[item.id];

    if (checked) {
      state[item.id] = true;
      // Only increment if it wasn't already checked
      if (!wasChecked) {
        this.incrementCompletionCount(item);
      }
    } else {
      delete state[item.id];
      // Only decrement if it was checked before
      if (wasChecked) {
        this.decrementCompletionCount(item);
      }
    }

    this.saveStateForType(item.frequency);
  }

  /**
   * Get completion count for an item (persists across same cycle)
   */
  getCompletionCount(item: ChecklistItem): number {
    const counts = this.getCompletionCountsForType(item.frequency);
    return counts[item.id] ?? 0;
  }

  /**
   * Increment completion count for an item
   */
  private incrementCompletionCount(item: ChecklistItem): void {
    const counts = this.getCompletionCountsForType(item.frequency);
    const currentCount = counts[item.id] ?? 0;
    counts[item.id] = currentCount + 1;
    this.saveCompletionCountsForType(item.frequency);
  }

  /**
   * Decrement completion count for an item (min 0)
   */
  private decrementCompletionCount(item: ChecklistItem): void {
    const counts = this.getCompletionCountsForType(item.frequency);
    const currentCount = counts[item.id] ?? 0;
    counts[item.id] = Math.max(0, currentCount - 1);
    this.saveCompletionCountsForType(item.frequency);
  }

  resetType(type: ChecklistFrequency): void {
    this.stateByType.set(type, {});
    this.completionCountsByType.set(type, {}); // Also reset completion counts
    this.saveStateForType(type);
    this.saveCompletionCountsForType(type);
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
    this.completionCounts = legacy?.completionCounts ?? {};

    // Apply default pins once (for new users or users who haven't had this applied)
    if (!legacy?.defaultPinsApplied) {
      this.applyDefaultPins();
    }
  }

  /**
   * Apply default pinned items for new users.
   * Only runs once - merges with any existing pins, then sets the flag.
   */
  private applyDefaultPins(): void {
    for (const id of DEFAULT_PINNED_IDS) {
      // Only pin if not already pinned (preserve user choice if somehow set)
      // Also don't pin if the item is hidden (user explicitly hid it)
      if (!this.pinned[id] && !this.hidden[id]) {
        this.pinned[id] = true;
      }
    }
    this.savePrefs();
  }

  private savePrefs(): void {
    const prefs: ChecklistPrefs = {
      pinned: this.pinned,
      hidden: this.hidden,
      completionCounts: this.completionCounts,
      defaultPinsApplied: true, // Always mark as applied after first save
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

  private getStateForType(type: ChecklistFrequency): Record<string, boolean> {
    if (!this.stateByType.has(type)) {
      this.stateByType.set(type, {});
    }
    return this.stateByType.get(type)!;
  }

  private getCompletionCountsForType(type: ChecklistFrequency): CompletionCounts {
    if (!this.completionCountsByType.has(type)) {
      this.completionCountsByType.set(type, {});
    }
    return this.completionCountsByType.get(type)!;
  }

  private getStorageKey(type: ChecklistFrequency): string {
    const config = this.registry.getTypeConfig(type);
    const cycleId = config?.cycleKeyGenerator() ?? 'unknown';
    return `wwm-checklist-${type}-${cycleId}`;
  }

  private getCompletionCountsStorageKey(type: ChecklistFrequency): string {
    const config = this.registry.getTypeConfig(type);
    const cycleId = config?.cycleKeyGenerator() ?? 'unknown';
    return `wwm-checklist-counts-${type}-${cycleId}`;
  }

  private loadAllStates(): void {
    // Load state for all known types
    for (const typeConfig of this.registry.availableTypes()) {
      this.loadStateForType(typeConfig.id);
      this.loadCompletionCountsForType(typeConfig.id);
    }
  }

  private loadStateForType(type: ChecklistFrequency): void {
    const key = this.getStorageKey(type);
    const versioned = loadVersioned<Record<string, boolean>>(key);
    const state = versioned?.data ?? loadJsonFromStorage<Record<string, boolean>>(key) ?? {};
    this.stateByType.set(type, state);
  }

  private loadCompletionCountsForType(type: ChecklistFrequency): void {
    const key = this.getCompletionCountsStorageKey(type);
    const versioned = loadVersioned<CompletionCounts>(key);
    const counts = versioned?.data ?? loadJsonFromStorage<CompletionCounts>(key) ?? {};
    this.completionCountsByType.set(type, counts);
  }

  private saveStateForType(type: ChecklistFrequency): void {
    const key = this.getStorageKey(type);
    const state = this.getStateForType(type);
    saveVersioned(key, state);
  }

  private saveCompletionCountsForType(type: ChecklistFrequency): void {
    const key = this.getCompletionCountsStorageKey(type);
    const counts = this.getCompletionCountsForType(type);
    saveVersioned(key, counts);
  }
}
