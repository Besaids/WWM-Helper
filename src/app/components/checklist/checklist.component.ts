import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import {
  ChecklistItem,
  ChecklistImportance,
  DAILY_CHECKLIST,
  WEEKLY_CHECKLIST,
  FREEPLAY_IDEAS,
  getDailyCycleId,
  getWeeklyCycleId,
} from '../../configs';
import { loadJsonFromStorage, loadVersioned, saveVersioned } from '../../utils';

const CYCLE_CHECK_INTERVAL_MS = 60_000; // Check for cycle changes every minute

type ChecklistTab = 'daily' | 'weekly';

// Use Record instead of an index signature to satisfy lint rules
type ChecklistState = Record<string, boolean>;

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss',
})
export class ChecklistComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  readonly DAILY_ITEMS = DAILY_CHECKLIST;
  readonly WEEKLY_ITEMS = WEEKLY_CHECKLIST;
  readonly FREEPLAY_IDEAS = FREEPLAY_IDEAS;

  readonly activeTab = signal<ChecklistTab>('daily');

  private dailyState: ChecklistState = {};
  private weeklyState: ChecklistState = {};

  // track current cycle IDs so we can detect when they change
  private currentDailyId = getDailyCycleId();
  private currentWeeklyId = getWeeklyCycleId();
  private cycleWatchSub?: Subscription;

  ngOnInit(): void {
    // Set initial tab from query param if present
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'daily' || tabParam === 'weekly') {
      this.activeTab.set(tabParam);
    }

    this.loadState();

    // Only run the live reset watcher in the browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Check once per minute whether the daily/weekly cycle ID changed.
    // When it changes, force a full page reload so timers + checklists reset.
    this.cycleWatchSub = interval(CYCLE_CHECK_INTERVAL_MS).subscribe(() => {
      const nextDailyId = getDailyCycleId();
      const nextWeeklyId = getWeeklyCycleId();

      if (nextDailyId !== this.currentDailyId || nextWeeklyId !== this.currentWeeklyId) {
        this.currentDailyId = nextDailyId;
        this.currentWeeklyId = nextWeeklyId;

        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    this.cycleWatchSub?.unsubscribe();
  }

  // --- Tab handling ---

  setTab(tab: ChecklistTab): void {
    this.activeTab.set(tab);
  }

  isActiveTab(tab: ChecklistTab): boolean {
    return this.activeTab() === tab;
  }

  // --- Checklist state helpers ---

  private loadState(): void {
    const dailyKey = `wwm-checklist-daily-${getDailyCycleId()}`;
    const weeklyKey = `wwm-checklist-weekly-${getWeeklyCycleId()}`;

    // Try versioned payloads first
    const dailyVersioned = loadVersioned<ChecklistState>(dailyKey);
    const weeklyVersioned = loadVersioned<ChecklistState>(weeklyKey);

    if (dailyVersioned?.data) {
      this.dailyState = dailyVersioned.data;
    } else {
      // Fallback: legacy raw JSON (pre-versioning)
      this.dailyState = loadJsonFromStorage<ChecklistState>(dailyKey) ?? {};
    }

    if (weeklyVersioned?.data) {
      this.weeklyState = weeklyVersioned.data;
    } else {
      // Fallback: legacy raw JSON (pre-versioning)
      this.weeklyState = loadJsonFromStorage<ChecklistState>(weeklyKey) ?? {};
    }
  }

  private saveState(): void {
    const dailyKey = `wwm-checklist-daily-${getDailyCycleId()}`;
    const weeklyKey = `wwm-checklist-weekly-${getWeeklyCycleId()}`;

    saveVersioned<ChecklistState>(dailyKey, this.dailyState);
    saveVersioned<ChecklistState>(weeklyKey, this.weeklyState);
  }

  isChecked(item: ChecklistItem): boolean {
    const state = item.frequency === 'daily' ? this.dailyState : this.weeklyState;
    return !!state[item.id];
  }

  onCheckboxChange(event: Event, item: ChecklistItem): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleItem(item, checked);
  }

  private toggleItem(item: ChecklistItem, checked: boolean): void {
    const state = item.frequency === 'daily' ? this.dailyState : this.weeklyState;

    if (checked) {
      state[item.id] = true;
    } else {
      delete state[item.id];
    }

    this.saveState();
  }

  /** Reset only the state for the given tab (daily or weekly). */
  resetTab(tab: ChecklistTab): void {
    if (tab === 'daily') {
      this.dailyState = {};
    } else {
      this.weeklyState = {};
    }
    this.saveState();
  }

  /** Reset the currently active checklist tab. */
  resetCurrentTab(): void {
    this.resetTab(this.activeTab());
  }

  // --- View helpers ---

  getItemsForTab(importance: ChecklistImportance): ChecklistItem[] {
    const tab = this.activeTab();
    const source = tab === 'daily' ? this.DAILY_ITEMS : this.WEEKLY_ITEMS;

    return source
      .filter((i) => i.importance === importance)
      .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
  }

  getCategoryGroups(
    importance: ChecklistImportance,
  ): { category: string; items: ChecklistItem[] }[] {
    const items = this.getItemsForTab(importance);
    const byCategory = new Map<string, ChecklistItem[]>();

    for (const item of items) {
      if (!byCategory.has(item.category)) {
        byCategory.set(item.category, []);
      }
      byCategory.get(item.category)!.push(item);
    }

    return Array.from(byCategory.entries())
      .map(([category, group]) => ({ category, items: group }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }
}
