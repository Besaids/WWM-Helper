import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { buildAssetTooltips, MULTI_DAY_ACTIVITIES, MultiDayActivity } from '../../../configs';

@Component({
  standalone: true,
  selector: 'app-multi-day-rewards-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './multi-day-rewards-guide.component.html',
  styleUrls: ['./multi-day-rewards-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiDayRewardsGuideComponent {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  readonly activities = MULTI_DAY_ACTIVITIES;
  readonly activeTabId = signal<string>(this.activities[0]?.id ?? '');
  showScrollTop = false;

  constructor() {
    this.tooltipRegistry.registerAll(buildAssetTooltips());
  }

  get activeActivity(): MultiDayActivity | undefined {
    return this.activities.find((a) => a.id === this.activeTabId());
  }

  setActiveTab(id: string): void {
    this.activeTabId.set(id);
    // Scroll to the content area on tab switch
    const el = document.getElementById('activity-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.activities;
    let newIndex = index;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = tabs.length - 1;
    }

    if (newIndex !== index) {
      this.setActiveTab(tabs[newIndex].id);
      // Focus the new tab
      const tabEl = document.getElementById(`tab-${tabs[newIndex].id}`);
      tabEl?.focus();
    }
  }
}
