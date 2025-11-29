import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { interval, map, startWith } from 'rxjs';
import { buildTimerChip } from './timer-chip.builder';
import { TIMER_DEFINITIONS } from '../../configs';
import { TimerDefinition } from '../../models';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly tick$ = interval(1000).pipe(startWith(0));

  readonly timerChips$ = this.tick$.pipe(
    map(() => {
      const now = DateTime.utc();
      return TIMER_DEFINITIONS.map((def: TimerDefinition) => buildTimerChip(def, now));
    }),
  );
}
