// src/app/services/analytics/analytics.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

type GtagArguments = [string, ...unknown[]];

declare global {
  interface Window {
    gtag?: (...args: GtagArguments) => void;
    dataLayer?: GtagArguments[];
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private initialized = false;
  private consentGranted = false;
  private pageViewSub: Subscription | null = null;

  initialize(): void {
    if (!this.isEnabled()) {
      console.info('[Analytics] Disabled (non-browser, non-prod, or no ID)');
      return;
    }

    if (this.initialized) {
      return;
    }

    this.initialized = true;
    console.info('[Analytics] Initialized (router wiring ready)');
    // We *only* wire router here; page_view events are gated by consentGranted.
    this.setupRouterTracking();
  }

  /** Called when the user accepts analytics in the cookie banner */
  grantConsent(): void {
    if (!this.isEnabled() || !window.gtag) {
      console.warn('[Analytics] Cannot grant consent; gtag not available');
      return;
    }

    const wasGranted = this.consentGranted;
    this.consentGranted = true;

    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });

    console.info('[Analytics] Consent granted');

    // First time we switch to granted → send an initial page_view
    if (!wasGranted) {
      const url = location.pathname + location.search + location.hash;
      this.trackPageView(url);
    }
  }

  /** Called when the user rejects analytics (or resets to denied) */
  denyConsent(): void {
    if (!this.isEnabled() || !window.gtag) {
      return;
    }

    this.consentGranted = false;

    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });

    console.info('[Analytics] Consent denied');
  }

  /** Manual page_view trigger (used internally + can be used for virtual pages) */
  trackPageView(url: string): void {
    if (!this.isEnabled() || !window.gtag || !this.consentGranted) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.origin + url,
      page_title: document.title,
    });
  }

  /** Generic event tracking helper */
  trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
    if (!this.isEnabled() || !window.gtag || !this.consentGranted) {
      return;
    }

    window.gtag('event', eventName, eventParams ?? {});
  }

  // ---- internals ----

  private setupRouterTracking(): void {
    if (this.pageViewSub) {
      return;
    }

    this.pageViewSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.trackPageView(e.urlAfterRedirects);
      });
  }

  private isEnabled(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      environment.production &&
      !!environment.googleAnalyticsId
    );
  }
}
