import { Injectable } from '@angular/core';
import { interval, map, distinctUntilChanged, filter, shareReplay, Observable } from 'rxjs';
import { getDailyCycleId, getWeeklyCycleId } from '../../configs';

const CYCLE_CHECK_INTERVAL_MS = 60_000;

interface CycleIds {
  daily: string;
  weekly: string;
}

function readCycleIds(): CycleIds {
  return { daily: getDailyCycleId(), weekly: getWeeklyCycleId() };
}

@Injectable({ providedIn: 'root' })
export class ResetWatchService {
  readonly resetChange$: Observable<CycleIds> =
    typeof window !== 'undefined' && typeof document !== 'undefined'
      ? interval(CYCLE_CHECK_INTERVAL_MS).pipe(
          map(() => readCycleIds()),
          distinctUntilChanged((a, b) => a.daily === b.daily && a.weekly === b.weekly),
          filter((_, index) => index !== 0), // skip first tick
          shareReplay({ bufferSize: 1, refCount: true }),
        )
      : interval(CYCLE_CHECK_INTERVAL_MS).pipe(
          map(() => readCycleIds()),
          filter(() => false),
          shareReplay({ bufferSize: 1, refCount: true }),
        );
}
