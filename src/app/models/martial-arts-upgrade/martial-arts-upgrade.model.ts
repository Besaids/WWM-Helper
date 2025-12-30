export type MartialArtId =
  | 'martial_arts.heavenquaker_spear'
  | 'martial_arts.infernal_twinblades'
  | 'martial_arts.inkwell_fan'
  | 'martial_arts.mortal_rope_dart'
  | 'martial_arts.nameless_spear'
  | 'martial_arts.nameless_sword'
  | 'martial_arts.panacea_fan'
  | 'martial_arts.soulshade_umbrella'
  | 'martial_arts.stormbreaker_spear'
  | 'martial_arts.strategic_sword'
  | 'martial_arts.thundercry_blade'
  | 'martial_arts.vernal_umbrella';

export interface MartialArtDefinition {
  id: MartialArtId;
  label: string;

  /** Items (asset IDs) */
  tipsMaterialId: string; // items.*_tips
  greenMaterialId: string; // items.*
  blueMaterialId: string; // items.*
}

export interface MartialArtsLevelCostSegment {
  fromLevel: number; // inclusive
  toLevel: number; // inclusive
  coin: number; // currency.coin per level-up into this range
  greenTier?: number; // green material count per level-up into this range
}

export interface MartialArtsBreakthroughCost {
  /** Breakthrough required to go BEYOND this level */
  atLevel: number;

  coin?: number;
  tips?: number;
  blueTier?: number;
}

export interface MartialArtsTrackState {
  included: boolean;
  currentLevel: number; // 1..max
}

export interface MartialArtsTotals {
  coin: number;
  tips: number;
  green: number;
  blue: number;
}

export interface MartialArtsUpgradeStep {
  kind: 'levels' | 'breakthrough';
  label: string;
  costsById: Record<string, number>;
}

export interface MartialArtsUpgradePlan {
  id: MartialArtId;
  label: string;
  currentLevel: number;
  targetLevel: number;
  steps: MartialArtsUpgradeStep[];
  totalsById: Record<string, number>;
}
