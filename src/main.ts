import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { runStorageMigrations, cleanupChecklistStorage } from './app/utils';
import { AnalyticsService } from './app/services';

runStorageMigrations();
cleanupChecklistStorage();

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    const analyticsService = appRef.injector.get(AnalyticsService);
    analyticsService.initialize();
  })
  .catch((err) => console.error(err));
