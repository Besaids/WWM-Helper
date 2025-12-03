// src/app/services/analytics/analytics.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type GtagArguments = [string, ...unknown[]];

declare global {
  interface Window {
    gtag?: (...args: GtagArguments) => void;
    dataLayer?: GtagArguments[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.info('[Analytics] Not running in browser; skipping');
      return;
    }

    if (!environment.production) {
      console.info('[Analytics] Not production build; skipping');
      return;
    }

    if (!environment.googleAnalyticsId) {
      console.warn('[Analytics] No GA ID configured; skipping');
      return;
    }

    if (this.initialized) {
      console.info('[Analytics] Already initialized; skipping');
      return;
    }

    this.loadGoogleAnalytics();
    this.trackPageViews();

    const initialPath = location.pathname + location.search + location.hash;
    this.trackPageView(initialPath);

    this.initialized = true;
    console.info('[Analytics] Initialized with ID', environment.googleAnalyticsId);
  }

  private loadGoogleAnalytics(): void {
    const id = environment.googleAnalyticsId!;

    // Initialize dataLayer and gtag stub
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function (...args: GtagArguments) {
      window.dataLayer!.push(args);
    };

    // Set consent defaults FIRST
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500,
    });

    // Initialize with current timestamp
    window.gtag('js', new Date());

    // Configure GA4
    window.gtag('config', id, {
      send_page_view: false,
    });

    // Load the actual gtag script (will process the dataLayer)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    console.info('[Analytics] Initialized, script loading');
  }

  grantConsent(): void {
    if (!window.gtag) {
      console.warn('[Analytics] Cannot grant consent; gtag not loaded');
      return;
    }

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });

    console.info('[Analytics] Consent granted, tracking enabled');
  }

  denyConsent(): void {
    if (!window.gtag) {
      return;
    }

    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });

    console.info('[Analytics] Consent denied');
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  trackPageView(url: string): void {
    if (!environment.production || !window.gtag) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.origin + url,
      page_title: document.title,
    });
  }

  trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
    if (!environment.production || !window.gtag) {
      return;
    }

    window.gtag('event', eventName, eventParams ?? {});
  }
}
