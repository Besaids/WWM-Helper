import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-tools-hub',
  imports: [CommonModule, RouterModule],
  templateUrl: './tools-hub.component.html',
  styleUrls: ['./tools-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsHubComponent {}
