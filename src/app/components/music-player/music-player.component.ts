import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { MUSIC_TRACKS, MusicTrack } from '../../configs';
import { formatTime } from './time-format';
import {
  loadPlayerState,
  PlayerAudioService,
  PlayerStore,
  savePlayerState,
  TrackId,
} from '../../services';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  private readonly store = inject(PlayerStore);
  private readonly audio = inject(PlayerAudioService);
  readonly tracks = MUSIC_TRACKS;

  // Local UI-only signal
  readonly isPlaylistOpen = this.store.isPlaylistOpen;

  // Expose store signals to template
  readonly currentTrackId = this.store.currentTrackId;
  readonly isPlaying = this.store.isPlaying;
  readonly volume = this.store.volume;
  readonly muted = this.store.muted;
  readonly shuffle = this.store.shuffle;
  readonly enabledTrackIds = this.store.enabledTrackIds;
  readonly currentTime = this.store.currentTime;
  readonly duration = this.store.duration;
  readonly enabledCount = this.store.enabledCount;

  private lastNonZeroVolume = 0.5;

  // Derived
  readonly enabledTracks = computed(() => {
    const enabled = this.enabledTrackIds();
    return this.tracks.filter((t) => enabled.has(t.id));
  });

  ngOnInit(): void {
    // Initialize store defaults
    const allTrackIds = new Set(this.tracks.map((t) => t.id));
    this.store.setEnabled(allTrackIds);
    this.store.setVolume(0);
    this.store.setMuted(true);
    this.store.setShuffle(false);
    this.store.setPlaying(false);
    this.store.setCurrentTrack(this.tracks[0]?.id ?? '');

    // Restore from storage (validated)
    const persisted = loadPlayerState();
    if (persisted) {
      const validTrack =
        persisted.currentTrackId && this.tracks.some((t) => t.id === persisted.currentTrackId);
      if (validTrack) this.store.setCurrentTrack(persisted.currentTrackId!);

      if (typeof persisted.volume === 'number') {
        const v = Math.max(0, Math.min(1, persisted.volume));
        this.store.setVolume(v);
        if (v > 0) this.lastNonZeroVolume = v;
      }
      if (typeof persisted.muted === 'boolean') this.store.setMuted(persisted.muted);
      if (typeof persisted.shuffle === 'boolean') this.store.setShuffle(persisted.shuffle);

      if (Array.isArray(persisted.enabledTrackIds) && persisted.enabledTrackIds.length) {
        const valid = persisted.enabledTrackIds.filter((id) => allTrackIds.has(id));
        if (valid.length) this.store.setEnabled(new Set(valid));
      }
    }

    // Init audio element
    this.audio.init();
    this.audio.setOnEnded(() => this.nextTrack(true));

    // Apply current track + volume to audio
    const current = this.getCurrentTrack();
    if (current) this.audio.setSource(current.file);
    this.audio.applyVolume();

    // Do not auto-play on load
  }

  ngOnDestroy(): void {
    this.audio.dispose();
  }

  // ---- Persistence ----

  private persist(): void {
    const enabledArray = Array.from(this.enabledTrackIds());
    savePlayerState({
      currentTrackId: this.currentTrackId(),
      isPlaying: this.isPlaying(),
      volume: this.volume(),
      muted: this.muted(),
      shuffle: this.shuffle(),
      enabledTrackIds: enabledArray,
    });
  }

  // ---- Helpers ----

  private getCurrentTrack(): MusicTrack {
    const id = this.currentTrackId();
    return this.tracks.find((t) => t.id === id) ?? this.tracks[0];
  }

  private getEnabledTracks(): MusicTrack[] {
    return this.enabledTracks();
  }

  // ---- Controls ----

  togglePlaylist(): void {
    this.store.togglePlaylist();
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  async play(): Promise<void> {
    try {
      this.store.setPlaying(true);
      this.audio.applyVolume();
      await this.audio.play();
      this.persist();
    } catch (error) {
      this.store.setPlaying(false);
      console.warn('Audio playback failed:', error);
    }
  }

  pause(): void {
    this.audio.pause();
    this.store.setPlaying(false);
    this.persist();
  }

  stop(): void {
    this.audio.stop();
    this.store.setPlaying(false);
    this.persist();
  }

  nextTrack(autoPlay = false): void {
    const enabled = this.getEnabledTracks();
    if (!enabled.length) return;

    const current = this.getCurrentTrack();
    let next: MusicTrack;

    if (this.shuffle()) {
      if (enabled.length === 1) {
        next = enabled[0];
      } else {
        const pool = enabled.filter((t) => t.id !== current.id);
        next = pool[Math.floor(Math.random() * pool.length)];
      }
    } else {
      const idx = enabled.findIndex((t) => t.id === current.id);
      const nextIndex = idx === -1 ? 0 : (idx + 1) % enabled.length;
      next = enabled[nextIndex];
    }

    this.store.setCurrentTrack(next.id);
    this.audio.setSource(next.file);
    this.persist();

    if (autoPlay || this.isPlaying()) {
      this.play();
    } else {
      this.stop();
    }
  }

  prevTrack(): void {
    const enabled = this.getEnabledTracks();
    if (!enabled.length) return;

    const current = this.getCurrentTrack();
    const idx = enabled.findIndex((t) => t.id === current.id);
    const prevIndex = idx <= 0 ? enabled.length - 1 : idx - 1;
    const prev = enabled[prevIndex];

    this.store.setCurrentTrack(prev.id);
    this.audio.setSource(prev.file);
    this.persist();

    if (this.isPlaying()) {
      this.play();
    } else {
      this.stop();
    }
  }

  toggleShuffle(): void {
    this.store.setShuffle(!this.shuffle());
    this.persist();
  }

  onVolumeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.setVolume(Number.isNaN(value) ? 0 : value);
  }

  setVolume(value: number): void {
    const v = Math.max(0, Math.min(1, value));
    this.store.setVolume(v);
    if (v > 0) {
      this.lastNonZeroVolume = v;
      this.store.setMuted(false);
    } else {
      this.store.setMuted(true);
    }
    this.audio.applyVolume();
    this.persist();
  }

  toggleMute(): void {
    const currentlyMuted = this.muted();
    if (currentlyMuted) {
      if (this.volume() === 0) {
        this.store.setVolume(this.lastNonZeroVolume || 0.5);
      }
      this.store.setMuted(false);
    } else {
      this.store.setMuted(true);
    }
    this.audio.applyVolume();
    this.persist();
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (Number.isNaN(value)) return;
    this.audio.seek(value);
  }

  // ---- Playlist helpers ----

  isTrackEnabled(trackId: TrackId): boolean {
    return this.enabledTrackIds().has(trackId);
  }

  // Supports both the improved handler and current template usage.
  onTrackCheckboxChange(event: Event, trackId: TrackId): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleTrackEnabled(trackId, checked);
  }

  toggleTrackEnabled(trackId: TrackId, checked: boolean): void {
    const updated = this.store.toggleEnabled(trackId, checked);

    // If we disabled the currently playing/selected track, switch to first enabled.
    if (!updated.has(this.currentTrackId())) {
      const [first] = updated;
      if (first) {
        this.store.setCurrentTrack(first);
        const track = this.tracks.find((t) => t.id === first);
        if (track) this.audio.setSource(track.file);
      }
    }

    this.persist();
  }

  playTrack(trackId: TrackId): void {
    if (!this.isTrackEnabled(trackId)) {
      this.toggleTrackEnabled(trackId, true);
    }
    this.store.setCurrentTrack(trackId);
    const track = this.tracks.find((t) => t.id === trackId);
    if (track) this.audio.setSource(track.file);
    this.persist();
    this.play();
  }

  // ---- Template helpers ----

  currentTrackTitle(): string {
    return this.getCurrentTrack()?.title ?? 'Unknown track';
  }

  trackIndexDisplay(): string {
    const track = this.getCurrentTrack();
    const idx = this.tracks.findIndex((t) => t.id === track.id);
    if (idx === -1) return '';
    return `${idx + 1}/${this.tracks.length}`;
  }

  formatTime(seconds: number): string {
    return formatTime(seconds);
  }
}
