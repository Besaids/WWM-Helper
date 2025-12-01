import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { TimerService } from '../../services/timer/timer.service';
import { ChecklistStateService } from '../../services/checklist/checklist-state.service';
import { DAILY_CHECKLIST, WEEKLY_CHECKLIST } from '../../configs';
import { ChecklistItem, TimerChip } from '../../models';
import { ChecklistToggleComponent } from '../ui';

interface HomeSectionItem {
  label: string;
  description?: string;
}

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  items: HomeSectionItem[];
  routerLink: string;
  ctaLabel: string;
}

interface TimerWithPriority extends TimerChip {
  priority: number; // Lower is higher priority
  isActive: boolean; // Currently in a window
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChecklistToggleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly timerService = inject(TimerService);
  private readonly checklistState = inject(ChecklistStateService);
  private readonly dynamicCountScale = 1;

  private subs = new Subscription();

  // Track pinned count reactively
  private pinnedCount$ = new BehaviorSubject<number>(0);

  // Dynamic timer count based on pinned tasks
  upcomingTimers$ = combineLatest([this.timerService.timerChips$, this.pinnedCount$]).pipe(
    map(([chips, pinnedCount]) => {
      // Calculate dynamic timer count
      // Ratio: ~0.75 timers per pinned task (timers are more compact)
      // Minimum 5 timers, scale up based on pinned tasks
      const dynamicCount = Math.max(5, Math.ceil(pinnedCount * this.dynamicCountScale));

      // Add isActive flag
      const withActiveFlag: TimerWithPriority[] = chips.map((chip) => ({
        ...chip,
        priority: 0, // Not used anymore but keeping interface for now
        isActive: this.isTimerActive(chip),
      }));

      // Sort by: not-configured last, then active first, then by remaining time (soonest first)
      return withActiveFlag
        .sort((a, b) => {
          // Push "Not configured" timers to the end
          const aNotConfigured = a.remaining === 'Not configured';
          const bNotConfigured = b.remaining === 'Not configured';

          if (aNotConfigured !== bNotConfigured) {
            return aNotConfigured ? 1 : -1;
          }

          // Then sort by active status (active timers first)
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;

          // Finally by remaining time (soonest first)
          return this.compareRemainingTime(a.remaining, b.remaining);
        })
        .slice(0, dynamicCount);
    }),
  );

  // Pinned checklist items
  pinnedDaily: ChecklistItem[] = [];
  pinnedWeekly: ChecklistItem[] = [];

  readonly sections: HomeSection[] = [
    {
      id: 'timers',
      title: 'Timers',
      subtitle: 'Live UTC-based countdowns for daily and weekly resets plus key world events.',
      items: [
        {
          label: 'Reset tracking',
          description:
            'Daily and weekly resets with clear UTC times so you never guess when systems flip.',
        },
        {
          label: 'World & event timers',
          description:
            'Arena 1v1, Fireworks events, Trading week reset, Mirage Boat and other time-based content.',
        },
        {
          label: 'Custom strip',
          description:
            'Pick which timers appear in the top strip; preferences are saved per browser.',
        },
      ],
      routerLink: '/timers',
      ctaLabel: 'Open timers',
    },
    {
      id: 'checklist',
      title: 'Checklists',
      subtitle: "Track what you've actually done this cycle with daily and weekly task lists.",
      items: [
        {
          label: 'Daily & weekly lists',
          description:
            'Core priorities first, then optional extras; state resets automatically with the game.',
        },
        {
          label: 'Detailed or compact view',
          description:
            'Swap between full descriptions or a denser list depending on how much text you want.',
        },
        {
          label: 'Local storage only',
          description: 'Progress is stored in your browser; no login or external accounts needed.',
        },
      ],
      routerLink: '/checklist',
      ctaLabel: 'Open checklist',
    },
    {
      id: 'guides',
      title: 'Guides',
      subtitle: 'Long-form explanations for systems that deserve more than a tooltip.',
      items: [
        {
          label: 'Trading / Commerce',
          description:
            'How Trade Week works, Local vs Remote prices, mansion slots, and using guild tools.',
        },
        {
          label: 'Integrated with tools',
          description:
            'Guides reference related timers and checklist items so everything stays in sync.',
        },
        {
          label: 'Room to grow',
          description: 'Space reserved for future guides as new systems or events are added.',
        },
      ],
      routerLink: '/guides',
      ctaLabel: 'Browse guides',
    },
  ];

  // External resources – static links
  readonly resourceLinks = [
    {
      label: 'Official Website',
      href: 'https://www.wherewindsmeetgame.com/',
    },
    {
      label: 'Official Discord',
      href: 'https://discord.gg/wherewindsmeet',
    },
    {
      label: 'Steam Page',
      href: 'https://store.steampowered.com/app/3564740/Where_Winds_Meet/',
    },
    {
      label: 'Community Fandom Wiki',
      href: 'https://where-winds-meet.fandom.com/wiki/Where_Winds_Meet',
    },
    {
      label: 'Reddit Community r/wherewindsmeet_',
      href: 'https://www.reddit.com/r/wherewindsmeet_/',
    },
    {
      label: 'Reddit Community r/WhereWindsMeet',
      href: 'https://www.reddit.com/r/WhereWindsMeet/',
    },
  ];

  ngOnInit(): void {
    this.updatePinnedItems();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private updatePinnedItems(): void {
    this.pinnedDaily = DAILY_CHECKLIST.filter(
      (item) => this.checklistState.isPinned(item) && !this.checklistState.isChecked(item),
    );

    this.pinnedWeekly = WEEKLY_CHECKLIST.filter(
      (item) => this.checklistState.isPinned(item) && !this.checklistState.isChecked(item),
    );

    // Update the reactive pinned count
    const totalPinned = this.pinnedDaily.length + this.pinnedWeekly.length;
    this.pinnedCount$.next(totalPinned);
  }

  private isTimerActive(chip: TimerChip): boolean {
    // Check if the timer label contains "(open)" which indicates an active window
    return chip.label.includes('(open)');
  }

  private compareRemainingTime(a: string, b: string): number {
    // Parse remaining time strings and compare
    const parseTime = (str: string): number => {
      const match = str.match(/(\d+)d|(\d+)h|(\d+)m|(\d+)s/g);
      if (!match) return Infinity;

      let seconds = 0;
      for (const part of match) {
        const value = parseInt(part);
        if (part.includes('d')) seconds += value * 86400;
        if (part.includes('h')) seconds += value * 3600;
        if (part.includes('m')) seconds += value * 60;
        if (part.includes('s')) seconds += value;
      }
      return seconds;
    };

    return parseTime(a) - parseTime(b);
  }

  // Checklist toggle handlers
  isChecked(item: ChecklistItem): boolean {
    return this.checklistState.isChecked(item);
  }

  onToggleItem(checked: boolean, item: ChecklistItem): void {
    this.checklistState.toggle(item, checked);
    // Update the pinned lists when an item is toggled
    this.updatePinnedItems();
  }

  get hasPinnedItems(): boolean {
    return this.pinnedDaily.length > 0 || this.pinnedWeekly.length > 0;
  }
}
