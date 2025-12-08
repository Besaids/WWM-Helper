/**
 * Boss Talent system models for the Blade Out season.
 * These types define the structure for Boss Talent challenges
 * available under Talents → Boss in-game.
 */

/**
 * The three track types available for each boss
 */
export type BossTalentTrackType = 'offensive' | 'defensive' | 'strategic';

/**
 * Boss IDs used in the Blade Out season
 */
export type BossTalentBossId =
  | 'void_king'
  | 'ye_wanshan'
  | 'lucky_seventeen'
  | 'sleeping_daoist'
  | 'murong_yuan'
  | 'twin_lions'
  | 'ghost_master';

/**
 * Season IDs for Boss Talents
 */
export type BossTalentSeasonId = 'blade_out';

/**
 * Individual tier within a track (Tier 1, 2, or 3)
 */
export interface BossTalentTier {
  /** Tier number: 1, 2, or 3 */
  tier: 1 | 2 | 3;

  /**
   * Full requirement text describing what needs to be done.
   * Can be null if sameAsTier is set or if the data is incomplete (TODO).
   */
  requirement: string | null;

  /** Full reward text describing the bonus granted */
  reward: string;

  /**
   * Account level required to unlock this tier.
   * Null if unknown or not yet documented.
   */
  unlockLevel: number | null;

  /**
   * When requirement is intentionally identical to another tier,
   * reference that tier number here.
   */
  sameAsTier?: number;

  /** Optional per-tier note (e.g., "TODO" or clarification) */
  notes?: string;
}

/**
 * A single track (Offensive, Defensive, or Strategic) for a boss
 */
export interface BossTalentTrack {
  /** Track type identifier */
  type: BossTalentTrackType;

  /** Display label (e.g., "Offensive", "Defensive", "Strategic") */
  label: string;

  /** Optional short one-line summary of what this track focuses on */
  description?: string;

  /** Array of tiers (typically 1–3, but some tracks may have fewer) */
  tiers: BossTalentTier[];

  /** Optional tips block for this track */
  tips?: string[];
}

/**
 * A single boss entry with all its talent tracks
 */
export interface BossTalentBoss {
  /** Unique boss identifier */
  id: BossTalentBossId;

  /** Display name of the boss */
  name: string;

  /** Hero title name unlocked by completing Offensive + Defensive tracks */
  heroTitleName: string;

  /** Path to the boss avatar image */
  avatarSrc: string;

  /** Path to the hero title image */
  titleSrc: string;

  /** Display order in the UI (1–7 for Blade Out) */
  order: number;

  /**
   * Short sentence describing which dungeons/difficulties this boss appears in.
   * E.g., "Appears in Sword Trial: Formless Calamity, Formless Mountain Pass, Ocean of Vengeance."
   */
  contentSummary: string;

  /** Array of tracks (Offensive, Defensive, Strategic) */
  tracks: BossTalentTrack[];
}

/**
 * A complete Boss Talent season configuration
 */
export interface BossTalentSeason {
  /** Unique season identifier */
  id: BossTalentSeasonId;

  /** Display name of the season (e.g., "Blade Out") */
  name: string;

  /**
   * Disclaimer text explaining season-limited nature
   * and that talents only apply in Sword Trial/Hero's Realm.
   */
  disclaimer: string;

  /** Array of all bosses in this season */
  bosses: BossTalentBoss[];

  /** Path to the meta title image (unlocked by completing all boss titles) */
  metaTitleSrc: string;

  /** Name of the meta title (e.g., "One Sword Holds Ten Thousand") */
  metaTitleName: string;

  /** Explanation paragraph about unlocking all seven titles */
  metaTitleNote: string;

  /** Credits for data contributors */
  credits: string;
}
