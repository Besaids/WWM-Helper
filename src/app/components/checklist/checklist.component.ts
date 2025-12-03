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

interface ChecklistCategoryGroup {
  category: string;
  items: ChecklistItem[];
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

  // Custom items
  readonly customItems$ = this.customChecklistService.customItems$;

  private subs = new Subscription();

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

  resetCurrentTab(): void {
    this.state.resetType(this.activeTab());
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
