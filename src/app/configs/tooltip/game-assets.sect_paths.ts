import { GameAssetDefinition } from '../../models';

export const SECT_PATHS_ASSETS: GameAssetDefinition[] = [
  {
    id: 'sect_paths.bamboocut_wind',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/bamboocut-wind.png',
    label: 'Bamboocut – Wind Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Assassin-style melee DPS path focused on high-speed burst and mobility, often pairing Infernal Twinblades and Mortal Rope Dart. Leans towards PvP-style aggressive gameplay.',
    game_system_tags: ['path', 'martial', 'assassin', 'melee', 'pvp'],
    ui_usage_notes:
      'Use on guides about burst / assassin builds, especially when recommending Bamboocut – Wind for aggressive players.',
    width: 542,
    height: 158,
    aspect_ratio: '271:79',
  },
  {
    id: 'sect_paths.bellstrike_splendor',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/bellstrike-splendor.png',
    label: 'Bellstrike – Splendor Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Mobile melee DPS path for Nameless Sword + Nameless Spear. Emphasizes fluid combos, repositioning, and consistent damage with strong mobility tools.',
    game_system_tags: ['path', 'martial', 'melee', 'hybrid', 'dps'],
    ui_usage_notes:
      'Use when talking about Bellstrike Splendor breakthrough, related tips, or path-progression advice for Nameless Sword builds.',
    width: 546,
    height: 158,
    aspect_ratio: '273:79',
  },
  {
    id: 'sect_paths.bellstrike_umbra',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/bellstrike-umbra.png',
    label: 'Bellstrike – Umbra Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Bleed-centric melee DPS path often pairing Strategic Sword with Heavenquaker Spear. Focuses on stacking bleed marks and detonating them for huge burst damage.',
    game_system_tags: ['path', 'martial', 'melee', 'bleed', 'dps'],
    ui_usage_notes:
      'Use in high-damage bleed-stacking build writeups or when illustrating Bellstrike – Umbra meta combos.',
    width: 546,
    height: 158,
    aspect_ratio: '273:79',
  },
  {
    id: 'sect_paths.silkbind_deluge',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/silkbind-deluge.png',
    label: 'Silkbind – Deluge Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Ranged healer/support path focused on sustain and revives, typically using Soulshade Umbrella + Panacea Fan. Excels in co-op content and keeping teams alive.',
    game_system_tags: ['path', 'martial', 'healer', 'support', 'ranged', 'coop'],
    ui_usage_notes:
      'Use for healing-oriented build sections, co-op support recommendations, or Path Guide content about Silkbind – Deluge.',
    width: 546,
    height: 162,
    aspect_ratio: '91:27',
  },
  {
    id: 'sect_paths.silkbind_jade',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/silkbind-jade.png',
    label: 'Silkbind – Jade Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Ranged crowd-control DPS path using Vernal Umbrella + Inkwell Fan. Specializes in juggling humanoid enemies and controlling fights from a distance.',
    game_system_tags: ['path', 'martial', 'ranged', 'cc', 'control'],
    ui_usage_notes:
      'Use when describing CC-heavy ranged playstyles or stylish control builds for solo and group play.',
    width: 546,
    height: 162,
    aspect_ratio: '91:27',
  },
  {
    id: 'sect_paths.stonesplit_might',
    category: 'sect_paths',
    file: 'assets/game/sect-paths/stonesplit-might.png',
    label: 'Stonesplit – Might Path',
    kind: 'path-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Tank-oriented path focusing on damage mitigation and control, commonly using Thundercry Blade with Stormbreaker Spear. Designed to absorb damage, hold aggro, and group enemies for AoE.',
    game_system_tags: ['path', 'martial', 'tank', 'defense', 'coop'],
    ui_usage_notes:
      'Use when explaining tank builds, group front-line roles, or Stonesplit – Might progression tips.',
    width: 546,
    height: 158,
    aspect_ratio: '273:79',
  },
];
