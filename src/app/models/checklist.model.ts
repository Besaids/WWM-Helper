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
  | 'premium';
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
