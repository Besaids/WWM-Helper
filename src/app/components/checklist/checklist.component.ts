import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DAILY_CHECKLIST, WEEKLY_CHECKLIST, FREEPLAY_IDEAS } from '../../configs';
import { ChecklistStateService } from '../../services/checklist/checklist-state.service';
import { ResetWatchService } from '../../services/reset/reset-watch.service';
import { ChecklistImportance, ChecklistItem } from '../../models';
import { ChecklistToggleComponent } from '../ui';

type ChecklistTab = 'daily' | 'weekly';
type ChecklistViewMode = 'detailed' | 'compact';

const CHECKLIST_VIEW_MODE_STORAGE_KEY = 'wwm-helper.checklist.view-mode';

interface ChecklistCategoryGroup {
  category: string;
  items: ChecklistItem[];
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, ChecklistToggleComponent],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly state = inject(ChecklistStateService);
  private readonly resetWatch = inject(ResetWatchService);

  readonly DAILY_ITEMS = DAILY_CHECKLIST;
  readonly WEEKLY_ITEMS = WEEKLY_CHECKLIST;
  readonly FREEPLAY_IDEAS = FREEPLAY_IDEAS;

  readonly activeTab = signal<ChecklistTab>('daily');
  readonly viewMode = signal<ChecklistViewMode>('detailed');

  private subs = new Subscription();

  ngOnInit(): void {
    // Initial tab from query param
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'daily' || tabParam === 'weekly') {
      this.activeTab.set(tabParam);
    }

    // Restore view mode from localStorage
    try {
      const stored = window.localStorage.getItem(CHECKLIST_VIEW_MODE_STORAGE_KEY);
      if (stored === 'detailed' || stored === 'compact') {
        this.viewMode.set(stored);
      }
    } catch {
      // ignore – localStorage not available
    }

    // Subscribe to cycle changes and reload when they occur
    this.subs.add(
      this.resetWatch.resetChange$.subscribe(() => {
        // Full reload ensures timers + checklist state align with new cycle
        window.location.reload();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // --- Tab handling ---

  setTab(tab: ChecklistTab): void {
    this.activeTab.set(tab);
  }

  isActiveTab(tab: ChecklistTab): boolean {
    return this.activeTab() === tab;
  }

  // --- View mode handling ---

  setViewMode(mode: ChecklistViewMode): void {
    if (this.viewMode() === mode) {
      return;
    }
    this.viewMode.set(mode);
    try {
      window.localStorage.setItem(CHECKLIST_VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }

  get isCompactView(): boolean {
    return this.viewMode() === 'compact';
  }

  // --- State proxy methods for template ---

  isChecked(item: ChecklistItem): boolean {
    return this.state.isChecked(item);
  }

  onToggleItem(checked: boolean, item: ChecklistItem): void {
    this.state.toggle(item, checked);
  }

  isPinned(item: ChecklistItem): boolean {
    return this.state.isPinned(item);
  }

  isHidden(item: ChecklistItem): boolean {
    return this.state.isHidden(item);
  }

  onTogglePinned(item: ChecklistItem): void {
    this.state.togglePinned(item);
  }

  onToggleHidden(item: ChecklistItem): void {
    this.state.toggleHidden(item);
    // If we're hiding the item and it's checked, uncheck it
    if (this.state.isHidden(item) && this.state.isChecked(item)) {
      this.state.toggle(item, false);
    }
  }

  resetTab(tab: ChecklistTab): void {
    this.state.resetTab(tab);
  }

  resetCurrentTab(): void {
    this.resetTab(this.activeTab());
  }

  // --- View helpers ---

  // Add these new methods to the component:

  getItemsForTab(importance: ChecklistImportance, excludeHidden = false): ChecklistItem[] {
    const tab = this.activeTab();
    const source = tab === 'daily' ? this.DAILY_ITEMS : this.WEEKLY_ITEMS;

    let items = source.filter((item) => item.importance === importance);

    // Optionally exclude hidden items
    if (excludeHidden) {
      items = items.filter((item) => !this.state.isHidden(item));
    }

    // Only sort by hidden status - keep original order otherwise
    return items.sort((a, b) => {
      const hiddenA = this.state.isHidden(a);
      const hiddenB = this.state.isHidden(b);

      // hidden always last (if not excluded)
      if (!excludeHidden && hiddenA !== hiddenB) {
        return hiddenA ? 1 : -1;
      }

      // otherwise, keep original order (don't sort by pinned)
      return 0;
    });
  }

  getCategoryGroups(
    importance: ChecklistImportance,
    excludeHidden = false,
  ): ChecklistCategoryGroup[] {
    const items = this.getItemsForTab(importance, excludeHidden);

    const grouped: Record<string, ChecklistItem[]> = {};
    for (const item of items) {
      const category = item.category ?? 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    }

    return Object.entries(grouped).map(([category, categoryItems]) => ({
      category,
      items: categoryItems,
    }));
  }

  // New method to get all hidden items for the current tab
  getHiddenItems(): ChecklistItem[] {
    const tab = this.activeTab();
    const source = tab === 'daily' ? this.DAILY_ITEMS : this.WEEKLY_ITEMS;

    return source.filter((item) => this.state.isHidden(item));
  }

  // New method to get hidden items grouped by category
  getHiddenCategoryGroups(): ChecklistCategoryGroup[] {
    const items = this.getHiddenItems();

    const grouped: Record<string, ChecklistItem[]> = {};
    for (const item of items) {
      const category = item.category ?? 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    }

    return Object.entries(grouped).map(([category, categoryItems]) => ({
      category,
      items: categoryItems,
    }));
  }
}
