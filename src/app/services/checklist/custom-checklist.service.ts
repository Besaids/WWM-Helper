import { Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { ChecklistItem, CustomChecklistItemFormData, CustomChecklistStorage } from '../../models';
import { getSafeLocalStorage, loadVersioned, saveVersioned } from '../../utils/storage';

const STORAGE_KEY = 'wwm-custom-checklist';
const STORAGE_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class CustomChecklistService {
  private readonly customItems = signal<ChecklistItem[]>([]);

  readonly customItems$ = this.customItems.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get all custom checklist items
   */
  getAll(): ChecklistItem[] {
    return this.customItems();
  }

  /**
   * Get item by ID
   */
  getById(id: string): ChecklistItem | undefined {
    return this.customItems().find((item) => item.id === id);
  }

  /**
   * Create a new custom checklist item
   */
  create(formData: CustomChecklistItemFormData): ChecklistItem {
    const now = DateTime.utc().toISO();
    const id = this.generateId();

    const item: ChecklistItem = {
      id,
      frequency: 'custom',
      importance: formData.importance,
      category: this.getCategoryFromImportance(formData.importance),
      label: this.sanitizeText(formData.label),
      description: formData.description ? this.sanitizeText(formData.description) : undefined,
      tags: formData.tags || [],
      isCustom: true,
      createdAt: now,
      expired: false,
    };

    this.customItems.update((items) => [...items, item]);
    this.saveToStorage();

    return item;
  }

  /**
   * Update an existing custom checklist item
   */
  update(id: string, formData: CustomChecklistItemFormData): ChecklistItem | null {
    const existing = this.getById(id);
    if (!existing || !existing.isCustom) {
      return null;
    }

    const updated: ChecklistItem = {
      ...existing,
      importance: formData.importance,
      category: this.getCategoryFromImportance(formData.importance),
      label: this.sanitizeText(formData.label),
      description: formData.description ? this.sanitizeText(formData.description) : undefined,
      tags: formData.tags || [],
    };

    this.customItems.update((items) => items.map((item) => (item.id === id ? updated : item)));
    this.saveToStorage();

    return updated;
  }

  /**
   * Delete a custom checklist item
   */
  delete(id: string): boolean {
    const exists = this.getById(id);
    if (!exists || !exists.isCustom) {
      return false;
    }

    this.customItems.update((items) => items.filter((item) => item.id !== id));
    this.saveToStorage();

    return true;
  }

  /**
   * Delete all custom checklist items
   */
  deleteAll(): void {
    this.customItems.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) {
      return;
    }

    const versioned = loadVersioned<CustomChecklistStorage>(STORAGE_KEY);
    if (versioned?.data?.items) {
      this.customItems.set(versioned.data.items);
    }
  }

  private saveToStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) {
      return;
    }

    const data: CustomChecklistStorage = {
      version: STORAGE_VERSION,
      items: this.customItems(),
    };

    saveVersioned(STORAGE_KEY, data);
  }

  private generateId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  private getCategoryFromImportance(importance: string): string {
    // Map importance to category name
    switch (importance) {
      case 'daily':
        return 'Daily Tasks';
      case 'weekly':
        return 'Weekly Tasks';
      case 'core':
        return 'Core Priorities';
      case 'optional':
        return 'Optional Tasks';
      default:
        return 'Custom';
    }
  }
}
