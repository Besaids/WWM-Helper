import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { combineLatest, interval, map, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { buildTimerChip } from './timer-chip.builder';
import { TIMER_DEFINITIONS } from '../../configs';
import { TimerDefinition } from '../../models';
import { GuildEventTimersService, GuildTimerId } from './guild-event-timers.service';
import { CustomTimerService } from './custom-timer.service';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly guildTimers = inject(GuildEventTimersService);
  private readonly customTimers = inject(CustomTimerService);

  private readonly tick$ = interval(1000).pipe(startWith(0));

  // Convert signal to observable
  private readonly customTimers$ = toObservable(this.customTimers.customTimers$);

  readonly timerChips$ = combineLatest([
    this.tick$,
    this.guildTimers.scheduleOverrides$,
    this.customTimers$,
  ]).pipe(
    map(([, overrides, customTimers]) => {
      const now = DateTime.utc();

      // Built-in timers
      const builtInChips = TIMER_DEFINITIONS.map((def: TimerDefinition) => {
        const isGuildTimer =
          def.id === 'guild-breaking-army' || def.id === 'guild-test-your-skills';

        const override = overrides[def.id as GuildTimerId];

        if (isGuildTimer && !override) {
          return {
            id: def.id,
            label: def.label,
            shortLabel: def.shortLabel,
            icon: def.icon,
            remaining: 'Not configured',
          };
        }

        const effectiveDef: TimerDefinition = override ? { ...def, schedule: override } : def;

        return buildTimerChip(effectiveDef, now);
      });

      // Custom recurring timers
      const customRecurringChips = customTimers
        .filter((t) => t.type === 'recurring' && t.schedule)
        .map((t) => {
          const def: TimerDefinition = {
            id: t.id,
            label: t.label,
            shortLabel: t.shortLabel,
            icon: t.icon,
            schedule: t.schedule!,
          };
          return buildTimerChip(def, now);
        });

      return [...builtInChips, ...customRecurringChips];
    }),
  );
}
