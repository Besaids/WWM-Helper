export type GearEnhancementSlotId =
  | 'gear_enhance.left_hand_weapon'
  | 'gear_enhance.right_hand_weapon'
  | 'gear_enhance.disc'
  | 'gear_enhance.pendant'
  | 'gear_enhance.helm'
  | 'gear_enhance.armor'
  | 'gear_enhance.greaves'
  | 'gear_enhance.bracer';

export interface GearEnhancementSlotDefinition {
  id: GearEnhancementSlotId;
  name: string;
  iconAssetId: string;

  // Standard per-slot mats
  standardMaterialId: string; // items.raw_ore | items.coarse_fur

  // Breakthrough mats (mapped per slot)
  breakthroughMaterial1Id: string; // items.lethal_crystal | items.aromatic_jade | items.bear_pelt
  breakthroughMaterial2Id: string; // items.cold_iron | items.dushan_jade | items.fat_tail_sheepskin
}

export interface GearEnhancementLevelCost {
  /**
   * Cost to upgrade INTO this level (e.g. current=0 -> target=1 uses level=1 costs).
   */
  level: number;

  oscillatingJade: number; // items.oscillating_jade
  coin: number; // currency.coin (kept as a number; UI can render with currency asset)

  standardMaterial?: number; // Raw Ore / Coarse Fur (slot-dependent)
  breakthroughMaterial1?: number; // Green Gear Enhancement Material 1 (slot-dependent mapping)
  breakthroughMaterial2?: number; // Green Gear Enhancement Material 2 (slot-dependent mapping)

  /**
   * Some enhancement levels require a minimum Gear Tier to proceed.
   * If present, this is the minimum required tier to reach THIS enhancement level.
   */
  requiredGearTier?: number;
}

export interface GearEnhancementTrackState {
  currentLevel: number; // typically 0..max
  included: boolean;
}

export interface GearEnhancementMaterialAmount {
  id: string; // item asset id (items.*)
  amount: number;
}

export interface GearEnhancementTotals {
  coin: number;
  materials: GearEnhancementMaterialAmount[];
}

export interface GearEnhancementUpgradeStep {
  fromLevel: number;
  toLevel: number;

  coin: number;
  materials: GearEnhancementMaterialAmount[];

  // If any level inside this step requires a tier; expose the max requirement in the step range
  requiredGearTier?: number;
}

export interface GearEnhancementTrackProgress {
  fromLevel: number;
  toLevel: number;

  steps: GearEnhancementUpgradeStep[];
  totals: GearEnhancementTotals;

  // Max tier requirement across the entire requested range
  maxRequiredGearTier?: number;
}
