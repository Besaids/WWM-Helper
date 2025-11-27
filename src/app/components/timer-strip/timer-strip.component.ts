// src/app/components/timer-strip/timer-strip.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerService } from '../../services';

@Component({
  selector: 'app-timer-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-strip.component.html',
  styleUrls: ['./timer-strip.component.scss'],
})
export class TimerStripComponent {
  private readonly timerService = inject(TimerService);
  readonly timers$ = this.timerService.timerChips$;
}
