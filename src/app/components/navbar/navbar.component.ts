import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MusicPlayerComponent } from '../music-player';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MusicPlayerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  readonly isMenuOpen = signal(false);

  // Music player visibility
  readonly isMusicPlayerOpen = signal(false);

  private get musicAutoHideDelay(): number {
    return window.innerWidth < 992 ? 7500 : 2000; // 7500ms for mobile, 2000ms for desktop
  }
  private musicHideTimeoutId: number | null = null;

  // --- Nav menu ---

  toggleMenu(): void {
    this.isMenuOpen.update((current) => !current);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  // --- Music player ---

  openMusicPlayer(): void {
    if (!this.isMusicPlayerOpen()) {
      this.isMusicPlayerOpen.set(true);
    }
    this.scheduleMusicAutoHide();
  }

  closeMusicPlayer(): void {
    if (!this.isMusicPlayerOpen()) return;
    this.isMusicPlayerOpen.set(false);
    this.clearMusicAutoHide();
  }

  /** Any interaction over the player area extends the auto-hide timer. */
  onMusicAreaInteraction(): void {
    if (!this.isMusicPlayerOpen()) return;
    this.scheduleMusicAutoHide();
  }

  private scheduleMusicAutoHide(): void {
    this.clearMusicAutoHide();
    this.musicHideTimeoutId = window.setTimeout(() => {
      this.isMusicPlayerOpen.set(false);
      this.musicHideTimeoutId = null;
    }, this.musicAutoHideDelay);
  }

  private clearMusicAutoHide(): void {
    if (this.musicHideTimeoutId !== null) {
      window.clearTimeout(this.musicHideTimeoutId);
      this.musicHideTimeoutId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearMusicAutoHide();
  }
}
