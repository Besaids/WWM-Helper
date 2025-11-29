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

type ChecklistTab = 'daily' | 'weekly';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule],
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

  private subs = new Subscription();

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'daily' || tabParam === 'weekly') {
      this.activeTab.set(tabParam);
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

  // --- State proxy methods for template ---

  isChecked(item: ChecklistItem): boolean {
    return this.state.isChecked(item);
  }

  onCheckboxChange(event: Event, item: ChecklistItem): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.state.toggle(item, checked);
  }

  resetTab(tab: ChecklistTab): void {
    this.state.resetTab(tab);
  }

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
      if (!byCategory.has(item.category)) byCategory.set(item.category, []);
      byCategory.get(item.category)!.push(item);
    }

    return Array.from(byCategory.entries())
      .map(([category, group]) => ({ category, items: group }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }
}
