import { ChecklistItem } from '../../models';

export const SEASONAL_DAILY_CHECKLIST: ChecklistItem[] = [
  {
    id: 'bp-daily-login',
    frequency: 'seasonal-daily',
    importance: 'core',
    category: 'Battle Pass – Daily',
    label: 'Log into the game today.',
    description: 'Simple login task that awards Battle Pass EXP once per day.',
    tags: ['progression', 'solo'],
    seasonId: 'jade-table-s1',
    expired: false,
  },
  {
    id: 'bp-daily-group-content',
    frequency: 'seasonal-daily',
    importance: 'core',
    category: 'Battle Pass – Daily',
    label: 'Complete Hero’s Realm, Sword Trial, Casual Co-op, or Arena modes.',
    description:
      'Clear at least one of the listed group or matchmade activities to gain daily Battle Pass EXP.',
    tags: ['combat', 'multiplayer'],
    seasonId: 'jade-table-s1',
    expired: false,
  },
  {
    id: 'bp-daily-wulin-journal',
    frequency: 'seasonal-daily',
    importance: 'core',
    category: 'Battle Pass – Daily',
    label: 'Complete any Wulin Journal experience.',
    description:
      'Finish one Wulin Journal activity of your choice; counts toward daily Battle Pass progress.',
    tags: ['adventure', 'exploration', 'solo'],
    seasonId: 'jade-table-s1',
    expired: false,
  },
  {
    id: 'bp-daily-consume-energy-40',
    frequency: 'seasonal-daily',
    importance: 'core',
    category: 'Battle Pass – Daily',
    label: 'Consume 40 Energy.',
    description:
      'Spend at least 40 Energy in any content (Campaign, Outpost, Trials, etc.) to complete this daily.',
    tags: ['progression', 'combat', 'solo', 'multiplayer'],
    seasonId: 'jade-table-s1',
    expired: false,
  },
  {
    id: 'bp-daily-outfit-or-decoration',
    frequency: 'seasonal-daily',
    importance: 'core',
    category: 'Battle Pass – Daily',
    label: 'Upload any outfit or increase Decoration Popularity.',
    description:
      'Interact with fashion or housing by uploading an outfit or raising Decoration Popularity for a daily Battle Pass reward.',
    tags: ['cosmetics', 'leisure', 'social'],
    seasonId: 'jade-table-s1',
    expired: false,
  },
];
