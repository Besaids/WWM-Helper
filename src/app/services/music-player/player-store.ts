import { Injectable, computed, signal } from '@angular/core';

export type TrackId = string;

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  readonly currentTrackId = signal<TrackId>('');
  readonly isPlaying = signal(false);
  readonly volume = signal(0); // 0..1
  readonly muted = signal(true);
  readonly shuffle = signal(false);
  readonly isPlaylistOpen = signal(false);

  readonly enabledTrackIds = signal<Set<TrackId>>(new Set());

  readonly currentTime = signal(0);
  readonly duration = signal(0);

  readonly enabledCount = computed(() => this.enabledTrackIds().size);

  // Mutators
  setCurrentTrack(id: TrackId): void {
    this.currentTrackId.set(id);
    this.currentTime.set(0);
    this.duration.set(0);
  }

  setPlaying(v: boolean): void {
    this.isPlaying.set(v);
  }

  setVolume(v: number): void {
    const clamped = Math.max(0, Math.min(1, v));
    this.volume.set(clamped);
  }

  setMuted(v: boolean): void {
    this.muted.set(v);
  }

  setShuffle(v: boolean): void {
    this.shuffle.set(v);
  }

  togglePlaylist(): void {
    this.isPlaylistOpen.update((x) => !x);
  }

  setCurrentTime(sec: number): void {
    this.currentTime.set(Math.max(0, sec));
  }

  setDuration(sec: number): void {
    this.duration.set(Math.max(0, sec));
  }

  setEnabled(ids: Set<TrackId>): void {
    this.enabledTrackIds.set(new Set(ids));
  }

  toggleEnabled(trackId: TrackId, enabled: boolean): Set<TrackId> {
    const current = new Set(this.enabledTrackIds());
    if (enabled) {
      current.add(trackId);
    } else {
      if (current.size <= 1) return current;
      current.delete(trackId);
    }
    this.enabledTrackIds.set(current);
    return current;
  }
}
