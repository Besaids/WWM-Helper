// src/app/services/analytics/analytics.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieConsentService } from '../privacy/cookie-consent.service';

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
  private readonly consent = inject(CookieConsentService);
  private initialized = false;

  initialize(): void {
    // Only in browser, production, and with user consent
    if (
      !isPlatformBrowser(this.platformId) ||
      !environment.production ||
      !environment.googleAnalyticsId
    ) {
      return;
    }

    if (!this.consent.isAnalyticsAllowed()) {
      // user either has not decided or explicitly denied
      return;
    }

    if (this.initialized) {
      return;
    }

    this.loadGoogleAnalytics();
    this.trackPageViews();
    this.initialized = true;
  }

  private loadGoogleAnalytics(): void {
    const id = environment.googleAnalyticsId!;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: GtagArguments) => {
      window.dataLayer!.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false,
    });
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
    });
  }

  trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
    if (!environment.production || !window.gtag) {
      return;
    }

    window.gtag('event', eventName, eventParams ?? {});
  }
}
