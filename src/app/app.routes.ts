import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' },
];
