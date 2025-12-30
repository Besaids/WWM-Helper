import { Injectable, computed, signal } from '@angular/core';
import {
  MartialArtDefinition,
  MartialArtId,
  MartialArtsTotals,
  MartialArtsTrackState,
  MartialArtsUpgradePlan,
  MartialArtsUpgradeStep,
} from '../../models';
import {
  MARTIAL_ARTS,
  MARTIAL_ARTS_BREAKTHROUGHS,
  MARTIAL_ARTS_LEVEL_COST_SEGMENTS,
  MARTIAL_ARTS_MAX_LEVEL,
} from '../../configs';

interface PersistedStateV3 {
  version: 3;
  tracks: Record<MartialArtId, MartialArtsTrackState>;
}

const STORAGE_KEY = 'wwmhelper.martial-arts-upgrade.v3';

interface LegacyTrackStateV2 {
  enabled?: boolean; // old name
  included?: boolean; // possible intermediate name
  currentLevel?: number;
  targetLevel?: number; // ignore; target is now page-level
}

interface LegacyPersistedStateV2 {
  version?: number;
  tracks?: Partial<Record<MartialArtId, LegacyTrackStateV2>>;
}

function clampInt(v: number, min: number, max: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function buildLevelCostMaps(): {
  coinByLevel: Record<number, number>;
  greenByLevel: Record<number, number>;
} {
  const coinByLevel: Record<number, number> = {};
  const greenByLevel: Record<number, number> = {};

  for (const seg of MARTIAL_ARTS_LEVEL_COST_SEGMENTS) {
    for (let lvl = seg.fromLevel; lvl <= seg.toLevel; lvl++) {
      coinByLevel[lvl] = seg.coin;
      greenByLevel[lvl] = seg.greenTier ?? 0;
    }
  }

  return { coinByLevel, greenByLevel };
}

@Injectable({ providedIn: 'root' })
export class MartialArtsUpgradeService {
  private readonly costMaps = buildLevelCostMaps();
  private readonly defsById = new Map<MartialArtId, MartialArtDefinition>(
    MARTIAL_ARTS.map((d) => [d.id, d]),
  );

  private readonly state = signal<PersistedStateV3>(this.loadOrDefault());

  readonly tracks = computed(() => this.state().tracks);

  readonly includedCount = computed(() => {
    const tracks = this.state().tracks;
    return (Object.keys(tracks) as MartialArtId[]).reduce(
      (acc, id) => acc + (tracks[id].included ? 1 : 0),
      0,
    );
  });

  // ---------------------------------------------------------------------------
  // Progress API (mirrors Mystic planner style)
  // ---------------------------------------------------------------------------

  getTrack(id: MartialArtId): MartialArtsTrackState {
    return this.state().tracks[id];
  }

  setIncluded(id: MartialArtId, included: boolean): void {
    const s = this.state();
    this.state.set({
      ...s,
      tracks: {
        ...s.tracks,
        [id]: { ...s.tracks[id], included },
      },
    });
    this.persist();
  }

  toggleIncluded(id: MartialArtId): void {
    const cur = this.getTrack(id);
    this.setIncluded(id, !cur.included);
  }

  setAllIncluded(included: boolean): void {
    const s = this.state();
    const nextTracks = { ...s.tracks };

    (Object.keys(nextTracks) as MartialArtId[]).forEach((id) => {
      nextTracks[id] = { ...nextTracks[id], included };
    });

    this.state.set({ ...s, tracks: nextTracks });
    this.persist();
  }

  setCurrentLevel(id: MartialArtId, level: number): void {
    const s = this.state();
    const currentLevel = clampInt(level, 1, MARTIAL_ARTS_MAX_LEVEL);

    this.state.set({
      ...s,
      tracks: {
        ...s.tracks,
        [id]: { ...s.tracks[id], currentLevel },
      },
    });
    this.persist();
  }

  resetAll(): void {
    this.state.set(this.defaultState());
    this.persist();
  }

  // ---------------------------------------------------------------------------
  // Totals + planning
  // ---------------------------------------------------------------------------

  computeGlobalTotalsById(targetLevel: number): Record<string, number> {
    const tgt = clampInt(targetLevel, 1, MARTIAL_ARTS_MAX_LEVEL);
    const tracks = this.state().tracks;

    const totals: Record<string, number> = {
      'currency.coin': 0,
    };

    (Object.keys(tracks) as MartialArtId[]).forEach((id) => {
      const t = tracks[id];
      if (!t.included) return;

      const def = this.defsById.get(id);
      if (!def) return;

      const r = this.computeTotalsForRange(t.currentLevel, tgt);

      totals['currency.coin'] = (totals['currency.coin'] ?? 0) + r.coin;
      totals[def.tipsMaterialId] = (totals[def.tipsMaterialId] ?? 0) + r.tips;
      totals[def.greenMaterialId] = (totals[def.greenMaterialId] ?? 0) + r.green;
      totals[def.blueMaterialId] = (totals[def.blueMaterialId] ?? 0) + r.blue;
    });

    Object.keys(totals).forEach((k) => {
      if (!totals[k]) delete totals[k];
    });

    return totals;
  }

  computeGlobalTotals(targetLevel: number): MartialArtsTotals {
    const tgt = clampInt(targetLevel, 1, MARTIAL_ARTS_MAX_LEVEL);
    const tracks = this.state().tracks;

    let coin = 0;
    let tips = 0;
    let green = 0;
    let blue = 0;

    (Object.keys(tracks) as MartialArtId[]).forEach((id) => {
      const t = tracks[id];
      if (!t.included) return;

      const r = this.computeTotalsForRange(t.currentLevel, tgt);
      coin += r.coin;
      tips += r.tips;
      green += r.green;
      blue += r.blue;
    });

    return { coin, tips, green, blue };
  }

  planUpgrade(id: MartialArtId, targetLevel: number): MartialArtsUpgradePlan | null {
    const def = this.defsById.get(id);
    if (!def) return null;

    const track = this.getTrack(id);
    const cur = clampInt(track.currentLevel, 1, MARTIAL_ARTS_MAX_LEVEL);
    const tgt = clampInt(targetLevel, 1, MARTIAL_ARTS_MAX_LEVEL);

    if (tgt <= cur) {
      return {
        id,
        label: def.label,
        currentLevel: cur,
        targetLevel: tgt,
        steps: [],
        totalsById: {},
      };
    }

    const steps: MartialArtsUpgradeStep[] = [];
    const totalsById: Record<string, number> = {};

    const addCost = (assetId: string, amount: number) => {
      if (!amount) return;
      totalsById[assetId] = (totalsById[assetId] ?? 0) + amount;
    };

    // Level-up segments: group by the segment definition; avoid per-level spam.
    for (const seg of MARTIAL_ARTS_LEVEL_COST_SEGMENTS) {
      const from = Math.max(seg.fromLevel, cur + 1);
      const to = Math.min(seg.toLevel, tgt);
      if (to < from) continue;

      const levelsCount = to - from + 1;
      const coin = seg.coin * levelsCount;
      const green = (seg.greenTier ?? 0) * levelsCount;

      const costsById: Record<string, number> = {
        'currency.coin': coin,
      };
      if (green) costsById[def.greenMaterialId] = green;

      steps.push({
        kind: 'levels',
        label: `Lv. ${from} → ${to}`,
        costsById,
      });

      addCost('currency.coin', coin);
      addCost(def.greenMaterialId, green);
    }

    // Breakthroughs when crossing the gate (same logic as your totals)
    for (const bt of MARTIAL_ARTS_BREAKTHROUGHS) {
      if (cur <= bt.atLevel && tgt > bt.atLevel) {
        const costsById: Record<string, number> = {};
        if (bt.coin) costsById['currency.coin'] = bt.coin;
        if (bt.tips) costsById[def.tipsMaterialId] = bt.tips;
        if (bt.blueTier) costsById[def.blueMaterialId] = bt.blueTier;

        steps.push({
          kind: 'breakthrough',
          label: `Breakthrough at Lv. ${bt.atLevel}`,
          costsById,
        });

        addCost('currency.coin', bt.coin ?? 0);
        addCost(def.tipsMaterialId, bt.tips ?? 0);
        addCost(def.blueMaterialId, bt.blueTier ?? 0);
      }
    }

    // Clean zeros
    Object.keys(totalsById).forEach((k) => {
      if (!totalsById[k]) delete totalsById[k];
    });

    return {
      id,
      label: def.label,
      currentLevel: cur,
      targetLevel: tgt,
      steps,
      totalsById,
    };
  }

  private computeTotalsForRange(currentLevel: number, targetLevel: number): MartialArtsTotals {
    const cur = clampInt(currentLevel, 1, MARTIAL_ARTS_MAX_LEVEL);
    const tgt = clampInt(targetLevel, 1, MARTIAL_ARTS_MAX_LEVEL);

    if (tgt <= cur) return { coin: 0, tips: 0, green: 0, blue: 0 };

    let coin = 0;
    let green = 0;

    for (let lvl = cur + 1; lvl <= tgt; lvl++) {
      coin += this.costMaps.coinByLevel[lvl] ?? 0;
      green += this.costMaps.greenByLevel[lvl] ?? 0;
    }

    let tips = 0;
    let blue = 0;

    for (const bt of MARTIAL_ARTS_BREAKTHROUGHS) {
      if (cur <= bt.atLevel && tgt > bt.atLevel) {
        coin += bt.coin ?? 0;
        tips += bt.tips ?? 0;
        blue += bt.blueTier ?? 0;
      }
    }

    return { coin, tips, green, blue };
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  private defaultState(): PersistedStateV3 {
    const tracks = MARTIAL_ARTS.reduce(
      (acc, d) => {
        acc[d.id] = { included: true, currentLevel: 1 };
        return acc;
      },
      {} as Record<MartialArtId, MartialArtsTrackState>,
    );

    return { version: 3, tracks };
  }

  private loadOrDefault(): PersistedStateV3 {
    // v3
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedStateV3;
        if (parsed?.version === 3 && parsed.tracks) return parsed;
      }
    } catch {
      // ignore
    }

    // migration from any older key you might have used previously
    try {
      const legacyRaw = localStorage.getItem('wwmhelper.martial-arts-upgrade.v2');
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw) as LegacyPersistedStateV2;
        const tracks = this.defaultState().tracks;

        (Object.keys(tracks) as MartialArtId[]).forEach((id) => {
          const lt = legacy.tracks?.[id];
          if (!lt) return;

          const included =
            typeof lt.included === 'boolean'
              ? lt.included
              : typeof lt.enabled === 'boolean'
                ? lt.enabled
                : true;

          const currentLevel =
            typeof lt.currentLevel === 'number'
              ? clampInt(lt.currentLevel, 1, MARTIAL_ARTS_MAX_LEVEL)
              : 1;

          tracks[id] = { included, currentLevel };
        });

        const migrated: PersistedStateV3 = { version: 3, tracks };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch {
      // ignore
    }

    return this.defaultState();
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      // ignore
    }
  }
}
