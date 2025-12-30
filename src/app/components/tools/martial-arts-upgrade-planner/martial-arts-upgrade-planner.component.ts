// src/app/components/tools/martial-arts-upgrade-planner/martial-arts-upgrade-planner.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  getDefaultTooltips,
  ITEMS_ASSETS,
  MARTIAL_ARTS,
  MARTIAL_ARTS_ASSETS,
  MARTIAL_ARTS_MAX_LEVEL,
} from '../../../configs';
import { TooltipDirective } from '../../../directives';
import { MartialArtsUpgradeService, TooltipRegistryService } from '../../../services';
import { MartialArtDefinition, MartialArtId, MartialArtsUpgradePlan } from '../../../models';

type PathKey =
  | 'bellstrike_splendor'
  | 'bellstrike_umbra'
  | 'silkbind_jade'
  | 'silkbind_deluge'
  | 'stonesplit_might'
  | 'bamboocut_wind';

const PATH_LABELS: Record<PathKey, string> = {
  bellstrike_splendor: 'Bellstrike - Splendor',
  bellstrike_umbra: 'Bellstrike - Umbra',
  silkbind_jade: 'Silkbind - Jade',
  silkbind_deluge: 'Silkbind - Deluge',
  stonesplit_might: 'Stonesplit - Might',
  bamboocut_wind: 'Bamboocut - Wind',
};

const ALL_PATH_KEYS: PathKey[] = [
  'bellstrike_splendor',
  'bellstrike_umbra',
  'silkbind_jade',
  'silkbind_deluge',
  'stonesplit_might',
  'bamboocut_wind',
];

// Stable ordering for green materials
const GREEN_MATERIAL_ORDER = [
  'items.bluestone_lock',
  'items.pine_resin_ointment',
  'items.tiger_bone_liquor',
];

// Stable ordering for blue materials
const BLUE_MATERIAL_ORDER = [
  'items.wolframite_weight',
  'items.scarlet_flame_ointment',
  'items.bone_renewal_tonic',
];

// Breakthrough levels for progress indicator (from config)
const BREAKTHROUGH_LEVELS = [20, 30, 40, 50, 55, 60, 65, 70];

function derivePathKey(tipsMaterialId: string): PathKey | null {
  const match = tipsMaterialId.match(/^items\.(\w+)_tips$/);
  if (match && ALL_PATH_KEYS.includes(match[1] as PathKey)) {
    return match[1] as PathKey;
  }
  return null;
}

interface MartialArtViewModel {
  def: MartialArtDefinition;
  label: string;
  iconUrl: string | null;
  pathKey: PathKey | null;
  pathLabel: string;
  tipsIconUrl: string | null;
  greenIconUrl: string | null;
  blueIconUrl: string | null;
}

interface MaterialEntry {
  assetId: string;
  label: string;
  iconUrl: string | null;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-martial-arts-upgrade-planner',
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './martial-arts-upgrade-planner.component.html',
  styleUrls: ['./martial-arts-upgrade-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MartialArtsUpgradePlannerComponent implements OnInit {
  private readonly planner = inject(MartialArtsUpgradeService);
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  readonly maxLevel = MARTIAL_ARTS_MAX_LEVEL;
  readonly levelOptions = Array.from({ length: MARTIAL_ARTS_MAX_LEVEL }, (_, i) => i + 1);
  readonly breakthroughLevels = BREAKTHROUGH_LEVELS;

  // All martial arts as view models
  readonly allArts: MartialArtViewModel[] = MARTIAL_ARTS.map((def) => {
    const asset = MARTIAL_ARTS_ASSETS.find((a) => a.id === def.id);
    const pathKey = derivePathKey(def.tipsMaterialId);
    return {
      def,
      label: def.label,
      iconUrl: asset?.file ?? null,
      pathKey,
      pathLabel: pathKey ? PATH_LABELS[pathKey] : 'Unknown Path',
      tipsIconUrl: this.getItemIcon(def.tipsMaterialId),
      greenIconUrl: this.getItemIcon(def.greenMaterialId),
      blueIconUrl: this.getItemIcon(def.blueMaterialId),
    };
  });

  readonly pathFilters: { key: PathKey; label: string; iconUrl: string | null }[] =
    ALL_PATH_KEYS.map((key) => ({
      key,
      label: PATH_LABELS[key],
      iconUrl: this.getItemIcon(`items.${key}_tips`),
    }));

  // Filter state
  readonly pathFilter = signal<PathKey | 'all'>('all');
  readonly upgradeableOnly = signal(false);
  readonly searchQuery = signal('');

  // Selection
  readonly selectedArtId = signal<MartialArtId | null>(null);

  // Target Level (component-local, defaults to max)
  readonly targetLevel = signal(MARTIAL_ARTS_MAX_LEVEL);

  // Tracks from service
  readonly tracks = this.planner.tracks;

  // Filtered arts
  readonly filteredArts = computed(() => {
    const path = this.pathFilter();
    const onlyUpgradeable = this.upgradeableOnly();
    const query = this.searchQuery().toLowerCase().trim();
    const target = this.targetLevel();

    return this.allArts.filter((art) => {
      if (path !== 'all' && art.pathKey !== path) return false;
      if (query && !art.label.toLowerCase().includes(query)) return false;
      if (onlyUpgradeable) {
        const track = this.tracks()[art.def.id];
        if (track && track.currentLevel >= target) return false;
      }
      return true;
    });
  });

  // Selected art details
  readonly selectedArt = computed(() => {
    const id = this.selectedArtId();
    if (!id) return null;
    return this.allArts.find((a) => a.def.id === id) ?? null;
  });

  // Upgrade plan for selected art
  readonly selectedPlan = computed<MartialArtsUpgradePlan | null>(() => {
    const id = this.selectedArtId();
    if (!id) return null;
    this.tracks();
    return this.planner.planUpgrade(id, this.targetLevel());
  });

  // Global totals (for all included arts)
  readonly globalTotalsById = computed(() => {
    this.tracks();
    return this.planner.computeGlobalTotalsById(this.targetLevel());
  });

  // Coin total
  readonly coinTotal = computed(() => this.globalTotalsById()['currency.coin'] ?? 0);

  // Path Tips entries (stable ordering by ALL_PATH_KEYS)
  readonly tipsEntries = computed<MaterialEntry[]>(() => {
    const totals = this.globalTotalsById();
    return ALL_PATH_KEYS.map((key) => {
      const assetId = `items.${key}_tips`;
      const count = totals[assetId] ?? 0;
      return {
        assetId,
        label: this.getItemLabel(assetId),
        iconUrl: this.getItemIcon(assetId),
        count,
      };
    });
  });

  // Green material entries (stable ordering)
  readonly greenMaterialEntries = computed<MaterialEntry[]>(() => {
    const totals = this.globalTotalsById();
    return GREEN_MATERIAL_ORDER.map((assetId) => ({
      assetId,
      label: this.getItemLabel(assetId),
      iconUrl: this.getItemIcon(assetId),
      count: totals[assetId] ?? 0,
    })).filter((e) => e.count > 0);
  });

  // Blue material entries (stable ordering)
  readonly blueMaterialEntries = computed<MaterialEntry[]>(() => {
    const totals = this.globalTotalsById();
    return BLUE_MATERIAL_ORDER.map((assetId) => ({
      assetId,
      label: this.getItemLabel(assetId),
      iconUrl: this.getItemIcon(assetId),
      count: totals[assetId] ?? 0,
    })).filter((e) => e.count > 0);
  });

  // Check if any tips have count > 0
  readonly hasTipsCosts = computed(() => this.tipsEntries().some((e) => e.count > 0));

  // Check if any upgrade materials have count > 0
  readonly hasUpgradeMaterials = computed(
    () => this.greenMaterialEntries().length > 0 || this.blueMaterialEntries().length > 0,
  );

  ngOnInit(): void {
    this.tooltipRegistry.registerAll(getDefaultTooltips());
    const first = this.filteredArts()[0];
    if (first) {
      this.selectedArtId.set(first.def.id);
    }
  }

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  selectArt(id: MartialArtId): void {
    this.selectedArtId.set(id);
  }

  toggleIncluded(id: MartialArtId, event: Event): void {
    event.stopPropagation();
    this.planner.toggleIncluded(id);
  }

  setCurrentLevel(id: MartialArtId, level: number): void {
    const clamped = Math.min(level, this.targetLevel());
    this.planner.setCurrentLevel(id, clamped);
  }

  setTargetLevel(level: number): void {
    this.targetLevel.set(level);
    const selectedId = this.selectedArtId();
    if (selectedId) {
      const track = this.tracks()[selectedId];
      if (track && track.currentLevel >= level && this.upgradeableOnly()) {
        const first = this.filteredArts()[0];
        if (first) {
          this.selectedArtId.set(first.def.id);
        }
      }
    }
  }

  includeAll(): void {
    this.planner.setAllIncluded(true);
  }

  includeNone(): void {
    this.planner.setAllIncluded(false);
  }

  resetAllProgress(): void {
    if (confirm('Reset all martial art progress (levels and inclusion) to defaults?')) {
      this.planner.resetAll();
    }
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  isSelected(id: MartialArtId): boolean {
    return this.selectedArtId() === id;
  }

  getTrack(id: MartialArtId) {
    return this.tracks()[id];
  }

  getProgressPercent(id: MartialArtId): number {
    const track = this.tracks()[id];
    if (!track) return 0;
    const target = this.targetLevel();
    if (target <= 1) return 100;
    return Math.min(100, ((track.currentLevel - 1) / (target - 1)) * 100);
  }

  getPrevBreakthrough(currentBreakthrough: number): number {
    const idx = BREAKTHROUGH_LEVELS.indexOf(currentBreakthrough);
    if (idx <= 0) return 0;
    return BREAKTHROUGH_LEVELS[idx - 1];
  }

  getLevelProgressInSegment(currentLevel: number, segmentEnd: number): number {
    const segmentStart = this.getPrevBreakthrough(segmentEnd);
    const segmentSize = segmentEnd - segmentStart;
    const progress = currentLevel - segmentStart;
    return Math.min(100, Math.max(0, (progress / segmentSize) * 100));
  }

  trackByArtId(_index: number, art: MartialArtViewModel): string {
    return art.def.id;
  }

  trackByAssetId(_index: number, entry: MaterialEntry): string {
    return entry.assetId;
  }

  private getItemIcon(assetId: string): string | null {
    const itemAsset = ITEMS_ASSETS.find((a) => a.id === assetId);
    if (itemAsset) return itemAsset.file;
    if (assetId === 'currency.coin') {
      return 'assets/game/currency/currency-coin.png';
    }
    return null;
  }

  private getItemLabel(assetId: string): string {
    const itemAsset = ITEMS_ASSETS.find((a) => a.id === assetId);
    if (itemAsset) return itemAsset.label;
    if (assetId === 'currency.coin') return 'Coin';
    return assetId
      .replace(/^items\./, '')
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  getStepMaterials(step: { costsById: Record<string, number> }): MaterialEntry[] {
    return Object.entries(step.costsById)
      .filter(([, count]) => count > 0)
      .map(([assetId, count]) => ({
        assetId,
        label: this.getItemLabel(assetId),
        iconUrl: this.getItemIcon(assetId),
        count,
      }));
  }

  getPlanMaterials(plan: MartialArtsUpgradePlan): MaterialEntry[] {
    return Object.entries(plan.totalsById)
      .filter(([, count]) => count > 0)
      .map(([assetId, count]) => ({
        assetId,
        label: this.getItemLabel(assetId),
        iconUrl: this.getItemIcon(assetId),
        count,
      }));
  }

  getMaterialTagClass(assetId: string, art: MartialArtViewModel): string {
    if (assetId === 'currency.coin') return 'material-tag--coin';
    if (assetId.includes('_tips')) return 'material-tag--tips';
    if (assetId === art.def.blueMaterialId) return 'material-tag--blue';
    if (assetId === art.def.greenMaterialId) return 'material-tag--green';
    return '';
  }

  scrollToTop(): void {
    const el = document.getElementById('top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
