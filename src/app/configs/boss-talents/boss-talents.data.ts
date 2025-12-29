// src/app/features/guides/boss-talents/boss-talents.data.ts

import { BossTalentSeason, BossTalentTrack, BossTalentTier } from '../../models';

const mkTier = (
  tier: 1 | 2 | 3,
  requirement: string | null,
  reward: string,
  unlockLevel: number | null,
  sameAsTier?: number,
  notes?: string,
): BossTalentTier => ({
  tier,
  requirement,
  reward,
  unlockLevel,
  ...(sameAsTier ? { sameAsTier } : {}),
  ...(notes ? { notes } : {}),
});

/**
 * The Void King – Formless Seer
 * Sheet: "The Void King"
 */
const VOID_KING_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat The Void King in Sword Trial and deflect 2 times within a single Whirlwind Frenzy cast.',
        'DMG +10% vs The Void King in Exhausted State',
        16,
      ),
      mkTier(
        2,
        'Defeat The Void King in Sword Trial – Formless Mountain Pass or Ocean of Vengeance and deflect 5 times within a single Whirlwind Frenzy cast.',
        'DMG +20% vs The Void King in Exhausted State',
        51,
      ),
      mkTier(
        3,
        'Defeat The Void King in Ocean of Vengeance in a team. The entire team must deflect 25 times within a single Whirlwind Frenzy cast.',
        'DMG +30% vs The Void King in Exhausted State',
        61,
      ),
    ],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        "Defeat The Void King in Sword Trial without getting knocked away by Wind Strike's wind zone.",
        "−20% DMG taken when knocked away by The Void King's wind zone",
        16,
      ),
      mkTier(
        2,
        "Defeat The Void King in Sword Trial or Ocean of Vengeance without getting knocked away by Wind Strike's wind zone.",
        "−40% DMG taken when knocked away by The Void King's wind zone",
        61,
      ),
      mkTier(
        3,
        'Defeat The Void King in Ocean of Vengeance in a team while ensuring no wind zone has reached within 3m of The Void King.',
        "−60% DMG taken when knocked away by The Void King's wind zone",
        61,
      ),
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        'Defeat The Void King 2 times in Sword Trial – Formless Calamity and claim the reward once.',
        'DMG and healing dealt +5% vs The Void King',
        16,
      ),
      mkTier(
        2,
        'Defeat The Void King 3 times in Sword Trial – Formless Mountain Pass and claim the reward once.',
        'DMG and healing dealt +10% vs The Void King',
        51,
      ),
      mkTier(
        3,
        'Defeat The Void King 5 times in Sword Trial – Ocean of Vengeance and claim the reward once.',
        'DMG and healing dealt +15% vs The Void King',
        61,
      ),
    ],
  },
];

/**
 * Ye Wanshan – Coldsteel Armor
 * Sheet: "Ye Wanshan"
 */
const YE_WANSHAN_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat Ye Wanshan in Sword Trial and successfully stop all Wraiths from self-destructing.',
        'DMG +10% vs Ye Wanshan in Exhausted State',
        31,
      ),
      mkTier(
        2,
        'Defeat Ye Wanshan in Sword Trial - Formless Mountain Pass or Ocean of Vengeance and successfully stop all Wraiths from self-destructing.',
        'DMG +20% vs Ye Wanshan in Exhausted State',
        51,
      ),
      mkTier(
        3,
        'Defeat Ye Wanshan in Ocean of Vengeance in a team and successfully stop all Wraiths from self-destructing.',
        'DMG +30% vs Ye Wanshan in Exhausted State',
        61,
      ),
    ],
    tips: ["Have the tank lead the boss to a corner that doesn't have Wraiths."],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        "Defeat Ye Wanshan in Sword Trial without taking damage from Wraith Cavalry during the 'Undying Fire' phase.",
        "20% chance to reduce twice the War's Fury when killing a Phantom Cavalry while mounted.",
        31,
      ),
      mkTier(
        2,
        "Defeat Ye Wanshan in Sword Trial – Formless Mountain Pass or Ocean of Vengeance without taking damage from Wraith Cavalry during the 'Undying Fire' phase.",
        '50% chance to reduce twice the War Flames when killing a Ghost Rider while mounted.',
        51,
      ),
      mkTier(
        3,
        "Defeat Ye Wanshan in Ocean of Vengeance in a team and reduce War's Fury to zero within 20 seconds during the 'Undying Fire' phase.",
        "100% chance to reduce twice the War's Fury when killing a Phantom Cavalry while mounted.",
        61,
      ),
    ],
    tips: [
      'Do not get on a horse and go to the side of the barrier in this phase opposite of the starting side. Avoid the cavalry and meteors.',
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        'Defeat Ye Wanshan 2 times in Sword Trial – Cold Mountain Pass and claim the reward once.',
        'DMG and healing dealt +5% vs Ye Wanshan',
        31,
      ),
      mkTier(
        2,
        'Defeat Ye Wanshan 3 times in Sword Trial – Formless Mountain Pass and claim the reward once.',
        'DMG and healing dealt +10% vs Ye Wanshan',
        51,
      ),
      mkTier(
        3,
        'Defeat Ye Wanshan 5 times in Sword Trial – Ocean of Vengeance and claim the reward once.',
        'DMG and healing dealt +15% vs Ye Wanshan',
        61,
      ),
    ],
  },
];

/**
 * Lucky Seventeen – The Humble Blade
 * Sheet: "Lucky Seventeen" + missing T3 offensive requirement from in-game screenshot.
 */
const LUCKY_SEVENTEEN_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat Lucky Seventeen in Sword Trial and destroy 1 rapier alone.',
        "DMG vs Lucky Seventeen's rapier +5%",
        41,
      ),
      mkTier(
        2,
        'Defeat Lucky Seventeen in Sword Trial – Fire of Blood and Iron or Ocean of Vengeance and destroy 2 rapiers alone.',
        "DMG vs Lucky Seventeen's rapier +10%",
        56,
      ),
      mkTier(
        3,
        'Defeat Lucky Seventeen in Ocean of Vengeance in a team, ensuring that each rapier is destroyed within 3 seconds of the previous one’s destruction.',
        "DMG vs Lucky Seventeen's rapier +15%",
        61,
      ),
    ],
    tips: ['Rotate through people destroying rapiers each time the event happens.'],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        'Defeat Lucky Seventeen in Sword Trial and catch the tossed player once.',
        'DMG +10% vs Lucky Seventeen in Exhausted State',
        41,
      ),
      mkTier(
        2,
        'Defeat Lucky Seventeen in Sword Trial – Fire of Blood and Iron or Ocean of Vengeance and catch the tossed player 2 times.',
        'DMG +20% vs Lucky Seventeen in Exhausted State',
        56,
      ),
      mkTier(
        3,
        'Defeat Lucky Seventeen in Ocean of Vengeance and catch all the tossed players.',
        'DMG +30% vs Lucky Seventeen in Exhausted State',
        61,
      ),
    ],
    tips: [
      'Everyone needs to run to the red line indicating the direction where the player will be thrown.',
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        'Defeat Lucky Seventeen 2 times in Sword Trial – Forging of Years and claim the reward once.',
        'DMG and healing dealt +5% vs Lucky Seventeen',
        41,
      ),
      mkTier(
        2,
        'Defeat Lucky Seventeen 3 times in Sword Trial – Fire of Blood and Iron and claim the reward once.',
        'DMG and healing dealt +10% vs Lucky Seventeen',
        56,
      ),
      mkTier(
        3,
        'Defeat Lucky Seventeen 5 times in Sword Trial – Ocean of Vengeance and claim the reward once.',
        'DMG and healing dealt +15% vs Lucky Seventeen',
        61,
      ),
    ],
  },
];

/**
 * Sleeping Daoist – Unbound Donkey Rider
 * Sheet: "Sleeping Daoist"
 */
const SLEEPING_DAOIST_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat Sleeping Daoist in Dream Jimming Pool in a team, ensuring that no more than 1 player is catching, and no player is injured by falling.',
        'DMG +10% vs Sleeping Daoist in Exhausted State',
        51,
      ),
      mkTier(
        2,
        'Defeat Sleeping Daoist in Dream Jimming Pool in a team, ensuring that no more than 2 players are catching, and no player is injured by falling.',
        'DMG +20% vs Sleeping Daoist in Exhausted State',
        51,
      ),
      mkTier(
        3,
        'Defeat Sleeping Daoist in Dream Jimming Pool (Supreme) in a team, ensuring that no more than 3 players are catching, and no player is injured by falling.',
        'DMG +30% vs Sleeping Daoist in Exhausted State',
        56,
      ),
    ],
    tips: [
      "The ground attack the Daoist deals will create a circle on the ground; stepping on it will turn you into a donkey. During 'Levitation Curse', turn into a donkey and stand underneath players that are lifted to catch them.",
    ],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        "Defeat Sleeping Daoist in Hero's Realm without taking damage during the Donkey Stampede.",
        'Restores HP equal to 2% of the damage dealt when dealing damage to a donkey in combat.',
        51,
      ),
      mkTier(
        2,
        "Defeat Sleeping Daoist in Hero's Realm while ensuring a single donkey summoned during the dream has farted more than 3 times.",
        'Restores HP equal to 4% of the damage dealt when dealing damage to a donkey in combat.',
        51,
      ),
      mkTier(
        3,
        'Defeat Sleeping Daoist in Dream Jimming Pool (Supreme) in a team with 20 or more donkeys summoned during the Donkey Phantom phase.',
        'When dealing damage to donkeys in battle, additionally restores HP equal to 6% of the damage dealt.',
        56,
      ),
    ],
    tips: [
      "During the 'Stampede of Donkeys' run in the same path with the team and do not stop. The second batch of portals in the phase will spawn somewhere on the other side of the arena. Do not use A/D; use your camera to adjust and try not to go over a 45° turn when getting into the line of donkeys. The first two tiers can be completed in the Supreme Hero's Realm.",
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        'Defeat Sleeping Daoist once in Dream Jimming Pool and claim the reward once.',
        'DMG and healing dealt +7.5% vs Sleeping Daoist',
        51,
      ),
      mkTier(
        2,
        'Defeat Sleeping Daoist once in Dream Jimming Pool (Supreme) and claim the reward once.',
        'DMG and healing dealt +15% vs Sleeping Daoist',
        56,
      ),
      // No tier 3 for this track in the sheet; leaving it absent.
    ],
  },
];

/**
 * Murong Yuan – Soaring Skyward
 * Sheet: "Murong Yuan"
 */
const MURONG_YUAN_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat Murong Yuan in Dream Jimming Pool in a team. During the Sea of Fire phase, let the Sea of Fire burn 4 Explosive Barrels, and make sure no more than 1 chain explosion is triggered throughout the entire battle.',
        'DMG +10% vs Murong Yuan in Exhausted State',
        51,
      ),
      mkTier(
        2,
        null,
        'DMG +20% vs Murong Yuan in Exhausted State',
        51,
        1,
        'Same requirement as Tier 1.',
      ),
      mkTier(
        3,
        'Defeat Murong Yuan in Dream Jimming Pool (Supreme) in a team. Let the first Sea of Fire burn all Explosive Barrels, and make sure no more than 1 chain explosion is triggered throughout the entire battle.',
        'DMG +30% vs Murong Yuan in Exhausted State',
        56,
      ),
    ],
    tips: [
      'Everyone needs to pay attention to the barrels. If you see two red barrels, move them apart.',
    ],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        'Defeat Murong Yuan in Dream Jimming Pool without taking explosion damage within 5m of any Explosive Barrel.',
        'Reduces the damage taken from Wooden Kite and Explosive Barrels by 5%.',
        51,
      ),
      mkTier(
        2,
        null,
        'Reduces the damage taken from Wooden Kite and Explosive Barrels by 10%.',
        51,
        1,
        'Same requirement as Tier 1.',
      ),
      mkTier(
        3,
        'Defeat Murong Yuan in Dream Jimming Pool (Supreme) in a team. The entire team must not take explosion damage within 5m of any Explosive Barrel.',
        'Take −15% damage from Wooden Kites and Explosive Barrels.',
        56,
      ),
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        "Defeat Murong Yuan once in Hero's Realm – Dream Jimming Pool and claim the reward once.",
        'DMG and healing dealt +7.5% vs Murong Yuan',
        51,
      ),
      mkTier(
        2,
        "Defeat Murong Yuan once in Hero's Realm – Dream Jimming Pool (Supreme) and claim the reward once.",
        'DMG and healing dealt +15% vs Murong Yuan',
        56,
      ),
    ],
  },
];

/**
 * Twin Lions – Lion Dancer
 * Not yet in sheet; Tier-1 data taken from in-game screenshots only.
 */
const TWIN_LIONS_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        'Defeat Twin Lions in Hero’s Realm. After the battle starts, snatch the Golden Ball 2 times (at least once using Celestial Seize) and throw them away before the progress bar is full.',
        'DMG +10% vs Twin Lions in Exhausted state',
        66,
      ),
      mkTier(
        2,
        "Defeat Twin Lions in Hero's Realm. After the battle starts, snatch the Golden Ball 3 times (at least once using Celestial Seize) and throw them away before the progress bar is full.",
        'DMG +20% vs Twin Lions in Exhausted state',
        66,
      ),
      mkTier(
        3,
        'Defeat Twin Lions in Sorrow of Mortalbound in a team. Only 2 players may pass the Golden Ball around, and all players must throw the Golden Ball out before the progress bar is full.',
        'DMG +30% vs Twin Lions in Exhausted state',
        71,
      ),
    ],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        "Defeat Twin Lions in Hero's Realm and successfully deflect 'Clouds Above' 2 times and 'Blooming Ground' 2 times.",
        "Reduces the damage taken from Twin Lions' Special Skills by 5%.",
        66,
      ),
      mkTier(
        2,
        'Defeat Twin Lions in Hero\'s Realm and successfully deflect all "Clouds Above" and Blooming Ground."',
        "Reduces the damage taken from Twin Lions' Special Skills by 10%.",
        66,
      ),
      mkTier(
        3,
        'Defeat Twin Lions in Sorrow of Mortalbound in a team without letting Twin Lions get the Golden Ball more than 2 times.',
        'Take 15% reduced damage from Golden Ball Twin Lions.',
        71,
      ),
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        "Defeat Twin Lions in Hero's Realm – Blazing Gale Dance once and claim the reward once.",
        'DMG and Healing +7.5% vs Twin Lions',
        66,
      ),
      mkTier(
        2,
        "Defeat Twin Lions in Hero's Realm - Sorrow of Mortalbound once and claim the reward once.",
        'DMG and Healing +15% vs Twin Lions',
        71,
      ),
    ],
  },
];

/**
 * Ghost Master – Shadow Severer
 * Not yet in sheet; Tier-1 data from in-game screenshots.
 */
const GHOST_MASTER_TRACKS: BossTalentTrack[] = [
  {
    type: 'offensive',
    label: 'Offensive',
    tiers: [
      mkTier(
        1,
        "Defeat Ghost Master in Hero's Realm without getting hit by 'Vanished Trail' and 'Soul Abyss,' or successfully block every cast of 'Eternal Extinction.'",
        'DMG +10% vs Ghost Master in Exhausted state',
        71,
      ),
      mkTier(
        2,
        null,
        'DMG +20% vs Ghost Master in Exhausted state',
        null,
        undefined,
        'TODO – Tier 2 requirement / unlock from in-game Ghost Master offensive node.',
      ),
      mkTier(
        3,
        null,
        'DMG +30% vs Ghost Master in Exhausted state',
        null,
        undefined,
        'TODO – Tier 3 requirement / unlock from in-game Ghost Master offensive node.',
      ),
    ],
  },
  {
    type: 'defensive',
    label: 'Defensive',
    tiers: [
      mkTier(
        1,
        "Defeat Ghost Master in Hero's Realm and survive while transformed into Golden Shackle and Silver Chain, or when affected by 'Into the Sedan.'",
        "DMG and Healing +5% vs Ghost Master's sedan",
        71,
      ),
      mkTier(
        2,
        null,
        "DMG and Healing +10% vs Ghost Master's sedan",
        null,
        undefined,
        'TODO – Tier 2 requirement / unlock from in-game Ghost Master defensive node.',
      ),
      mkTier(
        3,
        null,
        "DMG and Healing +15% vs Ghost Master's sedan",
        null,
        undefined,
        'TODO – Tier 3 requirement / unlock from in-game Ghost Master defensive node.',
      ),
    ],
  },
  {
    type: 'strategic',
    label: 'Strategic',
    tiers: [
      mkTier(
        1,
        "Defeat Ghost Master in Hero's Realm – Sorrow of Mortalbound once and claim the reward once.",
        'DMG and Healing +7.5% vs Ghost Master',
        71,
      ),
      mkTier(
        2,
        null,
        'DMG and Healing +15% vs Ghost Master',
        null,
        undefined,
        'TODO – Tier 2 requirement / unlock (likely additional clears of Sorrow of Mortalbound).',
      ),
    ],
  },
];

export const BLADE_OUT_BOSS_TALENTS: BossTalentSeason = {
  id: 'blade_out',
  name: 'Blade Out',
  disclaimer:
    "Blade Out Boss Talents are only active in Sword Trial and Hero's Realm. You must clear the fight with the requirement met; you do not need to spend energy or claim the chest for the talent to unlock.",
  metaTitleSrc: 'assets/guides/boss-talents/boss-all-title.png',
  metaTitleName: 'One Sword Holds Ten Thousand',
  metaTitleNote:
    'Unlock all seven Blade Out hero titles (Offensive + Defensive tracks for each boss) to obtain the animated season title “One Sword Holds Ten Thousand”.',
  credits: 'Atomic-Asta, CallmeTubs, 子沈',
  bosses: [
    {
      id: 'void_king',
      order: 1,
      name: 'The Void King',
      heroTitleName: 'Formless Seer',
      avatarSrc: 'assets/guides/boss-talents/boss-the-void-king-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-the-void-king-title.png',
      contentSummary:
        'Appears in Sword Trial: Formless Calamity, Formless Mountain Pass, Ocean of Vengeance.',
      tracks: VOID_KING_TRACKS,
    },
    {
      id: 'ye_wanshan',
      order: 2,
      name: 'Ye Wanshan',
      heroTitleName: 'Coldsteel Armor',
      avatarSrc: 'assets/guides/boss-talents/boss-ye-wanshan-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-ye-wanshan-title.png',
      contentSummary:
        'Appears in Sword Trial: Cold Mountain Pass, Formless Mountain Pass, Fire of Blood and Iron, Ocean of Vengeance.',
      tracks: YE_WANSHAN_TRACKS,
    },
    {
      id: 'lucky_seventeen',
      order: 3,
      name: 'Lucky Seventeen',
      heroTitleName: 'The Humble Blade',
      avatarSrc: 'assets/guides/boss-talents/boss-lucky-seventeen-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-lucky-seventeen-title.png',
      contentSummary:
        'Appears in Sword Trial: Forging of Years, Fire of Blood and Iron, Ocean of Vengeance.',
      tracks: LUCKY_SEVENTEEN_TRACKS,
    },
    {
      id: 'sleeping_daoist',
      order: 4,
      name: 'Sleeping Daoist',
      heroTitleName: 'Unbound Donkey Rider',
      avatarSrc: 'assets/guides/boss-talents/boss-sleeping-daoist-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-sleeping-daoist-title.png',
      contentSummary:
        "Appears in Hero's Realm: Dream Jimming Pool, Dream Jimming Pool - Supreme and Sword Trial: Crimson Dream, Crimson Dream - Supreme.",
      tracks: SLEEPING_DAOIST_TRACKS,
    },
    {
      id: 'murong_yuan',
      order: 5,
      name: 'Murong Yuan',
      heroTitleName: 'Soaring Skyward',
      avatarSrc: 'assets/guides/boss-talents/boss-murong-yuan-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-murong-yuan-title.png',
      contentSummary:
        "Appears in Hero's Realm: Dream Jimming Pool, Dream Jimming Pool - Supreme, Blazing Gale Dance and Sword Trial: Crimson Dream, Crimson Dream - Supreme.",
      tracks: MURONG_YUAN_TRACKS,
    },
    {
      id: 'twin_lions',
      order: 6,
      name: 'Twin Lions',
      heroTitleName: 'Lion Dancer',
      avatarSrc: 'assets/guides/boss-talents/boss-twin-lions-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-twin-lions-title.png',
      contentSummary: "Appears in Hero's Realm: Blazing Gale Dance and Sorrow of Mortalbound.",
      tracks: TWIN_LIONS_TRACKS,
    },
    {
      id: 'ghost_master',
      order: 7,
      name: 'Ghost Master',
      heroTitleName: 'Shadow Severer',
      avatarSrc: 'assets/guides/boss-talents/boss-ghost-master-avatar.png',
      titleSrc: 'assets/guides/boss-talents/boss-ghost-master-title.png',
      contentSummary: "Appears in Hero's Realm: Sorrow of Mortalbound.",
      tracks: GHOST_MASTER_TRACKS,
    },
  ],
};
