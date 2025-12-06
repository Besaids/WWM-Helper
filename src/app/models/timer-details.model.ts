import { TimerDefinition } from './timer-definition.model';

/** Metadata for timer details - content is now in the template */
export interface TimerDetails {
  id: string;
  /** Whether this timer has expandable "Show more" content */
  hasLongDetails: boolean;
  /** Special UI flags */
  hasGuildConfig?: boolean;
  hasTradeGuideLink?: boolean;
}

// Enhanced timer definition that includes content
export interface TimerDefinitionWithDetails extends TimerDefinition {
  details: TimerDetails;
}
