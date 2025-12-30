import { GearEnhancementLevelCost, GearEnhancementSlotDefinition } from '../../models';

export const GEAR_ENHANCEMENT_MIN_LEVEL = 0;
export const GEAR_ENHANCEMENT_MAX_LEVEL = 30;

/**
 * 8 gear pieces (slots) + their standard & breakthrough material mapping.
 * iconAssetId references src/app/configs/game-assets/game-assets.gear_enhance.ts
 */
export const GEAR_ENHANCEMENT_SLOTS: GearEnhancementSlotDefinition[] = [
  {
    id: 'gear_enhance.left_hand_weapon',
    name: 'Left-Hand Weapon',
    iconAssetId: 'gear_enhance.left_hand_weapon',
    standardMaterialId: 'items.raw_ore',
    breakthroughMaterial1Id: 'items.lethal_crystal',
    breakthroughMaterial2Id: 'items.cold_iron',
  },
  {
    id: 'gear_enhance.right_hand_weapon',
    name: 'Right-Hand Weapon',
    iconAssetId: 'gear_enhance.right_hand_weapon',
    standardMaterialId: 'items.raw_ore',
    breakthroughMaterial1Id: 'items.lethal_crystal',
    breakthroughMaterial2Id: 'items.cold_iron',
  },
  {
    id: 'gear_enhance.disc',
    name: 'Disc',
    iconAssetId: 'gear_enhance.disc',
    standardMaterialId: 'items.raw_ore',
    breakthroughMaterial1Id: 'items.aromatic_jade',
    breakthroughMaterial2Id: 'items.dushan_jade',
  },
  {
    id: 'gear_enhance.pendant',
    name: 'Pendant',
    iconAssetId: 'gear_enhance.pendant',
    standardMaterialId: 'items.raw_ore',
    breakthroughMaterial1Id: 'items.aromatic_jade',
    breakthroughMaterial2Id: 'items.dushan_jade',
  },
  {
    id: 'gear_enhance.helm',
    name: 'Helm',
    iconAssetId: 'gear_enhance.helm',
    standardMaterialId: 'items.coarse_fur',
    breakthroughMaterial1Id: 'items.bear_pelt',
    breakthroughMaterial2Id: 'items.fat_tail_sheepskin',
  },
  {
    id: 'gear_enhance.armor',
    name: 'Armor',
    iconAssetId: 'gear_enhance.armor',
    standardMaterialId: 'items.coarse_fur',
    breakthroughMaterial1Id: 'items.bear_pelt',
    breakthroughMaterial2Id: 'items.fat_tail_sheepskin',
  },
  {
    id: 'gear_enhance.greaves',
    name: 'Greaves',
    iconAssetId: 'gear_enhance.greaves',
    standardMaterialId: 'items.coarse_fur',
    breakthroughMaterial1Id: 'items.bear_pelt',
    breakthroughMaterial2Id: 'items.fat_tail_sheepskin',
  },
  {
    id: 'gear_enhance.bracer',
    name: 'Bracer',
    iconAssetId: 'gear_enhance.bracer',
    standardMaterialId: 'items.coarse_fur',
    breakthroughMaterial1Id: 'items.bear_pelt',
    breakthroughMaterial2Id: 'items.fat_tail_sheepskin',
  },
];

/**
 * Costs to upgrade INTO each enhancement level (1..30).
 * Oscillating Jade + Coin are always used.
 * StandardMaterial is slot-dependent: Raw Ore or Coarse Fur.
 * Breakthrough mats map by slot:
 *  - Breakthrough 1: Lethal Crystal / Aromatic Jade / Bear Pelt
 *  - Breakthrough 2: Cold Iron / Dushan Jade / Fat-Tail Sheepskin
 */
export const GEAR_ENHANCEMENT_LEVEL_COSTS: GearEnhancementLevelCost[] = [
  { level: 1, oscillatingJade: 1, coin: 200, requiredGearTier: 1 },
  { level: 2, oscillatingJade: 3, coin: 400 },
  { level: 3, oscillatingJade: 3, coin: 400, requiredGearTier: 16 },

  { level: 4, oscillatingJade: 4, coin: 600, standardMaterial: 1 },

  { level: 5, oscillatingJade: 5, coin: 1000, breakthroughMaterial1: 1 },

  { level: 6, oscillatingJade: 5, coin: 1000, standardMaterial: 2, requiredGearTier: 31 },
  { level: 7, oscillatingJade: 5, coin: 1000, standardMaterial: 2 },

  { level: 8, oscillatingJade: 5, coin: 1500, standardMaterial: 5 },
  { level: 9, oscillatingJade: 5, coin: 1500, standardMaterial: 5 },

  { level: 10, oscillatingJade: 8, coin: 2500, breakthroughMaterial1: 2 },

  { level: 11, oscillatingJade: 8, coin: 2500, standardMaterial: 5, requiredGearTier: 41 },
  { level: 12, oscillatingJade: 8, coin: 3000, standardMaterial: 5 },
  { level: 13, oscillatingJade: 8, coin: 3000, standardMaterial: 10 },
  { level: 14, oscillatingJade: 8, coin: 3000, standardMaterial: 10 },

  { level: 15, oscillatingJade: 10, coin: 4000, breakthroughMaterial2: 5 },

  { level: 16, oscillatingJade: 10, coin: 4500, standardMaterial: 10, requiredGearTier: 51 },
  { level: 17, oscillatingJade: 10, coin: 4500, standardMaterial: 10 },
  { level: 18, oscillatingJade: 10, coin: 5000, standardMaterial: 15 },
  { level: 19, oscillatingJade: 10, coin: 5000, standardMaterial: 15 },

  { level: 20, oscillatingJade: 15, coin: 8000, breakthroughMaterial2: 5 },

  { level: 21, oscillatingJade: 15, coin: 8500, standardMaterial: 15, requiredGearTier: 56 },
  { level: 22, oscillatingJade: 15, coin: 9000, standardMaterial: 15 },
  { level: 23, oscillatingJade: 15, coin: 9000, standardMaterial: 20 },
  { level: 24, oscillatingJade: 15, coin: 9500, standardMaterial: 20 },

  { level: 25, oscillatingJade: 20, coin: 13000, breakthroughMaterial2: 5 },

  { level: 26, oscillatingJade: 20, coin: 13500, standardMaterial: 20, requiredGearTier: 61 },
  { level: 27, oscillatingJade: 20, coin: 14000, standardMaterial: 20 },
  { level: 28, oscillatingJade: 20, coin: 14500, standardMaterial: 20 },
  { level: 29, oscillatingJade: 20, coin: 15000, standardMaterial: 20 },

  { level: 30, oscillatingJade: 25, coin: 19500, breakthroughMaterial2: 6 },
];
