import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { MUSIC_TRACKS, MusicTrack } from '../../configs';
import { loadJsonFromStorage, loadVersioned, saveVersioned } from '../../utils';

type TrackId = string;

interface PlayerState {
  currentTrackId: TrackId;
  isPlaying: boolean;
  volume: number; // 0..1
  muted: boolean;
  shuffle: boolean;
  enabledTrackIds: TrackId[];
}

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  private readonly storageKey = 'wwm-music-player-v1';

  readonly tracks = MUSIC_TRACKS;

  // UI state
  readonly currentTrackId = signal<TrackId>(this.tracks[0]?.id ?? '');
  readonly isPlaying = signal(false);
  readonly volume = signal(0); // muted by default
  readonly muted = signal(true);
  readonly shuffle = signal(false);
  readonly isPlaylistOpen = signal(false);

  readonly enabledTrackIds = signal<Set<TrackId>>(new Set(this.tracks.map((t) => t.id)));

  // playback progress
  readonly currentTime = signal(0);
  readonly duration = signal(0);

  // derived
  readonly enabledCount = computed(() => this.enabledTrackIds().size);

  private audio: HTMLAudioElement | null = null;
  private lastNonZeroVolume = 0.5;

  // Event handler references for proper cleanup
  private readonly onEndedHandler = (): void => this.handleTrackEnded();
  private readonly onTimeUpdateHandler = (): void => {
    if (!this.audio) return;
    this.currentTime.set(this.audio.currentTime || 0);
  };
  private readonly onLoadedMetadataHandler = (): void => {
    if (!this.audio) return;
    this.duration.set(this.audio.duration || 0);
  };

  ngOnInit(): void {
    this.restoreState();
    this.initAudio();
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', this.onEndedHandler);
      this.audio.removeEventListener('timeupdate', this.onTimeUpdateHandler);
      this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadataHandler);
      this.audio = null;
    }
  }

  // ---- Audio init / sync ----

  private initAudio(): void {
    if (typeof Audio === 'undefined' || !this.tracks.length) return;

    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.applyTrackToAudio();
    this.applyVolumeToAudio();

    this.audio.addEventListener('ended', this.onEndedHandler);
    this.audio.addEventListener('timeupdate', this.onTimeUpdateHandler);
    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadataHandler);
  }

  private applyTrackToAudio(): void {
    if (!this.audio) return;
    const track = this.getCurrentTrack();
    if (!track) return;

    this.currentTime.set(0);
    this.duration.set(0);

    this.audio.src = track.file;
    this.audio.currentTime = 0;
  }

  private applyVolumeToAudio(): void {
    if (!this.audio) return;
    const muted = this.muted();
    const vol = this.volume();

    this.audio.muted = muted;
    this.audio.volume = muted ? 0 : vol;
  }

  private getCurrentTrack(): MusicTrack {
    const id = this.currentTrackId();
    return this.tracks.find((t) => t.id === id) ?? this.tracks[0];
  }

  private getEnabledTracks(): MusicTrack[] {
    const enabled = this.enabledTrackIds();
    return this.tracks.filter((t) => enabled.has(t.id));
  }

  // ---- Persistence ----

  private restoreState(): void {
    // Not available in SSR / some environments
    if (typeof window === 'undefined') return;

    try {
      // Try versioned payload first
      const versioned = loadVersioned<PlayerState>(this.storageKey);
      const parsed =
        versioned?.data ?? loadJsonFromStorage<Partial<PlayerState>>(this.storageKey) ?? null;

      if (!parsed) return;

      if (parsed.currentTrackId && this.tracks.some((t) => t.id === parsed.currentTrackId)) {
        this.currentTrackId.set(parsed.currentTrackId);
      }

      if (typeof parsed.volume === 'number') {
        const v = Math.min(1, Math.max(0, parsed.volume));
        this.volume.set(v);
        if (v > 0) this.lastNonZeroVolume = v;
      }

      if (typeof parsed.muted === 'boolean') {
        this.muted.set(parsed.muted);
      }

      if (typeof parsed.shuffle === 'boolean') {
        this.shuffle.set(parsed.shuffle);
      }

      if (Array.isArray(parsed.enabledTrackIds) && parsed.enabledTrackIds.length) {
        const valid = parsed.enabledTrackIds.filter((id) => this.tracks.some((t) => t.id === id));
        if (valid.length) {
          this.enabledTrackIds.set(new Set(valid));
        }
      }

      // Do not auto-play on load
    } catch {
      // ignore malformed storage
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    const enabledArray = Array.from(this.enabledTrackIds());
    const state: PlayerState = {
      currentTrackId: this.currentTrackId(),
      isPlaying: this.isPlaying(),
      volume: this.volume(),
      muted: this.muted(),
      shuffle: this.shuffle(),
      enabledTrackIds: enabledArray,
    };

    saveVersioned<PlayerState>(this.storageKey, state);
  }

  // ---- Controls ----

  togglePlaylist(): void {
    this.isPlaylistOpen.update((v) => !v);
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    if (!this.audio) return;

    this.isPlaying.set(true);
    this.applyVolumeToAudio();

    this.audio
      .play()
      .then(() => {
        this.saveState();
      })
      .catch((error) => {
        this.isPlaying.set(false);
        // Log playback failures (autoplay policies, codec issues, etc.)
        console.warn('Audio playback failed:', error);
      });
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying.set(false);
    this.saveState();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTime.set(0);
    this.isPlaying.set(false);
    this.saveState();
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

    this.currentTrackId.set(next.id);
    this.applyTrackToAudio();
    this.saveState();

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

    this.currentTrackId.set(prev.id);
    this.applyTrackToAudio();
    this.saveState();

    if (this.isPlaying()) {
      this.play();
    } else {
      this.stop();
    }
  }

  handleTrackEnded(): void {
    this.nextTrack(true);
  }

  toggleShuffle(): void {
    this.shuffle.update((v) => !v);
    this.saveState();
  }

  onVolumeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.setVolume(Number.isNaN(value) ? 0 : value);
  }

  setVolume(value: number): void {
    const v = Math.min(1, Math.max(0, value));
    this.volume.set(v);
    if (v > 0) {
      this.lastNonZeroVolume = v;
      this.muted.set(false);
    } else {
      this.muted.set(true);
    }
    this.applyVolumeToAudio();
    this.saveState();
  }

  toggleMute(): void {
    const currentlyMuted = this.muted();
    if (currentlyMuted) {
      if (this.volume() === 0) {
        this.volume.set(this.lastNonZeroVolume || 0.5);
      }
      this.muted.set(false);
    } else {
      this.muted.set(true);
    }
    this.applyVolumeToAudio();
    this.saveState();
  }

  onSeek(event: Event): void {
    if (!this.audio) return;
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (Number.isNaN(value)) return;
    this.audio.currentTime = value;
    this.currentTime.set(value);
  }

  // ---- Playlist helpers ----

  isTrackEnabled(trackId: TrackId): boolean {
    return this.enabledTrackIds().has(trackId);
  }

  onTrackCheckboxChange(event: Event, trackId: TrackId): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleTrackEnabled(trackId, checked);
  }

  private toggleTrackEnabled(trackId: TrackId, checked: boolean): void {
    const current = new Set(this.enabledTrackIds());

    if (checked) {
      current.add(trackId);
    } else {
      if (current.size <= 1) {
        return;
      }
      current.delete(trackId);

      if (trackId === this.currentTrackId()) {
        const [first] = current;
        if (first) {
          this.currentTrackId.set(first);
          this.applyTrackToAudio();
        }
      }
    }

    this.enabledTrackIds.set(current);
    this.saveState();
  }

  playTrack(trackId: TrackId): void {
    if (!this.isTrackEnabled(trackId)) {
      this.toggleTrackEnabled(trackId, true);
    }
    this.currentTrackId.set(trackId);
    this.applyTrackToAudio();
    this.saveState();
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
    if (!seconds || !Number.isFinite(seconds)) return '0:00';
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
