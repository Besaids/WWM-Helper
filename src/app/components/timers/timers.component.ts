import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerPreferencesService, TimerService } from '../../services';
import { TimerChip } from '../../models';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimersComponent {
  private readonly timerService = inject(TimerService);
  private readonly timerPrefs = inject(TimerPreferencesService);

  // All timer chips (unfiltered)
  readonly timers$ = this.timerService.timerChips$;

  // Enabled timer IDs (Set<string>)
  readonly enabledIds$ = this.timerPrefs.enabledTimerIds$;

  // Which timer's details drawer is open in the settings list
  openTimerId: string | null = null;

  // Which timer has the long "show more" body expanded (inside the details drawer)
  longDetailsId: string | null = null;

  getChip(timers: readonly TimerChip[], id: string): TimerChip | undefined {
    return timers.find((t) => t.id === id);
  }

  onToggleTimer(id: string): void {
    this.timerPrefs.toggle(id);
  }

  toggleInfo(id: string): void {
    const isSame = this.openTimerId === id;
    this.openTimerId = isSame ? null : id;

    // If we closed the outer drawer or switched to another timer,
    // collapse the long body as well.
    if (!this.openTimerId || this.openTimerId !== id) {
      this.longDetailsId = null;
    }
  }

  toggleLongDetails(id: string): void {
    this.longDetailsId = this.longDetailsId === id ? null : id;
  }

  isEnabled(enabledIds: Set<string>, id: string): boolean {
    return enabledIds.has(id);
  }
}
