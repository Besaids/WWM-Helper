import { EventTimerDefinition } from '../../models';

/**
 * Active limited-time / roadmap content timers
 *
 * MAINTENANCE NOTES:
 * - Check these timers when content updates (typically with daily/weekly reset)
 * - Remove expired entries
 * - Add new battle passes, seasons, gacha banners and roadmap events as they arrive
 * - Most content syncs with daily reset (21:00 UTC)
 */
export const EVENT_TIMERS: EventTimerDefinition[] = [
  // ========================
  // Battle Pass
  // ========================
  {
    id: 'bp-blade-out-vol2-collection',
    label: 'Battle Pass: Blade Out – Vol. 2 (Collection)',
    shortLabel: 'BP Vol.2',
    icon: 'bi-star-fill',
    image: 'assets/game/navigation/menu-battle-pass-icon.png',
    category: 'battle-pass',
    // Seen in-game: "Remaining: 27d10h" at 2025-12-12 10:13 UTC; syncs to daily reset
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    description:
      'Current battle pass (Magpie Branch) with exclusive rewards and progression track. Complete weekly missions and daily tasks to maximize progress before it ends.',
    autoRemoveWhenExpired: true,
  },

  // ========================
  // Season
  // ========================
  {
    id: 'season-blade-out-s1',
    label: 'Season: Blade Out Season 1',
    shortLabel: 'Season 1',
    icon: 'bi-calendar-range',
    image: 'assets/game/navigation/menu-season-icon.png',
    category: 'season',
    // End date: 06/02/2026 at daily reset (21:00 UTC on Feb 5 → Feb 6 transition)
    endsAt: {
      year: 2026,
      month: 2,
      day: 6,
      hour: 21,
      minute: 0,
    },
    description:
      'Current game season with exclusive currency (Jade Fish), seasonal shop, and time-limited rewards. Season shop items and weekly caps reset with the season.',
    autoRemoveWhenExpired: true,
  },

  // ========================
  // Gacha - Standard Rotation (Cloud Garment)
  // ========================
  {
    id: 'gacha-cloud-garment-musical-grace',
    label: 'Gacha: Cloud Garment – Musical Grace',
    shortLabel: 'Musical',
    icon: 'bi-box-seam',
    image: 'assets/game/navigation/menu-draw-icon.png',
    category: 'gacha-standard',
    // Banner shows "27 d"; aligns with current BP cycle; assumed daily reset end
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    description:
      'Cloud Garment rotation showcase. Musical Grace appearance remains available during the current cycle.',
    autoRemoveWhenExpired: true,
  },
  {
    id: 'gacha-cloud-garment-formless-disguise',
    label: 'Gacha: Cloud Garment – Formless Disguise',
    shortLabel: 'Formless',
    icon: 'bi-box-seam',
    image: 'assets/game/navigation/menu-draw-icon.png',
    category: 'gacha-standard',
    // Banner shows "27 d"; aligns with current BP cycle; assumed daily reset end
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    description:
      'Cloud Garment rotation showcase. Formless Disguise appearance is newly available during the current cycle.',
    autoRemoveWhenExpired: true,
  },

  // ========================
  // Roadmap – upcoming December content
  // (treated as countdowns to release at 21:00 UTC on the roadmap date)
  // ========================

  {
    id: 'sect-velvet-shade-release',
    label: 'Sect: Velvet Shade release',
    shortLabel: 'Velvet Shade',
    icon: 'bi-people',
    image: 'assets/game/navigation/menu-sects-icon.png',
    category: 'event-sect',
    // Roadmap date 12/14 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2025,
      month: 12,
      day: 14,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until the Velvet Shade sect releases. Timer tracks the expected unlock at daily reset on December 14 (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'sword-trial-scarlet-shock',
    label: 'Sword Trial: Scarlet Shock (Sleeping Daoist / Murong Yuan)',
    shortLabel: 'Scarlet Shock',
    icon: 'bi-sword',
    image: 'assets/guides/boss-talents/boss-sleeping-daoist-avatar.png',
    category: 'event-trial',
    // Roadmap Week 3–4, date 12/21 – treat as start timer
    endsAt: {
      year: 2025,
      month: 12,
      day: 21,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown to the Scarlet Shock Sword Trial featuring Sleeping Daoist and Murong Yuan. Assumes the event opens with the daily reset on December 21 (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'heros-realm-blazing-gale-dance',
    label: "Hero's Realm: Blazing Gale Dance (Twin Lions / Murong Yuan)",
    shortLabel: 'Blazing Gale',
    icon: 'bi-wind',
    image: 'assets/guides/boss-talents/boss-twin-lions-avatar.png',
    category: 'event-realm',
    // Roadmap Week 3–4, date 12/21 – treat as start timer
    endsAt: {
      year: 2025,
      month: 12,
      day: 21,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      "Countdown to the Blazing Gale Dance Hero's Realm encounter with Twin Lions and Murong Yuan. Assumes it unlocks at the December 21 daily reset (21:00 UTC).",
    autoRemoveWhenExpired: true,
  },

  {
    id: 'fireworks-festival-year-end',
    label: 'Fireworks Festival (Year-end)',
    shortLabel: 'Fireworks',
    icon: 'bi-stars',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event-festival',
    // Roadmap shows 12/30 – treat as festival starting at that reset
    endsAt: {
      year: 2025,
      month: 12,
      day: 30,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown to the year-end Fireworks Festival in Kaifeng. Timer points at the expected start around the December 30 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  // ========================
  // Windtail’s Jianghu – limited events
  // ========================

  {
    id: 'event-great-faceologist',
    label: 'The Great Faceologist',
    shortLabel: 'Faceologist',
    icon: 'bi-person-bounding-box',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    endsAt: {
      year: 2026,
      month: 1,
      day: 1,
      hour: 21,
      minute: 0,
    },
    description:
      'Windtail’s Jianghu creative event. Submit and support fashion/face presets to earn rewards over the event duration.',
    autoRemoveWhenExpired: true,
  },
  {
    id: 'event-thaw-of-eons',
    label: 'Thaw of Eons',
    shortLabel: 'Thaw of Eons',
    icon: 'bi-fire',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    endsAt: {
      year: 2026,
      month: 1,
      day: 4,
      hour: 21,
      minute: 0,
    },
    description:
      'Festival hub event tied to Kaifeng fireworks and Lucky Money. Includes Fortune Beyond Parlor, Social Butterfly and Fireworks Festival sub-events.',
    autoRemoveWhenExpired: true,
  },
  {
    id: 'event-lumina-guide-kaifeng',
    label: 'Lumina Guide – Kaifeng',
    shortLabel: 'Lumina Kaifeng',
    icon: 'bi-geo-alt',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    endsAt: {
      year: 2026,
      month: 2,
      day: 5,
      hour: 4,
      minute: 0,
    },
    description:
      'Limited-time Lumina Guide storyline in Kaifeng. Clear the event instance and objectives before it disappears from the Events panel.',
    autoRemoveWhenExpired: true,
  },
  {
    id: 'event-lumina-guide-qinghe',
    label: 'Lumina Guide – Qinghe',
    shortLabel: 'Lumina Qinghe',
    icon: 'bi-geo-alt',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 4,
      minute: 0,
    },
    description:
      'Limited-time Lumina Guide storyline in Qinghe. Finish its Manual-style exploration and rewards before the timer ends.',
    autoRemoveWhenExpired: true,
  },
  // ========================
  // Roadmap – upcoming January 2026 content
  // (treated as countdowns to release at 21:00 UTC on the roadmap date)
  // ========================

  {
    id: 'solo-mode-lv10-unbound-release',
    label: 'Solo Mode: Lv.10 – Unbound (release)',
    shortLabel: 'Solo: Unbound',
    icon: 'bi-person',
    image: 'assets/game/navigation/solo-mode-icon.png',
    category: 'event',
    // Roadmap date 01/04 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 4,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until Solo Mode “Lv.10 – Unbound” becomes available at the January 4 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'heros-realm-sorrow-of-mortalbound-release',
    label: "Hero's Realm: Sorrow of Mortalbound (release)",
    shortLabel: 'Sorrow (HR)',
    icon: 'bi-trophy',
    image: 'assets/guides/boss-talents/boss-twin-lions-avatar.png',
    category: 'event-realm',
    // Roadmap date 01/04 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 4,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until the “Sorrow of Mortalbound” Hero’s Realm encounter unlocks at the January 4 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'kaifeng-campaign-legacy-quests-release',
    label: 'Kaifeng Campaign & Legacy Quests (release)',
    shortLabel: 'Kaifeng Quests',
    icon: 'bi-journal-bookmark',
    image: 'assets/game/navigation/menu-quest-icon.png',
    category: 'event',
    // Roadmap date 01/08 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until Kaifeng Campaign & Legacy Quests content becomes available at the January 8 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'world-boss-nameless-general-release',
    label: 'World Boss: Nameless General (release)',
    shortLabel: 'World Boss',
    icon: 'bi-skull',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    // Roadmap date 01/08 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until the “Nameless General” World Boss becomes available at the January 8 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'event-jianghu-martial-games-release',
    label: 'Event: Jianghu Martial Games (release)',
    shortLabel: 'Martial Games',
    icon: 'bi-lightning-charge',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    // Roadmap date 01/08 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 8,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Jianghu Martial Games” starts at the January 8 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'puzzle-cave-mistveil-prison-release',
    label: 'Puzzle Cave: Mistveil Prison (release)',
    shortLabel: 'Mistveil',
    icon: 'bi-puzzle',
    image: 'assets/game/navigation/journal-icon.png',
    category: 'event',
    // Roadmap date 01/15 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 15,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Puzzle Cave: Mistveil Prison” unlocks at the January 15 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'event-guild-battle-preseason-release',
    label: 'Event: Guild Battle Preseason (release)',
    shortLabel: 'Guild Preseason',
    icon: 'bi-people',
    image: 'assets/game/navigation/menu-guild-icon.png',
    category: 'event',
    // Roadmap date 01/16 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 16,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Guild Battle Preseason” starts at the January 16 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'region-nine-mortal-ways-base-release',
    label: 'Region: Nine Mortal Ways Base (release)',
    shortLabel: 'Nine Mortal',
    icon: 'bi-geo-alt',
    image: 'assets/game/navigation/menu-quest-icon.png',
    category: 'event',
    // Roadmap date 01/22 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 22,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until the “Nine Mortal Ways Base” region content unlocks at the January 22 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'story-whispers-beneath-the-moon-release',
    label: 'Story: Whispers Beneath the Moon (release)',
    shortLabel: 'New Story',
    icon: 'bi-book',
    image: 'assets/game/navigation/menu-quest-icon.png',
    category: 'event',
    // Roadmap date 01/25 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 25,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Whispers Beneath the Moon” story content becomes available at the January 25 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'event-year-of-abundance-release',
    label: 'Event: Year of Abundance (release)',
    shortLabel: 'Abundance',
    icon: 'bi-gift',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    // Roadmap date 01/29 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 29,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Year of Abundance” starts at the January 29 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },

  {
    id: 'event-season-end-dash-release',
    label: 'Event: Season-End Dash (release)',
    shortLabel: 'Season Dash',
    icon: 'bi-flag',
    image: 'assets/game/navigation/menu-events-icon.png',
    category: 'event',
    // Roadmap date 01/29 – assume goes live at daily reset (21:00 UTC)
    endsAt: {
      year: 2026,
      month: 1,
      day: 29,
      hour: 21,
      minute: 0,
    },
    target: 'release',
    description:
      'Countdown until “Season-End Dash” starts at the January 29 daily reset (21:00 UTC).',
    autoRemoveWhenExpired: true,
  },
];
