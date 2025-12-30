// src/app/components/tools/gear-enhancement-upgrade-planner/gear-enhancement-upgrade-planner.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  getDefaultTooltips,
  GEAR_ENHANCE_ASSETS,
  GEAR_ENHANCEMENT_MAX_LEVEL,
  GEAR_ENHANCEMENT_MIN_LEVEL,
  ITEMS_ASSETS,
} from '../../../configs';
import { TooltipDirective } from '../../../directives';
import { GearEnhancementUpgradeService, TooltipRegistryService } from '../../../services';
import {
  GearEnhancementMaterialAmount,
  GearEnhancementSlotDefinition,
  GearEnhancementSlotId,
  GearEnhancementUpgradeStep,
} from '../../../models';

interface SlotViewModel {
  def: GearEnhancementSlotDefinition;
  iconUrl: string | null;
}

interface MaterialEntry {
  assetId: string;
  label: string;
  iconUrl: string | null;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-gear-enhancement-upgrade-planner',
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './gear-enhancement-upgrade-planner.component.html',
  styleUrls: ['./gear-enhancement-upgrade-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearEnhancementUpgradePlannerComponent implements OnInit {
  private readonly service = inject(GearEnhancementUpgradeService);
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  readonly minLevel = GEAR_ENHANCEMENT_MIN_LEVEL;
  readonly maxLevel = GEAR_ENHANCEMENT_MAX_LEVEL;
  readonly levelOptions = Array.from(
    { length: GEAR_ENHANCEMENT_MAX_LEVEL - GEAR_ENHANCEMENT_MIN_LEVEL + 1 },
    (_, i) => GEAR_ENHANCEMENT_MIN_LEVEL + i,
  );

  // Slot view models
  readonly allSlots: SlotViewModel[] = this.service.slots().map((def) => ({
    def,
    iconUrl: this.getSlotIcon(def.iconAssetId),
  }));

  // Signals from service
  readonly selectedSlotId = this.service.selectedSlotId;
  readonly targetLevel = this.service.targetLevel;
  readonly tracks = this.service.tracks;
  readonly totalsForIncluded = this.service.totalsForIncluded;
  readonly selectedProgress = this.service.selectedProgress;

  // Selected slot view model
  readonly selectedSlot = computed(() => {
    const id = this.selectedSlotId();
    return this.allSlots.find((s) => s.def.id === id) ?? null;
  });

  // Coin total from aggregated totals
  readonly coinTotal = computed(() => this.totalsForIncluded().coin);

  // Materials from aggregated totals
  readonly materialEntries = computed<MaterialEntry[]>(() =>
    this.totalsForIncluded().materials.map((m) => ({
      assetId: m.id,
      label: this.getItemLabel(m.id),
      iconUrl: this.getItemIcon(m.id),
      count: m.amount,
    })),
  );

  // Check if there are any material costs
  readonly hasMaterialCosts = computed(() => this.materialEntries().length > 0);

  ngOnInit(): void {
    this.tooltipRegistry.registerAll(getDefaultTooltips());
  }

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  selectSlot(id: GearEnhancementSlotId): void {
    this.service.setSelectedSlot(id);
  }

  setTargetLevel(level: number): void {
    this.service.setTargetLevel(level);
  }

  setCurrentLevel(id: GearEnhancementSlotId, level: number): void {
    this.service.setCurrentLevel(id, level);
  }

  toggleIncluded(id: GearEnhancementSlotId, event: Event): void {
    event.stopPropagation();
    const track = this.tracks()[id];
    this.service.setIncluded(id, !track?.included);
  }

  includeAll(): void {
    this.service.includeAll();
  }

  includeNone(): void {
    this.service.includeNone();
  }

  resetAllProgress(): void {
    if (confirm('Reset all gear enhancement progress (levels and inclusion) to defaults?')) {
      this.service.resetAllProgress();
    }
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  isSelected(id: GearEnhancementSlotId): boolean {
    return this.selectedSlotId() === id;
  }

  getTrack(id: GearEnhancementSlotId) {
    return this.tracks()[id];
  }

  getProgressPercent(id: GearEnhancementSlotId): number {
    const track = this.tracks()[id];
    if (!track) return 0;
    const target = this.targetLevel();
    if (target <= this.minLevel) return 100;
    const range = target - this.minLevel;
    const progress = track.currentLevel - this.minLevel;
    return Math.min(100, (progress / range) * 100);
  }

  trackBySlotId(_index: number, slot: SlotViewModel): string {
    return slot.def.id;
  }

  trackByAssetId(_index: number, entry: MaterialEntry): string {
    return entry.assetId;
  }

  trackByStepIndex(index: number): number {
    return index;
  }

  private getSlotIcon(assetId: string): string | null {
    const asset = GEAR_ENHANCE_ASSETS.find((a) => a.id === assetId);
    return asset?.file ?? null;
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

  getStepMaterials(step: GearEnhancementUpgradeStep): MaterialEntry[] {
    return step.materials.map((m) => ({
      assetId: m.id,
      label: this.getItemLabel(m.id),
      iconUrl: this.getItemIcon(m.id),
      count: m.amount,
    }));
  }

  getProgressMaterials(materials: GearEnhancementMaterialAmount[]): MaterialEntry[] {
    return materials.map((m) => ({
      assetId: m.id,
      label: this.getItemLabel(m.id),
      iconUrl: this.getItemIcon(m.id),
      count: m.amount,
    }));
  }

  getMaterialTagClass(assetId: string): string {
    if (assetId === 'items.oscillating_jade') return 'material-tag--jade';
    if (assetId === 'items.raw_ore' || assetId === 'items.coarse_fur')
      return 'material-tag--standard';
    if (
      assetId === 'items.lethal_crystal' ||
      assetId === 'items.aromatic_jade' ||
      assetId === 'items.bear_pelt'
    )
      return 'material-tag--green';
    if (
      assetId === 'items.cold_iron' ||
      assetId === 'items.dushan_jade' ||
      assetId === 'items.fat_tail_sheepskin'
    )
      return 'material-tag--blue';
    return '';
  }

  scrollToTop(): void {
    const el = document.getElementById('top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
