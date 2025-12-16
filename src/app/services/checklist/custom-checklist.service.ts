import { Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';
import {
  ChecklistFrequency,
  ChecklistImportance,
  ChecklistItem,
  CustomChecklistItemFormData,
  CustomChecklistStorage,
} from '../../models';
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
      importance: formData.importance,
      frequency: this.getFrequencyFromImportance(formData.importance),
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
      frequency: this.getFrequencyFromImportance(formData.importance),
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
      const normalized = versioned.data.items.map((i) => this.normalizeCustomItem(i));
      this.customItems.set(normalized);
      // Persist any migration (old custom items used frequency: 'custom' for daily/weekly buckets).
      this.saveToStorage();
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

  private getFrequencyFromImportance(importance: ChecklistImportance): ChecklistFrequency {
    // Custom items still live under the "custom" tab, but their *reset behavior*
    // should match their chosen importance bucket.
    switch (importance) {
      case 'daily':
        return 'daily';
      case 'weekly':
        return 'weekly';
      default:
        return 'custom';
    }
  }

  private normalizeCustomItem(item: ChecklistItem): ChecklistItem {
    const importance = item.importance as ChecklistImportance;

    return {
      ...item,
      isCustom: true,
      importance,
      // Critical: daily/weekly custom items must use daily/weekly frequency so they cycle-reset.
      frequency: this.getFrequencyFromImportance(importance),
      category: this.getCategoryFromImportance(importance),
      label: this.sanitizeText(item.label),
      description: item.description ? this.sanitizeText(item.description) : undefined,
      createdAt: item.createdAt ?? DateTime.utc().toISO(),
      expired: item.expired ?? false,
      tags: item.tags ?? [],
    };
  }

  private sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  private getCategoryFromImportance(importance: ChecklistImportance): string {
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

  /**
   * Replace all custom items (for import overwrite mode)
   */
  replaceAll(items: ChecklistItem[]): void {
    const sanitized = items.map((item) => this.normalizeCustomItem(item));

    this.customItems.set(sanitized);
    this.saveToStorage();
  }

  /**
   * Merge items from import (add mode)
   * If an item with the same ID exists, it will be replaced.
   */
  mergeItems(items: ChecklistItem[]): void {
    const current = this.customItems();
    const currentById = new Map(current.map((item) => [item.id, item]));

    // Add or replace items from import
    for (const item of items) {
      const sanitized = this.normalizeCustomItem(item);
      currentById.set(item.id, sanitized);
    }

    this.customItems.set(Array.from(currentById.values()));
    this.saveToStorage();
  }
}
