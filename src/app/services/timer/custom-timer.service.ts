// src/app/services/timer/custom-timer.service.ts

import { Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';
import {
  CustomTimerDefinition,
  CustomTimersStorage,
  CustomTimerFormData,
  TimerSchedule,
} from '../../models';
import { getSafeLocalStorage, loadVersioned, saveVersioned } from '../../utils/storage';

const STORAGE_KEY = 'wwm-custom-timers';
const STORAGE_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class CustomTimerService {
  private readonly customTimers = signal<CustomTimerDefinition[]>([]);

  readonly customTimers$ = this.customTimers.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get all custom timers
   */
  getAll(): CustomTimerDefinition[] {
    return this.customTimers();
  }

  /**
   * Get custom recurring timers
   */
  getRecurringTimers(): CustomTimerDefinition[] {
    return this.customTimers().filter((t) => t.type === 'recurring');
  }

  /**
   * Get custom event timers
   */
  getEventTimers(): CustomTimerDefinition[] {
    return this.customTimers().filter((t) => t.type === 'event');
  }

  /**
   * Get timer by ID
   */
  getById(id: string): CustomTimerDefinition | undefined {
    return this.customTimers().find((t) => t.id === id);
  }

  /**
   * Create a new custom timer
   */
  create(formData: CustomTimerFormData): CustomTimerDefinition {
    const now = DateTime.utc().toISO();
    const id = this.generateId();

    const timer: CustomTimerDefinition = {
      id,
      type: formData.type,
      label: this.sanitizeText(formData.label),
      shortLabel: this.sanitizeText(formData.shortLabel),
      icon: formData.icon,
      image: '',
      summary: formData.summary ? this.sanitizeText(formData.summary) : undefined,
      createdAt: now,
      updatedAt: now,
      isCustom: true,
    };

    if (formData.type === 'recurring' && formData.scheduleType) {
      timer.schedule = this.buildSchedule(formData);
    } else if (formData.type === 'event') {
      const iso = formData.eventEndsAt
        ? DateTime.fromJSDate(formData.eventEndsAt).toUTC().toISO()
        : undefined;

      timer.endsAt = iso ?? undefined;
      timer.category = formData.eventCategory || 'other';
    }

    this.customTimers.update((timers) => [...timers, timer]);
    this.saveToStorage();

    return timer;
  }

  /**
   * Update an existing custom timer
   */
  update(id: string, formData: CustomTimerFormData): CustomTimerDefinition | null {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    const updated: CustomTimerDefinition = {
      ...existing,
      label: this.sanitizeText(formData.label),
      shortLabel: this.sanitizeText(formData.shortLabel),
      icon: formData.icon,
      summary: formData.summary ? this.sanitizeText(formData.summary) : undefined,
      updatedAt: DateTime.utc().toISO(),
    };

    if (formData.type === 'recurring' && formData.scheduleType) {
      updated.schedule = this.buildSchedule(formData);
    } else if (formData.type === 'event') {
      const iso = formData.eventEndsAt
        ? DateTime.fromJSDate(formData.eventEndsAt).toUTC().toISO()
        : undefined;

      updated.endsAt = iso ?? undefined;
      updated.category = formData.eventCategory || 'other';
    }

    this.customTimers.update((timers) => timers.map((t) => (t.id === id ? updated : t)));
    this.saveToStorage();

    return updated;
  }

  /**
   * Delete a custom timer
   */
  delete(id: string): boolean {
    const exists = this.getById(id);
    if (!exists) {
      return false;
    }

    this.customTimers.update((timers) => timers.filter((t) => t.id !== id));
    this.saveToStorage();

    return true;
  }

  /**
   * Delete all custom timers
   */
  deleteAll(): void {
    this.customTimers.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) {
      return;
    }

    const versioned = loadVersioned<CustomTimersStorage>(STORAGE_KEY);
    if (versioned?.data?.timers) {
      this.customTimers.set(versioned.data.timers);
    }
  }

  private saveToStorage(): void {
    const storage = getSafeLocalStorage();
    if (!storage) {
      return;
    }

    const data: CustomTimersStorage = {
      version: STORAGE_VERSION,
      timers: this.customTimers(),
    };

    saveVersioned(STORAGE_KEY, data);
  }

  private buildSchedule(formData: CustomTimerFormData): TimerSchedule {
    switch (formData.scheduleType) {
      case 'daily':
        return {
          type: 'daily',
          hour: formData.dailyHour ?? 0,
          minute: formData.dailyMinute ?? 0,
        };

      case 'weekly':
        return {
          type: 'weekly',
          weekday: formData.weeklyWeekday ?? 1,
          hour: formData.weeklyHour ?? 0,
          minute: formData.weeklyMinute ?? 0,
        };

      case 'daily-multi':
        return {
          type: 'daily-multi',
          times: formData.dailyMultiTimes ?? [],
          windowHours: formData.dailyMultiWindowHours,
        };

      case 'weekly-multi':
        return {
          type: 'weekly-multi',
          weekdays: formData.weeklyMultiWeekdays ?? [],
          hour: formData.weeklyMultiHour ?? 0,
          minute: formData.weeklyMultiMinute ?? 0,
        };

      case 'weekly-times':
        return {
          type: 'weekly-times',
          times: formData.weeklyTimeSlots ?? [],
        };

      case 'weekly-range':
        return {
          type: 'weekly-range',
          openWeekday: formData.weeklyRangeOpenWeekday ?? 1,
          openHour: formData.weeklyRangeOpenHour ?? 0,
          openMinute: formData.weeklyRangeOpenMinute ?? 0,
          closeWeekday: formData.weeklyRangeCloseWeekday ?? 5,
          closeHour: formData.weeklyRangeCloseHour ?? 0,
          closeMinute: formData.weeklyRangeCloseMinute ?? 0,
        };

      default:
        throw new Error(`Unknown schedule type: ${formData.scheduleType}`);
    }
  }

  private generateId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize user input to prevent XSS and limit length
   */
  private sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}
