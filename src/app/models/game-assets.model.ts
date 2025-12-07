import { TooltipVariant } from './tooltip.model';

// High-level buckets for your assets
export type GameAssetCategory = 'currency' | 'items' | 'navigation' | 'sect_paths' | 'system';

// How the icon is used / drawn in UI
export type GameAssetKind =
  | 'currency-icon'
  | 'gacha-ticket-icon'
  | 'nav-icon'
  | 'menu-nav-icon'
  | 'path-icon'
  | 'system-icon';

// Tags used for filtering / grouping across systems
export type GameSystemTag =
  | 'currency'
  | 'coop'
  | 'social'
  | 'cosmetics'
  | 'weekly_cap'
  | 'wandering_paths'
  | 'basic'
  | 'merchant'
  | 'economy'
  | 'commerce'
  | 'minigame'
  | 'food'
  | 'premium'
  | 'cash_shop'
  | 'gacha'
  | 'premium_like'
  | 'inner_way'
  | 'draw_shop'
  | 'solemn_echo'
  | 'celestial_echo'
  | 'bounties'
  | 'legendary'
  | 'housing'
  | 'activity'
  | 'season_shop'
  | 'exploration'
  | 'sin_leaf_exchange'
  | 'guild'
  | 'recycling'
  | 'progression'
  | 'item'
  | 'gacha_ticket'
  | 'navigation'
  | 'menu'
  | 'battle_pass'
  | 'season'
  | 'events'
  | 'journal'
  | 'quests'
  | 'appearance'
  | 'inventory'
  | 'guide'
  | 'emotes'
  | 'feedback'
  | 'mode'
  | 'online'
  | 'solo'
  | 'path'
  | 'martial'
  | 'assassin'
  | 'melee'
  | 'pvp'
  | 'ranged'
  | 'hybrid'
  | 'dps'
  | 'healer'
  | 'support'
  | 'cc'
  | 'control'
  | 'tank'
  | 'defense'
  | 'system'
  | 'resource'
  | 'daily'
  | 'account_wide'
  | 'crafting'
  | 'profession'
  | 'sects'
  | 'reputation'
  | 'special'
  | 'time'
  | 'resets'
  | 'free_to_play'
  | 'draw'
  | 'exit'
  | 'mail'
  | 'photo'
  | 'settings'
  | 'shop'
  | 'bleed'
  | 'ghost_market'
  | 'treasure_money';

// Enforce the "7:6", "1:1" style strings
export type AspectRatioString = `${number}:${number}`;

// Core asset definition model
export interface GameAssetDefinition {
  /** Unique ID like "currency.echo_bead" */
  id: string;
  /** Top-level category (currency, items, navigation, etc.) */
  category: GameAssetCategory;
  /** Relative path under /assets */
  file: string;
  /** Human-readable label ("Echo Bead", "Battle Pass", etc.) */
  label: string;
  /** UI usage kind (currency-icon, system-icon, nav-icon, etc.) */
  kind: GameAssetKind;
  /** Source metadata ("Where Winds Meet (in-game capture)") */
  source: string;
  /** Short description of what it is / where it’s used in-game */
  description: string;
  /** Cross-system tags for filtering and grouping */
  game_system_tags: GameSystemTag[];
  /** Notes on how you intend to use it in the helper UI */
  ui_usage_notes: string;
  /** Pixel dimensions of the source asset */
  width: number;
  height: number;
  /** W x H as a string ratio like "7:6", "1:1", etc. */
  aspect_ratio: AspectRatioString;
  tooltip_variant?: TooltipVariant;
}
