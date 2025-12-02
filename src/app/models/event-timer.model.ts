// src/app/models/event-timer.model.ts

import { DateTime } from 'luxon';

/**
 * Category for event timers - helps with grouping and styling
 */
export type EventTimerCategory =
  | 'battle-pass'
  | 'season'
  | 'gacha-standard'
  | 'gacha-special'
  | 'limited-event'
  | 'other';

/**
 * Event timer definition for limited-time content
 * Unlike recurring timers, these have a specific end date and are removed when expired
 */
export interface EventTimerDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  category: EventTimerCategory;

  /**
   * End date/time in UTC
   * Can be specified as:
   * - ISO string: '2025-12-11T21:00:00.000Z'
   * - Luxon DateTime object
   * - Object: { year, month, day, hour?, minute? } - assumes UTC, defaults to 21:00
   */
  endsAt: string | DateTime | EventTimerEndDate;

  /**
   * Optional description for the details panel
   */
  description?: string;

  /**
   * Whether this timer should auto-hide after expiration
   * Default: true
   */
  autoRemoveWhenExpired?: boolean;
}

export interface EventTimerEndDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

/**
 * Processed event timer chip for display
 */
export interface EventTimerChip {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  category: EventTimerCategory;
  remaining: string;
  isExpired: boolean;
  endsAt: DateTime;
}
