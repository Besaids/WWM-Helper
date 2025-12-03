import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieConsentService } from '../../services/privacy/cookie-consent.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cookieConsent = inject(CookieConsentService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly showResetMessage = signal(false);

  resetCookieConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Clear the consent preference from localStorage
    this.cookieConsent.resetConsent();

    // Reset analytics consent mode to denied
    this.analytics.denyConsent();

    // Show confirmation message
    this.showResetMessage.set(true);

    // Hide message after 3 seconds
    setTimeout(() => {
      this.showResetMessage.set(false);
    }, 3000);

    // Reload page to show cookie banner again
    setTimeout(() => {
      window.location.reload();
    }, 3500);
  }
}
