import { TimerDetails } from '../../models';

/** Simplified config - only metadata, content is in the template */
export const TIMER_DETAILS_CONFIG: Record<string, TimerDetails> = {
  'daily-reset': {
    id: 'daily-reset',
    hasLongDetails: true,
  },
  'weekly-reset': {
    id: 'weekly-reset',
    hasLongDetails: true,
  },
  'arena-1v1': {
    id: 'arena-1v1',
    hasLongDetails: true,
  },
  'fireworks-seats': {
    id: 'fireworks-seats',
    hasLongDetails: true,
  },
  'fireworks-festival': {
    id: 'fireworks-festival',
    hasLongDetails: true,
  },
  'fireworks-show': {
    id: 'fireworks-show',
    hasLongDetails: true,
  },
  'mirage-boat': {
    id: 'mirage-boat',
    hasLongDetails: true,
  },
  'guild-breaking-army': {
    id: 'guild-breaking-army',
    hasLongDetails: false,
    hasGuildConfig: true,
  },
  'guild-test-your-skills': {
    id: 'guild-test-your-skills',
    hasLongDetails: false,
    hasGuildConfig: true,
  },
  'trading-week-reset': {
    id: 'trading-week-reset',
    hasLongDetails: true,
    hasTradeGuideLink: true,
  },
  'trading-price-peak-check': {
    id: 'trading-price-peak-check',
    hasLongDetails: true,
    hasTradeGuideLink: true,
  },
};
