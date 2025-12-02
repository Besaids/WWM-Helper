// c:\Users\andcr\WWM-Helper\src\app\configs\timer-details.ts

import { TimerDetails } from '../models';

export const TIMER_DETAILS_CONFIG: Record<string, TimerDetails> = {
  'daily-reset': {
    id: 'daily-reset',
    summary:
      "At daily reset you regain <strong>Stamina</strong>, Jianghu Errands refresh, Bounties rotate, and daily-limited activities like <strong>Blessed Land</strong>, <strong>Five Animal Frolics</strong> and <strong>Scholar's Hearth</strong> reset. <strong>Energy</strong> keeps regenerating passively (1 every 9 minutes), but this breakpoint is where most daily activities and shops flip over.",
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Core resources',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Energy</strong> – Regenerates 1 every 9 real-time minutes up to your personal cap (e.g. 500). Spent on <strong>Campaign Challenge</strong>, <strong>Outpost Challenge</strong> and <strong>Sword Trial</strong> (20 Energy for Campaign/Outpost/Joint Battle, 60 Energy for boss trials like Formless Mountain Pass).',
              '<strong>Stamina</strong> – Crafting resource with a 2,500 cap. You gain <strong>450 Stamina</strong> back at each daily reset for crafting gear, food, medicine, manuals and construction items.',
            ],
          },
        ],
      },
      {
        heading: 'Daily-limited activities',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Jianghu Errands</strong> – Sect daily missions reset here. Grant <strong>Merit</strong> plus <strong>Reputation</strong> (Reputation has its own weekly gain cap).',
              "<strong>Blessed Land for Cultivation</strong>, <strong>Five Animal Frolics</strong>, <strong>Scholar's Hearth</strong> – Online activities usually tied into Jianghu Errands; their participation rewards reset daily.",
              '<strong>Bounties</strong> – NPC bounty list refreshes. Once you clear all NPC bounties you can only continue with player-posted bounties (for <strong>Fourfold Coin</strong> and leaderboard progress) until next reset.',
              '<strong>Ye Buxiu Betting Match (Chess)</strong> – Located in <em>Qinghe – Dreamscape: Blissful Retreat</em>. You can win up to <strong>3 times per day</strong>. On Expert difficulty that is up to <strong>900 Commerce Coin</strong> for 3 wins; each loss costs 150 Commerce Coin.',
            ],
          },
        ],
      },
      {
        heading: 'Merchant daily stock',
        content: [
          {
            type: 'list',
            items: [
              'Certain NPC merchants have items flagged as <strong>daily stock</strong>; those purchase limits refresh at daily reset. Others are weekly or one-time.',
            ],
          },
        ],
      },
      {
        heading: 'Nice extras around reset',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Visit your home</strong> for the free daily hairstyles and to pick up any time-gated home rewards before the next reset.',
            ],
          },
        ],
      },
    ],
  },

  'weekly-reset': {
    id: 'weekly-reset',
    summary:
      'Weekly reset for raid lockouts, weekly currency caps and weekly shop stock. Use this to line up your long-term goals and big-ticket rewards.',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Weekly group content',
        content: [
          {
            type: 'list',
            items: [
              "<strong>Hero's Realm (Wandering Paths)</strong> – Up to 10-player raid-style instance. Two bosses per run; you get <strong>one weekly reward per boss</strong> (two rewards total). No Energy cost; gated by weekly loot.",
              "<strong>Guild Hero's Realm</strong> – 5–10 guild members; separate weekly reward for clearing both bosses together as a guild. No matchmaking and no Energy cost; has its own weekly lockout.",
            ],
          },
        ],
      },
      {
        heading: 'Weekly currency caps',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Coin</strong> – 175,000 weekly gain cap from repeatable content.',
              '<strong>Harmony Charm</strong> – 2,000 weekly cap; earned from Partnership, Discipleship and Sworn Cohort activities and spent in the Social Shop.',
              '<strong>Treasure Token</strong> – 2,500 weekly cap from Guild Events; used in <strong>Red Gold Boutique</strong>.',
              '<strong>Jade Fish</strong> – 20,000 weekly cap as the current Season currency; used in the Season Shop. Many Season items also have their own weekly purchase limits.',
              '<strong>Reputation</strong> – 1,200 weekly gain cap from Jianghu Errands; used in Sect shops.',
            ],
          },
        ],
      },
      {
        heading: 'Social XP caps',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Partnership</strong> – 2,000 XP per week from activities with your Partner; unlocks perks and Partnership shop items.',
              '<strong>Discipleship</strong> – 2,000 XP per week from activities with your Disciple(s) and Master; unlocks levels and shop options.',
              '<strong>Sworn Cohort</strong> – 2,000 XP per week from activities with Cohort members; tied to Cohort shop unlocks.',
              '<strong>Intimacy</strong> – Weekly cap exists but the exact value is hidden. Increased by travelling together, chatting, and gifting friends; affects long-term friendship perks.',
            ],
          },
        ],
      },
      {
        heading: 'Weekly shop stock',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Season / Jade Fish Shop</strong> – Many items refresh weekly, on top of the Jade Fish weekly cap.',
              '<strong>Battle Pass Token Shop</strong> – Some rewards also have weekly limits.',
              'Other merchants carry items with <strong>weekly</strong> rather than daily stock. Some high-end items also use <strong>monthly</strong> caps; check in-game tooltips.',
            ],
          },
        ],
      },
      {
        heading: 'Weekly shop priorities',
        content: [
          {
            type: 'list',
            items: [
              'In the <strong>Jade Fish / Season shop</strong>, prioritize progression items such as <strong>Martial Arts Combat Tips</strong> and <strong>Inner Way Note</strong> chests over random gear boxes.',
              'Under the appearance tab, pick up your weekly <strong>Lingering Melody</strong>; it is used for cosmetic banners and is easy to forget.',
              'If you use <strong>Healer</strong> or <strong>Scholar</strong> professions, grab their weekly profession boxes before reset so you do not miss skill-progress items.',
            ],
          },
        ],
      },
    ],
  },

  'arena-1v1': {
    id: 'arena-1v1',
    summary:
      'Countdown to the current / next <strong>1v1 Arena</strong> ranked window. When it shows <strong>open</strong>, ranked 1v1 is available.',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Arena 1v1 windows',
        content: [
          {
            type: 'paragraph',
            text: 'Use this timer to line up PvP sessions with friends or guildmates. When the timer shows <strong>open</strong>, ranked 1v1 is available; when it counts down, it is showing time until the next open window.',
          },
          {
            type: 'paragraph',
            text: 'Keeping this pinned makes it easier to choose between queuing now or focusing on other activities first.',
          },
        ],
      },
    ],
  },

  'fireworks-seats': {
    id: 'fireworks-seats',
    summary:
      'Bidding window for <strong>Fireworks Seats</strong> at Velvet Shade / Pearlglow Lake. The timer shows <strong>open</strong> while bidding is live and counts down to the next close.',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Bidding tips',
        content: [
          {
            type: 'list',
            items: [
              '<strong>When</strong> – Every <strong>Monday 01:00</strong> to <strong>Friday 13:00</strong> (UTC).',
              '<strong>What</strong> – Bid on sponsored seats for the Fireworks Show and set custom fireworks messages that will appear to other players.',
              'The helper shows this timer as <strong>open</strong> while bidding is live and counts down to the next close.',
            ],
          },
        ],
      },
    ],
  },

  'fireworks-festival': {
    id: 'fireworks-festival',
    summary:
      'Weekend <strong>Fireworks Festival</strong> at Pearlglow Lake with red envelopes for all attendees; runs twice per weekend (Sat 12:30, Sun 00:30 UTC).',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Festival notes',
        content: [
          {
            type: 'list',
            items: [
              '<strong>When</strong> – Every <strong>Saturday at 12:30 and Sunday at 00:30 (UTC)</strong>.',
              '<strong>Where</strong> – <strong>Velvet Shade → Pearlglow Lake</strong> in Kaifeng.',
              '<strong>What</strong> – Live Fireworks Festival with <strong>red envelopes</strong> dropped to all attendees.',
              'You can also trigger related quests by talking to <strong>Zhao Rui</strong> and <strong>Sun Jinyuan</strong> near Velvet Shade between <strong>Chen</strong> and <strong>You</strong> hours.',
            ],
          },
        ],
      },
    ],
  },

  'fireworks-show': {
    id: 'fireworks-show',
    summary:
      'Night-time <strong>Fireworks Show</strong> at Pearlglow Lake; prime-time multiplayer version on weekends plus a nightly solo version.',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'Show windows',
        content: [
          {
            type: 'list',
            items: [
              '<strong>Multiplayer</strong> – Every <strong>Friday & Saturday at 20:30 (UTC)</strong>. Main Fireworks Show instance where sponsored seats and custom messages appear; best time for <strong>red envelopes</strong> with other players.',
              '<strong>Solo</strong> – Every night at <strong>Zi hour</strong> a Fireworks Festival runs at Pearlglow Lake in your own world. You can fast-forward time to Zi hour to see it; rewards may differ from the full multiplayer event.',
            ],
          },
        ],
      },
    ],
  },

  'mirage-boat': {
    id: 'mirage-boat',
    summary:
      'Server-wide <strong>Mirage Boat</strong> "Painted Cruise" event. Use this timer to see when the next cruise window is about to start so you can hop on for rewards and try cosmetic outfits.',
    hasLongDetails: true,
    longDetailsSections: [
      {
        heading: 'What the Mirage Boat is',
        content: [
          {
            type: 'list',
            items: [
              'Premium, ultra-rare boat mount unlocked by collecting <strong>170 Mirage Torn Pages</strong> from the Celestial Draw and exchanging them in the Draw Shop.',
              'Lets the owner start a server-wide social event called the <strong>Painted Cruise / Mirage Boat Event</strong>, effectively a moving party on the rivers around Kaifeng.',
              'Mostly cosmetic and social; it is a flex mount and an event trigger rather than a direct power boost.',
            ],
          },
        ],
      },
      {
        heading: 'When the event runs',
        content: [
          {
            type: 'list',
            items: [
              "There is a <strong>fixed weekly cruise</strong> every <strong>Sunday evening</strong> and <strong>Monday morning</strong> (UTC; check this timer's countdown and the in-game event panel for the exact times on your server).",
              'Mirage Boat owners can also spend currency to trigger extra cruises outside the fixed windows, so you may occasionally see additional departures.',
            ],
          },
        ],
      },
      {
        heading: 'How to join',
        content: [
          {
            type: 'list',
            items: [
              'When a cruise is active, an event icon appears on your UI; follow it to the dock and board the Mirage Boat with other players.',
              'The boat follows a set route; you can roam the deck, emote, and join small mini-activities while it sails.',
              'You <strong>do not need to own the Mirage Boat</strong> to participate; any player can join as a guest when a cruise is running.',
            ],
          },
        ],
      },
      {
        heading: 'Rewards and perks',
        content: [
          {
            type: 'list',
            items: [
              'You earn <strong>Fortune Points</strong> simply by staying on the boat and participating in its mini-games; at <strong>1,000 Fortune Points</strong> you can claim your reward via the Mirage Boat icon at the top-right of the screen.',
              'Rewards are mailed to you if you leave early; the quality scales with how much the owner spends to fund the cruise.',
              "During the event you can temporarily wear <strong>any outfits owned by the boat's owner</strong>, letting you test premium cosmetics for free while you're on board.",
            ],
          },
        ],
      },
    ],
  },

  'guild-breaking-army': {
    id: 'guild-breaking-army',
    summary:
      "Breaking Army is your guild's solo challenge event. Each session lasts <strong>1 hour</strong>. The exact schedule is set by your guild leader. Use the in-game card time (for example <strong>Wednesday 20:30 (UTC+8)</strong>) and enter it below.",
    hasLongDetails: false,
    hasGuildConfig: true,
  },

  'guild-test-your-skills': {
    id: 'guild-test-your-skills',
    summary:
      "Test Your Skills is your guild's internal arena event. Each session lasts <strong>1 hour</strong>. The exact schedule is set by your guild leader. Use the in-game card times (for example <strong>Thursday 20:30 (UTC+8)</strong> and <strong>Sunday 20:30 (UTC+8)</strong>) and enter them below.",
    hasLongDetails: false,
    hasGuildConfig: true,
  },

  'trading-week-reset': {
    id: 'trading-week-reset',
    summary:
      'Trade Week reset for <strong>Trading Goods</strong>. Every Friday at 21:00 UTC the three featured trade items change in the <strong>Price Bulletin</strong>. Use this to remember when to clear out old stock and check the new week.',
    hasLongDetails: true,
    hasTradeGuideLink: true,
    longDetailsSections: [
      {
        heading: 'What this timer tracks',
        content: [
          {
            type: 'list',
            items: [
              'When a new Trade Week starts and the three Trading Goods rotate.',
              "When last week's trade items stop being part of the structured Trading loop.",
              'The hard deadline to sell any leftover Trading Goods before they go "off-rotation".',
            ],
          },
        ],
      },
      {
        heading: 'Basic trading loop',
        content: [
          {
            type: 'list',
            items: [
              "After Friday 21:00 UTC, open the <strong>Price Bulletin</strong> at Zang Qiyue to see the week's 1 Local + 2 Remote items.",
              'With 80 slots, buy <strong>30 of the two most expensive items</strong> and <strong>20 of the remaining one</strong> to maximise profit.',
              'Hold them and watch prices over the week; aim to sell all stock before the next Friday 21:00 UTC reset.',
            ],
          },
        ],
      },
      {
        heading: 'Guild bonus tips',
        content: [
          {
            type: 'list',
            items: [
              "The <strong>Selling Bonus</strong> and <strong>Market Tax</strong> techniques only apply when exchanging Trading Goods with <strong>guild members</strong>, including your guild's trade NPC.",
              "Prefer selling Remote items in guildmates' worlds or to your guild NPC; only use random buyers if their price is much higher than your guild options.",
            ],
          },
        ],
      },
    ],
  },

  'trading-price-peak-check': {
    id: 'trading-price-peak-check',
    summary:
      'Weekly reminder to check potential <strong>Trading Goods</strong> price peaks. Fires on <strong>Tuesday at 21:00 UTC</strong>, about halfway through the Trade Week, so you can log in, review Local % values and look for good Remote buyers.',
    hasLongDetails: true,
    hasTradeGuideLink: true,
    longDetailsSections: [
      {
        heading: 'What to do when it pings',
        content: [
          {
            type: 'list',
            items: [
              'Open the <strong>Price Bulletin</strong> and check the current Local item %.',
              'If the Local item looks high for this week, decide whether to sell now or keep holding.',
              'Refresh <strong>Remote Price</strong> to see if any guild members / buyers are offering strong prices for Remote items.',
              'Remember you still have time until <strong>Friday 21:00 UTC</strong> to fully dump your stock.',
            ],
          },
        ],
      },
    ],
  },
};
