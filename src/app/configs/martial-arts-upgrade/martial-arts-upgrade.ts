import {
  MartialArtDefinition,
  MartialArtsBreakthroughCost,
  MartialArtsLevelCostSegment,
} from '../../models';

export const MARTIAL_ARTS_MAX_LEVEL = 70;

/**
 * IMPORTANT:
 * tipsMaterialId MUST be correct per martial art.
 * I’m wiring the field now so the planner can show the right icon and totals.
 * You can adjust the mapping later once you confirm per-art tips from your sheet/game.
 */
export const MARTIAL_ARTS: MartialArtDefinition[] = [
  {
    id: 'martial_arts.heavenquaker_spear',
    label: 'Heavenquaker Spear',
    tipsMaterialId: 'items.stonesplit_might_tips', // TODO verify
    greenMaterialId: 'items.bluestone_lock',
    blueMaterialId: 'items.wolframite_weight',
  },
  {
    id: 'martial_arts.infernal_twinblades',
    label: 'Infernal Twinblades',
    tipsMaterialId: 'items.bellstrike_umbra_tips', // TODO verify
    greenMaterialId: 'items.bluestone_lock',
    blueMaterialId: 'items.wolframite_weight',
  },
  {
    id: 'martial_arts.inkwell_fan',
    label: 'Inkwell Fan',
    tipsMaterialId: 'items.silkbind_jade_tips', // TODO verify
    greenMaterialId: 'items.pine_resin_ointment',
    blueMaterialId: 'items.scarlet_flame_ointment',
  },
  {
    id: 'martial_arts.mortal_rope_dart',
    label: 'Mortal Rope Dart',
    tipsMaterialId: 'items.bamboocut_wind_tips', // TODO verify
    greenMaterialId: 'items.pine_resin_ointment',
    blueMaterialId: 'items.scarlet_flame_ointment',
  },
  {
    id: 'martial_arts.nameless_spear',
    label: 'Nameless Spear',
    tipsMaterialId: 'items.stonesplit_might_tips', // TODO verify
    greenMaterialId: 'items.bluestone_lock',
    blueMaterialId: 'items.wolframite_weight',
  },
  {
    id: 'martial_arts.nameless_sword',
    label: 'Nameless Sword',
    tipsMaterialId: 'items.bellstrike_splendor_tips', // TODO verify
    greenMaterialId: 'items.pine_resin_ointment',
    blueMaterialId: 'items.scarlet_flame_ointment',
  },
  {
    id: 'martial_arts.panacea_fan',
    label: 'Panacea Fan',
    tipsMaterialId: 'items.silkbind_deluge_tips', // from your screenshot “Silkbind - Deluge”
    greenMaterialId: 'items.pine_resin_ointment',
    blueMaterialId: 'items.scarlet_flame_ointment',
  },
  {
    id: 'martial_arts.soulshade_umbrella',
    label: 'Soulshade Umbrella',
    tipsMaterialId: 'items.bellstrike_umbra_tips', // TODO verify
    greenMaterialId: 'items.tiger_bone_liquor',
    blueMaterialId: 'items.bone_renewal_tonic',
  },
  {
    id: 'martial_arts.stormbreaker_spear',
    label: 'Stormbreaker Spear',
    tipsMaterialId: 'items.stonesplit_might_tips', // TODO verify
    greenMaterialId: 'items.bluestone_lock',
    blueMaterialId: 'items.wolframite_weight',
  },
  {
    id: 'martial_arts.strategic_sword',
    label: 'Strategic Sword',
    tipsMaterialId: 'items.bellstrike_splendor_tips', // TODO verify
    greenMaterialId: 'items.pine_resin_ointment',
    blueMaterialId: 'items.scarlet_flame_ointment',
  },
  {
    id: 'martial_arts.thundercry_blade',
    label: 'Thundercry Blade',
    tipsMaterialId: 'items.bamboocut_wind_tips', // TODO verify
    greenMaterialId: 'items.bluestone_lock',
    blueMaterialId: 'items.wolframite_weight',
  },
  {
    id: 'martial_arts.vernal_umbrella',
    label: 'Vernal Umbrella',
    tipsMaterialId: 'items.bellstrike_umbra_tips', // TODO verify
    greenMaterialId: 'items.tiger_bone_liquor',
    blueMaterialId: 'items.bone_renewal_tonic',
  },
];

export const MARTIAL_ARTS_LEVEL_COST_SEGMENTS: MartialArtsLevelCostSegment[] = [
  { fromLevel: 2, toLevel: 3, coin: 100 },
  { fromLevel: 4, toLevel: 5, coin: 200 },
  { fromLevel: 6, toLevel: 7, coin: 300 },
  { fromLevel: 8, toLevel: 10, coin: 400 },
  { fromLevel: 11, toLevel: 15, coin: 500 },
  { fromLevel: 16, toLevel: 20, coin: 600 },

  { fromLevel: 21, toLevel: 25, coin: 800, greenTier: 1 },
  { fromLevel: 26, toLevel: 30, coin: 1000, greenTier: 1 },
  { fromLevel: 31, toLevel: 35, coin: 1200, greenTier: 2 },
  { fromLevel: 36, toLevel: 40, coin: 1500, greenTier: 2 },
  { fromLevel: 41, toLevel: 45, coin: 2000, greenTier: 4 },
  { fromLevel: 46, toLevel: 50, coin: 3000, greenTier: 4 },
  { fromLevel: 51, toLevel: 55, coin: 6000, greenTier: 6 },
  { fromLevel: 56, toLevel: 60, coin: 8000, greenTier: 6 },
  { fromLevel: 61, toLevel: 65, coin: 12000, greenTier: 6 },
  { fromLevel: 66, toLevel: 70, coin: 15000, greenTier: 6 },
];

export const MARTIAL_ARTS_BREAKTHROUGHS: MartialArtsBreakthroughCost[] = [
  { atLevel: 20, coin: 2000 },

  { atLevel: 30, tips: 2, blueTier: 2 },
  { atLevel: 40, tips: 4, blueTier: 2 },
  { atLevel: 50, tips: 8, blueTier: 3 },
  { atLevel: 55, tips: 12, blueTier: 5 },
  { atLevel: 60, tips: 18, blueTier: 5 },
  { atLevel: 65, tips: 24, blueTier: 10 },
];
