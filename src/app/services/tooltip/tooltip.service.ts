import { Injectable, Injector, inject } from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayPositionBuilder,
  FlexibleConnectedPositionStrategy,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipRegistryService } from './tooltip-registry.service';
import { TooltipComponent } from '../../components';
import { isValidTooltipConfig, TooltipConfig } from '../../models';

/** Preferred positions for tooltip placement */
const POSITION_ABOVE: ConnectedPosition = {
  originX: 'center',
  originY: 'top',
  overlayX: 'center',
  overlayY: 'bottom',
  offsetY: -8,
};

const POSITION_BELOW: ConnectedPosition = {
  originX: 'center',
  originY: 'bottom',
  overlayX: 'center',
  overlayY: 'top',
  offsetY: 8,
};

const POSITION_LEFT: ConnectedPosition = {
  originX: 'start',
  originY: 'center',
  overlayX: 'end',
  overlayY: 'center',
  offsetX: -8,
};

const POSITION_RIGHT: ConnectedPosition = {
  originX: 'end',
  originY: 'center',
  overlayX: 'start',
  overlayY: 'center',
  offsetX: 8,
};

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly injector = inject(Injector);
  private readonly registry = inject(TooltipRegistryService);

  private overlayRef: OverlayRef | null = null;
  private tooltipComponentInstance: TooltipComponent | null = null;
  private currentHostElement: HTMLElement | null = null;

  /** Unique ID counter for tooltip elements */
  private idCounter = 0;

  /** Current tooltip ID for aria-describedby */
  private currentTooltipId: string | null = null;

  /**
   * Resolves a tooltip config from either a string key or a direct config object.
   */
  resolveConfig(configOrKey: string | TooltipConfig): TooltipConfig | null {
    if (typeof configOrKey === 'string') {
      return this.registry.get(configOrKey) ?? null;
    }
    return configOrKey;
  }

  /**
   * Show a tooltip attached to the given host element.
   * If a tooltip is already visible, it will be replaced.
   */
  show(hostElement: HTMLElement, config: TooltipConfig): string | null {
    if (!isValidTooltipConfig(config)) {
      return null;
    }

    // Hide any existing tooltip first
    if (this.overlayRef && this.currentHostElement !== hostElement) {
      this.hide();
    }

    this.currentHostElement = hostElement;
    this.currentTooltipId = `tooltip-${++this.idCounter}`;

    if (!this.overlayRef) {
      this.createOverlay(hostElement, config);
    } else {
      this.updateOverlay(hostElement, config);
    }

    return this.currentTooltipId;
  }

  /**
   * Hide the currently visible tooltip.
   */
  hide(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.tooltipComponentInstance = null;
      this.currentHostElement = null;
      this.currentTooltipId = null;
    }
  }

  /**
   * Check if a tooltip is currently visible.
   */
  isVisible(): boolean {
    return this.overlayRef?.hasAttached() ?? false;
  }

  /**
   * Get the current tooltip element for hover detection.
   */
  getTooltipElement(): HTMLElement | null {
    return this.overlayRef?.overlayElement ?? null;
  }

  /**
   * Get the current host element.
   */
  getHostElement(): HTMLElement | null {
    return this.currentHostElement;
  }

  private createOverlay(hostElement: HTMLElement, config: TooltipConfig): void {
    const positionStrategy = this.createPositionStrategy(hostElement, config);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'app-tooltip-panel',
    });

    const portal = new ComponentPortal(TooltipComponent, null, this.injector);
    const componentRef = this.overlayRef.attach(portal);

    this.tooltipComponentInstance = componentRef.instance;
    this.tooltipComponentInstance.config = config;
    this.tooltipComponentInstance.tooltipId = this.currentTooltipId!;
  }

  private updateOverlay(hostElement: HTMLElement, config: TooltipConfig): void {
    if (!this.overlayRef || !this.tooltipComponentInstance) return;

    // Update position strategy for new host
    const positionStrategy = this.createPositionStrategy(hostElement, config);
    this.overlayRef.updatePositionStrategy(positionStrategy);

    // Update component config
    this.tooltipComponentInstance.config = config;
    this.tooltipComponentInstance.tooltipId = this.currentTooltipId!;
  }

  private createPositionStrategy(
    hostElement: HTMLElement,
    config: TooltipConfig,
  ): FlexibleConnectedPositionStrategy {
    // For inline text (inlineInfo), prefer vertical placement
    const isInline = config.variant === 'inlineInfo' || !config.variant;

    const positions: ConnectedPosition[] = isInline
      ? [POSITION_ABOVE, POSITION_BELOW, POSITION_LEFT, POSITION_RIGHT]
      : [POSITION_ABOVE, POSITION_BELOW, POSITION_RIGHT, POSITION_LEFT];

    return this.positionBuilder.flexibleConnectedTo(hostElement).withPositions(positions);
  }
}
