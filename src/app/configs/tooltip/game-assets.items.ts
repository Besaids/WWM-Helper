import { GameAssetDefinition } from "../../models";

export const ITEMS_ASSETS: GameAssetDefinition[] = [
  {
    id: 'items.lingering_melody',
    category: 'items',
    file: 'assets/game/items/item-common-lingering-melody.png',
    label: 'Lingering Melody',
    kind: 'gacha-ticket-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Premium gacha ticket used for Celestial Echo draws (the premium banner). Typically purchased with Echo Jade from shops such as Meow Meow’s Shop, Zhao Feiyan’s Warehouse, and Ghostlight Market, and sometimes obtained from passes or bundles fed by Echo Bead top-ups.',
    game_system_tags: ['item', 'gacha_ticket', 'celestial_echo', 'premium'],
    ui_usage_notes:
      'Use whenever a guide or checklist refers to Celestial Echo pulls, premium draws, or advises players how to turn premium currency (Echo Beads → Echo Jade) into banner pulls efficiently.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.resonating_melody',
    category: 'items',
    file: 'assets/game/items/item-common-resonating-melody.png',
    label: 'Resonating Melody',
    kind: 'gacha-ticket-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Standard gacha ticket used for Solemn Echo draws (the regular / free banner). Purchased with Echo Jade and used for Solemn Echo pulls and long-term cosmetic or weapon unlocks.',
    game_system_tags: ['item', 'gacha_ticket', 'solemn_echo', 'free_to_play'],
    ui_usage_notes:
      'Use for grindable / Echo-Jade-based gacha pulls and any advice about turning Echo Jade into regular cosmetics, weapons, and other non-premium draws.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.beautys_garment',
    category: 'items',
    file: 'assets/game/items/item-beautys-garment.png',
    label: "Beauty's Garment",
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A delicate white flower used as a common raw material for cooking and other crafts. Gathered in the wild and sometimes sold by merchants.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use as the default inventory icon when listing Beauty’s Garment costs in cooking or medicine recipes.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.beautys_plume',
    category: 'items',
    file: 'assets/game/items/item-beautys-plume.png',
    label: "Beauty's Plume",
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      "Rare mystic-art breakthrough material obtained from Beauty's Garment nodes and various support boxes or shops. Used to promote several Mystic Skills between tiers.",
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use whenever a Mystic Skill breakthrough cost lists Beauty’s Plume (for example Cloud Steps, Meridian Touch, Serene Breeze, etc.).',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.buddhas_tear',
    category: 'items',
    file: 'assets/game/items/item-buddhas-tear.png',
    label: "Buddha's Tear",
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A dark-red medicinal root that can be consumed or used as a raw material in healing items and other crafts. Gathered in the field or purchased from some vendors.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use when listing Buddha’s Tear as a basic ingredient in medicine, cooking, or early-game healing routes.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.buddhas_tear_root',
    category: 'items',
    file: 'assets/game/items/item-buddhas-tear-root.png',
    label: "Buddha's Tear Root",
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      "Refined Buddha's Tear root used as a dedicated Mystic Skill breakthrough material, especially for flaming-style offensive arts.",
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use for breakthrough cost tables on Mystic Skills that consume Buddha’s Tear Root (for example Flaming Meteor and similar arts).',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.frost_mushroom',
    category: 'items',
    file: 'assets/game/items/item-frost-mushroom.png',
    label: 'Frost Mushroom',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A cold-loving mushroom harvested from snowy areas, used as a general raw material for recipes and medicine, and as the base plant for Mycelium drops.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use when listing Frost Mushroom as a standard ingredient in cooking/medicine or as the common drop paired with Frost Mushroom Mycelium.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.frost_mushroom_mycelium',
    category: 'items',
    file: 'assets/game/items/item-frost-mushroom-mycelium.png',
    label: 'Frost Mushroom Mycelium',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Special breakthrough material derived from Frost Mushrooms. Consumed alongside Ebon Iron to promote certain movement-focused Mystic Skills.',
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use for Ghostly Steps and other Mystic Skill breakthrough cost sections that call for Frost Mushroom Mycelium.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.jade_tower_peony',
    category: 'items',
    file: 'assets/game/items/item-jade-tower-peony.png',
    label: 'Jade Tower Peony',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A Kaifeng specialty white peony used as a high-grade medical and crafting ingredient, and the source plant needed to obtain Jade Tower Pearls.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use as the standard inventory icon when showing Jade Tower Peony costs for medicines (like Yin-Yang Ointment) or gathering requirements for Jade Tower Pearl drops.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.jade_tower_pearl',
    category: 'items',
    file: 'assets/game/items/item-jade-tower-pearl.png',
    label: 'Jade Tower Pearl',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Rare breakthrough collectible formed from the essence of Jade Tower Peony. Used as a Mystic Skill breakthrough material and obtained from support boxes, shops, and rare gathering drops.',
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use for any Mystic Skill tier-promotion cost that lists Jade Tower Pearl (for example Dragon’s Breath, Golden Body, and similar skills).',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.jasmine',
    category: 'items',
    file: 'assets/game/items/item-jasmine.png',
    label: 'Jasmine',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A fragrant white blossom used as a general raw material in crafts and as the base plant for the rare Jasmine Stamen mystic-art material.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use for recipes or material lists that consume regular Jasmine, distinct from the breakthrough-only Jasmine Stamen.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.jasmine_stamen',
    category: 'items',
    file: 'assets/game/items/item-jasmine-stamen.png',
    label: 'Jasmine Stamen',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Extremely rare inner core of the Jasmine flower, used as a dedicated Mystic Skill breakthrough material, especially for Soaring Spin.',
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use when documenting Mystic Skills that promote using Jasmine Stamen, and to distinguish rare breakthrough drops from common Jasmine.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.vicious_flower',
    category: 'items',
    file: 'assets/game/items/item-vicious-flower.png',
    label: 'Vicious Flower',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A sharp-petaled wildflower used as a cooking and crafting ingredient, commonly gathered in the field and tied to various buff-food recipes.',
    game_system_tags: ['item', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use as the basic Vicious Flower material icon for food recipes or generic raw-material lists.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.vicious_fruit',
    category: 'items',
    file: 'assets/game/items/item-vicious-fruit.png',
    label: 'Vicious Fruit',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Mystic-art breakthrough material associated with Vicious Flower, used to promote several offensive Mystic Skills between tiers.',
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use when listing breakthrough materials for Mystic Skills like Blinding Mist, Drunken Poet, and other arts that consume Vicious Fruit.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.ebon_iron',
    category: 'items',
    file: 'assets/game/items/item-ebon-iron.png',
    label: 'Ebon Iron',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Dense black iron ingot used as a core Mystic Skill breakthrough material, usually paired with rarer plant-based items such as Frost Mushroom Mycelium or Jade Tower Pearl.',
    game_system_tags: ['item', 'crafting', 'mystic_skill', 'breakthrough'],
    ui_usage_notes:
      'Use wherever you list shared metal costs for Mystic Skill breakthroughs, as the generic ore component alongside specific herb/pearl materials.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
];
