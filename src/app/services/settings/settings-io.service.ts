import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import {
  WwmSettingsExportV1,
  SettingsExportOptions,
  SettingsImportOptions,
  ImportValidationResult,
  ImportSummary,
  ChecklistItem,
  CustomTimerDefinition,
  CUSTOM_CHECKLIST_LIMITS,
  CUSTOM_TIMER_LIMITS,
} from '../../models';
import { CustomChecklistService } from '../checklist/custom-checklist.service';
import { ChecklistStateService } from '../checklist/checklist-state.service';
import { CustomTimerService } from '../timer/custom-timer.service';
import { TimerPreferencesService } from '../timer/timer-preferences.service';
import {
  GuildEventTimersService,
  GuildTimerId,
  GuildEventConfig,
} from '../timer/guild-event-timers.service';

const VALID_GUILD_TIMER_IDS: GuildTimerId[] = ['guild-breaking-army', 'guild-test-your-skills'];

const VALID_CHECKLIST_FREQUENCIES = [
  'daily',
  'weekly',
  'seasonal-daily',
  'seasonal-weekly',
  'seasonal-period',
  'custom',
] as const;

const VALID_CHECKLIST_IMPORTANCES = ['core', 'optional', 'daily', 'weekly'] as const;

const VALID_TIMER_SCHEDULE_TYPES = [
  'daily',
  'weekly',
  'weekly-multi',
  'weekly-range',
  'daily-multi',
  'weekly-times',
] as const;

const VALID_EVENT_CATEGORIES = [
  'battle-pass',
  'season',
  'gacha-standard',
  'gacha-special',
  'limited-event',
  'other',
] as const;

@Injectable({ providedIn: 'root' })
export class SettingsIoService {
  private readonly customChecklist = inject(CustomChecklistService);
  private readonly checklistState = inject(ChecklistStateService);
  private readonly customTimers = inject(CustomTimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);
  private readonly guildTimers = inject(GuildEventTimersService);

  /**
   * Build an export payload based on the selected options
   */
  buildExport(options: SettingsExportOptions): WwmSettingsExportV1 {
    const payload: WwmSettingsExportV1 = {
      version: 1,
      exportedAt: DateTime.utc().toISO(),
      source: 'wwm-helper',
    };

    // Build checklists section
    const hasChecklistOptions = options.checklistCustomItems || options.checklistPinsHidden;
    if (hasChecklistOptions) {
      payload.checklists = {};

      if (options.checklistCustomItems) {
        payload.checklists.customItems = this.customChecklist.getAll();
      }

      if (options.checklistPinsHidden) {
        const prefs = this.checklistState.getPrefsSnapshot();
        payload.checklists.pinned = { ...prefs.pinned };
        payload.checklists.hidden = { ...prefs.hidden };
      }
    }

    // Build timers section
    const hasTimerOptions =
      options.timerCustomTimers || options.timerEnabledIds || options.timerGuildEvents;
    if (hasTimerOptions) {
      payload.timers = {};

      if (options.timerCustomTimers) {
        payload.timers.customTimers = this.customTimers.getAll();
      }

      if (options.timerEnabledIds) {
        payload.timers.enabledIds = this.timerPrefs.getEnabledIdsSnapshot();
      }

      if (options.timerGuildEvents) {
        payload.timers.guildEvents = this.guildTimers.getConfigsSnapshot();
      }
    }

    return payload;
  }

  /**
   * Validate import JSON text and return detailed results
   */
  validateImport(jsonText: string): ImportValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Step 1: Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return {
        valid: false,
        errors: [`Invalid JSON syntax: ${e instanceof Error ? e.message : 'Parse error'}`],
        warnings: [],
      };
    }

    // Step 2: Validate top-level structure
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        valid: false,
        errors: ['Import data must be a JSON object'],
        warnings: [],
      };
    }

    const obj = parsed as Record<string, unknown>;

    // Version check
    if (obj['version'] !== 1) {
      errors.push(
        `Unsupported version: expected 1, got ${obj['version'] ?? 'missing'}. This import file may be from a newer version of WWM Helper.`,
      );
    }

    // Source check
    if (obj['source'] !== 'wwm-helper') {
      errors.push(
        `Invalid source: expected 'wwm-helper', got '${obj['source'] ?? 'missing'}'. This doesn't appear to be a valid WWM Helper export.`,
      );
    }

    // exportedAt check (optional validation)
    if (obj['exportedAt'] && typeof obj['exportedAt'] === 'string') {
      const dt = DateTime.fromISO(obj['exportedAt']);
      if (!dt.isValid) {
        warnings.push('Export timestamp is not a valid ISO date');
      }
    }

    // If we have critical errors, stop here
    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // Step 3: Validate checklists section
    const summary: ImportSummary = {
      customChecklistItemCount: 0,
      pinnedCount: 0,
      hiddenCount: 0,
      customTimerCount: 0,
      enabledTimerCount: 0,
      guildEventCount: 0,
    };

    if (obj['checklists'] !== undefined) {
      if (typeof obj['checklists'] !== 'object' || obj['checklists'] === null) {
        errors.push('checklists must be an object');
      } else {
        const checklists = obj['checklists'] as Record<string, unknown>;
        this.validateChecklistsSection(checklists, errors, warnings, summary);
      }
    }

    // Step 4: Validate timers section
    if (obj['timers'] !== undefined) {
      if (typeof obj['timers'] !== 'object' || obj['timers'] === null) {
        errors.push('timers must be an object');
      } else {
        const timers = obj['timers'] as Record<string, unknown>;
        this.validateTimersSection(timers, errors, warnings, summary);
      }
    }

    // Check if there's anything to import
    const hasContent =
      summary.customChecklistItemCount > 0 ||
      summary.pinnedCount > 0 ||
      summary.hiddenCount > 0 ||
      summary.customTimerCount > 0 ||
      summary.enabledTimerCount > 0 ||
      summary.guildEventCount > 0;

    if (!hasContent) {
      warnings.push('This export contains no importable data');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary,
      payload: errors.length === 0 ? (obj as unknown as WwmSettingsExportV1) : undefined,
    };
  }

  /**
   * Apply an import to the current settings
   */
  applyImport(payload: WwmSettingsExportV1, options: SettingsImportOptions): void {
    const { scopes, mode } = options;

    // Apply checklist custom items
    if (scopes.checklistCustomItems && payload.checklists?.customItems) {
      this.applyCustomChecklistItems(payload.checklists.customItems, mode);
    }

    // Apply checklist pins/hidden
    if (scopes.checklistPinsHidden && payload.checklists) {
      this.applyChecklistPrefs(payload.checklists.pinned, payload.checklists.hidden, mode);
    }

    // Apply custom timers
    if (scopes.timerCustomTimers && payload.timers?.customTimers) {
      this.applyCustomTimers(payload.timers.customTimers, mode);
    }

    // Apply enabled timer IDs
    if (scopes.timerEnabledIds && payload.timers?.enabledIds) {
      this.applyEnabledTimerIds(payload.timers.enabledIds, mode);
    }

    // Apply guild events
    if (scopes.timerGuildEvents && payload.timers?.guildEvents) {
      this.applyGuildEvents(payload.timers.guildEvents, mode);
    }
  }

  // ---- Validation helpers ----

  private validateChecklistsSection(
    checklists: Record<string, unknown>,
    errors: string[],
    warnings: string[],
    summary: ImportSummary,
  ): void {
    // Validate customItems
    if (checklists['customItems'] !== undefined) {
      if (!Array.isArray(checklists['customItems'])) {
        errors.push('checklists.customItems must be an array');
      } else {
        for (let i = 0; i < checklists['customItems'].length; i++) {
          const item = checklists['customItems'][i];
          const itemErrors = this.validateChecklistItem(item, i);
          errors.push(...itemErrors);
          if (itemErrors.length === 0) {
            summary.customChecklistItemCount++;
          }
        }
      }
    }

    // Validate pinned
    if (checklists['pinned'] !== undefined) {
      if (typeof checklists['pinned'] !== 'object' || checklists['pinned'] === null) {
        errors.push('checklists.pinned must be an object');
      } else {
        const pinned = checklists['pinned'] as Record<string, unknown>;
        for (const [key, value] of Object.entries(pinned)) {
          if (typeof value !== 'boolean') {
            errors.push(`checklists.pinned["${key}"] must be a boolean`);
          } else if (value === true) {
            summary.pinnedCount++;
          }
        }
      }
    }

    // Validate hidden
    if (checklists['hidden'] !== undefined) {
      if (typeof checklists['hidden'] !== 'object' || checklists['hidden'] === null) {
        errors.push('checklists.hidden must be an object');
      } else {
        const hidden = checklists['hidden'] as Record<string, unknown>;
        for (const [key, value] of Object.entries(hidden)) {
          if (typeof value !== 'boolean') {
            errors.push(`checklists.hidden["${key}"] must be a boolean`);
          } else if (value === true) {
            summary.hiddenCount++;
          }
        }
      }
    }
  }

  private validateChecklistItem(item: unknown, index: number): string[] {
    const errors: string[] = [];
    const prefix = `checklists.customItems[${index}]`;

    if (typeof item !== 'object' || item === null) {
      return [`${prefix} must be an object`];
    }

    const obj = item as Record<string, unknown>;

    // Required fields
    if (typeof obj['id'] !== 'string' || obj['id'].length === 0) {
      errors.push(`${prefix}.id is required and must be a non-empty string`);
    }

    if (typeof obj['label'] !== 'string') {
      errors.push(`${prefix}.label is required and must be a string`);
    } else {
      if (obj['label'].length < CUSTOM_CHECKLIST_LIMITS.LABEL_MIN_LENGTH) {
        errors.push(
          `${prefix}.label must be at least ${CUSTOM_CHECKLIST_LIMITS.LABEL_MIN_LENGTH} characters`,
        );
      }
      if (obj['label'].length > CUSTOM_CHECKLIST_LIMITS.LABEL_MAX_LENGTH) {
        errors.push(
          `${prefix}.label must not exceed ${CUSTOM_CHECKLIST_LIMITS.LABEL_MAX_LENGTH} characters`,
        );
      }
    }

    // Frequency validation
    if (
      !VALID_CHECKLIST_FREQUENCIES.includes(
        obj['frequency'] as (typeof VALID_CHECKLIST_FREQUENCIES)[number],
      )
    ) {
      errors.push(`${prefix}.frequency must be one of: ${VALID_CHECKLIST_FREQUENCIES.join(', ')}`);
    }

    // Importance validation
    if (
      !VALID_CHECKLIST_IMPORTANCES.includes(
        obj['importance'] as (typeof VALID_CHECKLIST_IMPORTANCES)[number],
      )
    ) {
      errors.push(`${prefix}.importance must be one of: ${VALID_CHECKLIST_IMPORTANCES.join(', ')}`);
    }

    // Category validation
    if (typeof obj['category'] !== 'string') {
      errors.push(`${prefix}.category is required and must be a string`);
    }

    // Optional description
    if (obj['description'] !== undefined) {
      if (typeof obj['description'] !== 'string') {
        errors.push(`${prefix}.description must be a string`);
      } else if (obj['description'].length > CUSTOM_CHECKLIST_LIMITS.DESCRIPTION_MAX_LENGTH) {
        errors.push(
          `${prefix}.description must not exceed ${CUSTOM_CHECKLIST_LIMITS.DESCRIPTION_MAX_LENGTH} characters`,
        );
      }
    }

    // Tags validation
    if (obj['tags'] !== undefined) {
      if (!Array.isArray(obj['tags'])) {
        errors.push(`${prefix}.tags must be an array`);
      } else if (obj['tags'].length > CUSTOM_CHECKLIST_LIMITS.MAX_TAGS) {
        errors.push(`${prefix}.tags must not exceed ${CUSTOM_CHECKLIST_LIMITS.MAX_TAGS} items`);
      }
    }

    return errors;
  }

  private validateTimersSection(
    timers: Record<string, unknown>,
    errors: string[],
    warnings: string[],
    summary: ImportSummary,
  ): void {
    // Validate customTimers
    if (timers['customTimers'] !== undefined) {
      if (!Array.isArray(timers['customTimers'])) {
        errors.push('timers.customTimers must be an array');
      } else {
        for (let i = 0; i < timers['customTimers'].length; i++) {
          const timer = timers['customTimers'][i];
          const timerErrors = this.validateCustomTimer(timer, i);
          errors.push(...timerErrors);
          if (timerErrors.length === 0) {
            summary.customTimerCount++;
          }
        }
      }
    }

    // Validate enabledIds
    if (timers['enabledIds'] !== undefined) {
      if (!Array.isArray(timers['enabledIds'])) {
        errors.push('timers.enabledIds must be an array');
      } else {
        for (let i = 0; i < timers['enabledIds'].length; i++) {
          if (typeof timers['enabledIds'][i] !== 'string') {
            errors.push(`timers.enabledIds[${i}] must be a string`);
          } else {
            summary.enabledTimerCount++;
          }
        }
      }
    }

    // Validate guildEvents
    if (timers['guildEvents'] !== undefined) {
      if (typeof timers['guildEvents'] !== 'object' || timers['guildEvents'] === null) {
        errors.push('timers.guildEvents must be an object');
      } else {
        const events = timers['guildEvents'] as Record<string, unknown>;
        for (const [key, config] of Object.entries(events)) {
          if (!VALID_GUILD_TIMER_IDS.includes(key as GuildTimerId)) {
            errors.push(
              `timers.guildEvents["${key}"] is not a valid guild timer ID. Valid IDs: ${VALID_GUILD_TIMER_IDS.join(', ')}`,
            );
            continue;
          }

          const configErrors = this.validateGuildEventConfig(config, key);
          errors.push(...configErrors);
          if (configErrors.length === 0) {
            summary.guildEventCount++;
          }
        }
      }
    }
  }

  private validateCustomTimer(timer: unknown, index: number): string[] {
    const errors: string[] = [];
    const prefix = `timers.customTimers[${index}]`;

    if (typeof timer !== 'object' || timer === null) {
      return [`${prefix} must be an object`];
    }

    const obj = timer as Record<string, unknown>;

    // Required fields
    if (typeof obj['id'] !== 'string' || obj['id'].length === 0) {
      errors.push(`${prefix}.id is required and must be a non-empty string`);
    }

    // Type validation
    if (obj['type'] !== 'recurring' && obj['type'] !== 'event') {
      errors.push(`${prefix}.type must be 'recurring' or 'event'`);
    }

    // Label validation
    if (typeof obj['label'] !== 'string') {
      errors.push(`${prefix}.label is required and must be a string`);
    } else {
      if (obj['label'].length < CUSTOM_TIMER_LIMITS.LABEL_MIN_LENGTH) {
        errors.push(
          `${prefix}.label must be at least ${CUSTOM_TIMER_LIMITS.LABEL_MIN_LENGTH} characters`,
        );
      }
      if (obj['label'].length > CUSTOM_TIMER_LIMITS.LABEL_MAX_LENGTH) {
        errors.push(
          `${prefix}.label must not exceed ${CUSTOM_TIMER_LIMITS.LABEL_MAX_LENGTH} characters`,
        );
      }
    }

    // Short label validation
    if (typeof obj['shortLabel'] !== 'string') {
      errors.push(`${prefix}.shortLabel is required and must be a string`);
    } else {
      if (obj['shortLabel'].length < CUSTOM_TIMER_LIMITS.SHORT_LABEL_MIN_LENGTH) {
        errors.push(
          `${prefix}.shortLabel must be at least ${CUSTOM_TIMER_LIMITS.SHORT_LABEL_MIN_LENGTH} characters`,
        );
      }
      if (obj['shortLabel'].length > CUSTOM_TIMER_LIMITS.SHORT_LABEL_MAX_LENGTH) {
        errors.push(
          `${prefix}.shortLabel must not exceed ${CUSTOM_TIMER_LIMITS.SHORT_LABEL_MAX_LENGTH} characters`,
        );
      }
    }

    // Icon validation
    if (typeof obj['icon'] !== 'string') {
      errors.push(`${prefix}.icon is required and must be a string`);
    }

    // isCustom flag
    if (obj['isCustom'] !== true) {
      errors.push(`${prefix}.isCustom must be true`);
    }

    // Schedule validation for recurring timers
    if (obj['type'] === 'recurring' && obj['schedule'] !== undefined) {
      if (typeof obj['schedule'] !== 'object' || obj['schedule'] === null) {
        errors.push(`${prefix}.schedule must be an object`);
      } else {
        const schedule = obj['schedule'] as Record<string, unknown>;
        if (
          !VALID_TIMER_SCHEDULE_TYPES.includes(
            schedule['type'] as (typeof VALID_TIMER_SCHEDULE_TYPES)[number],
          )
        ) {
          errors.push(
            `${prefix}.schedule.type must be one of: ${VALID_TIMER_SCHEDULE_TYPES.join(', ')}`,
          );
        }
      }
    }

    // Event timer validation
    if (obj['type'] === 'event') {
      if (obj['endsAt'] !== undefined && typeof obj['endsAt'] !== 'string') {
        errors.push(`${prefix}.endsAt must be an ISO date string`);
      }
      if (
        obj['category'] !== undefined &&
        !VALID_EVENT_CATEGORIES.includes(obj['category'] as (typeof VALID_EVENT_CATEGORIES)[number])
      ) {
        errors.push(`${prefix}.category must be one of: ${VALID_EVENT_CATEGORIES.join(', ')}`);
      }
    }

    // Summary validation
    if (obj['summary'] !== undefined) {
      if (typeof obj['summary'] !== 'string') {
        errors.push(`${prefix}.summary must be a string`);
      } else if (obj['summary'].length > CUSTOM_TIMER_LIMITS.SUMMARY_MAX_LENGTH) {
        errors.push(
          `${prefix}.summary must not exceed ${CUSTOM_TIMER_LIMITS.SUMMARY_MAX_LENGTH} characters`,
        );
      }
    }

    return errors;
  }

  private validateGuildEventConfig(config: unknown, key: string): string[] {
    const errors: string[] = [];
    const prefix = `timers.guildEvents["${key}"]`;

    if (typeof config !== 'object' || config === null) {
      return [`${prefix} must be an object`];
    }

    const obj = config as Record<string, unknown>;

    // Timezone offset validation
    if (typeof obj['timezoneOffsetMinutes'] !== 'number') {
      errors.push(`${prefix}.timezoneOffsetMinutes must be a number`);
    } else if (obj['timezoneOffsetMinutes'] < -720 || obj['timezoneOffsetMinutes'] > 840) {
      errors.push(`${prefix}.timezoneOffsetMinutes must be between -720 and 840`);
    }

    // Slots validation
    if (!Array.isArray(obj['slots'])) {
      errors.push(`${prefix}.slots must be an array`);
    } else {
      if (obj['slots'].length > 2) {
        errors.push(`${prefix}.slots must not have more than 2 items`);
      }
      for (let i = 0; i < obj['slots'].length; i++) {
        const slot = obj['slots'][i];
        if (typeof slot !== 'object' || slot === null) {
          errors.push(`${prefix}.slots[${i}] must be an object`);
          continue;
        }
        const s = slot as Record<string, unknown>;
        if (typeof s['weekday'] !== 'number' || s['weekday'] < 1 || s['weekday'] > 7) {
          errors.push(`${prefix}.slots[${i}].weekday must be a number between 1 and 7`);
        }
        if (typeof s['hour'] !== 'number' || s['hour'] < 0 || s['hour'] > 23) {
          errors.push(`${prefix}.slots[${i}].hour must be a number between 0 and 23`);
        }
        if (typeof s['minute'] !== 'number' || s['minute'] < 0 || s['minute'] > 59) {
          errors.push(`${prefix}.slots[${i}].minute must be a number between 0 and 59`);
        }
      }
    }

    return errors;
  }

  // ---- Apply helpers ----

  private applyCustomChecklistItems(items: ChecklistItem[], mode: 'add' | 'overwrite'): void {
    if (mode === 'overwrite') {
      this.customChecklist.replaceAll(items);
    } else {
      // Add mode: merge with existing
      this.customChecklist.mergeItems(items);
    }
  }

  private applyChecklistPrefs(
    pinned: Record<string, boolean> | undefined,
    hidden: Record<string, boolean> | undefined,
    mode: 'add' | 'overwrite',
  ): void {
    this.checklistState.updatePrefsFromImport({ pinned, hidden }, mode);
  }

  private applyCustomTimers(timers: CustomTimerDefinition[], mode: 'add' | 'overwrite'): void {
    if (mode === 'overwrite') {
      this.customTimers.replaceAll(timers);
    } else {
      this.customTimers.mergeTimers(timers);
    }
  }

  private applyEnabledTimerIds(ids: string[], mode: 'add' | 'overwrite'): void {
    this.timerPrefs.setEnabledIdsFromImport(ids, mode);
  }

  private applyGuildEvents(
    configs: Partial<Record<GuildTimerId, GuildEventConfig>>,
    mode: 'add' | 'overwrite',
  ): void {
    this.guildTimers.setConfigsFromImport(configs, mode);
  }
}
