import { GameAssetDefinition } from '../../models';

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
  {
    id: 'items.snail_meat',
    category: 'items',
    file: 'assets/game/items/item-snail-meat.png',
    label: 'Snail Meat',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Cooked snail dish bought from food vendors. When eaten, it gives a small boost to herb gathering efficiency by adding a chance to obtain extra plants for a short period.',
    game_system_tags: ['item', 'food', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use for guides or checklists that mention cheap gathering buffs; note that it boosts extra herb harvest chance for a limited time and counts as a food effect.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.chicken_noodles',
    category: 'items',
    file: 'assets/game/items/item-chicken-noodles.png',
    label: 'Chicken Noodles',
    kind: 'material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Hearty noodle dish sold by food vendors that temporarily increases herb gathering yield, giving a higher chance for extra harvests at the cost of a shorter duration.',
    game_system_tags: ['item', 'food', 'crafting', 'profession', 'exploration'],
    ui_usage_notes:
      'Use wherever you discuss stronger but shorter gathering buffs; this food improves the odds of extra herb drops but still shares the single active food-effect limit.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  //
  // Tickets / tokens / profession
  //
  {
    id: 'items.activity_appearance_ticket',
    category: 'items',
    file: 'assets/game/items/item-activity-appearance-ticket.png',
    label: 'Activity Appearance Ticket',
    kind: 'ticket-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Special appearance currency earned from Energy-based activities such as outposts and certain Campaign chests. Redeemed in the Season or related shops for cosmetic Appearances and visual rewards.',
    game_system_tags: ['item', 'currency', 'appearance', 'ticket', 'season_shop', 'outpost'],
    ui_usage_notes:
      'Use whenever a guide talks about farming appearance tickets, Energy activities that pay out cosmetic currency, or shop costs tied specifically to “Activity Appearance Ticket”.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.activity_appearance_ticket_description',
    category: 'items',
    file: 'assets/game/items/item-activity-appearance-ticket-description.png',
    label: 'Activity Appearance Ticket – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card summarising what Activity Appearance Tickets are used for and where they are obtained.',
    game_system_tags: ['item', 'guide_card', 'appearance', 'ticket', 'season_shop', 'outpost'],
    ui_usage_notes:
      'Use in cosmetics/appearance guides when you want a visual “what & where” explainer for Activity Appearance Tickets instead of only the small icon.',
    width: 1720,
    height: 1272,
    aspect_ratio: '215:159',
  },
  {
    id: 'items.bounty_token',
    category: 'items',
    file: 'assets/game/items/item-bounty-token.png',
    label: 'Bounty Token',
    kind: 'token-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Token used to post or interact with bounty missions. Consumed when placing bounties and obtained from activities that involve hunting targets or resolving accusations.',
    game_system_tags: ['item', 'currency', 'bounty', 'wanted', 'pvp'],
    ui_usage_notes:
      'Use for any explanation of bounty posting, bounty-related currencies, or guides that describe how many Bounty Tokens are needed for different bounty activities.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.bounty_token_description',
    category: 'items',
    file: 'assets/game/items/item-bounty-token-description.png',
    label: 'Bounty Token – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card explaining the basic function of Bounty Tokens and the main sources that award them.',
    game_system_tags: ['item', 'guide_card', 'bounty', 'wanted', 'pvp', 'currency'],
    ui_usage_notes:
      'Use in bounty/PvP system overviews where you want a dedicated visual explaining how Bounty Tokens work and where to earn them.',
    width: 1720,
    height: 988,
    aspect_ratio: '430:247',
  },
  {
    id: 'items.career_notebook',
    category: 'items',
    file: 'assets/game/items/item-career-notebook.png',
    label: 'Career Notebook',
    kind: 'profession-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Profession progression manual used to raise your Profession Tier (notably Healer and other careers). Dropped from profession-related content and sold in limited weekly quantities in some shops.',
    game_system_tags: ['item', 'profession', 'career', 'progression'],
    ui_usage_notes:
      'Use in profession guides and checklists when explaining how to level careers, or when listing priority weekly purchases for profession growth.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.career_notebook_description',
    category: 'items',
    file: 'assets/game/items/item-career-notebook-description.png',
    label: 'Career Notebook – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card outlining what Career Notebooks do and where players can obtain them for profession levelling.',
    game_system_tags: ['item', 'guide_card', 'profession', 'career', 'progression'],
    ui_usage_notes:
      'Use in detailed profession/Healer progression guides when you want an at-a-glance visual explanation for Career Notebooks.',
    width: 1720,
    height: 1024,
    aspect_ratio: '215:128',
  },

  //
  // Appearance / cosmetics / chests
  //
  {
    id: 'items.garment_design_shard',
    category: 'items',
    file: 'assets/game/items/item-garment-design-shard.png',
    label: 'Garment Design Shard',
    kind: 'crafting-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Tailoring diagram fragment used for crafting or unlocking garment designs. Often obtained from Season Shop stock and other appearance-focused rewards.',
    game_system_tags: ['item', 'appearance', 'garment', 'design', 'crafting', 'season_shop'],
    ui_usage_notes:
      'Use for guides that recommend weekly Season Shop purchases for fashion progression or when documenting materials needed to unlock or craft specific garments.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.garment_design_shard_description',
    category: 'items',
    file: 'assets/game/items/item-garment-design-shard-description.png',
    label: 'Garment Design Shard – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card explaining what Garment Design Shards are used for and the main places to acquire them.',
    game_system_tags: ['item', 'guide_card', 'appearance', 'garment', 'design', 'season_shop'],
    ui_usage_notes:
      'Use in cosmetics/appearance sections where you outline how to unlock outfits using Garment Design Shards and want a dedicated visual.',
    width: 1724,
    height: 1016,
    aspect_ratio: '431:254',
  },
  {
    id: 'items.cosmetic_chest',
    category: 'items',
    file: 'assets/game/items/item-cosmetic-chest.png',
    label: 'Cosmetic Chest',
    kind: 'chest-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Campaign reward casket that can grant exclusive cosmetic items (outfits, hairstyles, accessories) or pay out cosmetic currency such as Cosmetic Tickets instead.',
    game_system_tags: ['item', 'appearance', 'cosmetic_chest', 'campaign', 'ticket_source'],
    ui_usage_notes:
      'Use when explaining Campaign cosmetic farming loops, drop expectations for exclusive sets, or how many Cosmetic Chests/Tickets are needed for appearance purchases.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.outpost_cosmetic_chest',
    category: 'items',
    file: 'assets/game/items/item-outpost-cosmetic-chest.png',
    label: 'Outpost Cosmetic Chest',
    kind: 'chest-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Outpost reward casket that grants Activity Appearance Tickets and has a chance to unlock outpost-exclusive Appearances. Primarily obtained by clearing Sword Trial outposts.',
    game_system_tags: ['item', 'appearance', 'cosmetic_chest', 'outpost', 'ticket_source'],
    ui_usage_notes:
      'Use when describing outpost farming for Activity Appearance Tickets or exclusive cosmetics, or when comparing outposts versus Campaigns as cosmetic sources.',
    width: 1720,
    height: 1152,
    aspect_ratio: '215:144',
  },
  {
    id: 'items.outpost_cosmetic_chest_description',
    category: 'items',
    file: 'assets/game/items/item-outpost-cosmetic-chest-description.png',
    label: 'Outpost Cosmetic Chest – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card describing Outpost Cosmetic Chests, their rewards, and their main acquisition methods.',
    game_system_tags: ['item', 'guide_card', 'appearance', 'cosmetic_chest', 'outpost'],
    ui_usage_notes:
      'Use in cosmetics/outpost sections of guides when you want a dedicated explainer image for Outpost Cosmetic Chests.',
    width: 1720,
    height: 1152,
    aspect_ratio: '215:144',
  },

  //
  // Development / systems chests
  //
  {
    id: 'items.oscillating_jade',
    category: 'items',
    file: 'assets/game/items/item-oscillating-jade.png',
    label: 'Oscillating Jade',
    kind: 'development-material-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Universal development material used to enhance gear in the early and mid tiers. Commonly obtained from Campaign rewards and various shops.',
    game_system_tags: ['item', 'gear', 'development', 'enhancement', 'oscillating_jade'],
    ui_usage_notes:
      'Use whenever you outline general gear enhancement costs, early-game upgrade routes, or recommended weekly purchases of Oscillating Jade from shops.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.oscillating_jade_description',
    category: 'items',
    file: 'assets/game/items/item-oscillating-jade-description.png',
    label: 'Oscillating Jade – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card explaining what Oscillating Jade is used for and highlighting its main acquisition sources.',
    game_system_tags: ['item', 'guide_card', 'gear', 'development', 'enhancement'],
    ui_usage_notes:
      'Use in gear-progression guides where you want a quick visual that summarises Oscillating Jade and its sources.',
    width: 1720,
    height: 1160,
    aspect_ratio: '43:29',
  },
  {
    id: 'items.gear_chest',
    category: 'items',
    file: 'assets/game/items/item-gear-chest.png',
    label: 'Gear Chest',
    kind: 'chest-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Season Shop chest that lets you choose a gear tier and set, then grants a random piece from that selection. Purchased mainly with Jade Fish and used to round out equipment sets.',
    game_system_tags: ['item', 'gear', 'chest', 'season_shop', 'jade_fish'],
    ui_usage_notes:
      'Use for gearing-route guides, Season Shop priority lists, and explanations of how to pick sets/tiers from Gear Chests when chasing specific armour pieces.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.inner_way_note_chest',
    category: 'items',
    file: 'assets/game/items/item-inner-way-note-chest.png',
    label: 'Inner Way Note: Chest',
    kind: 'chest-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Chest containing Inner Way Notes used to unlock and level Inner Ways (passive skill lines). Commonly obtained from Season Shop stock and some rewards.',
    game_system_tags: ['item', 'inner_way', 'development', 'chest', 'season_shop'],
    ui_usage_notes:
      'Use for Inner Way progression guides, weekly shop checklists, and any place you mention “Inner Way Note: Chest” as a reward or purchase.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.martial_arts_chest',
    category: 'items',
    file: 'assets/game/items/item-martial-arts-chest.png',
    label: 'Martial Arts: Custom Tips',
    kind: 'chest-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Reward chest tied to Martial Arts Custom Tips. Opening it allows you to select or unlock specific Martial Arts tips for your weapons, improving combat options and breakthroughs.',
    game_system_tags: ['item', 'martial_arts', 'development', 'custom_tips', 'chest'],
    ui_usage_notes:
      'Use when discussing Martial Arts optimisation, recommended weekly purchases, or how to acquire Custom Tips for specific builds.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.support_box',
    category: 'items',
    file: 'assets/game/items/item-support-box.png',
    label: 'Support Box',
    kind: 'reward-pack-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Supply box that bundles assorted support items such as consumables and development materials. Usually purchased in limited weekly quantities in Season or Exchange shops.',
    game_system_tags: ['item', 'support_box', 'consumables', 'development', 'weekly_shop'],
    ui_usage_notes:
      'Use for weekly-purchase recommendation sections and any explanation of support boxes that provide mixed utility items.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },

  //
  // Generic reward packs / coin bundles
  //
  {
    id: 'items.small_bag',
    category: 'items',
    file: 'assets/game/items/item-small-bag.png',
    label: 'Small Bag',
    kind: 'reward-pack-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A simple coin pouch icon used in-game for small bundles of currency or minor reward packs. Exact contents depend on the specific item name that uses this icon.',
    game_system_tags: ['item', 'currency', 'reward', 'bundle'],
    ui_usage_notes:
      'Use as a generic icon for small currency bundles or minor reward packs when you do not need to show a specific named item but want a “bag of coins” visual.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.small_box',
    category: 'items',
    file: 'assets/game/items/item-small-box.png',
    label: 'Small Box',
    kind: 'reward-pack-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A small reward chest icon commonly associated with boxes that contain Coins, Commerce Coins, or similar low-volume rewards.',
    game_system_tags: ['item', 'currency', 'reward', 'bundle', 'commerce'],
    ui_usage_notes:
      'Use for “Small Box of Coins / Commerce Coins”–style rewards and for generic low-tier reward boxes where the exact content is explained in surrounding text.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
  },
  {
    id: 'items.string_of_coins',
    category: 'items',
    file: 'assets/game/items/item-string-of-coins.png',
    label: 'String of Coins',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'A bundle of Coins tied together on a string, used as a small currency-pack reward in various activities and events.',
    game_system_tags: ['item', 'currency', 'coin', 'reward', 'bundle'],
    ui_usage_notes:
      'Use whenever you list specific Coin pack rewards given as items (string/bundle) rather than direct Coin payouts.',
    width: 1720,
    height: 1024,
    aspect_ratio: '215:128',
  },
  {
    id: 'items.string_of_coins_description',
    category: 'items',
    file: 'assets/game/items/item-string-of-coins-description.png',
    label: 'String of Coins – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full-width info card describing String of Coins rewards and listing the main sources that grant them.',
    game_system_tags: ['item', 'guide_card', 'currency', 'coin', 'reward', 'bundle'],
    ui_usage_notes:
      'Use in economy/currency sections where you explain Coin-pack rewards and want a graphical explanation for String of Coins.',
    width: 1720,
    height: 1024,
    aspect_ratio: '215:128',
  },
  // Description cards – professions / career giftboxes

  {
    id: 'items.healer_giftbox_description',
    category: 'items',
    file: 'assets/game/items/item-healer-giftbox-description.png',
    label: 'Healer Giftbox – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Full description panel for the Healer Giftbox, a Season Shop box that grants random Prescription upgrade materials for the Healer profession.',
    game_system_tags: [
      'item',
      'profession',
      'healer',
      'giftbox',
      'career',
      'season_shop',
      'guide_card',
    ],
    ui_usage_notes:
      'Use beside healer / illness guides when you want to show the actual in-game Healer Giftbox description, e.g. when explaining how to get Prescription materials from the Season Shop.',
    width: 1720,
    height: 980,
    aspect_ratio: '86:49',
  },
  {
    id: 'items.scholar_giftbox_description',
    category: 'items',
    file: 'assets/game/items/item-scholar-giftbox-description.png',
    label: 'Scholar Giftbox – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for the Scholar Giftbox, a Season Shop box that provides materials to upgrade Gift of Gab debate cards for the Scholar profession.',
    game_system_tags: [
      'item',
      'profession',
      'scholar',
      'giftbox',
      'career',
      'season_shop',
      'guide_card',
    ],
    ui_usage_notes:
      'Use in Gift of Gab / Scholar profession guides when clarifying where to get card-upgrade materials and how the Scholar Giftbox works.',
    width: 1720,
    height: 996,
    aspect_ratio: '430:249',
  },
  {
    id: 'items.custom_career_giftbox_description',
    category: 'items',
    file: 'assets/game/items/item-custom-career-giftbox-description.png',
    label: 'Custom Career Giftbox – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for the Custom Career Giftbox, a Season Shop box that grants profession-agnostic materials used to upgrade various career Prescriptions and cards (such as Healer or Scholar).',
    game_system_tags: [
      'item',
      'profession',
      'career',
      'giftbox',
      'multi_profession',
      'season_shop',
      'guide_card',
    ],
    ui_usage_notes:
      'Use when explaining “Career Giftboxes” or cross-profession upgrade routes that rely on Custom Career Giftboxes from the Season Shop.',
    width: 1720,
    height: 1568,
    aspect_ratio: '215:196',
  },

  // Description cards – combat progression boxes

  {
    id: 'items.martial_arts_chest_description',
    category: 'items',
    file: 'assets/game/items/item-martial-arts-custom-tips-description.png',
    label: 'Martial Arts: Custom Tips – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description panel for the Martial Arts: Custom Tips chest, a Season Shop box that provides materials used for Martial Arts breakthroughs and custom tip setups.',
    game_system_tags: [
      'item',
      'martial_arts',
      'breakthrough',
      'custom_tips',
      'season_shop',
      'guide_card',
    ],
    ui_usage_notes:
      'Use next to sections that recommend buying Martial Arts: Custom Tips with Jade Fish, or when breaking down Martial Arts breakthrough priorities.',
    width: 1720,
    height: 1892,
    aspect_ratio: '10:11',
  },
  {
    id: 'items.custom_martial_arts_breakthrough_chest_description',
    category: 'items',
    file: 'assets/game/items/item-custom-martial-arts-breakthrough-chest-description.png',
    label: 'Custom Martial Arts Breakthrough Chest – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for the Custom Martial Arts Breakthrough Chest, a Battle Pass / shop chest that yields Martial Arts breakthrough materials for the weapon set of your choice.',
    game_system_tags: [
      'item',
      'martial_arts',
      'breakthrough',
      'battle_pass',
      'reward_chest',
      'guide_card',
    ],
    ui_usage_notes:
      'Use in Battle Pass or progression guides when explaining where to get high-value Martial Arts breakthrough materials and why these chests are worth rare tokens.',
    width: 1720,
    height: 1576,
    aspect_ratio: '215:197',
  },
  {
    id: 'items.mystic_skills_breakthrough_support_box_description',
    category: 'items',
    file: 'assets/game/items/item-mystic-skills-breakthrough-support-box-description.png',
    label: 'Mystic Skills Breakthrough Support Box – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description panel for the Mystic Skills Breakthrough Support Box, a high-value chest that provides rare materials needed to promote Mystic Skills to higher tiers.',
    game_system_tags: [
      'item',
      'mystic_skill',
      'breakthrough',
      'support_box',
      'battle_pass',
      'season_shop',
      'guide_card',
    ],
    ui_usage_notes:
      'Use alongside any Mystic Skills breakthrough cost tables where you want to show the official in-game box card instead of just listing the name.',
    width: 1720,
    height: 1900,
    aspect_ratio: '86:95',
  },

  // Description cards – Life Supplies / enhance route

  {
    id: 'items.life_supplies_support_box_description',
    category: 'items',
    file: 'assets/game/items/item-life-supplies-support-box-description.png',
    label: 'Life Supplies Support Box – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for the Life Supplies Support Box, a Season Shop purchase that bundles “Enhance” materials and related upgrade resources.',
    game_system_tags: [
      'item',
      'enhance',
      'gear_upgrade',
      'season_shop',
      'support_box',
      'guide_card',
    ],
    ui_usage_notes:
      'Pair with the Support Box icon in gear-upgrade or Jade Fish spending guides when explaining why and when to buy Life Supplies Support Boxes for Enhance materials.',
    width: 1720,
    height: 1764,
    aspect_ratio: '430:441',
  },
  {
    id: 'items.small_box_of_commerce_coins_description',
    category: 'items',
    file: 'assets/game/items/item-small-box-of-commerce-coins-description.png',
    label: 'Small Box of Commerce Coins – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description panel for the Small Box of Commerce Coins, a Season Shop item that converts Jade Fish into a small bundle of Commerce Coins for trading routes.',
    game_system_tags: [
      'item',
      'currency',
      'commerce_coin',
      'season_shop',
      'reward_box',
      'guide_card',
    ],
    ui_usage_notes:
      'Use when discussing Jade Fish → Commerce Coin conversion or Season Shop priorities, especially for players focused on trading and Commerce routes.',
    width: 1720,
    height: 1116,
    aspect_ratio: '430:279',
  },

  // Description cards – Inner Way progression

  {
    id: 'items.inner_way_note_chest_description',
    category: 'items',
    file: 'assets/game/items/item-inner-way-note-chest-description.png',
    label: 'Inner Way Note: Chest – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for the Inner Way Note: Chest, which provides Inner Way Notes used to unlock and level Inner Ways (passive skill lines). Commonly obtained from the Season Shop and promo codes.',
    game_system_tags: [
      'item',
      'inner_way',
      'passive_skill',
      'season_shop',
      'code_reward',
      'guide_card',
    ],
    ui_usage_notes:
      'Use in Inner Way progression guides or Jade Fish shopping checklists when you want to show the in-game Inner Way Note: Chest description.',
    width: 1720,
    height: 2408,
    aspect_ratio: '5:7',
  },
  {
    id: 'items.inner_way_note_custom_chest_description',
    category: 'items',
    file: 'assets/game/items/item-inner-way-note-custom-chest-description.png',
    label: 'Inner Way Note: Custom Chest – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description panel for the Inner Way Note: Custom Chest, a variant chest that provides Inner Way Notes with some control over which Inner Way line you advance.',
    game_system_tags: [
      'item',
      'inner_way',
      'passive_skill',
      'custom_choice',
      'reward_chest',
      'guide_card',
    ],
    ui_usage_notes:
      'Use if you later document custom/choice-based Inner Way Note chests; this card helps distinguish them from the standard Inner Way Note: Chest.',
    width: 1720,
    height: 2116,
    aspect_ratio: '430:529',
  },

  // Description cards – other

  {
    id: 'items.tier_56_path_chest_description',
    category: 'items',
    file: 'assets/game/items/item-tier-56-path-chest-description.png',
    label: 'Tier 56 Path Chest – Info Card',
    kind: 'item-description-card',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'Description card for a Tier 56 Path Chest; a high-tier account progression reward chest granted at a specific Path tier, containing a mix of gear and currency.',
    game_system_tags: ['item', 'path_chest', 'progression', 'reward_chest', 'guide_card'],
    ui_usage_notes:
      'Use in Path / progression guides when you want to show the exact Tier 56 chest description, e.g. in “what to expect from Path rewards” sections.',
    width: 1720,
    height: 2036,
    aspect_ratio: '430:509',
  },
];
