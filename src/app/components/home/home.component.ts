import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DAILY_CHECKLIST, WEEKLY_CHECKLIST } from '../../configs';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChecklistImportance, ChecklistItem } from '../../models';

interface HighlightGroup {
  title: string;
  items: ChecklistItem[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly today = signal(new Date());

  readonly dailyHighlights: HighlightGroup = {
    title: 'Core daily priorities',
    items: this.pickCore(DAILY_CHECKLIST, 4),
  };

  readonly weeklyHighlights: HighlightGroup = {
    title: 'Core weekly goals',
    items: this.pickCore(WEEKLY_CHECKLIST, 4),
  };

  // External resources – for now just static links
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
      label: 'Reddit Community wherewindsmeet_',
      href: 'https://www.reddit.com/r/wherewindsmeet_/',
    },
    {
      label: 'Reddit Community WhereWindsMeet',
      href: 'https://www.reddit.com/r/WhereWindsMeet/',
    },
  ];

  ngOnInit(): void {
    // Poll once per minute; update signal when the calendar day changes.
    interval(60_000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const now = new Date();
        const prev = this.today();
        if (
          prev.getFullYear() !== now.getFullYear() ||
          prev.getMonth() !== now.getMonth() ||
          prev.getDate() !== now.getDate()
        ) {
          this.today.set(now);
        }
      });
  }

  private pickCore(source: ChecklistItem[], limit: number): ChecklistItem[] {
    return source
      .filter((i) => i.importance === ('core' as ChecklistImportance))
      .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label))
      .slice(0, limit);
  }
}
