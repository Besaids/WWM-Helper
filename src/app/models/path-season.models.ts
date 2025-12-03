// path-season.models.ts

/**
 * Root config for a Path Guide season (e.g. "Blade Out").
 * Backed by a single JSON file, e.g. assets/data/path-guides/blade-out.json
 */
export interface PathSeasonConfig {
  /** Internal season identifier; should match the file name / route key (e.g. "blade-out"). */
  seasonId: string;

  /** Human-readable season name (e.g. "Blade Out"). */
  seasonName: string;

  /** Global rules / clarifications that apply to all paths in this season. */
  globalRules: GlobalSeasonRules;

  /** List of all paths (Bellstrike - Splendor, Umbra, etc.) included in this season. */
  paths: PathConfig[];
}

/**
 * Global rules for the season; shared explanations that are not per-path.
 */
export interface GlobalSeasonRules {
  /** Label for the generic combat challenge used by DPS / tank paths. */
  combatChallengeDpsLabel: string;

  /** Label for the generic combat challenge used by healer paths. */
  combatChallengeHealerLabel: string;

  /**
   * Free-form notes explaining global mechanics:
   * - how the combat challenge works
   * - equalized stats in trials
   * - need to equip both weapons, etc.
   */
  notes: string[];
}

/**
 * Configuration for a single Path (martial arts school + weapon pair) within the season.
 */
export interface PathConfig {
  /** Internal path identifier, used in URLs / IDs (e.g. "bellstrike-splendor"). */
  pathId: string;

  /** Display name for the path (e.g. "Bellstrike - Splendor"). */
  pathName: string;

  /** High-level combat category (e.g. "DPS Melee Combat", "Heal Ranged Combat"). */
  category: string;

  /** Role the path fulfills in group content (e.g. "Melee DPS", "Tank", "Healer", "Ranged DPS"). */
  role: string;

  /** Two-weapon combination that defines the path (must be both equipped for challenges to count). */
  weapons: [string, string];

  /**
   * Ordered list of season-related challenges for this path.
   * In Blade Out this is:
   *   1x generic Combat Challenge
   *   2x [Martial Art]
   *   1x [Inner Way]
   *   1x [Season Challenge] clear
   */
  seasonalChallenges: SeasonalChallenge[];
}

/**
 * Type of season challenge, used for grouping / filtering in the UI.
 */
export type ChallengeCategory = 'combat' | 'martial-art' | 'inner-way' | 'season';

/**
 * A single season challenge entry for a given path.
 */
export interface SeasonalChallenge {
  /**
   * Globally unique challenge ID within the season.
   * Suggested format: `${seasonId}-${pathId}-${short-name}`.
   */
  id: string;

  /**
   * Sorting index within the path; matches the in-game progression order:
   *   1 = Combat Challenge
   *   2–4 = Martial/Inner challenges
   *   5 = Season Challenge clear
   */
  order: number;

  /**
   * Functional category for the challenge (combat, martial-art, inner-way, season).
   * Useful for badges / filtering in the UI.
   */
  category: ChallengeCategory;

  /**
   * Short title; usually starts with the in-game bracketed tag
   * like "[Combat Challenge]", "[Martial Art]", "[Inner Way]", "[Season Challenge]".
   */
  name: string;

  /**
   * Player-facing description; safe to show directly in the guide UI.
   * Should explain exactly what to do, including per-run counts and how many runs are required.
   */
  description: string;

  /**
   * Structured details to support richer UI rendering, filtering, and tooltip hints.
   * All fields are optional: each challenge will populate only what it needs.
   */
  conditions: ChallengeConditions;
}

/**
 * Structured challenge conditions.
 * This is intentionally flexible; only some fields will be filled per challenge.
 */
export interface ChallengeConditions {
  /**
   * Target boss name (e.g. "The Void King", "Sleeping Daoist", "Any campaign boss").
   * For Hero's Realm or generic content, this may be a content name instead.
   */
  boss?: string;

  /**
   * Content label / mode (e.g. "Campaign – solo", "Trial – Hard or Abyss",
   * "Online – multiplayer", "Campaign – single-player only (no trials)").
   */
  mode?: string;

  /**
   * For challenges tied to a specific instance type rather than a boss
   * (e.g. "Any Hero's Realm").
   */
  content?: string;

  /**
   * Required Inner Way, if any (e.g. "Sword Morph", "Sword Horizon",
   * "Echoes of Oblivion", "Exquisite Scenery", "Royal Remedy").
   */
  innerWay?: string;

  /**
   * Specific weapon used in the condition, where it matters
   * (e.g. "Nameless Sword", "Soulshade Umbrella").
   */
  weapon?: string;

  /**
   * Specific skill used in the condition, if relevant
   * (e.g. "Vagrant Sword", "Sword Dance", "Endless Cloud", "Floating Grace").
   */
  skill?: string;

  /**
   * Named effect that must be applied or triggered (e.g. "Bleeding",
   * "Spring Surge", "Samsara", "Combo", "Taunt").
   */
  effect?: string;

  /**
   * Human-readable per-run condition (e.g. "Hit Vagrant Sword 10 times in one run").
   * This is a compact string you can show in bullet lists or tooltips.
   */
  perRunRequirement?: string;

  /**
   * Number of runs in which the perRunRequirement must be satisfied
   * (e.g. 3 for (3/3), 5 for (5/5), 1 for (1/1)).
   */
  runsRequired?: number;

  /**
   * Time limit in seconds for time-attack style challenges
   * (e.g. 180 for 3 minutes, 300 for 5 minutes, 360 for 6 minutes).
   */
  timeLimitSeconds?: number;

  /**
   * Minimum HP percentage that must not be crossed during the attempt.
   * e.g. 0.5 means "HP must never drop below 50%".
   */
  hpThresholdMin?: number;

  /**
   * Additional restriction text for state-based challenges
   * (e.g. "No Severe Injury / no being downed during the run").
   */
  restriction?: string;

  /**
   * Required character level to unlock the challenge, if applicable
   * (e.g. 51 for Silkbind – Deluge Hero's Realm challenge).
   */
  unlockLevel?: number;

  /**
   * Free-form notes, clarifications, or tips coming from the guide
   * (e.g. "Sword Dance must actually absorb projectiles; just spinning does not count.").
   */
  notes?: string;
}
