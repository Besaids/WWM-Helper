// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {
  GuidesHubComponent,
  PrivacyComponent,
  TradingGuideComponent,
  PathSeasonGuideComponent,
  MapComponent,
  ToolsHubComponent,
  ChineseChessComponent,
  ChessWinsGuideComponent,
  HomeComponent,
  TimersComponent,
  ChecklistComponent,
  MultiDayRewardsGuideComponent,
  SettingsIoComponent,
  BossTalentsGuideComponent,
  MysticSkillMaterialsGuideComponent,
  MysticUpgradePlannerComponent,
  MysticMetricsGuideComponent,
  NotFoundComponent,
} from './components';
import { SeoData } from './models';

const OG_DEFAULT_IMAGE = 'https://besaids.github.io/WWM-Helper/assets/portal/wwm-logo.png';

const NOT_FOUND_SEO: SeoData = {
  title: '404 – Page not found | WWM Helper',
  description: 'This page does not exist. Use Home, Guides, or Tools to navigate.',
  image: OG_DEFAULT_IMAGE,
  robots: 'noindex, follow',
  canonicalPath: '/404',
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    component: HomeComponent,
    data: {
      seo: {
        title: 'WWM Helper – Where Winds Meet Timers, Checklists, Guides & Tools',
        description:
          'Unofficial Where Winds Meet companion; track resets, events, seasonal goals, and keep your own checklists. Runs in your browser; no login.',
        image: OG_DEFAULT_IMAGE,
        canonicalPath: '/',
      } satisfies SeoData,
    },
  },

  {
    path: 'timers',
    component: TimersComponent,
    data: {
      seo: {
        title: 'WWM Timers – Daily, Weekly, Events; WWM Helper',
        description:
          'Reset timers for Where Winds Meet; daily/weekly cycles, event windows, and configurable schedules so you stop missing activities.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'checklist',
    component: ChecklistComponent,
    data: {
      seo: {
        title: 'WWM Checklists – Dailies, Weeklies, Seasonal; WWM Helper',
        description:
          'Track dailies, weeklies, seasonal goals, and custom tasks; pin what matters; hide noise; keep your run clean.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'map',
    component: MapComponent,
    data: {
      seo: {
        title: 'WWM Map – Interactive Links & Tracking; WWM Helper',
        description:
          'Map helpers and quick navigation for Where Winds Meet points of interest and farming routes.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides',
    component: GuidesHubComponent,
    data: {
      seo: {
        title: 'WWM Guides – Trading, Boss Talents, Seasonal Paths; WWM Helper',
        description:
          'Practical guides for Where Winds Meet systems; trading, seasonal paths, boss talents, mystic skills, and more.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/boss-talents',
    component: BossTalentsGuideComponent,
    data: {
      seo: {
        title: 'Boss Talents Guide (Blade Out); WWM Helper',
        description:
          'Seasonal boss talent challenges for Sword Trial and Hero’s Realm; track requirements, rewards, and completion.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/chess-wins',
    component: ChessWinsGuideComponent,
    data: {
      seo: {
        title: 'Chinese Chess Wins Guide; WWM Helper',
        description:
          'Guide for winning Chinese Chess encounters in Where Winds Meet; patterns, setups, and practical tips.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/multi-day-rewards',
    component: MultiDayRewardsGuideComponent,
    data: {
      seo: {
        title: 'Multi-day Rewards Guide; WWM Helper',
        description:
          'What resets when; how multi-day rewards work in Where Winds Meet; plan ahead and avoid waste.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/trading',
    component: TradingGuideComponent,
    data: {
      seo: {
        title: 'Trading Guide; WWM Helper',
        description:
          'Trading routes, reset logic, and practical strategy for Where Winds Meet trading; optimize coins and time.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/path-season',
    component: PathSeasonGuideComponent,
    data: {
      seo: {
        title: 'Seasonal Path Challenges Guide; WWM Helper',
        description:
          'Requirements and rewards for seasonal Path challenges; clear steps, unlock notes, and completion tracking.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/mystic-skill-materials',
    component: MysticSkillMaterialsGuideComponent,
    data: {
      seo: {
        title: 'Mystic Skill Materials Farming Guide; WWM Helper',
        description:
          'How to gather mystic skill upgrade materials efficiently; what matters, where to look, and how to track nodes.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'guides/mystic-metrics',
    component: MysticMetricsGuideComponent,
    data: {
      seo: {
        title: 'Mystic Skill Damage Metrics; WWM Helper',
        description:
          'Compare mystic skills by DPS, damage per Vitality, and efficiency; pin skills for side-by-side charts.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'tools',
    component: ToolsHubComponent,
    data: {
      seo: {
        title: 'WWM Tools Hub; WWM Helper',
        description:
          'Utility tools for Where Winds Meet; chess helper, planners, and quality-of-life utilities.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'tools/chinese-chess',
    component: ChineseChessComponent,
    data: {
      seo: {
        title: 'Chinese Chess Tool; WWM Helper',
        description:
          'Practice and solve Chinese Chess positions; helper tool built for Where Winds Meet players.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'tools/mystic-upgrade-planner',
    component: MysticUpgradePlannerComponent,
    data: {
      seo: {
        title: 'Mystic Upgrade Planner; WWM Helper',
        description:
          'Plan mystic upgrades and required materials; reduce guesswork; keep your progression structured.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'tools/settings',
    component: SettingsIoComponent,
    data: {
      seo: {
        title: 'Import/Export Settings; WWM Helper',
        description:
          'Export and import your timers and checklist setup; keep your config safe; move between devices easily.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      seo: {
        title: 'Privacy; WWM Helper',
        description:
          'Privacy details; what data is stored locally, what analytics are collected, and how consent works.',
        image: OG_DEFAULT_IMAGE,
      } satisfies SeoData,
    },
  },

  // Explicit 404 route (handy for testing / sharing)
  {
    path: '404',
    component: NotFoundComponent,
    data: { seo: NOT_FOUND_SEO },
  },

  // Real SPA fallback (unknown routes show 404 UI + noindex + canonical /404)
  {
    path: '**',
    component: NotFoundComponent,
    data: { seo: NOT_FOUND_SEO },
  },
];
