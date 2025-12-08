// src/app/configs/mystic-skill-upgrade.config.ts

export type MysticSkillCategory = 'offensive' | 'general' | 'movement';

export type MysticSkillRole =
  | 'puzzle'
  | 'area_debuff'
  | 'area_damage'
  | 'single_target_control'
  | 'single_target_burst'
  | 'support'
  | 'general'
  | 'lightness'
  | 'wall_run'
  | 'movement'
  | 'diving';

export type MysticSkillId =
  | 'mystic_skill.abyss_dive'
  | 'mystic_skill.blinding_mist'
  | 'mystic_skill.celestial_seize'
  | 'mystic_skill.cloud_steps'
  | 'mystic_skill.divine_counter'
  | 'mystic_skill.dragon_head'
  | 'mystic_skill.dragons_breath'
  | 'mystic_skill.drunken_poet'
  | 'mystic_skill.fan_glider'
  | 'mystic_skill.flaming_meteor'
  | 'mystic_skill.free_morph'
  | 'mystic_skill.ghost_bind'
  | 'mystic_skill.ghostly_steps'
  | 'mystic_skill.glow_of_fireflies'
  | 'mystic_skill.golden_body'
  | 'mystic_skill.guardian_palm'
  | 'mystic_skill.honking_havoc'
  | 'mystic_skill.leaping_toad'
  | 'mystic_skill.lions_roar'
  | 'mystic_skill.meridian_touch'
  | 'mystic_skill.meteor_flight'
  | 'mystic_skill.mighty_drop'
  | 'mystic_skill.safe_mighty_drop'
  | 'mystic_skill.serene_breeze'
  | 'mystic_skill.skywalk_dash'
  | 'mystic_skill.soaring_spin'
  | 'mystic_skill.star_shift'
  | 'mystic_skill.still_waters'
  | 'mystic_skill.tai_chi'
  | 'mystic_skill.talon_strike'
  | 'mystic_skill.thousand_mile_flight'
  | 'mystic_skill.threefold_skywalk'
  | 'mystic_skill.touch_of_death'
  | 'mystic_skill.veil_of_stillness'
  | 'mystic_skill.wallstride_shadowdash'
  | 'mystic_skill.wallstride_swiftstride'
  | 'mystic_skill.wind_rider'
  | 'mystic_skill.wind_sense'
  | 'mystic_skill.wolflike_frenzy'
  | 'mystic_skill.yaksha_rush';

export type MysticBreakthroughItemId =
  | 'items.beautys_plume'
  | 'items.buddhas_tear_root'
  | 'items.frost_mushroom_mycelium'
  | 'items.jade_tower_pearl'
  | 'items.jasmine_stamen'
  | 'items.vicious_fruit';

export interface MysticSkillUpgradeConfig {
  id: MysticSkillId;
  upgradeable: boolean;
  category: MysticSkillCategory;
  role: MysticSkillRole;
  /** Breakthrough material item id for this skill (rare drop, not base flower). */
  materialItemId?: MysticBreakthroughItemId;
}

/**
 * All 40 mystic skills, with upgradeability flags and breakthrough material mapping
 * for the ones that actually upgrade via plant + Ebon Iron.
 */
export const MYSTIC_SKILL_UPGRADES: MysticSkillUpgradeConfig[] = [
  {
    id: 'mystic_skill.abyss_dive',
    upgradeable: false,
    category: 'movement',
    role: 'diving',
  },
  {
    id: 'mystic_skill.blinding_mist',
    upgradeable: true,
    category: 'offensive',
    role: 'support',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.celestial_seize',
    upgradeable: true,
    category: 'offensive',
    role: 'puzzle',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.cloud_steps',
    upgradeable: true,
    category: 'offensive',
    role: 'puzzle',
    materialItemId: 'items.beautys_plume',
  },
  {
    id: 'mystic_skill.divine_counter',
    upgradeable: false,
    category: 'general',
    role: 'general',
  },
  {
    id: 'mystic_skill.dragon_head',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_burst',
    materialItemId: 'items.jade_tower_pearl',
  },
  {
    id: 'mystic_skill.dragons_breath',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_burst',
    materialItemId: 'items.jade_tower_pearl',
  },
  {
    id: 'mystic_skill.drunken_poet',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_burst',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.fan_glider',
    upgradeable: false,
    category: 'movement',
    role: 'lightness',
  },
  {
    id: 'mystic_skill.flaming_meteor',
    upgradeable: true,
    category: 'offensive',
    role: 'area_damage',
    materialItemId: 'items.buddhas_tear_root',
  },
  {
    id: 'mystic_skill.free_morph',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_control',
    materialItemId: 'items.buddhas_tear_root',
  },
  {
    id: 'mystic_skill.ghost_bind',
    upgradeable: true,
    category: 'offensive',
    role: 'area_damage',
    materialItemId: 'items.jade_tower_pearl',
  },
  {
    id: 'mystic_skill.ghostly_steps',
    upgradeable: true,
    category: 'offensive',
    role: 'support',
    materialItemId: 'items.frost_mushroom_mycelium',
  },
  {
    id: 'mystic_skill.glow_of_fireflies',
    upgradeable: false,
    category: 'offensive',
    role: 'support',
  },
  {
    id: 'mystic_skill.golden_body',
    upgradeable: true,
    category: 'offensive',
    role: 'support',
    materialItemId: 'items.jade_tower_pearl',
  },
  {
    id: 'mystic_skill.guardian_palm',
    upgradeable: true,
    category: 'offensive',
    role: 'area_damage',
    materialItemId: 'items.buddhas_tear_root',
  },
  {
    id: 'mystic_skill.honking_havoc',
    upgradeable: true,
    category: 'offensive',
    role: 'support',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.leaping_toad',
    upgradeable: true,
    category: 'offensive',
    role: 'area_debuff',
    materialItemId: 'items.beautys_plume',
  },
  {
    id: 'mystic_skill.lions_roar',
    upgradeable: true,
    category: 'offensive',
    role: 'area_debuff',
    materialItemId: 'items.buddhas_tear_root',
  },
  {
    id: 'mystic_skill.meridian_touch',
    upgradeable: true,
    category: 'offensive',
    role: 'puzzle',
    materialItemId: 'items.beautys_plume',
  },
  {
    id: 'mystic_skill.meteor_flight',
    upgradeable: false,
    category: 'movement',
    role: 'lightness',
  },
  {
    id: 'mystic_skill.mighty_drop',
    upgradeable: false,
    category: 'movement',
    role: 'movement',
  },
  {
    id: 'mystic_skill.safe_mighty_drop',
    upgradeable: false,
    category: 'movement',
    role: 'movement',
  },
  {
    id: 'mystic_skill.serene_breeze',
    upgradeable: true,
    category: 'offensive',
    role: 'support',
    materialItemId: 'items.beautys_plume',
  },
  {
    id: 'mystic_skill.skywalk_dash',
    upgradeable: false,
    category: 'movement',
    role: 'movement',
  },
  {
    id: 'mystic_skill.soaring_spin',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_control',
    materialItemId: 'items.jasmine_stamen',
  },
  {
    id: 'mystic_skill.star_shift',
    upgradeable: false, // upgrades via other means; not plant-based
    category: 'general',
    role: 'general',
  },
  {
    id: 'mystic_skill.still_waters',
    upgradeable: false,
    category: 'general',
    role: 'general',
  },
  {
    id: 'mystic_skill.tai_chi',
    upgradeable: true,
    category: 'offensive',
    role: 'puzzle',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.talon_strike',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_control',
    materialItemId: 'items.vicious_fruit',
  },
  {
    id: 'mystic_skill.thousand_mile_flight',
    upgradeable: false,
    category: 'movement',
    role: 'lightness',
  },
  {
    id: 'mystic_skill.threefold_skywalk',
    upgradeable: false,
    category: 'movement',
    role: 'movement',
  },
  {
    id: 'mystic_skill.touch_of_death',
    upgradeable: true,
    category: 'general',
    role: 'general',
    materialItemId: 'items.beautys_plume',
  },
  {
    id: 'mystic_skill.veil_of_stillness',
    upgradeable: false,
    category: 'offensive',
    role: 'support',
  },
  {
    id: 'mystic_skill.wallstride_shadowdash',
    upgradeable: false,
    category: 'movement',
    role: 'wall_run',
  },
  {
    id: 'mystic_skill.wallstride_swiftstride',
    upgradeable: false,
    category: 'movement',
    role: 'wall_run',
  },
  {
    id: 'mystic_skill.wind_rider',
    upgradeable: false,
    category: 'movement',
    role: 'lightness',
  },
  {
    id: 'mystic_skill.wind_sense',
    upgradeable: false,
    category: 'general',
    role: 'general',
  },
  {
    id: 'mystic_skill.wolflike_frenzy',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_control',
    materialItemId: 'items.jade_tower_pearl',
  },
  {
    id: 'mystic_skill.yaksha_rush',
    upgradeable: true,
    category: 'offensive',
    role: 'single_target_control',
    materialItemId: 'items.buddhas_tear_root',
  },
];

// Base flower ↔ rare breakthrough item ↔ gathering node.

export interface MysticPlantPairing {
  baseItemId: string; // e.g. 'items.jade_tower_peony'
  rareDropItemId: string; // e.g. 'items.jade_tower_pearl'
  gatheringNodeId: string; // e.g. 'gathering.jade_tower_peony'
}

export const MYSTIC_PLANT_PAIRINGS: MysticPlantPairing[] = [
  {
    baseItemId: 'items.beautys_garment',
    rareDropItemId: 'items.beautys_plume',
    gatheringNodeId: 'gathering.beautys_garment',
  },
  {
    baseItemId: 'items.buddhas_tear',
    rareDropItemId: 'items.buddhas_tear_root',
    gatheringNodeId: 'gathering.buddhas_tear',
  },
  {
    baseItemId: 'items.frost_mushroom',
    rareDropItemId: 'items.frost_mushroom_mycelium',
    gatheringNodeId: 'gathering.frost_mushroom',
  },
  {
    baseItemId: 'items.jade_tower_peony',
    rareDropItemId: 'items.jade_tower_pearl',
    gatheringNodeId: 'gathering.jade_tower_peony',
  },
  {
    baseItemId: 'items.jasmine',
    rareDropItemId: 'items.jasmine_stamen',
    gatheringNodeId: 'gathering.jasmine',
  },
  {
    baseItemId: 'items.vicious_flower',
    rareDropItemId: 'items.vicious_fruit',
    gatheringNodeId: 'gathering.vicious_flower',
  },
];

// Tier costs (global, known up to T3 herb amounts; T4 herb TBD).

export interface MysticTierCost {
  tier: 1 | 2 | 3 | 4;
  ironLevel: 1 | 2 | 3 | 4;
  /** Ebon Iron per rank in this tier. */
  ironPerRank: number;
  /** Total ranks in this tier (including breakthrough rank). */
  ranksPerTier: number; // currently always 10
  /**
   * Breakthrough material count for the 9→10 step in this tier.
   * Undefined where the game does not use plant breakthroughs (or unknown).
   */
  breakthroughItemCount?: number;
}

export const MYSTIC_MAX_TIER = 4;
export const MYSTIC_MAX_RANK_PER_TIER = 10;

export const MYSTIC_TIER_COSTS: MysticTierCost[] = [
  {
    tier: 1,
    ironLevel: 1,
    ironPerRank: 2,
    ranksPerTier: 10,
    breakthroughItemCount: 5, // T1 → T2
  },
  {
    tier: 2,
    ironLevel: 2,
    ironPerRank: 4,
    ranksPerTier: 10,
    breakthroughItemCount: 15, // T2 → T3
  },
  {
    tier: 3,
    ironLevel: 3,
    ironPerRank: 10,
    ranksPerTier: 10,
    breakthroughItemCount: 18, // T3 → T4
  },
  {
    tier: 4,
    ironLevel: 4,
    ironPerRank: 20,
    ranksPerTier: 10,
    // breakthroughItemCount: undefined; // T4→T5 unknown / not in global yet
  },
];
