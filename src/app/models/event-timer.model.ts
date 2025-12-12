import { DateTime } from 'luxon';

/**
 * Whether the timer is counting down to the start of content or to its end.
 * Default: 'end'
 */
export type EventTimerTarget = 'release' | 'end';

/**
 * Category for event timers - helps with grouping and styling
 */
export type EventTimerCategory =
  | 'battle-pass'
  | 'season'
  | 'gacha-standard'
  | 'gacha-special'
  | 'limited-event'
  | 'other'
  | 'event-festival'
  | 'event-realm'
  | 'event-trial'
  | 'event-sect'
  | 'event';

/**
 * Event timer definition for limited-time content
 * Unlike recurring timers, these have a specific end date and are removed when expired
 */
export interface EventTimerDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  image: string;
  category: EventTimerCategory;

  /**
   * End date/time in UTC
   */
  endsAt: string | DateTime | EventTimerEndDate;

  /**
   * Is this a countdown until the content starts or ends?
   * If omitted, treated as 'end' for backwards compatibility.
   */
  target?: EventTimerTarget;

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
  image: string;
  category: EventTimerCategory;
  remaining: string;
  isExpired: boolean;
  endsAt: DateTime;

  /**
   * Start vs end countdown
   */
  target: EventTimerTarget;
}
