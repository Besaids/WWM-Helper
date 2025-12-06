export type ChecklistImportance = 'core' | 'optional' | 'daily' | 'weekly';

export type ChecklistFrequency =
  | 'daily'
  | 'weekly'
  | 'seasonal-daily'
  | 'seasonal-weekly'
  | 'seasonal-period'
  | 'custom';

export type ChecklistTag =
  | 'solo'
  | 'multiplayer'
  | 'guild'
  | 'combat'
  | 'social'
  | 'economy'
  | 'exploration'
  | 'leisure'
  | 'adventure'
  | 'progression'
  | 'stats'
  | 'mounts'
  | 'premium'
  | 'reward'
  | 'cosmetics';

export interface ChecklistPreferences {
  pinned: boolean;
  hidden: boolean;
}

export interface ChecklistPreferencesState {
  daily: Record<string, ChecklistPreferences>;
  weekly: Record<string, ChecklistPreferences>;
}

export interface ChecklistPrefs {
  pinned: Record<string, boolean>;
  hidden: Record<string, boolean>;
  completionCounts: Record<string, number>;
  /** Tracks whether default pins have been applied (v1). Set once and never reset. */
  defaultPinsApplied?: boolean;
}

export interface ChecklistTypeConfig {
  id: ChecklistFrequency;
  label: string;
  description: string;
  cycleKeyGenerator: () => string; // Function to generate storage key
}

export interface ChecklistItem {
  id: string;
  frequency: ChecklistFrequency;
  importance: ChecklistImportance;
  category: string;
  label: string;
  description?: string;
  tags?: ChecklistTag[];
  route?: string;
  section?: string;

  // New optional fields for custom/seasonal
  seasonId?: string; // For seasonal items
  isCustom?: boolean; // Flag for user-created items
  createdAt?: string; // ISO date for custom items
  expired: boolean; // Default false
}

export interface CustomChecklistItemFormData {
  frequency: ChecklistFrequency;
  importance: ChecklistImportance;
  category: string;
  label: string;
  description?: string;
  tags?: ChecklistTag[];
  seasonId?: string;
}

export interface FreeplayIdea {
  id: string;
  category: string;
  label: string;
  description: string;
  tags?: ChecklistTag[];
}

/**
 * Storage structure for custom checklist items
 */
export interface CustomChecklistStorage {
  version: number;
  items: ChecklistItem[];
}

/**
 * Character limits for custom checklist items
 */
export const CUSTOM_CHECKLIST_LIMITS = {
  LABEL_MIN_LENGTH: 3,
  LABEL_MAX_LENGTH: 80, // Slightly longer than the longest existing item
  DESCRIPTION_MAX_LENGTH: 300,
  MAX_TAGS: 5,
} as const;
