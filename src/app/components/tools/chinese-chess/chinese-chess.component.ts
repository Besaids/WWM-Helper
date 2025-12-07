// chinese-chess.component.ts
import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TooltipDirective } from '../../../directives';

@Component({
  standalone: true,
  selector: 'app-chinese-chess',
  imports: [CommonModule, TooltipDirective],
  templateUrl: './chinese-chess.component.html',
  styleUrls: ['./chinese-chess.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChineseChessComponent implements AfterViewInit {
  // DI via inject()
  private readonly sanitizer = inject(DomSanitizer);

  // plain string for href & other uses
  readonly chessUrlRaw = 'https://play.xiangqi.com/';

  // SafeResourceUrl specifically for iframe [src]
  readonly chessUrlSafe: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.chessUrlRaw,
  );

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
