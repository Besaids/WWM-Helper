// c:\Users\andcr\WWM-Helper\src\app\components\guides\hub\guides-hub.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';
import { buildAssetTooltips } from '../../../configs';

@Component({
  standalone: true,
  selector: 'app-guides-hub',
  imports: [CommonModule, RouterModule, TooltipDirective],
  templateUrl: './guides-hub.component.html',
  styleUrls: ['./guides-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuidesHubComponent {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  constructor() {
    this.tooltipRegistry.registerAll(buildAssetTooltips());
  }
}
