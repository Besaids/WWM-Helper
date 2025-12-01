import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-guides-hub',
  imports: [CommonModule, RouterModule],
  templateUrl: './guides-hub.component.html',
  styleUrls: ['./guides-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuidesHubComponent {}
