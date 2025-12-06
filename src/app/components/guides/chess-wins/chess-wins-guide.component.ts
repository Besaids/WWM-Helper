import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-chess-wins-guide',
  imports: [CommonModule, RouterModule],
  templateUrl: './chess-wins-guide.component.html',
  styleUrls: ['./chess-wins-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessWinsGuideComponent {
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
    this.showScrollTop = window.scrollY > 400;
  }
}
