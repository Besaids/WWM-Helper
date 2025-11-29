import { loadJsonFromStorage, loadVersioned, saveVersioned } from '..';
import { TrackId } from '../../services';

export interface PlayerState {
  currentTrackId: TrackId;
  isPlaying: boolean;
  volume: number; // 0..1
  muted: boolean;
  shuffle: boolean;
  enabledTrackIds: TrackId[];
}

export const PLAYER_STORAGE_KEY = 'wwm-music-player-v1';

export function loadPlayerState(): Partial<PlayerState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const versioned = loadVersioned<PlayerState>(PLAYER_STORAGE_KEY);
    return versioned?.data ?? loadJsonFromStorage<Partial<PlayerState>>(PLAYER_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function savePlayerState(state: PlayerState): void {
  if (typeof window === 'undefined') return;
  saveVersioned<PlayerState>(PLAYER_STORAGE_KEY, state);
}
