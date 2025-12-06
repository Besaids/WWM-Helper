import { Directive, ElementRef, Input, OnDestroy, inject, NgZone } from '@angular/core';
import { TooltipConfig, isValidTooltipConfig } from '../../models/tooltip.model';
import { TooltipService } from '../../services/tooltip/tooltip.service';

/** Delay in ms before showing tooltip on hover */
const SHOW_DELAY = 200;

/** Delay in ms before hiding tooltip after leaving */
const HIDE_DELAY = 120;

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'onPointerLeave($event)',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(click)': 'onClick($event)',
    '(keydown.escape)': 'onEscape()',
  },
})
export class TooltipDirective implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly tooltipService = inject(TooltipService);
  private readonly ngZone = inject(NgZone);

  /** Tooltip configuration - either a string key or a full config object */
  @Input('appTooltip') config: string | TooltipConfig = '';

  /** Show delay timer */
  private showTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Hide delay timer */
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Whether the tooltip is currently shown */
  private isShown = false;

  /** Whether pointer is over the host element */
  private isPointerOverHost = false;

  /** Whether pointer is over the tooltip element */
  private isPointerOverTooltip = false;

  /** Document click listener for outside clicks */
  private documentClickListener: ((e: Event) => void) | null = null;

  /** Tooltip pointer listeners */
  private tooltipPointerEnterListener: ((e: Event) => void) | null = null;
  private tooltipPointerLeaveListener: ((e: Event) => void) | null = null;

  /** Current tooltip ID for aria-describedby */
  private currentTooltipId: string | null = null;

  ngOnDestroy(): void {
    this.clearTimers();
    this.hide();
    this.removeDocumentClickListener();
    this.removeTooltipPointerListeners();
  }

  onPointerEnter(event: PointerEvent): void {
    // Ignore touch events for hover behavior (touch uses click)
    if (event.pointerType === 'touch') return;

    this.isPointerOverHost = true;
    this.clearHideTimeout();
    this.scheduleShow();
  }

  onPointerLeave(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;

    this.isPointerOverHost = false;
    this.clearShowTimeout();
    this.scheduleHideIfNeeded();
  }

  onFocus(): void {
    this.clearHideTimeout();
    this.show();
  }

  onBlur(): void {
    // Don't hide immediately if focus moved to tooltip link
    this.scheduleHideIfNeeded();
  }

  onClick(event: Event): void {
    // Toggle tooltip on click (works for both mouse and touch)
    if (this.isShown) {
      this.hide();
    } else {
      event.stopPropagation();
      this.show();
      this.addDocumentClickListener();
    }
  }

  onEscape(): void {
    this.hide();
  }

  private scheduleShow(): void {
    if (this.isShown) return;

    this.clearShowTimeout();
    this.showTimeoutId = setTimeout(() => {
      this.ngZone.run(() => this.show());
    }, SHOW_DELAY);
  }

  private scheduleHideIfNeeded(): void {
    // Only hide if pointer is not over host AND not over tooltip
    if (this.isPointerOverHost || this.isPointerOverTooltip) return;

    this.clearHideTimeout();
    this.hideTimeoutId = setTimeout(() => {
      this.ngZone.run(() => {
        // Double-check before hiding
        if (!this.isPointerOverHost && !this.isPointerOverTooltip) {
          this.hide();
        }
      });
    }, HIDE_DELAY);
  }

  private show(): void {
    const resolvedConfig = this.tooltipService.resolveConfig(this.config);
    if (!isValidTooltipConfig(resolvedConfig)) return;

    this.currentTooltipId = this.tooltipService.show(
      this.elementRef.nativeElement,
      resolvedConfig!,
    );

    if (this.currentTooltipId) {
      this.isShown = true;
      this.elementRef.nativeElement.setAttribute('aria-describedby', this.currentTooltipId);
      this.addTooltipPointerListeners();
    }
  }

  private hide(): void {
    if (!this.isShown) return;

    this.tooltipService.hide();
    this.isShown = false;
    this.isPointerOverTooltip = false;
    this.elementRef.nativeElement.removeAttribute('aria-describedby');
    this.removeDocumentClickListener();
    this.removeTooltipPointerListeners();
    this.currentTooltipId = null;
  }

  private addTooltipPointerListeners(): void {
    const tooltipElement = this.tooltipService.getTooltipElement();
    if (!tooltipElement) return;

    this.tooltipPointerEnterListener = () => {
      this.isPointerOverTooltip = true;
      this.clearHideTimeout();
    };

    this.tooltipPointerLeaveListener = () => {
      this.isPointerOverTooltip = false;
      this.scheduleHideIfNeeded();
    };

    tooltipElement.addEventListener('pointerenter', this.tooltipPointerEnterListener);
    tooltipElement.addEventListener('pointerleave', this.tooltipPointerLeaveListener);
  }

  private removeTooltipPointerListeners(): void {
    const tooltipElement = this.tooltipService.getTooltipElement();
    if (tooltipElement) {
      if (this.tooltipPointerEnterListener) {
        tooltipElement.removeEventListener('pointerenter', this.tooltipPointerEnterListener);
      }
      if (this.tooltipPointerLeaveListener) {
        tooltipElement.removeEventListener('pointerleave', this.tooltipPointerLeaveListener);
      }
    }
    this.tooltipPointerEnterListener = null;
    this.tooltipPointerLeaveListener = null;
  }

  private addDocumentClickListener(): void {
    if (this.documentClickListener) return;

    // Use setTimeout to avoid the current click event triggering immediate close
    setTimeout(() => {
      this.documentClickListener = (event: Event) => {
        const target = event.target as HTMLElement;
        const hostElement = this.elementRef.nativeElement;
        const tooltipElement = this.tooltipService.getTooltipElement();

        // Check if click is outside both host and tooltip
        const isOutsideHost = !hostElement.contains(target);
        const isOutsideTooltip = !tooltipElement || !tooltipElement.contains(target);

        if (isOutsideHost && isOutsideTooltip) {
          this.ngZone.run(() => this.hide());
        }
      };

      document.addEventListener('click', this.documentClickListener, true);
    }, 0);
  }

  private removeDocumentClickListener(): void {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener, true);
      this.documentClickListener = null;
    }
  }

  private clearTimers(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  private clearShowTimeout(): void {
    if (this.showTimeoutId !== null) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
}
