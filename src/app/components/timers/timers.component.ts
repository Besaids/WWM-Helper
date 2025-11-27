import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimerService } from '../../services';
import { TimerChip } from '../../models';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
})
export class TimersComponent {
  private readonly timerService = inject(TimerService);
  readonly timers$ = this.timerService.timerChips$;

  getChip(timers: readonly TimerChip[], id: string): TimerChip | undefined {
    return timers.find((t) => t.id === id);
  }
}
