import { inject, Injectable, signal } from '@angular/core';
import { ChecklistTypeConfig, ChecklistItem, ChecklistFrequency } from '../../models';
import {
  getDailyCycleId,
  getWeeklyCycleId,
  SEASONAL_DAILY_CHECKLIST,
  SEASONAL_PERIOD_CHECKLIST,
  SEASONAL_WEEKLY_CHECKLIST,
} from '../../configs';
import { DAILY_CHECKLIST, WEEKLY_CHECKLIST } from '../../configs';
import { CustomChecklistService } from './custom-checklist.service';

@Injectable({ providedIn: 'root' })
export class ChecklistRegistryService {
  private readonly customChecklistService = inject(CustomChecklistService);

  // Define all available checklist types
  private readonly checklistTypes = signal<ChecklistTypeConfig[]>([
    {
      id: 'daily',
      label: 'Daily',
      description: 'Daily tasks that reset at 21:00 UTC',
      cycleKeyGenerator: () => getDailyCycleId(),
    },
    {
      id: 'weekly',
      label: 'Weekly',
      description: 'Weekly tasks that reset Sunday 21:00 UTC',
      cycleKeyGenerator: () => getWeeklyCycleId(),
    },
    {
      id: 'seasonal-daily',
      label: 'Seasonal Daily',
      description: 'Season-specific daily tasks',
      cycleKeyGenerator: () => `${this.getCurrentSeasonId()}-${getDailyCycleId()}`,
    },
    {
      id: 'seasonal-weekly',
      label: 'Seasonal Weekly',
      description: 'Season-specific weekly tasks',
      cycleKeyGenerator: () => `${this.getCurrentSeasonId()}-${getWeeklyCycleId()}`,
    },
    {
      id: 'seasonal-period',
      label: 'Seasonal Period',
      description: 'Per-season tasks (entire season duration)',
      cycleKeyGenerator: () => this.getCurrentSeasonId(),
    },
    {
      id: 'custom',
      label: 'Custom',
      description: 'Your personal checklist items',
      cycleKeyGenerator: () => 'custom', // Custom items don't cycle
    },
  ]);

  readonly availableTypes = this.checklistTypes.asReadonly();

  /**
   * Get configuration for a specific checklist type
   */
  getTypeConfig(type: ChecklistFrequency): ChecklistTypeConfig | undefined {
    return this.checklistTypes().find((t) => t.id === type);
  }

  /**
   * Get all items for a given checklist type
   */
  getItemsForType(type: ChecklistFrequency): ChecklistItem[] {
    switch (type) {
      case 'daily':
        return DAILY_CHECKLIST;
      case 'weekly':
        return WEEKLY_CHECKLIST;
      case 'seasonal-daily':
        return SEASONAL_DAILY_CHECKLIST;
      case 'seasonal-weekly':
        return SEASONAL_WEEKLY_CHECKLIST;
      case 'seasonal-period':
        return SEASONAL_PERIOD_CHECKLIST;
      case 'custom':
        return this.getCustomItems();
      default:
        return [];
    }
  }

  /**
   * Get current season ID (e.g., 's1-2025', 's2-2025')
   * This should match the game's season tracking
   */
  private getCurrentSeasonId(): string {
    // TODO: Implement proper season tracking
    // For now, return a placeholder
    return 's1-2025';
  }

  private getCustomItems(): ChecklistItem[] {
    return this.customChecklistService.getAll();
  }
}
