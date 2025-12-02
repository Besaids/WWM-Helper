import { TimerDefinition } from './timer-definition.model';

export interface TimerDetailsSection {
  heading: string;
  content: TimerDetailsSectionContent[];
}

export type TimerDetailsSectionContent =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

export interface TimerDetails {
  id: string;
  /** Short summary always shown when details drawer is open */
  summary: string;
  /** Whether this timer has expandable "Show more" content */
  hasLongDetails: boolean;
  /** Sections shown when "Show more" is toggled */
  longDetailsSections?: TimerDetailsSection[];
  /** Special UI flags */
  hasGuildConfig?: boolean;
  hasTradeGuideLink?: boolean;
}

// Enhanced timer definition that includes content
export interface TimerDefinitionWithDetails extends TimerDefinition {
  details: TimerDetails;
}
