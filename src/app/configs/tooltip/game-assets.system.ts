import { GameAssetDefinition } from '../../models';

export const SYSTEM_ASSETS: GameAssetDefinition[] = [
  {
    id: 'system.energy',
    category: 'system',
    file: 'assets/game/system/energy.png',
    label: 'Energy',
    kind: 'system-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Account-wide activity resource that gates certain high-value tasks (similar to stamina systems in other online games). Regenerates over time and is spent on repeatable, reward-heavy content such as Campaigns, Outposts, and Sword Trials.',
    game_system_tags: ['system', 'resource', 'daily', 'account_wide'],
    ui_usage_notes:
      'Use wherever the helper references daily/weekly energy spending priorities, capped-content planning, or reminders to avoid wasting Energy at cap.',
    width: 644,
    height: 224,
    aspect_ratio: '23:8',
  },
  {
    id: 'system.stamina',
    category: 'system',
    file: 'assets/game/system/stamina.png',
    label: 'Stamina',
    kind: 'system-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Crafting stamina used when forging gear, cooking, brewing medicine, construction, and other production tasks. Each craft consumes Stamina, which replenishes once per day at the scheduled daily reset.',
    game_system_tags: ['system', 'resource', 'daily', 'crafting', 'profession'],
    ui_usage_notes:
      'Use for anything that talks about crafting limits, daily Stamina refills, or optimizing forge / medicine / cooking batches. Do not use for movement or dodge stamina.',
    width: 748,
    height: 228,
    aspect_ratio: '187:57',
  },
  {
    id: 'system.energy_small',
    category: 'system',
    file: 'assets/game/system/energy-small.png',
    label: 'Energy (Small)',
    kind: 'system-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Account-wide activity resource that gates certain high-value tasks (similar to stamina systems in other online games). Regenerates over time and is spent on repeatable, reward-heavy content.',
    game_system_tags: ['system', 'resource', 'daily', 'account_wide'],
    ui_usage_notes:
      'Compact Energy icon for checklists, tooltips, and tight HUD-style layouts where the full Energy graphic would be too large.',
    width: 200,
    height: 200,
    aspect_ratio: '1:1',
  },
  {
    id: 'system.stamina_small',
    category: 'system',
    file: 'assets/game/system/stamina-small.png',
    label: 'Stamina (Crafting)',
    kind: 'system-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Crafting Stamina icon for forge, cooking, medicine, manuals, and construction UIs. Represents the limited daily pool that refills at the daily reset.',
    game_system_tags: ['system', 'resource', 'daily', 'crafting', 'profession'],
    ui_usage_notes:
      'Use in tight layouts like checklists, tooltips, or inline text when referencing crafting Stamina costs or remaining daily Stamina.',
    width: 200,
    height: 200,
    aspect_ratio: '1:1',
  },
];
