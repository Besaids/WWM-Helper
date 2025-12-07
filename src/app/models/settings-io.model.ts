/**
 * Settings Import/Export Models
 *
 * Versioned payload structure for exporting and importing user settings
 * for checklists and timers.
 */

import { ChecklistItem } from './checklist.model';
import { CustomTimerDefinition } from './custom-timer.model';
import { GuildEventConfig, GuildTimerId } from '../services/timer/guild-event-timers.service';

/**
 * Export payload version 1
 */
export interface WwmSettingsExportV1 {
  /** Schema version for future-proofing */
  version: 1;
  /** ISO timestamp of when the export was created */
  exportedAt: string;
  /** Source identifier to validate imports */
  source: 'wwm-helper';

  /** Checklist-related settings */
  checklists?: {
    /** User-created custom checklist items */
    customItems?: ChecklistItem[];
    /** Pinned item IDs */
    pinned?: Record<string, boolean>;
    /** Hidden item IDs */
    hidden?: Record<string, boolean>;
  };

  /** Timer-related settings */
  timers?: {
    /** User-created custom timers */
    customTimers?: CustomTimerDefinition[];
    /** Enabled timer IDs */
    enabledIds?: string[];
    /** Guild event configurations */
    guildEvents?: Partial<Record<GuildTimerId, GuildEventConfig>>;
  };
}

/**
 * Export options - which sections to include
 */
export interface SettingsExportOptions {
  checklistCustomItems: boolean;
  checklistPinsHidden: boolean;
  timerCustomTimers: boolean;
  timerEnabledIds: boolean;
  timerGuildEvents: boolean;
}

/**
 * Import options - which sections to apply and how
 */
export interface SettingsImportOptions {
  scopes: SettingsExportOptions;
  mode: 'add' | 'overwrite';
}

/**
 * Summary of what an import contains
 */
export interface ImportSummary {
  customChecklistItemCount: number;
  pinnedCount: number;
  hiddenCount: number;
  customTimerCount: number;
  enabledTimerCount: number;
  guildEventCount: number;
}

/**
 * Validation result for import
 */
export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary?: ImportSummary;
  payload?: WwmSettingsExportV1;
}

/**
 * Default export options (all selected)
 */
export const DEFAULT_EXPORT_OPTIONS: SettingsExportOptions = {
  checklistCustomItems: true,
  checklistPinsHidden: true,
  timerCustomTimers: true,
  timerEnabledIds: true,
  timerGuildEvents: true,
};

/**
 * Default import options
 */
export const DEFAULT_IMPORT_OPTIONS: SettingsImportOptions = {
  scopes: { ...DEFAULT_EXPORT_OPTIONS },
  mode: 'add',
};
