import { MysticBreakthroughItemId, MysticSkillId } from '../../configs';

/**
 * Progress state for a single mystic skill.
 */
export interface MysticProgress {
  tier: number; // 1..MYSTIC_MAX_TIER
  rank: number; // 0..MYSTIC_MAX_RANK_PER_TIER-1
  included: boolean; // whether this skill is counted in global totals
}

/**
 * Map of skill id to progress state.
 */
export type MysticProgressMap = Record<MysticSkillId, MysticProgress>;

/**
 * Aggregated material totals.
 */
export interface MaterialTotals {
  /** Ebon Iron per level (1–4). */
  ebonIron: Record<1 | 2 | 3 | 4, number>;
  /** Total breakthrough herb items for one skill. */
  herbs: number;
}

/**
 * A single step in the upgrade plan.
 */
export interface TierStep {
  fromTier: number;
  fromRank: number;
  toTier: number;
  toRank: number;
  label: string;
  materials: MaterialTotals;
}

/**
 * Full upgrade plan for a single skill.
 */
export interface SkillUpgradePlan {
  skillId: MysticSkillId;
  materialItemId?: MysticBreakthroughItemId;
  steps: TierStep[];
  total: MaterialTotals;
}

/**
 * Global summary across all included skills.
 */
export interface GlobalMaterialSummary {
  ebonIron: Record<1 | 2 | 3 | 4, number>;
  herbsByItem: Record<string, number>; // keyed by MysticBreakthroughItemId
}
