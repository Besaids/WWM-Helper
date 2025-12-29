import { Injectable, computed, signal } from '@angular/core';
import {
  MartialArtDefinition,
  MartialArtId,
  MartialArtsTotals,
  MartialArtsTrackState,
} from '../../models';
import {
  MARTIAL_ARTS,
  MARTIAL_ARTS_BREAKTHROUGHS,
  MARTIAL_ARTS_LEVEL_COST_SEGMENTS,
  MARTIAL_ARTS_MAX_LEVEL,
} from '../../configs';

interface PersistedStateV2 {
  version: 2;
  tracks: Record<MartialArtId, MartialArtsTrackState>;
}

const STORAGE_KEY = 'wwmhelper.martial-arts-upgrade.v2';

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

  private readonly state = signal<PersistedStateV2>(this.loadOrDefault());

  readonly tracks = computed(() => this.state().tracks);

  readonly globalTotals = computed(() => {
    const tracks = this.state().tracks;
    let coin = 0;
    let tips = 0;
    let green = 0;
    let blue = 0;

    (Object.keys(tracks) as MartialArtId[]).forEach((id) => {
      const t = tracks[id];
      if (!t.enabled) return;

      const totals = this.computeTotalsForTrack(t.currentLevel, t.targetLevel);
      coin += totals.coin;
      tips += totals.tips;
      green += totals.green;
      blue += totals.blue;
    });

    return { coin, tips, green, blue } satisfies MartialArtsTotals;
  });

  readonly materialTotalsById = computed(() => {
    const tracks = this.state().tracks;

    const totals: Record<string, number> = {
      'currency.coin': 0,
    };

    (Object.keys(tracks) as MartialArtId[]).forEach((id) => {
      const t = tracks[id];
      if (!t.enabled) return;

      const def = this.defsById.get(id);
      if (!def) return;

      const r = this.computeTotalsForTrack(t.currentLevel, t.targetLevel);

      totals['currency.coin'] = (totals['currency.coin'] ?? 0) + r.coin;
      totals[def.tipsMaterialId] = (totals[def.tipsMaterialId] ?? 0) + r.tips;
      totals[def.greenMaterialId] = (totals[def.greenMaterialId] ?? 0) + r.green;
      totals[def.blueMaterialId] = (totals[def.blueMaterialId] ?? 0) + r.blue;
    });

    Object.keys(totals).forEach((k) => {
      if (!totals[k]) delete totals[k];
    });

    return totals;
  });

  setEnabled(id: MartialArtId, enabled: boolean): void {
    const s = this.state();
    this.state.set({
      ...s,
      tracks: {
        ...s.tracks,
        [id]: { ...s.tracks[id], enabled },
      },
    });
    this.persist();
  }

  setCurrentLevel(id: MartialArtId, level: number): void {
    const s = this.state();
    const currentLevel = clampInt(level, 1, MARTIAL_ARTS_MAX_LEVEL);
    const targetLevel = Math.max(currentLevel, s.tracks[id].targetLevel);

    this.state.set({
      ...s,
      tracks: {
        ...s.tracks,
        [id]: { ...s.tracks[id], currentLevel, targetLevel },
      },
    });
    this.persist();
  }

  setTargetLevel(id: MartialArtId, level: number): void {
    const s = this.state();
    const targetLevel = clampInt(level, 1, MARTIAL_ARTS_MAX_LEVEL);
    const currentLevel = Math.min(s.tracks[id].currentLevel, targetLevel);

    this.state.set({
      ...s,
      tracks: {
        ...s.tracks,
        [id]: { ...s.tracks[id], currentLevel, targetLevel },
      },
    });
    this.persist();
  }

  private computeTotalsForTrack(currentLevel: number, targetLevel: number): MartialArtsTotals {
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

  private loadOrDefault(): PersistedStateV2 {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedStateV2;
        if (parsed?.version === 2 && parsed.tracks) return parsed;
      }
    } catch {
      // ignore
    }

    const tracks = MARTIAL_ARTS.reduce(
      (acc, d) => {
        acc[d.id] = { enabled: false, currentLevel: 1, targetLevel: MARTIAL_ARTS_MAX_LEVEL };
        return acc;
      },
      {} as Record<MartialArtId, MartialArtsTrackState>,
    );

    return { version: 2, tracks };
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      // ignore
    }
  }
}
