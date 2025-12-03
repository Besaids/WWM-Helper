import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BLADE_OUT_SEASON } from '../../../configs/path-guides/blade-out-season';
import { PathSeasonConfig, ChallengeCategory } from '../../../models/path-season.models';
import { PathChallengeCompletionService } from '../../../services/path-challenge';

@Component({
  standalone: true,
  selector: 'app-path-season-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './path-season-guide.component.html',
  styleUrls: ['./path-season-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathSeasonGuideComponent {
  private readonly completionService = inject(PathChallengeCompletionService);

  // Available seasons (for future expansion)
  readonly seasons: PathSeasonConfig[] = [BLADE_OUT_SEASON];

  // Currently selected season
  selectedSeasonId = signal<string>('blade-out');
  selectedSeason = computed(() => this.seasons.find((s) => s.seasonId === this.selectedSeasonId()));

  // Currently selected path
  selectedPathId = signal<string>('bellstrike-splendor');
  selectedPath = computed(() => {
    const season = this.selectedSeason();
    return season?.paths.find((p) => p.pathId === this.selectedPathId());
  });

  showScrollTop = signal(false);

  // Expose completion state as readonly signal for reactivity
  private completionState = this.completionService.completionState$;

  selectSeason(seasonId: string): void {
    this.selectedSeasonId.set(seasonId);
    // Reset to first path when season changes
    const season = this.selectedSeason();
    if (season && season.paths.length > 0) {
      this.selectedPathId.set(season.paths[0].pathId);
    }
  }

  selectPath(pathId: string): void {
    this.selectedPathId.set(pathId);
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  /**
   * Format time in seconds to mm:ss display
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get readable label and CSS class for challenge category
   */
  getCategoryInfo(category: ChallengeCategory): { label: string; cssClass: string } {
    switch (category) {
      case 'combat':
        return { label: 'Combat', cssClass: 'category-combat' };
      case 'martial-art':
        return { label: 'Martial Art', cssClass: 'category-martial' };
      case 'inner-way':
        return { label: 'Inner Way', cssClass: 'category-inner' };
      case 'season':
        return { label: 'Season Challenge', cssClass: 'category-season' };
      default:
        return { label: 'Challenge', cssClass: 'category-default' };
    }
  }

  /**
   * Get role badge CSS class
   */
  getRoleBadgeClass(role: string): string {
    const normalized = role.toLowerCase();
    if (normalized.includes('dps')) return 'role-dps';
    if (normalized.includes('tank')) return 'role-tank';
    if (normalized.includes('heal')) return 'role-healer';
    return 'role-default';
  }

  /**
   * Check if a challenge is completed (reactive)
   */
  isChallengeCompleted(challengeId: string): boolean {
    // Access the signal to make this reactive
    const state = this.completionState();
    return !!state[challengeId];
  }

/**
 * Toggle challenge completion
 */
toggleChallengeCompletion(event: Event, challengeId: string): void {
  event.stopPropagation(); // Prevent any parent click handlers
  event.preventDefault(); // Prevent default button behavior (form submission, scrolling, etc.)
  this.completionService.toggleCompletion(challengeId);
}

  getPathCompletion(pathId: string): { completed: number; total: number } {
  const state = this.completionState();
  const seasonId = this.selectedSeasonId();
  let completed = 0;

  // Count challenges with format: {seasonId}-{pathId}-...
  const prefix = `${seasonId}-${pathId}-`;
  for (const challengeId in state) {
    if (state[challengeId] && challengeId.startsWith(prefix)) {
      completed++;
    }
  }

  return { completed, total: 5 };
}
}
