import { computed, effect, Injectable, signal } from '@angular/core';
import {
  GEAR_ENHANCEMENT_LEVEL_COSTS,
  GEAR_ENHANCEMENT_MAX_LEVEL,
  GEAR_ENHANCEMENT_MIN_LEVEL,
  GEAR_ENHANCEMENT_SLOTS,
} from '../../configs';
import {
  GearEnhancementLevelCost,
  GearEnhancementMaterialAmount,
  GearEnhancementSlotDefinition,
  GearEnhancementSlotId,
  GearEnhancementTotals,
  GearEnhancementTrackProgress,
  GearEnhancementTrackState,
  GearEnhancementUpgradeStep,
} from '../../models';
import { clampInt, isObject } from '../../utils';

interface PersistedStateV1 {
  version: 1;
  tracks: Record<GearEnhancementSlotId, GearEnhancementTrackState>;
}

@Injectable({ providedIn: 'root' })
export class GearEnhancementUpgradeService {
  private readonly storageKey = 'wwm.gearEnhancementUpgradePlanner.v1';

  private readonly costsByLevel = new Map<number, GearEnhancementLevelCost>(
    GEAR_ENHANCEMENT_LEVEL_COSTS.map((c) => [c.level, c]),
  );

  private readonly stateSig = signal<PersistedStateV1>(this.loadOrDefaultState());

  private readonly selectedSlotIdSig = signal<GearEnhancementSlotId>(GEAR_ENHANCEMENT_SLOTS[0]!.id);
  private readonly targetLevelSig = signal<number>(GEAR_ENHANCEMENT_MAX_LEVEL);

  readonly slots = computed(() => GEAR_ENHANCEMENT_SLOTS);

  readonly selectedSlotId = this.selectedSlotIdSig.asReadonly();
  readonly targetLevel = this.targetLevelSig.asReadonly();

  readonly tracks = computed(() => this.stateSig().tracks);

  readonly includedSlotIds = computed(() =>
    GEAR_ENHANCEMENT_SLOTS.filter((s) => this.stateSig().tracks[s.id]?.included).map((s) => s.id),
  );

  readonly totalsForIncluded = computed(() => {
    const target = this.getClampedTargetLevel();

    let coin = 0;
    const mats: Record<string, number> = {};

    for (const slot of GEAR_ENHANCEMENT_SLOTS) {
      const track = this.stateSig().tracks[slot.id];
      if (!track?.included) continue;

      const { coin: c, materials } = this.computeTotalsForSlot(slot, track.currentLevel, target);
      coin += c;

      for (const m of materials) {
        mats[m.id] = (mats[m.id] ?? 0) + m.amount;
      }
    }

    return {
      coin,
      materials: this.sortMaterials(this.compactMaterials(mats)),
    } satisfies GearEnhancementTotals;
  });

  readonly selectedProgress = computed(() => {
    const id = this.selectedSlotIdSig();
    return this.getTrackProgress(id);
  });

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stateSig()));
    });
  }

  // -------------------------
  // Public API
  // -------------------------

  setSelectedSlot(id: GearEnhancementSlotId): void {
    this.selectedSlotIdSig.set(id);
  }

  setTargetLevel(level: number): void {
    this.targetLevelSig.set(this.clampLevel(level));
  }

  setCurrentLevel(id: GearEnhancementSlotId, level: number): void {
    const next = this.clampLevel(level);

    this.stateSig.update((state) => ({
      ...state,
      tracks: {
        ...state.tracks,
        [id]: {
          ...state.tracks[id],
          currentLevel: next,
        },
      },
    }));
  }

  setIncluded(id: GearEnhancementSlotId, included: boolean): void {
    this.stateSig.update((state) => ({
      ...state,
      tracks: {
        ...state.tracks,
        [id]: {
          ...state.tracks[id],
          included,
        },
      },
    }));
  }

  includeAll(): void {
    this.stateSig.update((state) => {
      const nextTracks: Record<GearEnhancementSlotId, GearEnhancementTrackState> = {
        ...state.tracks,
      };
      for (const slot of GEAR_ENHANCEMENT_SLOTS) {
        nextTracks[slot.id] = { ...nextTracks[slot.id], included: true };
      }
      return { ...state, tracks: nextTracks };
    });
  }

  includeNone(): void {
    this.stateSig.update((state) => {
      const nextTracks: Record<GearEnhancementSlotId, GearEnhancementTrackState> = {
        ...state.tracks,
      };
      for (const slot of GEAR_ENHANCEMENT_SLOTS) {
        nextTracks[slot.id] = { ...nextTracks[slot.id], included: false };
      }
      return { ...state, tracks: nextTracks };
    });
  }

  resetAllProgress(): void {
    this.stateSig.set(this.defaultState());
    this.selectedSlotIdSig.set(GEAR_ENHANCEMENT_SLOTS[0]!.id);
    this.targetLevelSig.set(GEAR_ENHANCEMENT_MAX_LEVEL);
  }

  getSlotDefinition(id: GearEnhancementSlotId): GearEnhancementSlotDefinition {
    const slot = GEAR_ENHANCEMENT_SLOTS.find((s) => s.id === id);
    if (!slot) throw new Error(`Unknown gear slot id: ${id}`);
    return slot;
  }

  getTrackProgress(id: GearEnhancementSlotId): GearEnhancementTrackProgress {
    const slot = this.getSlotDefinition(id);
    const target = this.getClampedTargetLevel();

    const track = this.stateSig().tracks[id];
    const from = this.clampLevel(track?.currentLevel ?? GEAR_ENHANCEMENT_MIN_LEVEL);
    const to = target;

    const steps = this.computeStepsForSlot(slot, from, to);
    const totals = this.computeTotalsForSlot(slot, from, to);

    const maxRequiredGearTier = this.getMaxRequiredGearTier(from, to);

    return {
      fromLevel: from,
      toLevel: to,
      steps,
      totals,
      maxRequiredGearTier: maxRequiredGearTier ?? undefined,
    };
  }

  // -------------------------
  // Core computation
  // -------------------------

  private computeTotalsForSlot(
    slot: GearEnhancementSlotDefinition,
    currentLevel: number,
    targetLevel: number,
  ): GearEnhancementTotals {
    const from = this.clampLevel(currentLevel);
    const to = this.clampLevel(targetLevel);

    if (to <= from) {
      return { coin: 0, materials: [] };
    }

    let coin = 0;
    const mats: Record<string, number> = {};

    for (let lvl = from + 1; lvl <= to; lvl++) {
      const cost = this.costsByLevel.get(lvl);
      if (!cost) continue;

      coin += cost.coin;

      this.addMat(mats, 'items.oscillating_jade', cost.oscillatingJade);

      if (cost.standardMaterial) this.addMat(mats, slot.standardMaterialId, cost.standardMaterial);
      if (cost.breakthroughMaterial1)
        this.addMat(mats, slot.breakthroughMaterial1Id, cost.breakthroughMaterial1);
      if (cost.breakthroughMaterial2)
        this.addMat(mats, slot.breakthroughMaterial2Id, cost.breakthroughMaterial2);
    }

    return {
      coin,
      materials: this.sortMaterials(this.compactMaterials(mats)),
    };
  }

  private computeStepsForSlot(
    slot: GearEnhancementSlotDefinition,
    currentLevel: number,
    targetLevel: number,
  ): GearEnhancementUpgradeStep[] {
    const from = this.clampLevel(currentLevel);
    const to = this.clampLevel(targetLevel);

    if (to <= from) return [];

    // Build per-level steps then merge consecutive identical payloads to keep UI short.
    const rawSteps: GearEnhancementUpgradeStep[] = [];

    for (let lvl = from + 1; lvl <= to; lvl++) {
      const cost = this.costsByLevel.get(lvl);
      if (!cost) continue;

      const mats: Record<string, number> = {};
      this.addMat(mats, 'items.oscillating_jade', cost.oscillatingJade);

      if (cost.standardMaterial) this.addMat(mats, slot.standardMaterialId, cost.standardMaterial);
      if (cost.breakthroughMaterial1)
        this.addMat(mats, slot.breakthroughMaterial1Id, cost.breakthroughMaterial1);
      if (cost.breakthroughMaterial2)
        this.addMat(mats, slot.breakthroughMaterial2Id, cost.breakthroughMaterial2);

      const requiredTier = cost.requiredGearTier;

      rawSteps.push({
        fromLevel: lvl - 1,
        toLevel: lvl,
        coin: cost.coin,
        materials: this.sortMaterials(this.compactMaterials(mats)),
        requiredGearTier: requiredTier ?? undefined,
      });
    }

    return this.mergeSteps(rawSteps);
  }

  private mergeSteps(steps: GearEnhancementUpgradeStep[]): GearEnhancementUpgradeStep[] {
    const merged: GearEnhancementUpgradeStep[] = [];

    const sameMaterials = (
      a: GearEnhancementMaterialAmount[],
      b: GearEnhancementMaterialAmount[],
    ) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i]!.id !== b[i]!.id) return false;
        // for merge comparison we only care about ids; amounts are merged by sum
      }
      return true;
    };

    for (const step of steps) {
      const last = merged.at(-1);
      if (
        last &&
        last.toLevel === step.fromLevel &&
        last.requiredGearTier === step.requiredGearTier &&
        sameMaterials(last.materials, step.materials)
      ) {
        last.toLevel = step.toLevel;
        last.coin += step.coin;

        // merge amounts
        const map: Record<string, number> = {};
        for (const m of last.materials) map[m.id] = (map[m.id] ?? 0) + m.amount;
        for (const m of step.materials) map[m.id] = (map[m.id] ?? 0) + m.amount;
        last.materials = this.sortMaterials(this.compactMaterials(map));

        continue;
      }

      merged.push({
        ...step,
        materials: step.materials.map((m) => ({ ...m })),
      });
    }

    return merged;
  }

  private getMaxRequiredGearTier(fromLevel: number, toLevel: number): number | null {
    if (toLevel <= fromLevel) return null;

    let max: number | null = null;
    for (let lvl = fromLevel + 1; lvl <= toLevel; lvl++) {
      const cost = this.costsByLevel.get(lvl);
      if (!cost?.requiredGearTier) continue;
      max = max === null ? cost.requiredGearTier : Math.max(max, cost.requiredGearTier);
    }
    return max;
  }

  // -------------------------
  // Persistence
  // -------------------------

  private defaultState(): PersistedStateV1 {
    const tracks = this.buildDefaultTracks();
    return { version: 1, tracks };
  }

  private buildDefaultTracks(): Record<GearEnhancementSlotId, GearEnhancementTrackState> {
    const entries = GEAR_ENHANCEMENT_SLOTS.map(
      (s) =>
        [
          s.id,
          {
            currentLevel: GEAR_ENHANCEMENT_MIN_LEVEL,
            included: true,
          } satisfies GearEnhancementTrackState,
        ] as const,
    );

    return Object.fromEntries(entries) as Record<GearEnhancementSlotId, GearEnhancementTrackState>;
  }

  private loadOrDefaultState(): PersistedStateV1 {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return this.defaultState();

    const parsed = this.safeJsonParse(raw);
    if (!this.isPersistedStateV1(parsed)) return this.defaultState();

    // merge with defaults to tolerate new slots / missing keys
    const defaults = this.buildDefaultTracks();
    const mergedTracks: Record<GearEnhancementSlotId, GearEnhancementTrackState> = { ...defaults };

    for (const slot of GEAR_ENHANCEMENT_SLOTS) {
      const maybe = parsed.tracks[slot.id];
      if (!maybe) continue;

      mergedTracks[slot.id] = {
        currentLevel: this.clampLevel(maybe.currentLevel),
        included: Boolean(maybe.included),
      };
    }

    return { version: 1, tracks: mergedTracks };
  }

  private safeJsonParse(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private isPersistedStateV1(value: unknown): value is PersistedStateV1 {
    if (!isObject(value)) return false;

    const v = value as Record<string, unknown>;
    if (v['version'] !== 1) return false;
    if (!isObject(v['tracks'])) return false;

    // Shallow validate track values where possible
    const tracks = v['tracks'] as Record<string, unknown>;
    for (const slot of GEAR_ENHANCEMENT_SLOTS) {
      const t = tracks[slot.id];
      if (t === undefined) continue; // allow missing (we merge with defaults)

      if (!isObject(t)) return false;
      const tr = t as Record<string, unknown>;

      const lvl = tr['currentLevel'];
      const inc = tr['included'];

      if (typeof lvl !== 'number') return false;
      if (typeof inc !== 'boolean') return false;
    }

    return true;
  }

  // -------------------------
  // Small helpers
  // -------------------------

  private addMat(map: Record<string, number>, id: string, amount: number): void {
    if (amount <= 0) return;
    map[id] = (map[id] ?? 0) + amount;
  }

  private compactMaterials(map: Record<string, number>): GearEnhancementMaterialAmount[] {
    return Object.entries(map)
      .filter(([, amount]) => amount > 0)
      .map(([id, amount]) => ({ id, amount }));
  }

  private sortMaterials(mats: GearEnhancementMaterialAmount[]): GearEnhancementMaterialAmount[] {
    const priority: Record<string, number> = {
      'items.oscillating_jade': 0,
      'items.raw_ore': 10,
      'items.coarse_fur': 11,
      'items.lethal_crystal': 20,
      'items.aromatic_jade': 21,
      'items.bear_pelt': 22,
      'items.cold_iron': 30,
      'items.dushan_jade': 31,
      'items.fat_tail_sheepskin': 32,
    };

    return [...mats].sort((a, b) => {
      const pa = priority[a.id] ?? 999;
      const pb = priority[b.id] ?? 999;
      if (pa !== pb) return pa - pb;
      return a.id.localeCompare(b.id);
    });
  }

  private getClampedTargetLevel(): number {
    return this.clampLevel(this.targetLevelSig());
  }

  private clampLevel(level: number): number {
    return clampInt(level, GEAR_ENHANCEMENT_MIN_LEVEL, GEAR_ENHANCEMENT_MAX_LEVEL);
  }
}
