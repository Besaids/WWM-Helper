// c:\Users\andcr\WWM-Helper\src\app\components\guides\trading\trading-guide.component.ts
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';

@Component({
  standalone: true,
  selector: 'app-trading-guide',
  imports: [CommonModule, RouterModule, TooltipDirective],
  templateUrl: './trading-guide.component.html',
  styleUrls: ['./trading-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingGuideComponent {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  showScrollTop = false;

  constructor() {
    this.tooltipRegistry.registerAll({
      'currency.commerce_coin': {
        imageUrl: 'assets/game/currency/currency-commerce-coin.png',
        title: 'Commerce Coin',
        description: 'Mini-game currency for wagers in Pitch Pot, cards, Mahjong, and street food.',
        variant: 'inlineInfo',
      },
      'currency.coin': {
        imageUrl: 'assets/game/currency/currency-coin.png',
        title: 'Coin',
        description:
          'Generic in-game money for merchants, fees, and basic services. Weekly cap: 175,000.',
        variant: 'inlineInfo',
      },
    });
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }
}
