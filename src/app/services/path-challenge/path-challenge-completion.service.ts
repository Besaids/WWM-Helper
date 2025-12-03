import { Injectable, signal } from '@angular/core';
import { loadVersioned, saveVersioned } from '../../utils';

const STORAGE_KEY = 'wwm-path-challenge-completion';

/**
 * Tracks which seasonal path challenges have been completed by the user.
 * Format: { [challengeId]: true }
 */
type CompletionState = Record<string, boolean>;

@Injectable({ providedIn: 'root' })
export class PathChallengeCompletionService {
  // Make this a signal so changes propagate
  private completionState = signal<CompletionState>({});

  // Expose the completion state as a readonly signal for reactive access
  readonly completionState$ = this.completionState.asReadonly();

  constructor() {
    this.loadState();
  }

  /**
   * Check if a specific challenge is marked as completed
   */
  isCompleted(challengeId: string): boolean {
    return !!this.completionState()[challengeId];
  }

  /**
   * Toggle completion status for a challenge
   */
  toggleCompletion(challengeId: string): void {
    const current = this.completionState();
    const updated = { ...current };

    if (updated[challengeId]) {
      delete updated[challengeId];
    } else {
      updated[challengeId] = true;
    }

    this.completionState.set(updated);
    this.saveState();
  }

  /**
   * Reset all completion state (for testing or user preference)
   */
  resetAll(): void {
    this.completionState.set({});
    this.saveState();
  }

  /**
   * Load completion state from localStorage
   */
  private loadState(): void {
    const versioned = loadVersioned<CompletionState>(STORAGE_KEY);
    const state = versioned?.data ?? {};
    this.completionState.set(state);
  }

  /**
   * Save completion state to localStorage
   */
  private saveState(): void {
    saveVersioned(STORAGE_KEY, this.completionState());
  }
}
