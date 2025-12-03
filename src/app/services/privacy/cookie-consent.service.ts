// src/app/services/privacy/cookie-consent.service.ts
import { Injectable } from '@angular/core';

const STORAGE_KEY = 'wwm-helper.cookie-consent'; // simple, app-scoped

type AnalyticsConsent = 'granted' | 'denied';

interface CookieConsentPayload {
  analytics: AnalyticsConsent;
  updatedAt: string; // ISO timestamp
}

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private load(): CookieConsentPayload | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CookieConsentPayload;
    } catch {
      return null;
    }
  }

  private save(payload: CookieConsentPayload): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  hasDecision(): boolean {
    return this.load() !== null;
  }

  isAnalyticsAllowed(): boolean {
    const data = this.load();
    return data?.analytics === 'granted';
  }

  setAnalyticsConsent(allowed: boolean): void {
    const payload: CookieConsentPayload = {
      analytics: allowed ? 'granted' : 'denied',
      updatedAt: new Date().toISOString(),
    };
    this.save(payload);
  }
}
