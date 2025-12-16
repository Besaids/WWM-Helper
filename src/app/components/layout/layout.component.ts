import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { ResetWatchService } from '../../services/reset/reset-watch.service';
import { FooterComponent } from '../footer';
import { NavbarComponent } from '../navbar';
import { TimerStripComponent } from '../timer-strip';
import { CookieBannerComponent } from '../ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    TimerStripComponent,
    FooterComponent,
    CookieBannerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly resetWatch = inject(ResetWatchService);

  constructor() {
    // Global reload so Home / Checklist / everything re-syncs to the new cycle.
    this.resetWatch.resetChange$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => window.location.reload());
  }
}
