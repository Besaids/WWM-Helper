import { inject, Injectable } from '@angular/core';
import { PlayerStore } from './player-store';

type EndedHandler = () => void;

@Injectable({ providedIn: 'root' })
export class PlayerAudioService {
  private readonly store = inject(PlayerStore);
  private audio: HTMLAudioElement | null = null;

  private onEndedHandler?: EndedHandler;

  private readonly endedListener = () => this.onEndedHandler?.();
  private readonly timeUpdateListener = () => {
    if (!this.audio) return;
    this.store.setCurrentTime(this.audio.currentTime || 0);
  };
  private readonly loadedMetadataListener = () => {
    if (!this.audio) return;
    this.store.setDuration(this.audio.duration || 0);
  };

  init(): void {
    if (typeof Audio === 'undefined') return;
    if (this.audio) return;

    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.audio.addEventListener('ended', this.endedListener);
    this.audio.addEventListener('timeupdate', this.timeUpdateListener);
    this.audio.addEventListener('loadedmetadata', this.loadedMetadataListener);
  }

  setOnEnded(handler: EndedHandler): void {
    this.onEndedHandler = handler;
  }

  dispose(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.removeEventListener('ended', this.endedListener);
    this.audio.removeEventListener('timeupdate', this.timeUpdateListener);
    this.audio.removeEventListener('loadedmetadata', this.loadedMetadataListener);
    this.audio = null;
  }

  setSource(file: string): void {
    if (!this.audio) return;
    this.store.setCurrentTime(0);
    this.store.setDuration(0);
    this.audio.src = file;
    this.audio.currentTime = 0;
  }

  applyVolume(): void {
    if (!this.audio) return;
    const muted = this.store.muted();
    const vol = this.store.volume();
    this.audio.muted = muted;
    this.audio.volume = muted ? 0 : vol;
  }

  async play(): Promise<void> {
    if (!this.audio) return;
    this.applyVolume();
    await this.audio.play();
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.store.setCurrentTime(0);
  }

  seek(seconds: number): void {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, seconds);
    this.store.setCurrentTime(this.audio.currentTime);
  }
}
