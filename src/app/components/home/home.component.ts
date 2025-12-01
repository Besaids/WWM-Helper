import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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
      subtitle: 'Track what you’ve actually done this cycle with daily and weekly task lists.',
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
      label: 'Reddit Community wherewindsmeet_',
      href: 'https://www.reddit.com/r/wherewindsmeet_/',
    },
    {
      label: 'Reddit Community WhereWindsMeet',
      href: 'https://www.reddit.com/r/WhereWindsMeet/',
    },
  ];
}
