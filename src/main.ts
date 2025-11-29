import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { runStorageMigrations, cleanupChecklistStorage } from './app/utils';

// Run storage migrations and cleanup before bootstrapping the Angular app.
runStorageMigrations();
cleanupChecklistStorage();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
