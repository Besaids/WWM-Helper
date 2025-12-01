import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-trading-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './trading-guide.component.html',
  styleUrls: ['./trading-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingGuideComponent {
  showScrollTop = false;

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
    // tweak threshold if you want it to appear earlier/later
    this.showScrollTop = window.scrollY > 400;
  }
}
