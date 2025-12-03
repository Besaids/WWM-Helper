// path-season.blade-out.ts

import { PathSeasonConfig } from '../../models';

export const BLADE_OUT_SEASON: PathSeasonConfig = {
  seasonId: 'blade-out',
  seasonName: 'Blade Out',
  globalRules: {
    combatChallengeDpsLabel: '[Combat Challenge] Complete Any Campaign in Solo Mode',
    combatChallengeHealerLabel: '[Combat Challenge] Defeat any Boss in Online Mode',
    notes: [
      'For DPS/tank paths, the Combat Challenge requires defeating 3 campaign bosses in solo mode using the full path martial arts (both weapons equipped).',
      'For healer paths, the Combat Challenge requires defeating 3 bosses in online (multiplayer) mode using the full path martial arts.',
      "Unless a challenge explicitly mentions an Inner Way, 'martial art combination' means just the two weapons for that path.",
      'You can use your own loadout or the recommended one; stats are equalized inside Trials, but you must use both weapons (plus specific Inner Way if required).',
    ],
  },
  paths: [
    {
      pathId: 'bellstrike-splendor',
      pathName: 'Bellstrike - Splendor',
      category: 'DPS Melee Combat',
      role: 'Melee DPS',
      weapons: ['Nameless Sword', 'Nameless Spear'],
      seasonalChallenges: [
        {
          id: 'blade-out-bellstrike-splendor-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Complete Any Campaign in Solo Mode',
          description:
            'Using the full Bellstrike - Splendor martial arts combination, defeat 3 campaign bosses in solo mode.',
          conditions: {
            boss: 'Any campaign boss',
            mode: 'Campaign – solo',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bellstrike-splendor-martial-void-king',
          order: 2,
          category: 'martial-art',
          name: '[Martial Art] Vagrant Sword vs The Void King',
          description:
            "While using both Bellstrike - Splendor weapons, defeat The Void King (including trials). In a single run, successfully hit Nameless Sword's Vagrant Sword 10 times. Repeat this requirement across 3 runs (3/3).",
          conditions: {
            boss: 'The Void King',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Nameless Sword',
            skill: 'Vagrant Sword',
            perRunRequirement: 'Hit Vagrant Sword 10 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bellstrike-splendor-martial-sleeping-daoist',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Projectile Immunity vs Sleeping Daoist',
          description:
            'While using both Bellstrike - Splendor weapons, defeat Sleeping Daoist (including trials). In a single run, successfully achieve Projectile Immunity with the Nameless Spear charged skill Sword Dance 10 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Sleeping Daoist',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Nameless Spear',
            skill: 'Sword Dance (charged heavy attack)',
            perRunRequirement: 'Block/absorb projectiles 10 times with Sword Dance in one run',
            runsRequired: 3,
            notes:
              'The spin must actually absorb incoming projectiles; just spinning without being hit does not count.',
          },
        },
        {
          id: 'blade-out-bellstrike-splendor-inner-sword-morph',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] Sword Morph triple waves',
          description:
            "While using both Bellstrike - Splendor weapons and the Inner Way Sword Morph, defeat any single-player boss (including trials). In each qualifying run, successfully release all three sword waves of Nameless Sword's Vagrant Sword triple slash 5 times. Repeat this requirement across 5 runs (5/5).",
          conditions: {
            boss: 'Any single-player boss',
            mode: 'Campaign or Trial – single-player',
            innerWay: 'Sword Morph',
            weapon: 'Nameless Sword',
            skill: 'Vagrant Sword (triple sword waves)',
            perRunRequirement: 'Land all three waves 5 times in one run',
            runsRequired: 5,
          },
        },
        {
          id: 'blade-out-bellstrike-splendor-season-ye-wanshan',
          order: 5,
          category: 'season',
          name: '[Season Challenge] Ye Wanshan time trial',
          description:
            'Using the full Bellstrike - Splendor martial arts combination, complete the Ye Wanshan trial on Hard or Abyss difficulty within 3 minutes (1/1).',
          conditions: {
            boss: 'Ye Wanshan',
            mode: 'Trial – Hard or Abyss',
            timeLimitSeconds: 180,
            runsRequired: 1,
          },
        },
      ],
    },
    {
      pathId: 'bellstrike-umbra',
      pathName: 'Bellstrike - Umbra',
      category: 'DPS Melee Combat',
      role: 'Melee DPS',
      weapons: ['Strategic Sword', 'Heavenquaker Spear'],
      seasonalChallenges: [
        {
          id: 'blade-out-bellstrike-umbra-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Complete Any Campaign in Solo Mode',
          description:
            'Using the full Bellstrike - Umbra martial arts combination, defeat 3 campaign bosses in solo mode.',
          conditions: {
            boss: 'Any campaign boss',
            mode: 'Campaign – solo',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bellstrike-umbra-martial-lucky-seventeen',
          order: 2,
          category: 'martial-art',
          name: '[Martial Art] Bleed vs Lucky Seventeen',
          description:
            'While using both Bellstrike - Umbra weapons, defeat Lucky Seventeen (including trial). In a single run, successfully inflict the Bleeding effect with the Strategic Sword 15 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Lucky Seventeen',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Strategic Sword',
            effect: 'Bleeding',
            perRunRequirement: 'Apply Bleeding 15 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bellstrike-umbra-martial-dao-lord',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Spring Surge vs Dao Lord',
          description:
            'While using both Bellstrike - Umbra weapons, defeat Dao Lord (including trial). In a single run, successfully gain the Spring Surge effect with the Heavenquaker Spear 5 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Dao Lord',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Heavenquaker Spear',
            effect: 'Spring Surge',
            perRunRequirement: 'Trigger Spring Surge 5 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bellstrike-umbra-inner-sword-horizon',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] High Bleed with Crisscrossing Blades',
          description:
            "While using both Bellstrike - Umbra weapons and the Inner Way Sword Horizon, defeat any single-player boss (including trials). In each qualifying run, successfully deal High Bleed damage 5 times with Strategic Sword's Crisscrossing Blade/Swords. Repeat this requirement across 5 runs (5/5).",
          conditions: {
            boss: 'Any single-player boss',
            mode: 'Campaign or Trial – single-player',
            innerWay: 'Sword Horizon',
            weapon: 'Strategic Sword',
            skill: 'Crisscrossing Blade/Swords',
            effect: 'High Bleed damage',
            perRunRequirement: 'Deal High Bleed damage 5 times in one run',
            runsRequired: 5,
          },
        },
        {
          id: 'blade-out-bellstrike-umbra-season-earth-fiend-god',
          order: 5,
          category: 'season',
          name: '[Season Challenge] Earth Fiend God time trial',
          description:
            'Using the full Bellstrike - Umbra martial arts combination, complete the Earth Fiend God trial on Hard or Abyss difficulty within 3 minutes (1/1).',
          conditions: {
            boss: 'Earth Fiend God',
            mode: 'Trial – Hard or Abyss',
            timeLimitSeconds: 180,
            runsRequired: 1,
          },
        },
      ],
    },
    {
      pathId: 'stonesplit-might',
      pathName: 'Stonesplit - Might',
      category: 'Tank Melee Combat',
      role: 'Tank',
      weapons: ['Thundercry Blade', 'Stormbreaker Spear'],
      seasonalChallenges: [
        {
          id: 'blade-out-stonesplit-might-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Complete Any Campaign in Solo Mode',
          description:
            'Using the full Stonesplit - Might martial arts combination, defeat 3 campaign bosses in solo mode.',
          conditions: {
            boss: 'Any campaign boss',
            mode: 'Campaign – solo',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-stonesplit-might-martial-qianye-heavens-shift',
          order: 2,
          category: 'martial-art',
          name: "[Martial Art] Heaven's Shift vs Qianye",
          description:
            "While using both Stonesplit - Might weapons, defeat Qianye (including trial). In a single run, successfully use the Heaven's Shift Perception Skill of the Thundercry Blade 3 times. Repeat this requirement across 3 runs (3/3).",
          conditions: {
            boss: 'Qianye',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Thundercry Blade',
            skill: "Heaven's Shift (Perception Skill)",
            perRunRequirement: "Use Heaven's Shift 3 times in one run",
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-stonesplit-might-martial-dao-lord-storm-roar',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Storm Roar vs Dao Lord',
          description:
            "While using both Stonesplit - Might weapons, defeat Dao Lord (including trial). In a single run, successfully Taunt enemies 5 times with the Stormbreaker Spear's Storm Roar skill. Repeat this requirement across 3 runs (3/3).",
          conditions: {
            boss: 'Dao Lord',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Stormbreaker Spear',
            skill: 'Storm Roar',
            effect: 'Taunt',
            perRunRequirement: 'Apply Taunt with Storm Roar 5 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-stonesplit-might-inner-special-counter',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] Thundercry special counterattacks',
          description:
            "While using both Stonesplit - Might weapons, defeat any single-player boss (including trial). In each qualifying run, successfully use Thundercry Blade's Special Counterattack 5 times. Repeat this requirement across 5 runs (5/5).",
          conditions: {
            boss: 'Any single-player boss',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Thundercry Blade',
            skill: 'Special Counterattack',
            perRunRequirement: 'Execute the Special Counterattack 5 times in one run',
            runsRequired: 5,
            notes:
              'This Inner Way challenge does not require Exquisite Scenery; only the Season Challenge does.',
          },
        },
        {
          id: 'blade-out-stonesplit-might-season-qianye-exquisite-scenery',
          order: 5,
          category: 'season',
          name: '[Season Challenge] Qianye clear with Exquisite Scenery',
          description:
            'While using both Stonesplit - Might weapons and the Inner Way Exquisite Scenery, defeat Qianye in trials on Hard or Abyss difficulty while never letting your HP fall below 50% (1/1).',
          conditions: {
            boss: 'Qianye',
            mode: 'Trial – Hard or Abyss',
            innerWay: 'Exquisite Scenery',
            hpThresholdMin: 0.5,
            runsRequired: 1,
          },
        },
      ],
    },
    {
      pathId: 'bamboocut-wind',
      pathName: 'Bamboocut - Wind',
      category: 'DPS Melee Combat',
      role: 'Melee DPS',
      weapons: ['Infernal Twinblades', 'Mortal Rope Dart'],
      seasonalChallenges: [
        {
          id: 'blade-out-bamboocut-wind-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Complete Any Campaign in Solo Mode',
          description:
            'Using the full Bamboocut - Wind martial arts combination, defeat 3 campaign bosses in solo mode.',
          conditions: {
            boss: 'Any campaign boss',
            mode: 'Campaign – solo',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bamboocut-wind-martial-lucky-seventeen',
          order: 2,
          category: 'martial-art',
          name: '[Martial Art] Flamelash vs Lucky Seventeen',
          description:
            'While using both Bamboocut - Wind weapons, defeat Lucky Seventeen (including trial). In a single run, maintain the Infernal Twinblades\' active Flamelash state 3 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Lucky Seventeen',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Infernal Twinblades',
            effect: 'Flamelash state',
            perRunRequirement: 'Enter/maintain Flamelash 3 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bamboocut-wind-martial-void-king',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Coordinated strikes vs The Void King',
          description:
            'While using both Bamboocut - Wind weapons, defeat The Void King (including trial). In a single run, use Mortal Rope Dart to launch a coordinated strike 30 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'The Void King',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Mortal Rope Dart',
            skill: 'Coordinated strike',
            perRunRequirement: 'Perform 30 coordinated strikes in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-bamboocut-wind-inner-echoes-of-oblivion',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] Samsara with Echoes of Oblivion',
          description:
            'While using both Bamboocut - Wind weapons and the Inner Way Echoes of Oblivion, defeat any single-player boss (excluding trials). In each qualifying run, gain the Samsara effect 5 times. Repeat this requirement across 5 runs (5/5).',
          conditions: {
            boss: 'Any single-player boss (excluding trials)',
            mode: 'Campaign – single-player only (no trials)',
            innerWay: 'Echoes of Oblivion (Breakthrough 1 required)',
            effect: 'Samsara',
            perRunRequirement: 'Gain Samsara 5 times in one run',
            runsRequired: 5,
            notes:
              'Samsara only activates after the first breakthrough on Echoes of Oblivion.',
          },
        },
        {
          id: 'blade-out-bamboocut-wind-season-murong-yuan',
          order: 5,
          category: 'season',
          name: '[Season Challenge] Murong Yuan time trial',
          description:
            'Using the full Bamboocut - Wind martial arts combination, complete the Murong Yuan trial on Hard or Abyss difficulty within 5 minutes (1/1).',
          conditions: {
            boss: 'Murong Yuan',
            mode: 'Trial – Hard or Abyss',
            timeLimitSeconds: 300,
            runsRequired: 1,
          },
        },
      ],
    },
    {
      pathId: 'silkbind-jade',
      pathName: 'Silkbind - Jade',
      category: 'DPS Ranged Combat',
      role: 'Ranged DPS',
      weapons: ['Ninefold Umbrella', 'Inkwell Fan'],
      seasonalChallenges: [
        {
          id: 'blade-out-silkbind-jade-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Complete Any Campaign in Solo Mode',
          description:
            'Using the full Silkbind - Jade martial arts combination, defeat 3 campaign bosses in solo mode.',
          conditions: {
            boss: 'Any campaign boss',
            mode: 'Campaign – solo',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-jade-martial-snake-doctor',
          order: 2,
          category: 'martial-art',
          name: '[Martial Art] Spring Sorrow vs Snake Doctor',
          description:
            'While using both Silkbind - Jade weapons, defeat Snake Doctor (including trial). In a single run, hit the enemy 5 times with the umbrella skill Spring Sorrow. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Snake Doctor',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Ninefold Umbrella',
            skill: 'Spring Sorrow',
            perRunRequirement: 'Hit the enemy 5 times with Spring Sorrow in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-jade-martial-sleeping-daoist',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Jadewind Shield vs Sleeping Daoist',
          description:
            "While using both Silkbind - Jade weapons, defeat Sleeping Daoist (including trial). In a single run, use Inkwell Fan's Jadewind Shield 5 times. Repeat this requirement across 3 runs (3/3).",
          conditions: {
            boss: 'Sleeping Daoist',
            mode: 'Campaign or Trial – single-player',
            weapon: 'Inkwell Fan',
            skill: 'Jadewind Shield',
            perRunRequirement: 'Cast Jadewind Shield 5 times in one run',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-jade-inner-blossom-barrage',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] Combo stacks with Blossom Barrage',
          description:
            'While using both Silkbind - Jade weapons and the Inner Way Blossom Barrage, defeat any single-player boss (including trials). In each qualifying run, apply the Combo effect from the Ninefold Umbrella to the enemy 10 times. Repeat this requirement across 5 runs (5/5).',
          conditions: {
            boss: 'Any single-player boss',
            mode: 'Campaign or Trial – single-player',
            innerWay: 'Blossom Barrage',
            weapon: 'Ninefold Umbrella',
            effect: 'Combo',
            perRunRequirement: 'Apply the Combo effect 10 times in one run',
            runsRequired: 5,
            notes:
              'Apply Blossom Barrage with Spring Sorrow, then hit the target with any umbrella attack to generate Combo stacks.',
          },
        },
        {
          id: 'blade-out-silkbind-jade-season-sleeping-daoist',
          order: 5,
          category: 'season',
          name: '[Season Challenge] Sleeping Daoist time trial',
          description:
            'Using the full Silkbind - Jade martial arts combination, complete the Sleeping Daoist trial on Hard or Abyss difficulty within 6 minutes (1/1).',
          conditions: {
            boss: 'Sleeping Daoist',
            mode: 'Trial – Hard or Abyss',
            timeLimitSeconds: 360,
            runsRequired: 1,
          },
        },
      ],
    },
    {
      pathId: 'silkbind-deluge',
      pathName: 'Silkbind - Deluge',
      category: 'Heal Ranged Combat',
      role: 'Healer',
      weapons: ['Soulshade Umbrella', 'Panacea Fan'],
      seasonalChallenges: [
        {
          id: 'blade-out-silkbind-deluge-combat',
          order: 1,
          category: 'combat',
          name: '[Combat Challenge] Defeat any Boss in Online Mode',
          description:
            'Using the full Silkbind - Deluge martial arts combination, defeat 3 bosses in online (multiplayer) mode.',
          conditions: {
            boss: 'Any boss',
            mode: 'Online – multiplayer',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-deluge-martial-endless-cloud',
          order: 2,
          category: 'martial-art',
          name: '[Martial Art] Endless Cloud burst heals',
          description:
            'While using both Silkbind - Deluge weapons, defeat any multi-player boss. In a single run, successfully use the Endless Cloud skill (consuming all stacks of Dew for burst healing) 5 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Any multi-player boss',
            mode: 'Online – multiplayer',
            weapon: 'Panacea Fan',
            skill: 'Endless Cloud',
            perRunRequirement:
              'Use Endless Cloud 5 times in one run (each cast consumes all Dew stacks for a burst heal)',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-deluge-martial-floating-grace',
          order: 3,
          category: 'martial-art',
          name: '[Martial Art] Floating Grace buffs',
          description:
            'While using both Silkbind - Deluge weapons, defeat any multi-player boss. In a single run, use the Soulshade Umbrella skill Floating Grace to aid/buff allies 10 times. Repeat this requirement across 3 runs (3/3).',
          conditions: {
            boss: 'Any multi-player boss',
            mode: 'Online – multiplayer',
            weapon: 'Soulshade Umbrella',
            skill: 'Floating Grace',
            perRunRequirement: 'Use Floating Grace 10 times in one run to aid/buff allies',
            runsRequired: 3,
          },
        },
        {
          id: 'blade-out-silkbind-deluge-inner-royal-remedy',
          order: 4,
          category: 'inner-way',
          name: '[Inner Way] Royal Remedy water clone Dew restores',
          description:
            "While using both Silkbind - Deluge weapons and the Inner Way Royal Remedy, defeat any multi-player boss. In each qualifying run, have the Panacea Fan's water clone restore extra Dew to yourself 20 times. Repeat this requirement across 5 runs (5/5).",
          conditions: {
            boss: 'Any multi-player boss',
            mode: 'Online – multiplayer',
            innerWay: 'Royal Remedy',
            weapon: 'Panacea Fan',
            effect: 'Water clone restoring extra Dew',
            perRunRequirement: 'Water clone restores extra Dew to you 20 times in one run',
            runsRequired: 5,
          },
        },
        {
          id: 'blade-out-silkbind-deluge-season-heros-realm',
          order: 5,
          category: 'season',
          name: "[Season Challenge] Hero's Realm no-down clear",
          description:
            "While using both Silkbind - Deluge weapons, complete any Hero's Realm without ever being Severely Injured or downed (1/1). This Season Challenge unlocks at level 51.",
          conditions: {
            content: "Any Hero's Realm",
            mode: 'Online – multiplayer',
            restriction: 'No Severe Injury / no being downed during the run',
            runsRequired: 1,
            unlockLevel: 51,
          },
        },
      ],
    },
  ],
};
