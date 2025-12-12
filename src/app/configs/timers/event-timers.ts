import { EventTimerDefinition } from '../../models';

/**
 * Active limited-time content timers
 *
 * MAINTENANCE NOTES:
 * - Check these timers when content updates (typically with daily/weekly reset)
 * - Remove expired entries
 * - Add new battle passes, seasons, gacha banners as they arrive
 * - Most content syncs with daily reset (21:00 UTC)
 */
export const EVENT_TIMERS: EventTimerDefinition[] = [
  // ========================
  // Battle Pass
  // ========================
  {
    id: 'bp-blade-out-vol2-collection',
    label: 'Battle Pass: Blade Out - Vol. 2 (Collection)',
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
      day: 5,
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
];
