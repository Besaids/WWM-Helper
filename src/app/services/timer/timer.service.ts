import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { combineLatest, interval, map, startWith } from 'rxjs';
import { buildTimerChip } from './timer-chip.builder';
import { TIMER_DEFINITIONS } from '../../configs';
import { TimerDefinition } from '../../models';
import { GuildEventTimersService, GuildTimerId } from './guild-event-timers.service';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly guildTimers = inject(GuildEventTimersService);

  private readonly tick$ = interval(1000).pipe(startWith(0));

  readonly timerChips$ = combineLatest([this.tick$, this.guildTimers.scheduleOverrides$]).pipe(
    map(([, overrides]) => {
      const now = DateTime.utc();

      return TIMER_DEFINITIONS.map((def: TimerDefinition) => {
        const isGuildTimer =
          def.id === 'guild-breaking-army' || def.id === 'guild-test-your-skills';

        const override = overrides[def.id as GuildTimerId];

        if (isGuildTimer && !override) {
          // Not configured yet; don't call the scheduler helpers.
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
    }),
  );
}
