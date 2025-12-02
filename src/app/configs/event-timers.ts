// src/app/configs/event-timers.ts

import { EventTimerDefinition } from '../models';

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
    id: 'bp-blade-out-vol1',
    label: 'Battle Pass: Blade Out - Vol. 1',
    shortLabel: 'BP Vol.1',
    icon: 'bi-star-fill',
    category: 'battle-pass',
    // 9d 8h 30m from 2025-12-02 12:30 UTC = 2025-12-11 21:00 UTC (daily reset)
    endsAt: {
      year: 2025, // ✅ Fixed: was 2024
      month: 12,
      day: 11,
      hour: 21,
      minute: 0,
    },
    description:
      'Current battle pass with exclusive rewards and progression track. Complete weekly missions and daily tasks to maximize progress before it ends.',
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
  // Gacha - Special
  // ========================
  {
    id: 'gacha-swords-unseen',
    label: 'Gacha: Swords Unseen (Special)',
    shortLabel: 'Swords',
    icon: 'bi-gem',
    category: 'gacha-special',
    // Same end as BP Vol.1
    endsAt: {
      year: 2025, // ✅ Fixed: was 2024
      month: 12,
      day: 11,
      hour: 21,
      minute: 0,
    },
    description:
      'Special limited-time gacha banner featuring exclusive cosmetic weapons and appearance items. Does not follow the standard rotation.',
    autoRemoveWhenExpired: true,
  },

  // ========================
  // Gacha - Standard Rotation
  // ========================
  {
    id: 'gacha-cloud-garment',
    label: 'Gacha: Cloud Garment',
    shortLabel: 'Cloud',
    icon: 'bi-box-seam',
    category: 'gacha-standard',
    // "9 days left" - likely syncs with BP
    endsAt: {
      year: 2025, // ✅ Fixed: was 2024
      month: 12,
      day: 11,
      hour: 21,
      minute: 0,
    },
    description:
      'Current standard gacha banner rotation. Features rotating character outfits and equipment. Rotates with battle pass cycles.',
    autoRemoveWhenExpired: true,
  },
];
