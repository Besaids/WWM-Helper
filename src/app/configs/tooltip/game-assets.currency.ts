import { GameAssetDefinition } from "../../models";

export const CURRENCY_ASSETS: GameAssetDefinition[] = [
  {
    id: 'currency.adventure_slip',
    category: 'currency',
    file: 'assets/game/currency/currency-adventure-slip.png',
    label: 'Adventure Slip',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Co-op and online multiplayer currency (also called Four Seas Letters) used in the Four Seas / Wandering Paths style shops for cosmetics and housing-style rewards. Earned from Wandering Paths runs, co-op bounties, and other online activities; has a weekly cap.',
    game_system_tags: ['currency', 'coop', 'social', 'cosmetics', 'weekly_cap', 'wandering_paths'],
    ui_usage_notes:
      'Use whenever referencing co-op / Wandering Paths rewards, Four Seas shop cosmetics, or weekly multiplayer checklists.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.coin',
    category: 'currency',
    file: 'assets/game/currency/currency-coin.png',
    label: 'Coin',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Generic in-game money (Zhou Coin and regional variants) used for most merchant purchases, fees, and basic services. Lives in the Money Bag tab.',
    game_system_tags: ['currency', 'basic', 'merchant', 'economy'],
    ui_usage_notes:
      'Use as the default money icon for generic costs, vendor purchases, repairs, or other non-premium spending.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.commerce_coin',
    category: 'currency',
    file: 'assets/game/currency/currency-commerce-coin.png',
    label: 'Commerce Coin',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Mini-game and street-vendor currency used for wagers in activities like Pitch Pot, cards, Mahjong, and for buying street food. Also used for buying trade goods and items from commerce coin shop.',
    game_system_tags: ['currency', 'commerce', 'minigame', 'food'],
    ui_usage_notes:
      'Use when a guide or timer refers specifically to mini-game wagers or street food purchases instead of general merchants.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.echo_bead',
    category: 'currency',
    file: 'assets/game/currency/currency-echo-bead.png',
    label: 'Echo Bead',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Top-tier premium currency bought with real money. Used for Celestial Echo pulls and to purchase cash-shop bundles, cosmetics, and other high-end items.',
    game_system_tags: ['currency', 'premium', 'cash_shop', 'gacha'],
    ui_usage_notes:
      'Use for anything that clearly spends real-money premium currency; do not use for free-to-play only paths.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.echo_jade',
    category: 'currency',
    file: 'assets/game/currency/currency-echo-jade.png',
    label: 'Echo Jade',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'High-value earnable premium-like currency used at special merchants and systems, especially the Activity shop. Commonly spent on Internal Arts, power-progression items, cosmetics, and gacha tickets such as Lingering and Resonating Melodies.',
    game_system_tags: ['currency', 'premium_like', 'inner_way', 'gacha', 'economy'],
    ui_usage_notes:
      'Use when describing where to spend Echo Jade efficiently (Internal Arts, Activity shop, gacha tickets, etc.) or when labelling Echo Jade sinks in checklists.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.essence_of_earth',
    category: 'currency',
    file: 'assets/game/currency/currency-essence-of-earth.png',
    label: 'Essence of Earth',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Draw-shop token obtained from Solemn Echo (standard/free) gacha pulls. Spent in the Draw Shop on rewards associated with the Solemn Echo banner.',
    game_system_tags: ['currency', 'gacha', 'draw_shop', 'solemn_echo'],
    ui_usage_notes:
      'Use when a reward comes specifically from the Solemn Echo pool and is purchased via the draw-shop exchange.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.essence_of_heaven',
    category: 'currency',
    file: 'assets/game/currency/currency-essence-of-heaven.png',
    label: 'Essence of Heaven',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Draw-shop token obtained from Celestial Echo (premium) gacha pulls. Used to purchase rewards in the Draw Shop and can be converted towards Harmonic Cores.',
    game_system_tags: ['currency', 'gacha', 'draw_shop', 'celestial_echo', 'premium'],
    ui_usage_notes:
      'Use on guides that talk about Celestial Echo pity, draw-shop exchanges, or Harmonic Core conversion paths.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.fourfold_coin',
    category: 'currency',
    file: 'assets/game/currency/currency-fourfold-coin.png',
    label: 'Fourfold Coin',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Bounty-shop currency earned from NPC and player bounties. Has a weekly cap and is spent in the Bounty Shop on cosmetics, materials, and some account progression.',
    game_system_tags: ['currency', 'bounties', 'coop', 'cosmetics', 'weekly_cap'],
    ui_usage_notes:
      'Use on bounty-related checklist items or when explaining what to buy from the Bounty Shop each week.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.harmonic_core',
    category: 'currency',
    file: 'assets/game/currency/currency-harmonic-core.png',
    label: 'Harmonic Core',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Legendary-tier draw currency from Celestial Echo pulls. Used in the Draw Shop for top-end cosmetics, visual effects, and other rare items. Can be exchanged into Sound Jade.',
    game_system_tags: ['currency', 'gacha', 'draw_shop', 'premium', 'legendary'],
    ui_usage_notes:
      'Use when explaining long-term premium progression, legendary skill effects, or apex draw-shop purchases.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.harmony_charm',
    category: 'currency',
    file: 'assets/game/currency/currency-harmony-charm.png',
    label: 'Harmony Charm',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Social / co-op currency (also called Private Funds of the Ward) with a weekly cap. Earned from co-op play, online mode, partnerships, and NPC quiz-style activities; spent in Brotherhood / Social shops on cosmetics and housing items.',
    game_system_tags: ['currency', 'coop', 'social', 'cosmetics', 'housing', 'weekly_cap'],
    ui_usage_notes:
      'Use on guides about partnerships, Brotherhood cosmetics, and co-op fashion or housing progression.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.jade_fish',
    category: 'currency',
    file: 'assets/game/currency/currency-jade-fish.png',
    label: 'Jade Fish',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Universal activity currency with a high weekly cap, earned from exploration, quests, enemies, chests, and activities. Spent in the Activity shop on Internal Arts, gear, and cosmetics.',
    game_system_tags: ['currency', 'activity', 'season_shop', 'weekly_cap'],
    ui_usage_notes:
      'Use for sections about Activity shop priorities, weekly caps, and general “play anything” income.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.sin_leaf',
    category: 'currency',
    file: 'assets/game/currency/currency-sin-leaf.png',
    label: 'Sin Leaf',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Special currency obtained in places like Perception Forest and used in the Sin Leaf Exchange for certain free-to-play cosmetics and accessories (for example the Yaksha outfit set and some accessories).',
    game_system_tags: ['currency', 'cosmetics', 'exploration', 'sin_leaf_exchange'],
    ui_usage_notes:
      'Use when a cosmetic specifically lists the Sin Leaf Exchange as its source; separates it from Jade or draw-based unlocks.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.sound_jade',
    category: 'currency',
    file: 'assets/game/currency/currency-sound-jade.png',
    label: 'Sound Jade',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'High-end draw-shop currency primarily obtained by exchanging Harmonic Cores (for example 1 Core → 5 Sound Jade). Used to buy legendary skill visual effects and other premium cosmetics in the Draw Shop.',
    game_system_tags: ['currency', 'gacha', 'draw_shop', 'premium'],
    ui_usage_notes:
      'Use on advanced guides about legendary skill VFX, Mirage Boat / event items tied to the Draw Shop, and other endgame cosmetic optimizations.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.treasure_token',
    category: 'currency',
    file: 'assets/game/currency/currency-treasure-token.png',
    label: 'Treasure Token',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Guild currency obtained from Guild Events and capped weekly. Used in the Red Gold Boutique / guild shop to buy cosmetics, Mahjong chip bags, fireworks, and other guild-flavored items.',
    game_system_tags: ['currency', 'guild', 'events', 'cosmetics', 'weekly_cap'],
    ui_usage_notes:
      'Use when describing rewards that require guild participation (Guild Events, Red Gold Boutique purchases, or tracking the weekly Treasure Token cap).',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.vintage_bookplate',
    category: 'currency',
    file: 'assets/game/currency/currency-vintage-bookplate.png',
    label: 'Vintage Bookplate',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Voucher currency earned by recycling unused Inner Way tips. Spent on materials and resources for upgrading Inner Ways and related systems.',
    game_system_tags: ['currency', 'inner_way', 'recycling', 'progression'],
    ui_usage_notes:
      'Use when explaining how to convert duplicate tips into long-term power via Inner Way upgrades and tip recycling.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'currency.reputation',
    category: 'currency',
    file: 'assets/game/currency/currency-reputation.png',
    label: 'Reputation',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Sect reputation currency earned from completing Sect Commands (Jianghu Errands) and other daily sect activities. Spent at sect shops on sect-specific cosmetics, materials, and rewards; capped weekly.',
    game_system_tags: ['currency', 'sects', 'reputation', 'special', 'weekly_cap'],
    ui_usage_notes:
      'Use for any guide or checklist that references Sect Commands, sect reputation caps, or spending in sect shops.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
];
