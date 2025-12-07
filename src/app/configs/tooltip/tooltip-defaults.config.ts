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
  // System resources (alias → small icons)
  'system.energy': 'system.energy_small',
  'system.stamina': 'system.stamina_small',

  // Currencies
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
  'currency.sin_leaf': 'currency.sin_leaf',
  'currency.sound_jade': 'currency.sound_jade',
  'currency.treasure_token': 'currency.treasure_token',
  'currency.vintage_bookplate': 'currency.vintage_bookplate',
  'currency.reputation': 'currency.reputation',

  // Items
  'items.lingering_melody': 'items.lingering_melody',
  'items.resonating_melody': 'items.resonating_melody',

  // Navigation – simple icons
  'navigation.battle_pass': 'navigation.menu_battle_pass',
  'navigation.draw': 'navigation.draw',
  'navigation.events': 'navigation.events',
  'navigation.journal': 'navigation.journal',
  'navigation.online_mode': 'navigation.online_mode',
  'navigation.shop': 'navigation.shop',
  'navigation.solo_mode': 'navigation.solo_mode',
  'navigation.season': 'navigation.menu_season',

  // Navigation – menu icons
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
  'navigation.menu_menu': 'navigation.menu_menu',
  'navigation.menu_journal': 'navigation.menu_journal',
  'navigation.menu_letter': 'navigation.menu_letter',
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

  // Sect paths
  'sect_paths.bamboocut_wind': 'sect_paths.bamboocut_wind',
  'sect_paths.bellstrike_splendor': 'sect_paths.bellstrike_splendor',
  'sect_paths.bellstrike_umbra': 'sect_paths.bellstrike_umbra',
  'sect_paths.silkbind_deluge': 'sect_paths.silkbind_deluge',
  'sect_paths.silkbind_jade': 'sect_paths.silkbind_jade',
  'sect_paths.stonesplit_might': 'sect_paths.stonesplit_might',

  // System icon variants (big)
  'system.energy_big': 'system.energy',
  'system.stamina_big': 'system.stamina',
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
