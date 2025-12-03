import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected resetCookieConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove the consent decision
    localStorage.removeItem('wwm-helper.cookie-consent');

    // Reload the page so the cookie banner appears again
    window.location.reload();
  }
}
