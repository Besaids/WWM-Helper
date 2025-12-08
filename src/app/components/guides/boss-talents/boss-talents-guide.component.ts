import { ChangeDetectionStrategy, Component, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BLADE_OUT_BOSS_TALENTS } from '../../../configs/boss-talents/boss-talents.data';
import {
  BossTalentSeason,
  BossTalentBoss,
  BossTalentTrack,
  BossTalentTier,
  BossTalentTrackType,
} from '../../../models/boss-talents.model';

@Component({
  standalone: true,
  selector: 'app-boss-talents-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './boss-talents-guide.component.html',
  styleUrls: ['./boss-talents-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BossTalentsGuideComponent {
  /** The current season data */
  readonly season: BossTalentSeason = BLADE_OUT_BOSS_TALENTS;

  /** Currently selected boss ID */
  selectedBossId = signal<string>('void_king');

  /** Computed: the currently selected boss object */
  selectedBoss = computed(() => {
    const bosses = this.season.bosses.sort((a, b) => a.order - b.order);
    return bosses.find((b) => b.id === this.selectedBossId()) ?? bosses[0];
  });

  /** Sorted bosses list for display */
  readonly sortedBosses = computed(() => [...this.season.bosses].sort((a, b) => a.order - b.order));

  /** Show scroll-to-top button */
  showScrollTop = signal(false);

  /**
   * Select a boss by ID
   */
  selectBoss(bossId: string): void {
    this.selectedBossId.set(bossId);
  }

  /**
   * Scroll to a section by ID
   */
  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  /**
   * Get CSS class for track type
   */
  getTrackClass(type: BossTalentTrackType): string {
    switch (type) {
      case 'offensive':
        return 'track-offensive';
      case 'defensive':
        return 'track-defensive';
      case 'strategic':
        return 'track-strategic';
      default:
        return '';
    }
  }

  /**
   * Get icon class for track type
   */
  getTrackIcon(type: BossTalentTrackType): string {
    switch (type) {
      case 'offensive':
        return 'bi-lightning-charge-fill';
      case 'defensive':
        return 'bi-shield-fill';
      case 'strategic':
        return 'bi-bullseye';
      default:
        return 'bi-star-fill';
    }
  }

  /**
   * Get the display text for a tier's requirement
   * Handles sameAsTier references
   */
  getRequirementDisplay(tier: BossTalentTier, track: BossTalentTrack): string {
    if (tier.requirement && !tier.sameAsTier) {
      return tier.requirement;
    }

    if (tier.sameAsTier) {
      const ref = track.tiers.find((t) => t.tier === tier.sameAsTier);
      if (ref?.requirement) {
        return ref.requirement;
      }
      return `Same as Tier ${tier.sameAsTier}`;
    }

    if (tier.notes?.startsWith('TODO')) {
      return 'Data pending...';
    }
    return 'Requirement not yet documented';
  }

  /**
   * Check if a requirement is incomplete (TODO or missing)
   */
  isRequirementIncomplete(tier: BossTalentTier): boolean {
    return !tier.requirement && !tier.sameAsTier;
  }

  /**
   * Format unlock level display
   */
  formatUnlockLevel(level: number | null): string {
    if (level === null) {
      return '—';
    }
    return `Lv. ${level}`;
  }

  /**
   * Track function for *ngFor on bosses
   */
  trackByBossId(_index: number, boss: BossTalentBoss): string {
    return boss.id;
  }

  /**
   * Track function for *ngFor on tracks
   */
  trackByTrackType(_index: number, track: BossTalentTrack): string {
    return track.type;
  }

  /**
   * Track function for *ngFor on tiers
   */
  trackByTier(_index: number, tier: BossTalentTier): number {
    return tier.tier;
  }
}
