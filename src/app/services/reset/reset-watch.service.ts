import { Injectable } from '@angular/core';
import {
  Observable,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  pairwise,
  shareReplay,
  timer,
} from 'rxjs';
import { getDailyCycleId, getWeeklyCycleId } from '../../configs';

// If you want “near-instant” resets, keep this low.
// 5s is cheap; 60s feels laggy and is easier to “miss” around reset.
const CYCLE_CHECK_INTERVAL_MS = 5_000;

interface CycleIds {
  daily: string;
  weekly: string;
}

function readCycleIds(): CycleIds {
  return { daily: getDailyCycleId(), weekly: getWeeklyCycleId() };
}

const IS_BROWSER = typeof window !== 'undefined' && typeof document !== 'undefined';

@Injectable({ providedIn: 'root' })
export class ResetWatchService {
  /**
   * Emits when the daily or weekly cycle id changes.
   *
   * Note: do NOT “skip first tick”; that can permanently miss a reset
   * if the first poll after a reset is dropped.
   */
  readonly resetChange$: Observable<CycleIds>;

  constructor() {
    if (!IS_BROWSER) {
      // SSR / non-browser: never emit.
      this.resetChange$ = timer(CYCLE_CHECK_INTERVAL_MS).pipe(
        map(() => readCycleIds()),
        filter(() => false),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
      return;
    }

    const triggers$ = merge(
      // Poll; immediate tick ensures we seed pairwise with current ids.
      timer(0, CYCLE_CHECK_INTERVAL_MS),

      // Timers get throttled in background tabs; force a check when coming back.
      fromEvent(window, 'focus'),
      fromEvent(document, 'visibilitychange').pipe(filter(() => !document.hidden)),
    );

    const cycleIds$ = triggers$.pipe(
      map(() => readCycleIds()),
      distinctUntilChanged((a, b) => a.daily === b.daily && a.weekly === b.weekly),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.resetChange$ = cycleIds$.pipe(
      pairwise(),
      filter(([prev, cur]) => prev.daily !== cur.daily || prev.weekly !== cur.weekly),
      map(([, cur]) => cur),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
