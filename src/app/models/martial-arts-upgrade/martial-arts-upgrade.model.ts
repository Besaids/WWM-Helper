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

  /** Concrete item IDs (these exist in game-assets.items.ts + tooltips) */
  tipsMaterialId: string;
  greenMaterialId: string;
  blueMaterialId: string;
}

export interface MartialArtsLevelCostSegment {
  fromLevel: number; // inclusive
  toLevel: number; // inclusive
  coin: number; // currency.coin per level-up into this range
  greenTier?: number; // concrete green material count per level-up
}

export interface MartialArtsBreakthroughCost {
  /** Breakthrough required to go BEYOND this level */
  atLevel: number;

  coin?: number;
  tips?: number;
  blueTier?: number;
}

export interface MartialArtsTrackState {
  enabled: boolean;
  currentLevel: number; // 1..max
  targetLevel: number; // 1..max
}

export interface MartialArtsTotals {
  coin: number;
  tips: number;
  green: number;
  blue: number;
}
