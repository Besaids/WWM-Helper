import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { loadJsonFromStorage, saveJsonToStorage } from '../../utils/storage/storage';

interface TimerPreferencesStorage {
  version: number;
  enabledIds: string[];
}

const STORAGE_KEY = 'wwm-timer-preferences';
const STORAGE_VERSION = 1;
const DEFAULT_ENABLED_IDS: string[] = ['daily-reset', 'weekly-reset', 'arena-1v1'];

@Injectable({ providedIn: 'root' })
export class TimerPreferencesService {
  private readonly enabledIdsSubject = new BehaviorSubject<Set<string>>(
    new Set(this.loadInitialIds())
  );

  /** Observable set of enabled timer IDs */
  readonly enabledTimerIds$ = this.enabledIdsSubject.asObservable();

  /** Current enabled IDs snapshot */
  private get enabledIds(): Set<string> {
    return this.enabledIdsSubject.value;
  }

  isEnabled(id: string): boolean {
    return this.enabledIds.has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.enabledIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.update(next);
  }

  setEnabled(id: string, enabled: boolean): void {
    const next = new Set(this.enabledIds);
    if (enabled) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.update(next);
  }

  // ---- internals ----

  private loadInitialIds(): string[] {
    const stored = loadJsonFromStorage<TimerPreferencesStorage>(STORAGE_KEY);
    if (
      stored &&
      stored.version === STORAGE_VERSION &&
      Array.isArray(stored.enabledIds)
    ) {
      return stored.enabledIds;
    }
    return DEFAULT_ENABLED_IDS;
  }

  private update(next: Set<string>): void {
    this.enabledIdsSubject.next(next);

    const payload: TimerPreferencesStorage = {
      version: STORAGE_VERSION,
      enabledIds: Array.from(next),
    };
    saveJsonToStorage(STORAGE_KEY, payload);
  }
}
