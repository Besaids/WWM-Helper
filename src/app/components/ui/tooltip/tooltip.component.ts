import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TooltipConfig,
  TooltipLayoutMode,
  TooltipVariant,
  getTooltipLayoutMode,
} from '../../../models/tooltip.model';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tooltip',
    '[id]': 'tooltipId',
    '[class]': 'hostClasses()',
  },
})
export class TooltipComponent {
  /** Unique ID for aria-describedby linking */
  tooltipId = '';

  /** Internal signal for the tooltip configuration */
  private readonly configSignal = signal<TooltipConfig>({});

  /** Set the tooltip configuration */
  set config(value: TooltipConfig) {
    this.configSignal.set(value);
  }

  /** Get the tooltip configuration */
  get config(): TooltipConfig {
    return this.configSignal();
  }

  /** Computed layout mode based on config */
  readonly layoutMode = computed<TooltipLayoutMode>(() =>
    getTooltipLayoutMode(this.configSignal()),
  );

  /** Computed variant with default */
  readonly variant = computed<TooltipVariant>(() => this.configSignal().variant ?? 'inlineInfo');

  /** Whether the tooltip has a link */
  readonly hasLink = computed(() => {
    const cfg = this.configSignal();
    return !!(cfg.linkUrl && cfg.linkLabel);
  });

  /** Host classes for layout and variant */
  readonly hostClasses = computed(() => {
    const classes = [
      'app-tooltip',
      `app-tooltip--${this.layoutMode()}`,
      `app-tooltip--${this.variant()}`,
    ];
    return classes.join(' ');
  });

  /** Image URL from config */
  readonly imageUrl = computed(() => this.configSignal().imageUrl);

  /** Title from config */
  readonly title = computed(() => this.configSignal().title);

  /** Description from config */
  readonly description = computed(() => this.configSignal().description);

  /** Link URL from config */
  readonly linkUrl = computed(() => this.configSignal().linkUrl);

  /** Link label from config */
  readonly linkLabel = computed(() => this.configSignal().linkLabel);
}
