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
      'Use the Trade Week Reset and Trade Price Check timers: buy after Friday 21:00 (UTC), hold and sell across the week, and make sure all Trading Goods are dumped before the next trade reset.',
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
];
