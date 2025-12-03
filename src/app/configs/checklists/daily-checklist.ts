import { ChecklistItem } from '../../models';

export const DAILY_CHECKLIST: ChecklistItem[] = [
  {
    id: 'daily-energy',
    frequency: 'daily',
    importance: 'core',
    category: 'Core loop',
    label: 'Spend Energy on Wandering Paths (avoid capping).',
    description:
      'Use Campaign, Outpost or Sword Trial runs to burn Energy based on the rewards you want.',
    tags: ['combat', 'solo', 'multiplayer'],
    expired: false,
  },
  {
    id: 'daily-jianghu-errands',
    frequency: 'daily',
    importance: 'core',
    category: 'Sect & multiplayer',
    label: 'Complete your Sect Jianghu Errands.',
    description: 'Daily Merit for the Sect ladder plus Reputation (which has its own weekly cap).',
    tags: ['social', 'solo'],
    expired: false,
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
    expired: false,
  },
  {
    id: 'daily-sword-trial-joint-battle',
    frequency: 'daily',
    importance: 'core',
    category: 'Sect & multiplayer',
    label: 'Clear all 5 Joint Battle outposts (Sword Trial daily reward).',
    description:
      'In Hero’s Realm → Sword Trial → Joint Battle, clear all 5 outposts in a chain to claim the daily clear reward chest (40 Adventure Slips). Claim attempts refresh at daily reset.',
    tags: ['multiplayer', 'combat', 'reward'],
    expired: false,
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
    expired: false,
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
    expired: false,
  },
  {
    id: 'daily-trading-buy-goods',
    frequency: 'daily',
    importance: 'optional',
    category: 'Economy',
    label: 'Trade – buy weekly goods (Fri→Sun).',
    description:
      'After the Friday 21:00 UTC trade reset, buy this week’s Trading Goods: usually 30 of the two most expensive items and 20 of the cheapest (if you have 80 slots). Refill again after Sunday reset if you already sold.',
    tags: ['economy', 'solo'],
    expired: false,
  },
  {
    id: 'daily-trading-check-prices',
    frequency: 'daily',
    importance: 'optional',
    category: 'Economy',
    label: 'Trade – check prices and offload goods.',
    description:
      'Use the Trading timers for mid-week checks: watch the Local item’s % and refresh Remote Price for high-value buyers (guild members give bonuses). Offload all goods before Friday 21:00 UTC.',
    tags: ['economy', 'solo', 'guild'],
    expired: false,
  },
  {
    id: 'daily-stamina',
    frequency: 'daily',
    importance: 'optional',
    category: 'Economy',
    label: 'Spend some Stamina on crafting (if near cap).',
    description:
      'Stamina caps at 2,500. Use it on gear, food, medicine, manuals or construction items if you are close to capping.',
    tags: ['economy', 'solo'],
    expired: false,
  },
  {
    id: 'daily-baths',
    frequency: 'daily',
    importance: 'optional',
    category: 'Streak & one-time rewards',
    label: 'Visit Springwave Pavilion baths (Kaifeng).',
    description:
      'Give/receive massages for Coins, character XP and Adventure Slips. A 10-day streak grants the “Bathrobe: Golden Threads” outfit. Missing a day resets the streak.',
    tags: ['leisure', 'social', 'economy', 'multiplayer', 'reward', 'cosmetics'],
    expired: false,
  },
  {
    id: 'daily-well-of-heaven-training',
    frequency: 'daily',
    importance: 'optional',
    category: 'Streak & one-time rewards',
    label: 'Well of Heaven Special Training (+1 Constitution).',
    description:
      'From Wandering Paths → Casual Co-op → Adventure, queue for “Well of Heaven Special Training” (Qinghe – West Heaven’s Pier). Completing it once per day grants +1 Constitution (up to +10 total) plus normal co-op rewards, helping you meet Constitution requirements on gear.',
    tags: ['adventure', 'progression', 'stats', 'multiplayer', 'reward'],
    expired: false,
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
    expired: false,
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
    expired: false,
  },
  {
    id: 'daily-home-hair-combing',
    frequency: 'daily',
    importance: 'optional',
    category: 'Streak & one-time rewards',
    label: 'Comb hair at your home mirror (free hairstyles).',
    description:
      'At your character’s home, interact with the mirror once per day to unlock free hairstyles (two at a time, for a total of around 13). After about a week of daily visits you should have them all; once you’re done, you can hide this task.',
    tags: ['cosmetics', 'solo', 'reward'],
    expired: false,
  },
];
