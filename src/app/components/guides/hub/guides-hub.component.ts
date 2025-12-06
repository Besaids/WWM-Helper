// c:\Users\andcr\WWM-Helper\src\app\components\guides\hub\guides-hub.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';

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
    this.tooltipRegistry.register('currency.commerce_coin', {
      imageUrl: 'assets/game/currency/currency-commerce-coin.png',
      title: 'Commerce Coin',
      description: 'Mini-game currency for wagers in Pitch Pot, cards, Mahjong, and street food.',
      variant: 'inlineInfo',
    });
  }
}
