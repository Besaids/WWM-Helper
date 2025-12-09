import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';
import { getDefaultTooltips } from '../../../configs/tooltip/tooltip-defaults.config';

@Component({
  standalone: true,
  selector: 'app-mystic-skill-materials-guide',
  imports: [CommonModule, RouterModule, TooltipDirective],
  templateUrl: './mystic-skill-materials-guide.component.html',
  styleUrls: ['./mystic-skill-materials-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MysticSkillMaterialsGuideComponent {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  // Scroll-to-top visibility
  readonly showScrollTop = signal(false);

  constructor() {
    this.tooltipRegistry.registerAll(getDefaultTooltips());
  }

  // ---------------------------------------------------------------------------
  // Scroll Handling
  // ---------------------------------------------------------------------------

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
