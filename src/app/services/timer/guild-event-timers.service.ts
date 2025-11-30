import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { TimerSchedule } from '../../models';
import {
  loadJsonFromStorage,
  saveJsonToStorage,
  STORAGE_PREFIX,
} from '../../utils/storage/storage';

export type GuildTimerId = 'guild-breaking-army' | 'guild-test-your-skills';

export interface GuildEventSlot {
  weekday: number; // 1–7 (Mon–Sun)
  hour: number; // local card time, 0–23
  minute: number; // 0–59
}

export interface GuildEventConfig {
  timezoneOffsetMinutes: number; // e.g. +8h => 480
  slots: GuildEventSlot[]; // up to 2
}

interface GuildTimersStoragePayload {
  version: number;
  configs: Partial<Record<GuildTimerId, GuildEventConfig>>;
}

const STORAGE_KEY = `${STORAGE_PREFIX}guild-timers-v1`;
const STORAGE_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class GuildEventTimersService {
  private readonly state$ = new BehaviorSubject<GuildTimersStoragePayload>({
    version: STORAGE_VERSION,
    configs: this.loadConfigs(),
  });

  /** Raw configs for forms (timezone, weekday, local time). */
  readonly configs$ = this.state$.asObservable().pipe(map((s) => s.configs));

  /** Derived TimerSchedule overrides, in UTC, for the timer engine. */
  readonly scheduleOverrides$ = this.configs$.pipe(
    map((configs) => {
      const result: Partial<Record<GuildTimerId, TimerSchedule>> = {};

      for (const key of Object.keys(configs) as GuildTimerId[]) {
        const cfg = configs[key];
        if (!cfg || cfg.slots.length === 0) continue;

        const times = cfg.slots
          .filter((s) => this.isValidSlot(s))
          .map((slot) => this.toUtcWeeklyTime(slot, cfg.timezoneOffsetMinutes));

        if (times.length > 0) {
          result[key] = {
            type: 'weekly-times',
            times,
          } satisfies TimerSchedule;
        }
      }

      return result;
    }),
  );

  /** Convenience snapshot getters (useful inside non-reactive code). */
  getConfigsSnapshot(): Partial<Record<GuildTimerId, GuildEventConfig>> {
    return this.state$.value.configs;
  }

  getScheduleOverrideSnapshot(id: GuildTimerId): TimerSchedule | null {
    const overrides = this.buildScheduleOverrides(this.state$.value.configs);
    return overrides[id] ?? null;
  }

  /** Upsert a config (called from the Timers UI when the user hits Save). */
  upsertConfig(id: GuildTimerId, config: GuildEventConfig): void {
    const nextConfigs: Partial<Record<GuildTimerId, GuildEventConfig>> = {
      ...this.state$.value.configs,
      [id]: {
        ...config,
        slots: config.slots.filter((s) => this.isValidSlot(s)),
      },
    };

    const payload: GuildTimersStoragePayload = {
      version: STORAGE_VERSION,
      configs: nextConfigs,
    };

    this.state$.next(payload);
    saveJsonToStorage(STORAGE_KEY, payload);
  }

  /** Delete a config (back to "not configured"). */
  deleteConfig(id: GuildTimerId): void {
    const nextConfigs = { ...this.state$.value.configs };
    delete nextConfigs[id];

    const payload: GuildTimersStoragePayload = {
      version: STORAGE_VERSION,
      configs: nextConfigs,
    };

    this.state$.next(payload);
    saveJsonToStorage(STORAGE_KEY, payload);
  }

  // ---------- internals ----------

  private loadConfigs(): Partial<Record<GuildTimerId, GuildEventConfig>> {
    const stored = loadJsonFromStorage<GuildTimersStoragePayload>(STORAGE_KEY);
    if (!stored || typeof stored !== 'object') return {};
    if (stored.version !== STORAGE_VERSION) return stored.configs ?? {};
    return stored.configs ?? {};
  }

  private buildScheduleOverrides(
    configs: Partial<Record<GuildTimerId, GuildEventConfig>>,
  ): Partial<Record<GuildTimerId, TimerSchedule>> {
    const result: Partial<Record<GuildTimerId, TimerSchedule>> = {};

    for (const key of Object.keys(configs) as GuildTimerId[]) {
      const cfg = configs[key];
      if (!cfg || cfg.slots.length === 0) continue;

      const times = cfg.slots
        .filter((s) => this.isValidSlot(s))
        .map((slot) => this.toUtcWeeklyTime(slot, cfg.timezoneOffsetMinutes));

      if (times.length > 0) {
        result[key] = {
          type: 'weekly-times',
          times,
        } satisfies TimerSchedule;
      }
    }

    return result;
  }

  private isValidSlot(slot: GuildEventSlot): boolean {
    if (!slot) return false;
    const { weekday, hour, minute } = slot;
    if (weekday < 1 || weekday > 7) return false;
    if (hour < 0 || hour > 23) return false;
    if (minute < 0 || minute > 59) return false;
    return true;
  }

  /**
   * Convert a local slot (weekday/hour/minute in the card's timezone)
   * into a UTC weekly time (weekday/hour/minute).
   *
   * We treat the week as a 7*24*60 minute ring and subtract the offset.
   */
  private toUtcWeeklyTime(
    slot: GuildEventSlot,
    offsetMinutes: number,
  ): { weekday: number; hour: number; minute: number } {
    const weekMinutes = 7 * 24 * 60;

    // Minutes since Monday 00:00 in local time
    const localTotal = (slot.weekday - 1) * 24 * 60 + slot.hour * 60 + slot.minute;

    // Shift back by offset to get UTC minutes
    let utcTotal = (localTotal - offsetMinutes) % weekMinutes;
    if (utcTotal < 0) {
      utcTotal += weekMinutes;
    }

    const utcWeekday = Math.floor(utcTotal / (24 * 60)) + 1;
    const withinDay = utcTotal % (24 * 60);
    const utcHour = Math.floor(withinDay / 60);
    const utcMinute = withinDay % 60;

    return {
      weekday: utcWeekday,
      hour: utcHour,
      minute: utcMinute,
    };
  }
}
