import { DateTime } from 'luxon';

export type ChecklistFrequency = 'daily' | 'weekly';
export type ChecklistImportance = 'core' | 'optional';

export type ChecklistTag =
  | 'solo'
  | 'multiplayer'
  | 'guild'
  | 'combat'
  | 'social'
  | 'economy'
  | 'exploration'
  | 'leisure'
  | 'premium';

export interface ChecklistItem {
  id: string;
  frequency: ChecklistFrequency;
  importance: ChecklistImportance;
  category: string;
  label: string;
  description?: string;
  tags?: ChecklistTag[];
}

export interface FreeplayIdea {
  id: string;
  category: string;
  label: string;
  description: string;
  tags?: ChecklistTag[];
}

/**
 * Daily checklist items
 */
export const DAILY_CHECKLIST: ChecklistItem[] = [
  // Core dailies
  {
    id: 'daily-energy',
    frequency: 'daily',
    importance: 'core',
    category: 'Core loop',
    label: 'Spend Energy on Wandering Paths (avoid capping).',
    description:
      'Use Campaign, Outpost or Sword Trial runs to burn Energy based on the rewards you want.',
    tags: ['combat', 'solo', 'multiplayer'],
  },
  {
    id: 'daily-jianghu-errands',
    frequency: 'daily',
    importance: 'core',
    category: 'Sect & multiplayer',
    label: 'Complete your Sect Jianghu Errands.',
    description:
      'Daily Merit for the Sect ladder plus Reputation (which has its own weekly cap).',
    tags: ['social', 'solo'],
  },
  {
    id: 'daily-multiplayer-routine',
    frequency: 'daily',
    importance: 'core',
    category: 'Sect & multiplayer',
    label:
      'Do Blessed Land for Cultivation, Five Animal Frolics and Scholar’s Hearth (multiplayer).',
    description:
      'Low-stress online content that gives character XP, Coins and Adventure Slips; often overlaps with Jianghu Errands.',
    tags: ['multiplayer', 'social'],
  },
  {
    id: 'daily-merchants',
    frequency: 'daily',
    importance: 'core',
    category: 'Economy',
    label: 'Check daily-reset merchants.',
    description:
      'Buy only what you actually need; Coin income is limited and used in many systems.',
    tags: ['economy', 'solo'],
  },
  {
    id: 'daily-chess',
    frequency: 'daily',
    importance: 'core',
    category: 'Economy',
    label: 'Win up to 3 Ye Buxiu chess matches.',
    description:
      'Located in Qinghe – Dreamscape: Blissful Retreat. On Expert: up to 900 Commerce Coin per day; each loss costs 150 Coin.',
    tags: ['economy', 'solo'],
  },

  // Optional dailies
  {
    id: 'daily-stamina',
    frequency: 'daily',
    importance: 'optional',
    category: 'Economy',
    label: 'Spend some Stamina on crafting (if near cap).',
    description:
      'Stamina caps at 2,500. Use it on gear, food, medicine, manuals or construction items if you are close to capping.',
    tags: ['economy', 'solo'],
  },
  {
    id: 'daily-baths',
    frequency: 'daily',
    importance: 'optional',
    category: 'Leisure & cosmetics',
    label: 'Visit Springwave Pavilion baths (Kaifeng).',
    description:
      'Give/receive massages for Coins, character XP and Adventure Slips. A 10-day streak grants the “Bathrobe: Golden Threads” outfit.',
    tags: ['leisure', 'social', 'economy', 'multiplayer'],
  },
  {
    id: 'daily-gathering',
    frequency: 'daily',
    importance: 'optional',
    category: 'Preparation',
    label: 'Gather flowers and materials used for Mystic Skill upgrades.',
    description:
      'Some flowers have low drop-rate mats for Mystic Skills; farming slowly over time reduces grind later.',
    tags: ['exploration', 'solo'],
  },
  {
    id: 'daily-bounties',
    frequency: 'daily',
    importance: 'optional',
    category: 'Economy',
    label: 'Do Bounties (NPC and player-posted).',
    description:
      'NPC Bounty pools reset daily; player bounties let you keep farming Fourfold Coin and climbing the Bounty leaderboard.',
    tags: ['economy', 'combat', 'solo', 'multiplayer'],
  },
];

/**
 * Weekly checklist items
 */
export const WEEKLY_CHECKLIST: ChecklistItem[] = [
  // High-value weekly things
  {
    id: 'weekly-lingering-melody',
    frequency: 'weekly',
    importance: 'core',
    category: 'Premium pulls',
    label: 'Buy weekly Lingering Melodies with Echo Jade.',
    description:
      'Up to 3 per week: 2 × in Shop → Items (200 Echo Jade each) and 1 × in Season → Jade Fish → Appearance Exchange (200 Echo Jade). Total 600 Echo Jade for 3 premium gacha pulls.',
    tags: ['economy', 'premium'],
  },
  {
    id: 'weekly-heros-realm',
    frequency: 'weekly',
    importance: 'core',
    category: 'Group content',
    label: 'Clear weekly Hero’s Realm (Wandering Paths).',
    description:
      'Up to 10-player raid. Two bosses per run; 1 weekly reward per boss. Costs no Energy and even grants Energy plus key weekly rewards.',
    tags: ['combat', 'multiplayer'],
  },
  {
    id: 'weekly-guild-heros-realm',
    frequency: 'weekly',
    importance: 'core',
    category: 'Guild',
    label: 'Clear weekly Guild Hero’s Realm.',
    description:
      '5–10 guild members only; separate weekly reward for clearing both bosses together. No matchmaking and no Energy cost.',
    tags: ['guild', 'combat', 'multiplayer'],
  },
  {
    id: 'weekly-guild-events',
    frequency: 'weekly',
    importance: 'core',
    category: 'Guild',
    label: 'Do your Guild’s weekly Events.',
    description:
      'Earn currencies used to upgrade yourself in the Technique tab and support guild progression.',
    tags: ['guild', 'multiplayer'],
  },

  // Weekly economy / trading
  {
    id: 'weekly-trading',
    frequency: 'weekly',
    importance: 'optional',
    category: 'Economy',
    label: 'Run trading at Feng’s Tradehall for Commerce Coins.',
    description:
      'Buy goods at Feng’s Tradehall and sell at the Trade Commission next door. Read a trading guide first; the system rewards understanding price trends.',
    tags: ['economy', 'solo'],
  },

  // Weekly caps
  {
    id: 'weekly-cap-coin',
    frequency: 'weekly',
    importance: 'core',
    category: 'Caps',
    label: 'Hit your weekly Coin target (up to 175,000).',
    description: 'Regular Coin from repeatable activities; used in almost every system.',
    tags: ['economy'],
  },
  {
    id: 'weekly-cap-reputation',
    frequency: 'weekly',
    importance: 'core',
    category: 'Caps',
    label: 'Hit weekly Reputation cap (1,200).',
    description: 'Earned mainly from Jianghu Errands; used in Sect shops.',
    tags: ['economy', 'social'],
  },
  {
    id: 'weekly-cap-jade-fish',
    frequency: 'weekly',
    importance: 'core',
    category: 'Caps',
    label: 'Hit weekly Jade Fish cap (20,000) and spend it wisely.',
    description:
      'Season currency from many activities; used in the Season Shop where many items also have weekly purchase limits.',
    tags: ['economy'],
  },
  {
    id: 'weekly-cap-treasure-token',
    frequency: 'weekly',
    importance: 'core',
    category: 'Caps',
    label: 'Hit weekly Treasure Token cap (2,500).',
    description: 'Obtained from Guild Events; spent in the Red Gold Boutique.',
    tags: ['economy', 'guild'],
  },
  {
    id: 'weekly-cap-harmony-charm',
    frequency: 'weekly',
    importance: 'core',
    category: 'Caps',
    label: 'Hit weekly Harmony Charm cap (2,000).',
    description:
      'Social currency from Partnership, Discipleship and Sworn Cohort activities; spent in the Social Shop.',
    tags: ['economy', 'social'],
  },
  {
    id: 'weekly-cap-social-xp',
    frequency: 'weekly',
    importance: 'core',
    category: 'Social',
    label: 'Reach weekly XP caps for Partnership / Discipleship / Sworn Cohort and Intimacy.',
    description:
      'Play with Partner, Disciples, Sworn Cohort and friends in any content. Each has a weekly XP cap; Intimacy has a hidden weekly limit.',
    tags: ['social', 'multiplayer'],
  },
];

/**
 * “I’m lost, what can I do?” ideas
 */
export const FREEPLAY_IDEAS: FreeplayIdea[] = [
  {
    id: 'idea-events',
    category: 'Progress / Events',
    label: 'Check the Events tab.',
    description:
      'Look for limited-time or seasonal events that align with what you enjoy; they often overlap with your normal activities.',
    tags: ['solo', 'multiplayer'],
  },
  {
    id: 'idea-taiping-mausoleum',
    category: 'Progress / Events',
    label: 'Run Taiping Mausoleum (Foundation Trials & Divine Challenge).',
    description:
      'Use Foundation Trials to push character progression and Divine Challenge for harder content and rewards.',
    tags: ['combat', 'solo', 'multiplayer'],
  },
  {
    id: 'idea-trials',
    category: 'Combat',
    label: 'Do Trials to re-fight bosses.',
    description:
      'Beat up bosses you have already cleared for extra rewards and practice in higher difficulties.',
    tags: ['combat', 'solo', 'multiplayer'],
  },
  {
    id: 'idea-pvp',
    category: 'Combat',
    label: 'Queue for PvP.',
    description: 'Jump into PvP modes if you feel like testing builds or just want a change of pace.',
    tags: ['combat', 'multiplayer'],
  },
  {
    id: 'idea-casual-coop',
    category: 'Social / Co-op',
    label: 'Join Casual Co-op activities (Adventure / Leisure).',
    description:
      'Low-pressure co-op content; a good way to meet people while still earning rewards.',
    tags: ['multiplayer', 'social'],
  },
  {
    id: 'idea-seasonal-martial-arts',
    category: 'Progress / Builds',
    label: 'Work on seasonal objectives for your martial arts.',
    description:
      'Follow the seasonal path for your weapon / martial art to unlock upgrades and cosmetics.',
    tags: ['combat', 'solo'],
  },
  {
    id: 'idea-martial-arts-hunt',
    category: 'Progress / Builds',
    label: 'Research and chase missing martial arts, inner ways and mystic skills.',
    description:
      'Look up how to obtain each missing piece and start knocking them out before you hit a wall later.',
    tags: ['combat', 'exploration'],
  },
  {
    id: 'idea-quests',
    category: 'Content / Exploration',
    label: 'Clear quest backlogs (main, side, tales).',
    description:
      'Quests give a mix of resources, appearances, titles and story; clearing them also improves region completion.',
    tags: ['exploration', 'solo'],
  },
  {
    id: 'idea-exploration',
    category: 'Content / Exploration',
    label: 'Explore for oddities, chests and points of interest.',
    description:
      'Roam the map for oddities, chests and other POIs; they feed into region exploration rates and rewards.',
    tags: ['exploration', 'solo'],
  },
  {
    id: 'idea-region-minmax',
    category: 'Content / Exploration',
    label: 'Min-max region exploration rates.',
    description:
      'Target specific regions to max out Tales, Echoes, Wandering Tales and other completion metrics.',
    tags: ['exploration', 'solo'],
  },
  {
    id: 'idea-compendium',
    category: 'Collection',
    label: 'Fill out your Compendium.',
    description:
      'Check entries and see what you still need to unlock; treat it as a long-term to-do list for completion.',
    tags: ['exploration', 'solo'],
  },
  {
    id: 'idea-fishing',
    category: 'Leisure',
    label: 'Go fishing.',
    description:
      'Relax, catch some fish, and fill Compendium entries. Occasionally tied to events or “catch X fish” style objectives, but mostly just a chill side activity.',
    tags: ['leisure', 'solo'],
  },
  {
    id: 'idea-social',
    category: 'Social / Multiplayer',
    label: 'Hang out in multiplayer and socialize.',
    description:
      'Spend time in Kaifeng, Fireworks Festival, baths or other hubs. Make friends, join a guild, and build social XP while goofing around.',
    tags: ['multiplayer', 'social'],
  },
];

/**
 * Helpers for cycle IDs aligned with reset times
 * (used by ChecklistComponent via import).
 */

export function getDailyCycleId(): string {
  const resetHourUtc = 21; // 21:00 UTC daily reset
  const now = DateTime.utc();
  let resetBase = now.set({
    hour: resetHourUtc,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  if (now < resetBase) {
    resetBase = resetBase.minus({ days: 1 });
  }

  return resetBase.toISODate(); // e.g. "2025-11-27"
}

export function getWeeklyCycleId(): string {
  const resetHourUtc = 21; // 21:00 UTC
  const resetWeekday = 7; // Sunday in ISO (1=Mon..7=Sun)
  const now = DateTime.utc();
  let resetBase = now.set({
    weekday: resetWeekday,
    hour: resetHourUtc,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  if (now < resetBase) {
    resetBase = resetBase.minus({ weeks: 1 });
  }

  return resetBase.toISODate();
}
