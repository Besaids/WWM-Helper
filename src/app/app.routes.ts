import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { TimersComponent } from './components/timers';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'timers', component: TimersComponent },
  { path: '**', redirectTo: 'home' },
];
