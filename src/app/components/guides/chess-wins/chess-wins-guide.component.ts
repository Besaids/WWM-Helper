// c:\Users\andcr\WWM-Helper\src\app\components\guides\chess-wins\chess-wins-guide.component.ts
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';
import { buildAssetTooltips } from '../../../configs';

@Component({
  standalone: true,
  selector: 'app-chess-wins-guide',
  imports: [CommonModule, RouterModule, TooltipDirective],
  templateUrl: './chess-wins-guide.component.html',
  styleUrls: ['./chess-wins-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessWinsGuideComponent {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  showScrollTop = false;

  constructor() {
    this.tooltipRegistry.registerAll(buildAssetTooltips());
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
