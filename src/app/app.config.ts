// app.config.ts
import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './utils/global-error-handler';
import { AnalyticsService, CookieConsentService } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    provideAppInitializer(() => {
      const analytics = inject(AnalyticsService);
      const consent = inject(CookieConsentService);

      analytics.initialize();

      if (consent.isAnalyticsAllowed()) {
        console.info('[App Init] User previously granted consent, enabling tracking');
        analytics.grantConsent();
      } else {
        console.info('[App Init] No consent yet, waiting for user decision');
      }
    }),
  ],
};
