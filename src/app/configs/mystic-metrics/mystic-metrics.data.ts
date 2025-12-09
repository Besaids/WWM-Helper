// src/app/configs/mystic-metrics/mystic-metrics.data.ts
//
// Central data source for Mystic Skill damage metrics used in charts / planners.
//
// There are two layers of data here:
//
// 1) MYSTIC_SKILL_BASE_DATA
//    - Raw in-game facts per mystic (cooldown, vitality per input).
//    - These come from your own tooltip screenshots, *not* from the YT sheet.
//    - Safe to reuse for things like future combo planners.
//
// 2) MYSTIC_USAGE_METRICS
//    - Per-usage, per-tier damage tests taken from the Void King spreadsheets
//      in the YouTube videos by MidirSkry.
//    - Each row represents a *tested usage window*:
//        • sometimes a single press (Soaring Spin),
//        • sometimes a full multi-input chain (full Drunken Poet, full Leaping Toad),
//        • sometimes a combo of two mystics (Leaping Toad → Lion’s Roar,
//          Dragon’s Breath → Drunken Poet).
//    - effectiveVitality matches the sheet’s “Vitality” column; it is the
//      *total vitality spent to perform that tested usage*, which may differ
//      from the tooltip vitality-per-press.
//    - animTimeSeconds is taken from the T3 sheet where present and assumed
//      to be the same for all tiers of that usage.
//
// IMPORTANT:
// - avgDamage, effectiveVitality, and animTimeSeconds values should match the
//   sheets; if you discover mistakes, fix them in the source sheet and then
//   paste updated values into this file.
// - DPS, damage-per-vitality, and combined scores should be computed at
//   runtime from these base values, not stored here, to avoid partial data.

import { MysticSkillBase, MysticUsageDefinition, MysticUsageTierMetrics } from '../../models';

// -----------------------------------------------------------------------------
// Base data – per-mystic cooldowns and vitality-per-input
// -----------------------------------------------------------------------------

/**
 * Base in-game data: cooldowns and per-input vitality costs
 * for each mystic skill that appears in the current T2/T3 damage sheets.
 *
 * These values come from your own in-game tooltips (screenshots),
 * not from the YouTube spreadsheets.
 */
export const MYSTIC_SKILL_BASE_DATA: MysticSkillBase[] = [
  {
    id: 'mystic_skill.soaring_spin',
    name: 'Soaring Spin',
    cooldownSeconds: 12.0,
    vitalityPerInput: 15,
  },
  {
    id: 'mystic_skill.leaping_toad',
    name: 'Leaping Toad',
    cooldownSeconds: 8.0,
    vitalityPerInput: 25,
    maxInputsPerCast: 3, // initial jump + 2 recasts to reach Golden Toad
  },
  {
    id: 'mystic_skill.dragons_breath',
    name: "Dragon's Breath",
    cooldownSeconds: 6.0,
    vitalityPerInput: 20,
  },
  {
    id: 'mystic_skill.drunken_poet',
    name: 'Drunken Poet',
    cooldownSeconds: 0.1,
    vitalityPerInput: 10,
    maxInputsPerCast: 4, // full combo = 4 presses (sheet uses 40 vitality)
  },
  {
    id: 'mystic_skill.guardian_palm',
    name: 'Guardian Palm',
    cooldownSeconds: 8.0,
    vitalityPerInput: 30,
  },
  {
    id: 'mystic_skill.lions_roar',
    name: "Lion's Roar",
    cooldownSeconds: 12.0,
    vitalityPerInput: 30,
  },
  {
    id: 'mystic_skill.yaksha_rush',
    name: 'Yaksha Rush',
    cooldownSeconds: 2.0,
    vitalityPerInput: 15,
  },
  {
    id: 'mystic_skill.free_morph',
    name: 'Free Morph',
    cooldownSeconds: 3.0,
    vitalityPerInput: 35,
  },
  {
    id: 'mystic_skill.wolflike_frenzy',
    name: 'Wolflike Frenzy',
    cooldownSeconds: 3.0,
    vitalityPerInput: 35,
  },
  {
    id: 'mystic_skill.flaming_meteor',
    name: 'Flaming Meteor',
    cooldownSeconds: 30.0,
    vitalityPerInput: 60,
  },
  {
    id: 'mystic_skill.talon_strike',
    name: 'Talon Strike',
    cooldownSeconds: 2.0,
    vitalityPerInput: 15,
  },
  {
    id: 'mystic_skill.honking_havoc',
    name: 'Honking Havoc',
    cooldownSeconds: 40.0,
    vitalityPerInput: 70,
  },
];

// -----------------------------------------------------------------------------
// Test metrics – helper builders
// -----------------------------------------------------------------------------

/**
 * Small helpers so T2/T3 entries stay compact and strongly typed.
 */
function t2(partial: Omit<MysticUsageTierMetrics, 'tier'>): MysticUsageTierMetrics {
  return { tier: 2, ...partial };
}

function t3(partial: Omit<MysticUsageTierMetrics, 'tier'>): MysticUsageTierMetrics {
  return { tier: 3, ...partial };
}

// -----------------------------------------------------------------------------
// Test metrics – per-usage, per-tier
// -----------------------------------------------------------------------------

/**
 * Damage metrics for each tested usage at T2/T3,
 * copied from the creator's Google Sheets (Void King tests).
 *
 * For each usage:
 *  - effectiveVitality (on MysticUsageDefinition) = sheet “Vitality” column
 *    (total spent for that usage, tier-invariant).
 *  - animTimeSeconds (on MysticUsageDefinition)  = sheet “Anim Time” (T3 only);
 *    assumed tier-invariant when present.
 *  - avgDamage (per tier)                        = sheet “Average Damage”.
 *  - mysticScore (per tier, optional)            = sheet “Mystic Score
 *    (DPS × DpV / 1000)” when provided (mostly T3).
 *
 * DPS and damage-per-vitality should be computed from these base values:
 *   dps = avgDamage / animTimeSeconds
 *   dpv = avgDamage / effectiveVitality
 */
export const MYSTIC_USAGE_METRICS: MysticUsageDefinition[] = [
  // === Single skills =========================================================

  {
    id: 'mystic_usage.soaring_spin',
    label: 'Soaring Spin',
    kind: 'single',
    tooltipIds: ['mystic_skill.soaring_spin'],
    effectiveVitality: 15,
    animTimeSeconds: 2.1,
    tiers: {
      2: t2({
        avgDamage: 6633.7,
      }),
      3: t3({
        avgDamage: 7977,
      }),
    },
  },

  {
    id: 'mystic_usage.leaping_toad_single',
    label: 'Leaping Toad (Single)',
    kind: 'single',
    tooltipIds: ['mystic_skill.leaping_toad'],
    effectiveVitality: 25,
    animTimeSeconds: 1.97,
    tiers: {
      // No T2 single-hit entry in sheet; only full Toad at T2.
      3: t3({
        avgDamage: 7552,
      }),
    },
  },

  {
    id: 'mystic_usage.leaping_toad_full',
    label: 'Leaping Toad (Full)',
    kind: 'single',
    tooltipIds: ['mystic_skill.leaping_toad'],
    effectiveVitality: 55,
    animTimeSeconds: 6.66,
    tiers: {
      2: t2({
        avgDamage: 11993.7,
      }),
      3: t3({
        avgDamage: 17261,
      }),
    },
  },

  {
    id: 'mystic_usage.dragons_breath_full',
    label: "Dragon's Breath (Full Animation)",
    kind: 'single',
    tooltipIds: ['mystic_skill.dragons_breath'],
    effectiveVitality: 20,
    // No Anim Time provided in sheet for this variant; leave undefined.
    animTimeSeconds: undefined,
    tiers: {
      2: t2({
        avgDamage: 5780.6,
      }),
      // No separate T3 “full animation” test; for T3 we only have cancel and DB → Poet.
    },
  },

  {
    id: 'mystic_usage.dragons_breath_cancel',
    label: "Dragon's Breath (Animation Cancel)",
    kind: 'single',
    tooltipIds: ['mystic_skill.dragons_breath'],
    effectiveVitality: 20,
    animTimeSeconds: 2.0,
    tiers: {
      2: t2({
        avgDamage: 5511.3,
      }),
      3: t3({
        avgDamage: 6124,
      }),
    },
  },

  {
    id: 'mystic_usage.yaksha_rush',
    label: 'Yaksha Rush',
    kind: 'single',
    tooltipIds: ['mystic_skill.yaksha_rush'],
    effectiveVitality: 15,
    animTimeSeconds: 2.0,
    tiers: {
      2: t2({
        avgDamage: 3315.3,
      }),
      3: t3({
        avgDamage: 4142,
      }),
    },
  },

  {
    id: 'mystic_usage.free_morph',
    label: 'Free Morph',
    kind: 'single',
    tooltipIds: ['mystic_skill.free_morph'],
    effectiveVitality: 35,
    animTimeSeconds: 3.46,
    tiers: {
      2: t2({
        avgDamage: 6628.2,
      }),
      3: t3({
        avgDamage: 8177,
      }),
    },
  },

  {
    id: 'mystic_usage.wolflike_frenzy',
    label: 'Wolflike Frenzy',
    kind: 'single',
    tooltipIds: ['mystic_skill.wolflike_frenzy'],
    effectiveVitality: 35,
    animTimeSeconds: 3.27,
    tiers: {
      2: t2({
        avgDamage: 6577.7,
      }),
      3: t3({
        avgDamage: 7009,
      }),
    },
  },

  {
    id: 'mystic_usage.talon_strike',
    label: 'Talon Strike',
    kind: 'single',
    tooltipIds: ['mystic_skill.talon_strike'],
    effectiveVitality: 15,
    animTimeSeconds: 2.37,
    tiers: {
      2: t2({
        avgDamage: 2763.5,
      }),
      3: t3({
        avgDamage: 2902,
      }),
    },
  },

  {
    id: 'mystic_usage.flaming_meteor',
    label: 'Flaming Meteor',
    kind: 'single',
    tooltipIds: ['mystic_skill.flaming_meteor'],
    effectiveVitality: 60,
    animTimeSeconds: 10.03,
    tiers: {
      2: t2({
        avgDamage: 10034.2,
      }),
      3: t3({
        avgDamage: 13918,
      }),
    },
  },

  {
    id: 'mystic_usage.lions_roar',
    label: "Lion's Roar",
    kind: 'single',
    tooltipIds: ['mystic_skill.lions_roar'],
    effectiveVitality: 30,
    animTimeSeconds: 3.8,
    tiers: {
      2: t2({
        avgDamage: 3554.4,
      }),
      3: t3({
        avgDamage: 5010,
      }),
    },
  },

  {
    id: 'mystic_usage.drunken_poet',
    label: 'Drunken Poet (standalone)',
    kind: 'single',
    tooltipIds: ['mystic_skill.drunken_poet'],
    effectiveVitality: 40,
    animTimeSeconds: 5.16,
    tiers: {
      2: t2({
        avgDamage: 5896.2,
      }),
      3: t3({
        avgDamage: 6433,
      }),
    },
  },

  {
    id: 'mystic_usage.guardian_palm_rite',
    label: 'Guardian Palm (Rite)',
    kind: 'single',
    tooltipIds: ['mystic_skill.guardian_palm'],
    effectiveVitality: 30,
    animTimeSeconds: 6.53,
    tiers: {
      2: t2({
        avgDamage: 3986.4,
      }),
      3: t3({
        avgDamage: 11815,
      }),
    },
  },

  // Note: Honking Havoc is intentionally omitted here for now.
  // The T3 sheet lacks anim time and a reliable damage window definition.
  // We keep its base data in MYSTIC_SKILL_BASE_DATA, and can add a
  // MYSTIC_USAGE_METRICS entry later once we have proper tests.

  // === Combos ===============================================================

  {
    id: 'mystic_usage.dragons_breath_drunken_poet',
    label: "Dragon's Breath → Drunken Poet",
    kind: 'combo',
    tooltipIds: ['mystic_skill.dragons_breath', 'mystic_skill.drunken_poet'],
    effectiveVitality: 60,
    animTimeSeconds: 6.43,
    tiers: {
      2: t2({
        avgDamage: 11000.8,
      }),
      3: t3({
        avgDamage: 20190,
      }),
    },
  },

  {
    id: 'mystic_usage.leaping_toad_full_lions_roar',
    label: "Leaping Toad (Full) → Lion's Roar",
    kind: 'combo',
    tooltipIds: ['mystic_skill.leaping_toad', 'mystic_skill.lions_roar'],
    effectiveVitality: 85,
    animTimeSeconds: 11.07,
    tiers: {
      2: t2({
        avgDamage: 18681.6,
      }),
      3: t3({
        avgDamage: 24295,
      }),
    },
  },

  {
    id: 'mystic_usage.leaping_toad_single_lions_roar',
    label: "Leaping Toad (Single) → Lion's Roar",
    kind: 'combo',
    tooltipIds: ['mystic_skill.leaping_toad', 'mystic_skill.lions_roar'],
    effectiveVitality: 55,
    animTimeSeconds: 6.2,
    tiers: {
      // Only tested at T3.
      3: t3({
        avgDamage: 14906,
      }),
    },
  },
];
