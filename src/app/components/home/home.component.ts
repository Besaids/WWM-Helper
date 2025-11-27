import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ChecklistItem,
  ChecklistImportance,
  DAILY_CHECKLIST,
  WEEKLY_CHECKLIST,
} from '../../configs';

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
export class HomeComponent {
  readonly today = new Date();

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

  private pickCore(source: ChecklistItem[], limit: number): ChecklistItem[] {
    return source
      .filter((i) => i.importance === ('core' as ChecklistImportance))
      .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label))
      .slice(0, limit);
  }
}
