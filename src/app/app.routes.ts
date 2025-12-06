import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { TimersComponent } from './components/timers';
import { ChecklistComponent } from './components/checklist';
import {
  GuidesHubComponent,
  PrivacyComponent,
  TradingGuideComponent,
  PathSeasonGuideComponent,
  MapComponent,
  ToolsHubComponent,
  ChineseChessComponent,
  ChessWinsGuideComponent,
} from './components';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'timers', component: TimersComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'map', component: MapComponent },
  { path: 'guides', component: GuidesHubComponent },
  { path: 'guides/chess-wins', component: ChessWinsGuideComponent },
  { path: 'guides/trading', component: TradingGuideComponent },
  { path: 'guides/path-season', component: PathSeasonGuideComponent },
  { path: 'tools', component: ToolsHubComponent },
  { path: 'tools/chinese-chess', component: ChineseChessComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: 'home' },
];
