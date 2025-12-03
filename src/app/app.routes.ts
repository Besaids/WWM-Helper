import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { TimersComponent } from './components/timers';
import { ChecklistComponent } from './components/checklist';
import { GuidesHubComponent, PrivacyComponent, TradingGuideComponent } from './components';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'timers', component: TimersComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'guides', component: GuidesHubComponent },
  { path: 'guides/trading', component: TradingGuideComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: 'home' },
];
