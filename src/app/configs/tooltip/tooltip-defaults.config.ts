import { GameAssetDefinition, TooltipConfigMap } from '../../models';
import { GAME_ASSETS } from './game-assets';

/**
 * Index the game assets by ID for quick lookup.
 */
const GAME_ASSETS_BY_ID: Record<string, GameAssetDefinition> = GAME_ASSETS.reduce(
  (acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  },
  {} as Record<string, GameAssetDefinition>,
);

/**
 * Map tooltip IDs -> asset IDs.
 * Left side: the key you use in templates (e.g. "system.energy").
 * Right side: the asset.id from GAME_ASSETS.
 */
const ASSET_TOOLTIP_BINDINGS: Record<string, string> = {
  // System
  'system.energy': 'system.energy',
  'system.energy_small': 'system.energy_small',
  'system.stamina': 'system.stamina',
  'system.stamina_small': 'system.stamina_small',
  'system.energy_big': 'system.energy',
  'system.stamina_big': 'system.stamina',

  // Currency
  'currency.adventure_slip': 'currency.adventure_slip',
  'currency.coin': 'currency.coin',
  'currency.commerce_coin': 'currency.commerce_coin',
  'currency.echo_bead': 'currency.echo_bead',
  'currency.echo_jade': 'currency.echo_jade',
  'currency.essence_of_earth': 'currency.essence_of_earth',
  'currency.essence_of_heaven': 'currency.essence_of_heaven',
  'currency.fourfold_coin': 'currency.fourfold_coin',
  'currency.harmonic_core': 'currency.harmonic_core',
  'currency.harmony_charm': 'currency.harmony_charm',
  'currency.jade_fish': 'currency.jade_fish',
  'currency.reputation': 'currency.reputation',
  'currency.sin_leaf': 'currency.sin_leaf',
  'currency.sound_jade': 'currency.sound_jade',
  'currency.treasure_token': 'currency.treasure_token',
  'currency.vintage_bookplate': 'currency.vintage_bookplate',

  // Gathering nodes
  'gathering.beautys_garment': 'gathering.beautys_garment',
  'gathering.buddhas_tear': 'gathering.buddhas_tear',
  'gathering.frost_mushroom': 'gathering.frost_mushroom',
  'gathering.jade_tower_peony': 'gathering.jade_tower_peony',
  'gathering.jasmine': 'gathering.jasmine',
  'gathering.vicious_flower': 'gathering.vicious_flower',

  // Items
  'items.beautys_garment': 'items.beautys_garment',
  'items.beautys_plume': 'items.beautys_plume',
  'items.buddhas_tear': 'items.buddhas_tear',
  'items.buddhas_tear_root': 'items.buddhas_tear_root',
  'items.chicken_noodles': 'items.chicken_noodles',
  'items.ebon_iron': 'items.ebon_iron',
  'items.frost_mushroom': 'items.frost_mushroom',
  'items.frost_mushroom_mycelium': 'items.frost_mushroom_mycelium',
  'items.jade_tower_pearl': 'items.jade_tower_pearl',
  'items.jade_tower_peony': 'items.jade_tower_peony',
  'items.jasmine': 'items.jasmine',
  'items.jasmine_stamen': 'items.jasmine_stamen',
  'items.lingering_melody': 'items.lingering_melody',
  'items.resonating_melody': 'items.resonating_melody',
  'items.snail_meat': 'items.snail_meat',
  'items.vicious_flower': 'items.vicious_flower',
  'items.vicious_fruit': 'items.vicious_fruit',

  // Navigation (simple + menu icons)
  'navigation.battle_pass': 'navigation.battle_pass',
  'navigation.draw': 'navigation.draw',
  'navigation.events': 'navigation.events',
  'navigation.journal': 'navigation.journal',

  'navigation.menu_appearance': 'navigation.menu_appearance',
  'navigation.menu_bag': 'navigation.menu_bag',
  'navigation.menu_battle_pass': 'navigation.menu_battle_pass',
  'navigation.menu_compendium': 'navigation.menu_compendium',
  'navigation.menu_develop': 'navigation.menu_develop',
  'navigation.menu_draw': 'navigation.menu_draw',
  'navigation.menu_emotes': 'navigation.menu_emotes',
  'navigation.menu_events': 'navigation.menu_events',
  'navigation.menu_exit': 'navigation.menu_exit',
  'navigation.menu_feedback': 'navigation.menu_feedback',
  'navigation.menu_guide': 'navigation.menu_guide',
  'navigation.menu_guild': 'navigation.menu_guild',
  'navigation.menu_journal': 'navigation.menu_journal',
  'navigation.menu_letter': 'navigation.menu_letter',
  'navigation.menu_menu': 'navigation.menu_menu',
  'navigation.menu_photo': 'navigation.menu_photo',
  'navigation.menu_profession': 'navigation.menu_profession',
  'navigation.menu_quest': 'navigation.menu_quest',
  'navigation.menu_season': 'navigation.menu_season',
  'navigation.menu_sects': 'navigation.menu_sects',
  'navigation.menu_settings': 'navigation.menu_settings',
  'navigation.menu_shop': 'navigation.menu_shop',
  'navigation.menu_social': 'navigation.menu_social',
  'navigation.menu_time': 'navigation.menu_time',
  'navigation.menu_wandering_paths': 'navigation.menu_wandering_paths',

  'navigation.online_mode': 'navigation.online_mode',
  'navigation.shop': 'navigation.shop',
  'navigation.solo_mode': 'navigation.solo_mode',

  // Sect paths
  'sect_paths.bamboocut_wind': 'sect_paths.bamboocut_wind',
  'sect_paths.bellstrike_splendor': 'sect_paths.bellstrike_splendor',
  'sect_paths.bellstrike_umbra': 'sect_paths.bellstrike_umbra',
  'sect_paths.silkbind_deluge': 'sect_paths.silkbind_deluge',
  'sect_paths.silkbind_jade': 'sect_paths.silkbind_jade',
  'sect_paths.stonesplit_might': 'sect_paths.stonesplit_might',

  // Inner Ways
  'inner_way.adaptive_steel': 'inner_way.adaptive_steel',
  'inner_way.art_of_resistance': 'inner_way.art_of_resistance',
  'inner_way.battle_anthem': 'inner_way.battle_anthem',
  'inner_way.bitter_seasons': 'inner_way.bitter_seasons',
  'inner_way.blossom_barrage': 'inner_way.blossom_barrage',
  'inner_way.breaking_point': 'inner_way.breaking_point',
  'inner_way.divine_roulette': 'inner_way.divine_roulette',
  'inner_way.echoes_of_oblivion': 'inner_way.echoes_of_oblivion',
  'inner_way.envigorated_warrior': 'inner_way.envigorated_warrior',
  'inner_way.esoteric_revival': 'inner_way.esoteric_revival',
  'inner_way.evasive_charge': 'inner_way.evasive_charge',
  'inner_way.evening_snow': 'inner_way.evening_snow',
  'inner_way.exquisite_scenery': 'inner_way.exquisite_scenery',
  'inner_way.fivefold_bleed': 'inner_way.fivefold_bleed',
  'inner_way.flying_gourds': 'inner_way.flying_gourds',
  'inner_way.fury_harvest': 'inner_way.fury_harvest',
  'inner_way.insightful_strike': 'inner_way.insightful_strike',
  'inner_way.mending_loom': 'inner_way.mending_loom',
  'inner_way.morale_chant': 'inner_way.morale_chant',
  'inner_way.mountains_might': 'inner_way.mountains_might',
  'inner_way.restoring_blossom': 'inner_way.restoring_blossom',
  'inner_way.riptide_reflex': 'inner_way.riptide_reflex',
  'inner_way.rock_solid': 'inner_way.rock_solid',
  'inner_way.royal_remedy': 'inner_way.royal_remedy',
  'inner_way.seasonal_edge': 'inner_way.seasonal_edge',
  'inner_way.shadow_assault': 'inner_way.shadow_assault',
  'inner_way.star_reacher': 'inner_way.star_reacher',
  'inner_way.steadfast_stance': 'inner_way.steadfast_stance',
  'inner_way.sword_horizon': 'inner_way.sword_horizon',
  'inner_way.sword_morph': 'inner_way.sword_morph',
  'inner_way.thunderous_bloom': 'inner_way.thunderous_bloom',
  'inner_way.trapped_beast': 'inner_way.trapped_beast',
  'inner_way.vendetta': 'inner_way.vendetta',
  'inner_way.vital_leech': 'inner_way.vital_leech',
  'inner_way.wildfire_spark': 'inner_way.wildfire_spark',
  'inner_way.wind_beneath_wings': 'inner_way.wind_beneath_wings',
  'inner_way.wolfchasers_art': 'inner_way.wolfchasers_art',

  // Mystic Skills
  'mystic_skill.abyss_dive': 'mystic_skill.abyss_dive',
  'mystic_skill.blinding_mist': 'mystic_skill.blinding_mist',
  'mystic_skill.celestial_seize': 'mystic_skill.celestial_seize',
  'mystic_skill.cloud_steps': 'mystic_skill.cloud_steps',
  'mystic_skill.divine_counter': 'mystic_skill.divine_counter',
  'mystic_skill.dragon_head': 'mystic_skill.dragon_head',
  'mystic_skill.dragons_breath': 'mystic_skill.dragons_breath',
  'mystic_skill.drunken_poet': 'mystic_skill.drunken_poet',
  'mystic_skill.fan_glider': 'mystic_skill.fan_glider',
  'mystic_skill.flaming_meteor': 'mystic_skill.flaming_meteor',
  'mystic_skill.free_morph': 'mystic_skill.free_morph',
  'mystic_skill.ghost_bind': 'mystic_skill.ghost_bind',
  'mystic_skill.ghostly_steps': 'mystic_skill.ghostly_steps',
  'mystic_skill.glow_of_fireflies': 'mystic_skill.glow_of_fireflies',
  'mystic_skill.golden_body': 'mystic_skill.golden_body',
  'mystic_skill.guardian_palm': 'mystic_skill.guardian_palm',
  'mystic_skill.honking_havoc': 'mystic_skill.honking_havoc',
  'mystic_skill.leaping_toad': 'mystic_skill.leaping_toad',
  'mystic_skill.lions_roar': 'mystic_skill.lions_roar',
  'mystic_skill.meridian_touch': 'mystic_skill.meridian_touch',
  'mystic_skill.meteor_flight': 'mystic_skill.meteor_flight',
  'mystic_skill.mighty_drop': 'mystic_skill.mighty_drop',
  'mystic_skill.safe_mighty_drop': 'mystic_skill.safe_mighty_drop',
  'mystic_skill.serene_breeze': 'mystic_skill.serene_breeze',
  'mystic_skill.skywalk_dash': 'mystic_skill.skywalk_dash',
  'mystic_skill.soaring_spin': 'mystic_skill.soaring_spin',
  'mystic_skill.star_shift': 'mystic_skill.star_shift',
  'mystic_skill.still_waters': 'mystic_skill.still_waters',
  'mystic_skill.tai_chi': 'mystic_skill.tai_chi',
  'mystic_skill.talon_strike': 'mystic_skill.talon_strike',
  'mystic_skill.thousand_mile_flight': 'mystic_skill.thousand_mile_flight',
  'mystic_skill.threefold_skywalk': 'mystic_skill.threefold_skywalk',
  'mystic_skill.touch_of_death': 'mystic_skill.touch_of_death',
  'mystic_skill.veil_of_stillness': 'mystic_skill.veil_of_stillness',
  'mystic_skill.wallstride_shadowdash': 'mystic_skill.wallstride_shadowdash',
  'mystic_skill.wallstride_swiftstride': 'mystic_skill.wallstride_swiftstride',
  'mystic_skill.wind_rider': 'mystic_skill.wind_rider',
  'mystic_skill.wind_sense': 'mystic_skill.wind_sense',
  'mystic_skill.wolflike_frenzy': 'mystic_skill.wolflike_frenzy',
  'mystic_skill.yaksha_rush': 'mystic_skill.yaksha_rush',
};

/**
 * Static (non-asset) tooltips: hand-written once, reused everywhere.
 */
export const STATIC_TOOLTIPS: TooltipConfigMap = {
  'common.open_guide': {
    title: 'Open Guide',
    description: 'Go to the guide for more information about this feature.',
    variant: 'controlHint',
  },

  // Home / generic timer controls
  'timer.details-button': {
    title: 'View timer details',
    description: 'Show information about when and why this timer matters.',
    variant: 'controlHint',
  },
  'timer.toggle': {
    title: 'Show in timer strip',
    description: 'Enable to display this timer in the strip at the top of the page.',
    variant: 'controlHint',
  },

  // Timer strip state indicators
  'timer-badge.event': {
    title: 'Custom Event',
    description: 'This is a custom event timer you created.',
    variant: 'controlHint',
  },
  'timer-badge.active': {
    title: 'Active Timer',
    description: 'This event or window is currently open and available.',
    variant: 'controlHint',
  },
  'timer-state.warning': {
    title: 'Starting Soon',
    description:
      'This timer will reset or become available within 30 minutes. The color shifts from yellow to red as time runs out.',
    variant: 'controlHint',
  },
  'timer-state.urgent': {
    title: 'Expiring Now',
    description: 'This timer is expiring or starting within 10 minutes.',
    variant: 'controlHint',
  },

  // Control hints
  'checklist.pin': {
    title: 'Pin to Home',
    description:
      'Pin this task to show it on the Home page. Pinned tasks appear in a separate section for quick access.',
    variant: 'controlHint',
  },
  'checklist.hide': {
    title: 'Hide task',
    description:
      'Move this task to the Hidden section at the bottom. Use this for tasks you want to keep but not see in the main list.',
    variant: 'controlHint',
  },
  'checklist.edit': {
    title: 'Edit custom item',
    description: 'Edit the label, description, and frequency of this custom checklist item.',
    variant: 'controlHint',
  },
  'checklist.delete': {
    title: 'Delete custom item',
    description: 'Permanently delete this custom checklist item.',
    variant: 'controlHint',
  },
  'checklist.completion-count': {
    title: 'Completion count',
    description:
      "Number of times you've completed this task in the current cycle (daily/weekly/seasonal).",
    variant: 'controlHint',
  },
  'checklist.view-simple': {
    title: 'Simple view',
    description: 'Show only task labels for a compact, scannable list.',
    variant: 'controlHint',
  },
  'checklist.view-detailed': {
    title: 'Detailed view',
    description: 'Show task labels and descriptions with full context and guide links.',
    variant: 'controlHint',
  },
  'checklist.reset': {
    title: 'Reset checklist',
    description:
      'Uncheck all tasks in this checklist. Useful if you want to start fresh or accidentally checked items.',
    variant: 'controlHint',
  },
};

/**
 * Build tooltip configs from the GAME_ASSETS config.
 */
export function buildAssetTooltips(): TooltipConfigMap {
  const result: TooltipConfigMap = {};

  for (const [tooltipId, assetId] of Object.entries(ASSET_TOOLTIP_BINDINGS)) {
    const asset = GAME_ASSETS_BY_ID[assetId];

    if (!asset) {
      // Optional: make this throw if you want fail-fast:
      // throw new Error(`No asset found for tooltip binding: ${tooltipId} -> ${assetId}`);
      continue;
    }

    result[tooltipId] = {
      imageUrl: asset.file,
      title: asset.label,
      description: asset.description,
      variant: asset.tooltip_variant ?? 'inlineInfo',
    };
  }

  return result;
}

/**
 * Single helper that returns *all* default tooltips merged.
 */
export function getDefaultTooltips(): TooltipConfigMap {
  return {
    ...STATIC_TOOLTIPS,
    ...buildAssetTooltips(),
  };
}
