import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FREEPLAY_IDEAS } from '../../configs';
import { ChecklistStateService } from '../../services/checklist/checklist-state.service';
import { ChecklistRegistryService } from '../../services/checklist/checklist-registry.service';
import { CustomChecklistService } from '../../services/checklist/custom-checklist.service';
import { ResetWatchService } from '../../services/reset/reset-watch.service';
import {
  ChecklistImportance,
  ChecklistItem,
  ChecklistFrequency,
  ChecklistTypeConfig,
  CustomChecklistItemFormData,
} from '../../models';
import { ChecklistToggleComponent } from '../ui';
import { CustomChecklistModalComponent } from './custom-checklist-modal';

type ChecklistViewMode = 'detailed' | 'compact';

const CHECKLIST_VIEW_MODE_STORAGE_KEY = 'wwm-helper.checklist.view-mode';
const HIDDEN_SECTION_COLLAPSED_KEY = 'wwm-helper.checklist.hidden-collapsed';
const IDEAS_DRAWER_OPEN_KEY = 'wwm-helper.checklist.ideas-drawer-open';

interface ChecklistCategoryGroup {
  category: string;
  items: ChecklistItem[];
}

interface PinnedProgress {
  total: number;
  completed: number;
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, ChecklistToggleComponent, CustomChecklistModalComponent],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(ChecklistStateService);
  private readonly registry = inject(ChecklistRegistryService);
  private readonly customChecklistService = inject(CustomChecklistService);
  private readonly resetWatch = inject(ResetWatchService);

  readonly FREEPLAY_IDEAS = FREEPLAY_IDEAS;

  readonly availableTypes = this.registry.availableTypes;
  readonly activeTab = signal<ChecklistFrequency>('daily');
  readonly viewMode = signal<ChecklistViewMode>('detailed');

  // Modal state
  readonly isModalOpen = signal(false);
  readonly editingCustomItem = signal<ChecklistItem | null>(null);

  // Ideas drawer state
  readonly isIdeasDrawerOpen = signal(false);

  // Hidden section collapsed state
  readonly isHiddenCollapsed = signal(true);

  // Custom items
  readonly customItems$ = this.customChecklistService.customItems$;

  private subs = new Subscription();

  // Signal to trigger pinned progress recalculation
  private readonly pinnedProgressTrigger = signal(0);

  // Computed pinned progress for active tab (reactive)
  readonly pinnedProgress = computed<PinnedProgress>(() => {
    // Subscribe to trigger for reactivity
    this.pinnedProgressTrigger();

    const tab = this.activeTab();
    const allItems = this.registry.getItemsForType(tab);

    // Get pinned items that are not hidden and not expired
    const pinnedItems = allItems.filter(
      (item) => !item.expired && this.state.isPinned(item) && !this.state.isHidden(item),
    );

    const total = pinnedItems.length;
    const completed = pinnedItems.filter((item) => this.state.isChecked(item)).length;

    return { total, completed };
  });

  ngOnInit(): void {
    // Initial tab from query param
    const tabParam = this.route.snapshot.queryParamMap.get('tab') as ChecklistFrequency;
    const config = this.registry.getTypeConfig(tabParam);
    if (config) {
      this.activeTab.set(tabParam);
    }

    // Restore view mode from localStorage
    try {
      const stored = window.localStorage.getItem(CHECKLIST_VIEW_MODE_STORAGE_KEY);
      if (stored === 'detailed' || stored === 'compact') {
        this.viewMode.set(stored);
      }

      // Restore hidden section collapsed state
      const hiddenCollapsed = window.localStorage.getItem(HIDDEN_SECTION_COLLAPSED_KEY);
      if (hiddenCollapsed === 'false') {
        this.isHiddenCollapsed.set(false);
      }

      // Restore ideas drawer state
      const ideasOpen = window.localStorage.getItem(IDEAS_DRAWER_OPEN_KEY);
      if (ideasOpen === 'true') {
        this.isIdeasDrawerOpen.set(true);
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

  // --- Navigation helpers ---

  /**
   * Navigate to a guide route, optionally with a section fragment
   */
  navigateToGuide(item: ChecklistItem): void {
    if (!item.route) return;

    if (item.section) {
      this.router.navigate([item.route], { fragment: item.section });
    } else {
      this.router.navigate([item.route]);
    }
  }

  // --- Pinned progress recalculation ---

  private recalcPinnedProgress(): void {
    // Increment trigger to force computed signal re-evaluation
    this.pinnedProgressTrigger.update((v) => v + 1);
  }

  // --- Tab handling ---

  setTab(tab: ChecklistFrequency): void {
    this.activeTab.set(tab);
  }

  isActiveTab(tab: ChecklistFrequency): boolean {
    return this.activeTab() === tab;
  }

  getActiveTypeConfig(): ChecklistTypeConfig | undefined {
    return this.registry.getTypeConfig(this.activeTab());
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

  // --- Ideas drawer ---

  toggleIdeasDrawer(): void {
    const newState = !this.isIdeasDrawerOpen();
    this.isIdeasDrawerOpen.set(newState);

    // Lock/unlock body scroll
    if (newState) {
      document.body.classList.add('ideas-drawer-open');
    } else {
      document.body.classList.remove('ideas-drawer-open');
    }

    document.body.classList.remove('ideas-drawer-open');

    try {
      window.localStorage.setItem(IDEAS_DRAWER_OPEN_KEY, String(newState));
    } catch {
      // ignore
    }
  }

  closeIdeasDrawer(): void {
    this.isIdeasDrawerOpen.set(false);
    document.body.classList.remove('ideas-drawer-open');
    try {
      window.localStorage.setItem(IDEAS_DRAWER_OPEN_KEY, 'false');
    } catch {
      // ignore
    }
  }

  // --- Hidden section collapse ---

  toggleHiddenCollapsed(): void {
    const newState = !this.isHiddenCollapsed();
    this.isHiddenCollapsed.set(newState);
    try {
      window.localStorage.setItem(HIDDEN_SECTION_COLLAPSED_KEY, String(newState));
    } catch {
      // ignore
    }
  }

  // --- State proxy methods for template ---

  isChecked(item: ChecklistItem): boolean {
    return this.state.isChecked(item);
  }

  onToggleItem(checked: boolean, item: ChecklistItem): void {
    this.state.toggle(item, checked);
    this.recalcPinnedProgress();
  }

  isPinned(item: ChecklistItem): boolean {
    return this.state.isPinned(item);
  }

  isHidden(item: ChecklistItem): boolean {
    return this.state.isHidden(item);
  }

  onTogglePinned(item: ChecklistItem): void {
    this.state.togglePinned(item);
    this.recalcPinnedProgress();
  }

  onToggleHidden(item: ChecklistItem): void {
    this.state.toggleHidden(item);
    // If we're hiding the item and it's checked, uncheck it
    if (this.state.isHidden(item) && this.state.isChecked(item)) {
      this.state.toggle(item, false);
    }
    this.recalcPinnedProgress();
  }

  resetCurrentTab(): void {
    this.state.resetType(this.activeTab());
    this.recalcPinnedProgress();
  }

  getCompletionCount(item: ChecklistItem): number {
    return this.state.getCompletionCount(item);
  }

  // --- Modal handling ---

  openCustomItemModal(): void {
    this.editingCustomItem.set(null);
    this.isModalOpen.set(true);
  }

  openEditCustomItemModal(item: ChecklistItem): void {
    if (!item.isCustom) return;
    this.editingCustomItem.set(item);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingCustomItem.set(null);
  }

  handleModalSave(formData: CustomChecklistItemFormData): void {
    const editing = this.editingCustomItem();

    if (editing) {
      // Update existing custom item
      const updated = this.customChecklistService.update(editing.id, formData);
      console.log('Custom checklist item updated:', updated);
    } else {
      // Create new custom item
      const created = this.customChecklistService.create(formData);
      console.log('Custom checklist item created:', created);
    }

    this.closeModal();
    this.recalcPinnedProgress();
  }

  // --- Custom item helpers ---

  isCustomItem(itemId: string): boolean {
    return itemId.startsWith('custom-');
  }

  getCustomItem(itemId: string): ChecklistItem | undefined {
    return this.customChecklistService.getById(itemId);
  }

  deleteCustomItem(itemId: string): void {
    if (confirm('Are you sure you want to delete this checklist item?')) {
      const deleted = this.customChecklistService.delete(itemId);
      if (deleted) {
        console.log('Custom checklist item deleted:', itemId);
        this.recalcPinnedProgress();
      }
    }
  }

  // --- View helpers ---

  /**
   * Get all items for the active tab (filtered by importance and expired status)
   */
  getItemsForActiveTab(importance: ChecklistImportance, excludeHidden = false): ChecklistItem[] {
    const allItems = this.registry.getItemsForType(this.activeTab());

    // Filter out expired items and by importance
    let items = allItems.filter((item) => !item.expired && item.importance === importance);

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

  /**
   * Get category groups for the active tab
   */
  getCategoryGroups(
    importance: ChecklistImportance,
    excludeHidden = false,
  ): ChecklistCategoryGroup[] {
    const items = this.getItemsForActiveTab(importance, excludeHidden);

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

  /**
   * Get all hidden items for the current tab (excluding expired)
   */
  getHiddenItems(): ChecklistItem[] {
    const allItems = this.registry.getItemsForType(this.activeTab());
    return allItems.filter((item) => !item.expired && this.state.isHidden(item));
  }

  /**
   * Get hidden items grouped by category
   */
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

  /**
   * Check if the current tab has any items
   */
  hasItems(): boolean {
    const allItems = this.registry.getItemsForType(this.activeTab());
    return allItems.filter((item) => !item.expired).length > 0;
  }
}
