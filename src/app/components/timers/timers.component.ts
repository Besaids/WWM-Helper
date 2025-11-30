import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerPreferencesService, TimerService } from '../../services';
import { TimerChip } from '../../models';
import { DiamondToggleComponent } from '../ui';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule, DiamondToggleComponent],
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
    const isOpening = this.openTimerId !== id;

    // Toggle which timer is open
    this.openTimerId = isOpening ? id : null;

    // If we are closing the currently-open one, also collapse the long body
    if (!this.openTimerId || this.openTimerId !== id) {
      this.longDetailsId = null;
    }

    // When *opening* a timer, gently scroll it into view on mobile
    if (isOpening) {
      // Wait for the DOM to update so the details block actually exists
      setTimeout(() => this.scrollTimerIntoView(id), 0);
    }
  }

  private scrollTimerIntoView(id: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Only do this on mobile-ish widths; avoid jumping desktop viewport
    if (window.innerWidth > 768) {
      return;
    }

    const el = document.getElementById(`timer-${id}`);
    if (!el) {
      return;
    }

    // Offset so the row sits nicely below the top nav / timers strip
    const headerOffset = 80; // tweak if needed

    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }

  toggleLongDetails(id: string): void {
    this.longDetailsId = this.longDetailsId === id ? null : id;
  }

  isEnabled(enabledIds: Set<string>, id: string): boolean {
    return enabledIds.has(id);
  }
}
