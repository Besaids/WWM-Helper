import { Injectable, signal, computed } from '@angular/core';
import {
  MysticSkillId,
  MYSTIC_SKILL_UPGRADES,
  MYSTIC_TIER_COSTS,
  MYSTIC_MAX_TIER,
  MYSTIC_MAX_RANK_PER_TIER,
} from '../../configs';
import {
  MysticProgress,
  MysticProgressMap,
  MaterialTotals,
  TierStep,
  SkillUpgradePlan,
  GlobalMaterialSummary,
} from '../../models';

const STORAGE_KEY = 'wwm-helper.mystic-upgrades';
const DEBOUNCE_MS = 250;

@Injectable({ providedIn: 'root' })
export class MysticUpgradePlannerService {
  // Internal state
  private readonly progressMapSignal = signal<MysticProgressMap>(this.loadProgressMap());
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  // Public signals for reactive UI
  readonly progressMap = this.progressMapSignal.asReadonly();

  // Derived: max tier from config (future-proof)
  readonly maxTier = computed(() => {
    const maxFromCosts = Math.max(...MYSTIC_TIER_COSTS.map((c) => c.tier));
    return Math.max(maxFromCosts, MYSTIC_MAX_TIER);
  });

  readonly maxRankPerTier = MYSTIC_MAX_RANK_PER_TIER;

  // ------------------------------------------------------------------
  // Progress getters/setters
  // ------------------------------------------------------------------

  getProgress(skillId: MysticSkillId): MysticProgress {
    return this.progressMapSignal()[skillId];
  }

  updateProgress(skillId: MysticSkillId, partial: Partial<MysticProgress>): void {
    const current = this.progressMapSignal()[skillId];
    const updated = { ...current, ...partial };

    // Clamp values
    updated.tier = Math.max(1, Math.min(updated.tier, this.maxTier()));
    updated.rank = Math.max(0, Math.min(updated.rank, MYSTIC_MAX_RANK_PER_TIER - 1));

    this.progressMapSignal.update((map) => ({
      ...map,
      [skillId]: updated,
    }));

    this.debouncedSave();
  }

  toggleIncluded(skillId: MysticSkillId): void {
    const current = this.progressMapSignal()[skillId];
    this.updateProgress(skillId, { included: !current.included });
  }

  // ------------------------------------------------------------------
  // Calculation: per-skill plan
  // ------------------------------------------------------------------

  planUpgrade(
    skillId: MysticSkillId,
    current: MysticProgress,
    targetTier: number,
    targetRank: number,
  ): SkillUpgradePlan {
    const skillConfig = MYSTIC_SKILL_UPGRADES.find((s) => s.id === skillId);
    const materialItemId = skillConfig?.materialItemId;

    const steps: TierStep[] = [];
    const total: MaterialTotals = this.emptyTotals();

    let curTier = current.tier;
    let curRank = current.rank;

    // Walk tier-by-tier
    while (curTier < targetTier || (curTier === targetTier && curRank < targetRank)) {
      const tierCost = MYSTIC_TIER_COSTS.find((tc) => tc.tier === curTier);
      if (!tierCost) break; // safety

      const isLastTier = curTier === targetTier;
      const endRankThisTier = isLastTier ? targetRank : MYSTIC_MAX_RANK_PER_TIER - 1;

      // Step 1: ranks within this tier (curRank -> endRankThisTier)
      if (curRank < endRankThisTier) {
        const ranksToUpgrade = endRankThisTier - curRank;
        const ironAmount = ranksToUpgrade * tierCost.ironPerRank;

        const stepMaterials = this.emptyTotals();
        stepMaterials.ebonIron[tierCost.ironLevel as 1 | 2 | 3 | 4] = ironAmount;

        steps.push({
          fromTier: curTier,
          fromRank: curRank,
          toTier: curTier,
          toRank: endRankThisTier,
          label: `Tier ${curTier}: Rank ${curRank} → ${endRankThisTier}`,
          materials: stepMaterials,
        });

        total.ebonIron[tierCost.ironLevel as 1 | 2 | 3 | 4] += ironAmount;
        curRank = endRankThisTier;
      }

      // Step 2: breakthrough to next tier if needed
      if (!isLastTier && curRank === MYSTIC_MAX_RANK_PER_TIER - 1) {
        // Breakthrough: rank 9 -> tier+1 rank 0
        const btMaterials = this.emptyTotals();

        // Ebon Iron for the breakthrough rank itself
        btMaterials.ebonIron[tierCost.ironLevel as 1 | 2 | 3 | 4] = tierCost.ironPerRank;
        total.ebonIron[tierCost.ironLevel as 1 | 2 | 3 | 4] += tierCost.ironPerRank;

        // Herb if skill uses plant breakthroughs and tier has cost
        if (materialItemId && tierCost.breakthroughItemCount) {
          btMaterials.herbs = tierCost.breakthroughItemCount;
          total.herbs += tierCost.breakthroughItemCount;
        }

        const nextTier = curTier + 1;
        let btLabel = `Breakthrough: Tier ${curTier} → Tier ${nextTier}`;
        if (!tierCost.breakthroughItemCount) {
          btLabel += ' (no herb cost known)';
        }

        steps.push({
          fromTier: curTier,
          fromRank: MYSTIC_MAX_RANK_PER_TIER - 1,
          toTier: nextTier,
          toRank: 0,
          label: btLabel,
          materials: btMaterials,
        });

        curTier = nextTier;
        curRank = 0;
      } else if (isLastTier) {
        // We're done
        break;
      }
    }

    return {
      skillId,
      materialItemId,
      steps,
      total,
    };
  }

  // ------------------------------------------------------------------
  // Calculation: global totals
  // ------------------------------------------------------------------

  sumTotals(plans: SkillUpgradePlan[]): GlobalMaterialSummary {
    const result: GlobalMaterialSummary = {
      ebonIron: { 1: 0, 2: 0, 3: 0, 4: 0 },
      herbsByItem: {},
    };

    for (const plan of plans) {
      for (const lvl of [1, 2, 3, 4] as const) {
        result.ebonIron[lvl] += plan.total.ebonIron[lvl];
      }
      if (plan.materialItemId && plan.total.herbs > 0) {
        result.herbsByItem[plan.materialItemId] =
          (result.herbsByItem[plan.materialItemId] || 0) + plan.total.herbs;
      }
    }

    return result;
  }

  /**
   * Compute the global summary for all included skills with default target.
   */
  computeGlobalSummary(targetTier: number, targetRank: number): GlobalMaterialSummary {
    const map = this.progressMapSignal();
    const plans: SkillUpgradePlan[] = [];

    for (const skill of MYSTIC_SKILL_UPGRADES) {
      if (!skill.upgradeable) continue;
      const progress = map[skill.id];
      if (!progress?.included) continue;

      const plan = this.planUpgrade(skill.id, progress, targetTier, targetRank);
      plans.push(plan);
    }

    return this.sumTotals(plans);
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  private emptyTotals(): MaterialTotals {
    return {
      ebonIron: { 1: 0, 2: 0, 3: 0, 4: 0 },
      herbs: 0,
    };
  }

  private loadProgressMap(): MysticProgressMap {
    const map: Partial<MysticProgressMap> = {};

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<MysticProgressMap>;
        Object.assign(map, parsed);
      }
    } catch {
      // Ignore parse errors
    }

    // Ensure all skills have an entry
    for (const skill of MYSTIC_SKILL_UPGRADES) {
      if (!map[skill.id]) {
        map[skill.id] = {
          tier: 1,
          rank: 0,
          included: skill.upgradeable,
        };
      }
    }

    return map as MysticProgressMap;
  }

  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveToStorage();
    }, DEBOUNCE_MS);
  }

  private saveToStorage(): void {
    try {
      const map = this.progressMapSignal();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Reset all progress to defaults.
   */
  resetAll(): void {
    const map: Partial<MysticProgressMap> = {};
    for (const skill of MYSTIC_SKILL_UPGRADES) {
      map[skill.id] = {
        tier: 1,
        rank: 0,
        included: skill.upgradeable,
      };
    }
    this.progressMapSignal.set(map as MysticProgressMap);
    this.debouncedSave();
  }
}
