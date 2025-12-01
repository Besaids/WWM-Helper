export type ChecklistFrequency = 'daily' | 'weekly';
export type ChecklistImportance = 'core' | 'optional';

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
  | 'premium';

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
}

export interface ChecklistItem {
  id: string;
  frequency: ChecklistFrequency;
  importance: ChecklistImportance;
  category: string;
  label: string;
  description?: string;
  tags?: ChecklistTag[];
}

export interface FreeplayIdea {
  id: string;
  category: string;
  label: string;
  description: string;
  tags?: ChecklistTag[];
}
