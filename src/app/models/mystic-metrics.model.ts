// src/app/models/mystic-metrics.model.ts
//
// Core types for mystic skill damage metrics / usages.
// Designed to be tier-agnostic and future-proof (T4+).
//
// IMPORTANT DESIGN DECISION
// -------------------------
// For a given "usage" (e.g. Soaring Spin, full Leaping Toad, DB → Poet),
// mechanics like animation time and total vitality cost are treated as
// tier-invariant; they live on MysticUsageDefinition.
//
// Per-tier metrics only store avgDamage (and optionally the original
// sheet "mystic score"). All derived values such as DPS and damage-per-
// vitality should be computed at runtime from:
//
//   - usage.animTimeSeconds
//   - usage.effectiveVitality
//   - tier.avgDamage
//
// This avoids partial data issues (e.g. T2 missing DPS) and keeps the
// data model clean for T4+ in the future.

export type MysticTier = 2 | 3 | 4;

export type MysticUsageKind = 'single' | 'combo';

/**
 * Metrics for a single tested "usage" of a mystic skill or combo,
 * for a specific tier (T2, T3, later T4).
 *
 * Only values that actually change by tier are stored here. All derived
 * metrics (DPS, damage-per-vitality, combined score) should be calculated
 * by consumers from avgDamage + the usage-level mechanics.
 */
export interface MysticUsageTierMetrics {
  tier: MysticTier;

  /**
   * Average total damage of one full execution of this usage at this tier.
   * This comes directly from the Void King test sheets.
   */
  avgDamage: number;
}

/**
 * Base mechanical info for an individual mystic skill
 * (matches your mystic_skill.* ids and in-game tooltip numbers).
 */
export interface MysticSkillBase {
  /**
   * Should match your asset ids in game-assets.mystic_skill.ts,
   * e.g. "mystic_skill.soaring_spin".
   */
  id: string;

  name: string;

  cooldownSeconds: number;

  /**
   * Vitality cost per input/press, from the in-game tooltip.
   * For multi-input skills (Drunken Poet, Leaping Toad), this is
   * the base per-press cost; total per-usage vitality is represented
   * on MysticUsageDefinition.effectiveVitality.
   */
  vitalityPerInput: number;

  /**
   * Optional max number of inputs per full chain (e.g. 3 for full Leaping Toad,
   * 4 for full Drunken Poet). Not used yet; reserved for future combo planners.
   */
  maxInputsPerCast?: number;

  // Reserved for future: context/meta; not used in current charts.

  /** // TODO: use for PvE/PvP/AoE tagging later */
  tags?: string[];

  /** // TODO: 'single', 'chain', 'multi-hit', etc. */
  hitPattern?: string;

  /** // TODO: 'easy' | 'ok' | 'hard' to land reliably */
  reliability?: string;

  /** // TODO: extra notes / caveats about the skill */
  notes?: string;
}

/**
 * Convenience map type so we can reference tiers as record-like
 * while still allowing some tiers to be missing (e.g. only T3 tested).
 */
export type MysticUsageTierMap = Partial<Record<MysticTier, MysticUsageTierMetrics>>;

/**
 * A tested usage; can be a single skill (Soaring Spin) or a combo
 * (Leaping Toad (Full) → Lion's Roar, Dragon's Breath → Drunken Poet).
 *
 * Each usage has per-tier metrics taken from test sheets, plus
 * tier-invariant mechanics (effective vitality + animation time).
 */
export interface MysticUsageDefinition {
  /**
   * Internal id, e.g. "mystic_usage.soaring_spin",
   * "mystic_usage.leaping_toad_full_lions_roar".
   */
  id: string;

  /**
   * Display label; what you show in legends / tooltips.
   */
  label: string;

  kind: MysticUsageKind;

  /**
   * Underlying mystic skills (in order) used for this usage.
   * These should match the ids in MYSTIC_SKILL_ASSETS so you can look up:
   *  - icon files
   *  - tooltip copy
   */
  tooltipIds: string[];

  /**
   * Total vitality spent for one full execution of this usage window.
   * Matches the sheet’s "Vitality" column and is assumed tier-invariant.
   *
   * Example:
   *  - full Drunken Poet chain  = 40
   *  - full Leaping Toad        = 55
   *  - Leaping Toad → Lion's Roar = 85
   */
  effectiveVitality: number;

  /**
   * Animation time for one full execution of this usage window (seconds).
   * Comes from the T3 sheet where available and is assumed tier-invariant.
   *
   * Some usages (e.g. Dragon's Breath full animation) do not have this yet;
   * in those cases, consumers should treat DPS / time-based charts as
   * unavailable for that usage.
   */
  animTimeSeconds?: number;

  /**
   * Per-tier numbers for this usage.
   * Example: T2 + T3 for Soaring Spin; only T3 for Leaping Toad Single, etc.
   */
  tiers: MysticUsageTierMap;
}
