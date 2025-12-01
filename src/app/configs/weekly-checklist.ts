import { ChecklistItem } from '../models';

export const WEEKLY_CHECKLIST: ChecklistItem[] = [
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
  {
    id: 'weekly-trading-loop',
    frequency: 'weekly',
    importance: 'optional',
    category: 'Economy',
    label: 'Run your weekly Trading / Commerce loop.',
    description:
      'Use the Trading timers: buy this week’s goods after Friday 21:00 UTC, hold and sell across the week (Local peaks or good Remote buyers), then clear all stock before the next Trade Week reset.',
    tags: ['economy', 'solo', 'guild'],
  },
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
  {
    id: 'weekly-sell-horses',
    frequency: 'weekly',
    importance: 'optional',
    category: 'Economy',
    label: 'Sell up to 5 horses for Commerce Coins.',
    description:
      'Catch or steal horses during the week (for example at Wildmane Ranch in Qinghe), then sell your best 5 at any Horse Merchant. Prioritise higher-value horses so you hit the weekly 5-sale limit with the most Commerce Coins possible.',
    tags: ['economy', 'mounts', 'solo'],
  },
  {
    id: 'weekly-intimacy-items',
    frequency: 'weekly',
    importance: 'optional',
    category: 'Social & intimacy',
    label: 'Buy weekly Intimacy items from the Social Shops.',
    description:
      'Use Adventure Slips and Harmony Charms to buy the limited-stock Intimacy gifts each week: Green Ant Wine in the Wandering Paths shop (5 Slips, 40/week) plus Love Comb, Dried Meat Gift and Green Ant Wine in the Partnership, Discipleship and Sworn Cohort shops (25 Harmony each, 20/week). Send them as gifts to raise Intimacy with friends and partners.',
    tags: ['social', 'economy', 'multiplayer'],
  },
];
