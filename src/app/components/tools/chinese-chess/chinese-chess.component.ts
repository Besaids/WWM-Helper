import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chinese-chess',
  imports: [CommonModule],
  templateUrl: './chinese-chess.component.html',
  styleUrls: ['./chinese-chess.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChineseChessComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToMap();
    }, 0);
  }

  private scrollToMap(): void {
    const el = document.getElementById('top');
    if (!el) return;

    const headerOffset = 80;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const targetY = rect.top + scrollTop - headerOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }
}
