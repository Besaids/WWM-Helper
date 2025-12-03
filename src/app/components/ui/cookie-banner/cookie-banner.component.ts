import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieConsentService, AnalyticsService } from '../../../services';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  private readonly consent = inject(CookieConsentService);
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isVisible = signal<boolean>(false);

  constructor() {
    // Only show banner in browser if user hasn't made a decision
    if (isPlatformBrowser(this.platformId)) {
      this.isVisible.set(!this.consent.hasDecision());
    }
  }

  acceptAll(): void {
    this.consent.setAnalyticsConsent(true);
    this.analytics.initialize(); // Start analytics immediately
    this.isVisible.set(false);
  }

  rejectAll(): void {
    this.consent.setAnalyticsConsent(false);
    this.isVisible.set(false);
  }
}
