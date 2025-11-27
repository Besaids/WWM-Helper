import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar';
import { TimerStripComponent } from '../timer-strip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, TimerStripComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
