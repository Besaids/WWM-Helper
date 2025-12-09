import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { NgxEchartsDirective, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';
import { TooltipRegistryService } from '../../../services/tooltip/tooltip-registry.service';
import {
  buildAssetTooltips,
  STATIC_TOOLTIPS,
} from '../../../configs/tooltip/tooltip-defaults.config';
import { MYSTIC_USAGE_METRICS } from '../../../configs/mystic-metrics/mystic-metrics.data';
import {
  MysticUsageDefinition,
  MysticUsageTierMetrics,
  MysticTier,
} from '../../../models/mystic-metrics.model';
import { MYSTIC_SKILL_ASSETS } from '../../../configs/tooltip/game-assets.mystic_skill';
import { GameAssetDefinition } from '../../../models/game-assets.model';

// =============================================================================
// Derived Metrics Helpers (runtime only, never stored in config)
// =============================================================================

interface DerivedMetrics {
  dpv: number;
  dps: number | null;
  mysticScore: number | null;
}

function computeDerivedMetrics(
  usage: MysticUsageDefinition,
  tier: MysticUsageTierMetrics,
): DerivedMetrics {
  const v = usage.effectiveVitality;
  const t = usage.animTimeSeconds;
  const avg = tier.avgDamage;

  const dpv = avg / v;
  const dps = t != null ? avg / t : null;
  const mysticScore = dps != null ? (dps * dpv) / 1000 : null;

  return { dpv, dps, mysticScore };
}

// =============================================================================
// Chart Data Point Interface
// =============================================================================

interface ChartDataPoint {
  usageId: string;
  label: string;
  kind: 'single' | 'combo';
  tier: MysticTier;
  avgDamage: number;
  effectiveVitality: number;
  animTimeSeconds: number | null;
  dpv: number;
  dps: number | null;
  mysticScore: number | null;
  tooltipIds: string[];
}

// =============================================================================
// Tier Color Configuration
// =============================================================================

const TIER_COLORS: Record<MysticTier, { main: string; highlight: string; faded: string }> = {
  2: {
    main: 'rgba(147, 197, 253, 0.85)', // blue-300
    highlight: '#60a5fa', // blue-400
    faded: 'rgba(147, 197, 253, 0.4)',
  },
  3: {
    main: 'rgba(253, 224, 71, 0.85)', // yellow-300
    highlight: '#facc15', // yellow-400
    faded: 'rgba(253, 224, 71, 0.4)',
  },
  4: {
    main: 'rgba(248, 113, 113, 0.85)', // red-400
    highlight: '#f87171', // red-400
    faded: 'rgba(248, 113, 113, 0.4)',
  },
};

const BUBBLE_SIZE = {
  min: 6,
  max: 18,
  highlightBonus: 3,
  pinnedBonus: 6,
} as const;

// =============================================================================
// Pinned Entry Key
// =============================================================================

type PinnedKey = `${string}:${MysticTier}`;

function makePinnedKey(usageId: string, tier: MysticTier): PinnedKey {
  return `${usageId}:${tier}`;
}

// =============================================================================
// Component
// =============================================================================

@Component({
  standalone: true,
  selector: 'app-mystic-metrics-guide',
  imports: [CommonModule, FormsModule, RouterModule, NgxEchartsDirective, TooltipDirective],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }, // this is what NgxEchartsModule.forRoot({ echarts }) would have done
    },
  ],
  templateUrl: './mystic-metrics-guide.component.html',
  styleUrls: ['./mystic-metrics-guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MysticMetricsGuideComponent implements OnInit {
  private readonly tooltipRegistry = inject(TooltipRegistryService);

  readonly SERIES_ORDER = ['T2', 'T3', 'Background'] as const;

  // ---------------------------------------------------------------------------
  // Raw Data
  // ---------------------------------------------------------------------------

  readonly allUsages: MysticUsageDefinition[] = MYSTIC_USAGE_METRICS;

  // Index mystic assets by ID for quick lookup
  private readonly mysticAssetById: Record<string, GameAssetDefinition> =
    MYSTIC_SKILL_ASSETS.reduce(
      (acc, asset) => {
        acc[asset.id] = asset;
        return acc;
      },
      {} as Record<string, GameAssetDefinition>,
    );

  // ---------------------------------------------------------------------------
  // UI State Signals
  // ---------------------------------------------------------------------------

  // Tier filter
  readonly activeTiers = signal<Set<MysticTier>>(new Set([2, 3]));

  // Kind filter
  readonly kindFilter = signal<'all' | 'single' | 'combo'>('all');

  // Search query
  readonly searchQuery = signal('');

  // Selected usage IDs
  readonly selectedUsageIds = signal<Set<string>>(new Set(this.allUsages.map((u) => u.id)));

  // Pinned entries
  readonly pinnedEntries = signal<Set<PinnedKey>>(new Set());

  // Top N selector
  readonly topN = signal<5 | 10 | 'all'>(5);

  // Burst chart Y-axis mode
  readonly burstYAxis = signal<'dps' | 'damage'>('dps');

  // Efficiency highlight mode
  readonly efficiencyHighlight = signal<'dpv' | 'score'>('dpv');

  // Mobile tab
  readonly mobileActiveTab = signal<'burst' | 'efficiency'>('burst');

  // Scroll-to-top visibility
  readonly showScrollTop = signal(false);

  // Table sorting
  readonly sortBy = signal<'label' | 'kind' | 'dps' | 'dpv' | 'score'>('label');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  // Comparison chart controls
  readonly comparisonMetric = signal<'dpv' | 'dps' | 'damage' | 'score'>('dpv');
  readonly comparisonMode = signal<'absolute' | 'percent'>('absolute');

  // ---------------------------------------------------------------------------
  // Available Tiers (derived from data)
  // ---------------------------------------------------------------------------

  readonly availableTiers = computed<MysticTier[]>(() => {
    const tierSet = new Set<MysticTier>();
    for (const usage of this.allUsages) {
      for (const tier of Object.keys(usage.tiers)) {
        tierSet.add(Number(tier) as MysticTier);
      }
    }
    return Array.from(tierSet).sort((a, b) => a - b);
  });

  // ---------------------------------------------------------------------------
  // Sorted Usages for Selection Table
  // ---------------------------------------------------------------------------

  readonly sortedUsages = computed(() => {
    const usages = this.filteredUsages();
    const by = this.sortBy();
    const dir = this.sortDir();

    const sorted = [...usages].sort((a, b) => {
      let valA: number | string | null = null;
      let valB: number | string | null = null;

      if (by === 'label') {
        valA = a.label;
        valB = b.label;
      } else if (by === 'kind') {
        valA = a.kind;
        valB = b.kind;
      } else {
        // For numeric metrics, try T3 first, then T2
        const statsA = this.getUsageBestTierStats(a);
        const statsB = this.getUsageBestTierStats(b);

        if (by === 'dps') {
          valA = statsA?.dps ?? null;
          valB = statsB?.dps ?? null;
        } else if (by === 'dpv') {
          valA = statsA?.dpv ?? null;
          valB = statsB?.dpv ?? null;
        } else if (by === 'score') {
          valA = statsA?.score ?? null;
          valB = statsB?.score ?? null;
        }
      }

      // Null values go to the bottom
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      // Compare
      let cmp = 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        cmp = valA.localeCompare(valB);
      } else {
        cmp = (valA as number) - (valB as number);
      }

      return dir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  });

  // ---------------------------------------------------------------------------
  // Filtered Usages for Selection Panel
  // ---------------------------------------------------------------------------

  readonly filteredUsages = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const kind = this.kindFilter();

    return this.allUsages.filter((usage) => {
      // Kind filter
      if (kind !== 'all' && usage.kind !== kind) return false;

      // Search filter
      if (query && !usage.label.toLowerCase().includes(query)) return false;

      return true;
    });
  });

  // ---------------------------------------------------------------------------
  // All Chart Data Points (selected + tier filtered)
  // ---------------------------------------------------------------------------

  readonly chartDataPoints = computed<ChartDataPoint[]>(() => {
    const selected = this.selectedUsageIds();
    const tiers = this.activeTiers();
    const points: ChartDataPoint[] = [];

    for (const usage of this.allUsages) {
      if (!selected.has(usage.id)) continue;

      for (const [tierKey, tierData] of Object.entries(usage.tiers)) {
        const tier = Number(tierKey) as MysticTier;
        if (!tiers.has(tier)) continue;

        const derived = computeDerivedMetrics(usage, tierData);

        points.push({
          usageId: usage.id,
          label: usage.label,
          kind: usage.kind,
          tier,
          avgDamage: tierData.avgDamage,
          effectiveVitality: usage.effectiveVitality,
          animTimeSeconds: usage.animTimeSeconds ?? null,
          ...derived,
          tooltipIds: usage.tooltipIds,
        });
      }
    }

    return points;
  });

  // ---------------------------------------------------------------------------
  // Burst Chart Points (only those with animTimeSeconds)
  // ---------------------------------------------------------------------------

  readonly burstChartPoints = computed(() =>
    this.chartDataPoints().filter((p) => p.animTimeSeconds != null),
  );

  // ---------------------------------------------------------------------------
  // Top N Highlighted Points for Burst Chart
  // ---------------------------------------------------------------------------

  readonly burstHighlightedIds = computed(() => {
    const points = this.burstChartPoints();
    const mode = this.burstYAxis();
    const n = this.topN();

    if (n === 'all') return new Set(points.map((p) => makePinnedKey(p.usageId, p.tier)));

    const sorted = [...points].sort((a, b) => {
      const valA = mode === 'dps' ? (a.dps ?? 0) : a.avgDamage;
      const valB = mode === 'dps' ? (b.dps ?? 0) : b.avgDamage;
      return valB - valA;
    });

    return new Set(sorted.slice(0, n).map((p) => makePinnedKey(p.usageId, p.tier)));
  });

  // ---------------------------------------------------------------------------
  // Top N Highlighted Points for Efficiency Chart
  // ---------------------------------------------------------------------------

  readonly efficiencyHighlightedIds = computed(() => {
    const points = this.chartDataPoints();
    const mode = this.efficiencyHighlight();
    const n = this.topN();

    if (n === 'all') return new Set(points.map((p) => makePinnedKey(p.usageId, p.tier)));

    // Filter for score mode - only include those with mysticScore
    const validPoints = mode === 'score' ? points.filter((p) => p.mysticScore != null) : points;

    const sorted = [...validPoints].sort((a, b) => {
      const valA = mode === 'dpv' ? a.dpv : (a.mysticScore ?? 0);
      const valB = mode === 'dpv' ? b.dpv : (b.mysticScore ?? 0);
      return valB - valA;
    });

    return new Set(sorted.slice(0, n).map((p) => makePinnedKey(p.usageId, p.tier)));
  });

  // ---------------------------------------------------------------------------
  // Pinned Data Points
  // ---------------------------------------------------------------------------

  readonly pinnedDataPoints = computed(() => {
    const pinned = this.pinnedEntries();
    const allPoints = this.chartDataPoints();

    return allPoints.filter((p) => pinned.has(makePinnedKey(p.usageId, p.tier)));
  });

  // ---------------------------------------------------------------------------
  // T2→T3 Comparison Data (usages with both tiers selected)
  // ---------------------------------------------------------------------------

  readonly comparisonData = computed(() => {
    const selected = this.selectedUsageIds();
    const tiers = this.activeTiers();
    const metric = this.comparisonMetric();
    const mode = this.comparisonMode();

    if (!tiers.has(2) || !tiers.has(3)) return [];

    interface ComparisonRow {
      label: string;
      t2Value: number;
      t3Value: number;
      displayT2: number;
      displayT3: number;
      gainPercent: number;
    }

    const result: ComparisonRow[] = [];

    for (const usage of this.allUsages) {
      if (!selected.has(usage.id)) continue;

      const t2Tier = usage.tiers[2];
      const t3Tier = usage.tiers[3];
      if (!t2Tier || !t3Tier) continue;

      const t2Derived = computeDerivedMetrics(usage, t2Tier);
      const t3Derived = computeDerivedMetrics(usage, t3Tier);

      let t2Val: number | null = null;
      let t3Val: number | null = null;

      switch (metric) {
        case 'dpv':
          t2Val = t2Derived.dpv;
          t3Val = t3Derived.dpv;
          break;
        case 'dps':
          t2Val = t2Derived.dps;
          t3Val = t3Derived.dps;
          break;
        case 'damage':
          t2Val = t2Tier.avgDamage;
          t3Val = t3Tier.avgDamage;
          break;
        case 'score':
          t2Val = t2Derived.mysticScore;
          t3Val = t3Derived.mysticScore;
          break;
      }

      // Skip if either value is null
      if (t2Val === null || t3Val === null) continue;

      const gainPercent = t2Val !== 0 ? ((t3Val - t2Val) / t2Val) * 100 : 0;

      let displayT2 = t2Val;
      let displayT3 = t3Val;

      if (mode === 'percent') {
        displayT2 = 0;
        displayT3 = gainPercent;
      }

      result.push({
        label: usage.label,
        t2Value: t2Val,
        t3Value: t3Val,
        displayT2,
        displayT3,
        gainPercent,
      });
    }

    // Sort based on mode
    if (mode === 'percent') {
      return result.sort((a, b) => b.gainPercent - a.gainPercent);
    } else {
      return result.sort((a, b) => b.t3Value - a.t3Value);
    }
  });

  // ---------------------------------------------------------------------------
  // ECharts Options
  // ---------------------------------------------------------------------------

  readonly burstChartOption = computed<EChartsOption>(() => this.buildBurstChartOption());

  readonly efficiencyChartOption = computed<EChartsOption>(() => this.buildEfficiencyChartOption());

  readonly comparisonChartOption = computed<EChartsOption>(() => this.buildComparisonChartOption());

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    // Register tooltips
    this.tooltipRegistry.registerAll({
      ...STATIC_TOOLTIPS,
      ...buildAssetTooltips(),
      // Additional static tooltips for this guide
      'mystic-metrics.dpv': {
        title: 'Damage per Vitality (DpV)',
        description:
          'How much damage you deal for each point of Vitality spent. Higher is more efficient.',
        variant: 'inlineInfo',
      },
      'mystic-metrics.dps': {
        title: 'Damage per Second (DPS)',
        description:
          'How much damage you deal per second of animation time. Higher means faster burst.',
        variant: 'inlineInfo',
      },
      'mystic-metrics.score': {
        title: 'Mystic Score',
        description:
          'Combined metric: (DPS × DpV) / 1000. Balances raw burst speed with resource efficiency.',
        variant: 'inlineInfo',
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Tier Toggle
  // ---------------------------------------------------------------------------

  toggleTier(tier: MysticTier): void {
    const current = new Set(this.activeTiers());
    if (current.has(tier)) {
      current.delete(tier);
    } else {
      current.add(tier);
    }
    this.activeTiers.set(current);
  }

  isTierActive(tier: MysticTier): boolean {
    return this.activeTiers().has(tier);
  }

  // ---------------------------------------------------------------------------
  // Usage Selection
  // ---------------------------------------------------------------------------

  toggleUsage(usageId: string): void {
    const current = new Set(this.selectedUsageIds());
    if (current.has(usageId)) {
      current.delete(usageId);
    } else {
      current.add(usageId);
    }
    this.selectedUsageIds.set(current);
  }

  isUsageSelected(usageId: string): boolean {
    return this.selectedUsageIds().has(usageId);
  }

  selectAll(): void {
    this.selectedUsageIds.set(new Set(this.filteredUsages().map((u) => u.id)));
  }

  clearAll(): void {
    this.selectedUsageIds.set(new Set());
  }

  // ---------------------------------------------------------------------------
  // Quick Presets
  // ---------------------------------------------------------------------------

  selectRecommendedT3(): void {
    // Select top 5 by mysticScore at T3
    const t3Points: { usageId: string; score: number }[] = [];

    for (const usage of this.allUsages) {
      const t3 = usage.tiers[3];
      if (!t3 || usage.animTimeSeconds == null) continue;

      const derived = computeDerivedMetrics(usage, t3);
      if (derived.mysticScore != null) {
        t3Points.push({ usageId: usage.id, score: derived.mysticScore });
      }
    }

    t3Points.sort((a, b) => b.score - a.score);
    const topIds = t3Points.slice(0, 5).map((p) => p.usageId);

    this.selectedUsageIds.set(new Set(topIds));
    this.activeTiers.set(new Set([3]));
  }

  selectAllSingle(): void {
    const singleIds = this.allUsages.filter((u) => u.kind === 'single').map((u) => u.id);
    this.selectedUsageIds.set(new Set(singleIds));
  }

  selectAllCombo(): void {
    const comboIds = this.allUsages.filter((u) => u.kind === 'combo').map((u) => u.id);
    this.selectedUsageIds.set(new Set(comboIds));
  }

  // ---------------------------------------------------------------------------
  // Pinning
  // ---------------------------------------------------------------------------

  togglePin(usageId: string, tier: MysticTier): void {
    const key = makePinnedKey(usageId, tier);
    const current = new Set(this.pinnedEntries());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.pinnedEntries.set(current);
  }

  isPinned(usageId: string, tier: MysticTier): boolean {
    return this.pinnedEntries().has(makePinnedKey(usageId, tier));
  }

  unpinAll(): void {
    this.pinnedEntries.set(new Set());
  }

  // ---------------------------------------------------------------------------
  // Chart Event Handlers
  // ---------------------------------------------------------------------------

  onChartClick(event: unknown): void {
    const e = event as { data?: { usageId?: string; tier?: MysticTier } };
    if (e.data?.usageId && e.data?.tier) {
      this.togglePin(e.data.usageId, e.data.tier);
    }
  }

  // ---------------------------------------------------------------------------
  // Asset Lookup
  // ---------------------------------------------------------------------------

  getAssetForTooltipId(tooltipId: string): GameAssetDefinition | undefined {
    return this.mysticAssetById[tooltipId];
  }

  // ---------------------------------------------------------------------------
  // Stats for Selection Panel Row
  // ---------------------------------------------------------------------------

  getUsageT3Stats(
    usage: MysticUsageDefinition,
  ): { dps: string; dpv: string; score: string } | null {
    const t3 = usage.tiers[3];
    if (!t3) return null;

    const derived = computeDerivedMetrics(usage, t3);
    return {
      dps: derived.dps != null ? derived.dps.toFixed(0) : '—',
      dpv: derived.dpv.toFixed(0),
      score: derived.mysticScore != null ? derived.mysticScore.toFixed(0) : '—',
    };
  }

  // ---------------------------------------------------------------------------
  // Scroll Handling
  // ---------------------------------------------------------------------------

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
    this.showScrollTop.set(window.scrollY > 400);
  }

  // ---------------------------------------------------------------------------
  // Formatting Helpers
  // ---------------------------------------------------------------------------

  formatNumber(value: number | null, decimals = 0): string {
    if (value == null) return '—';
    return value.toFixed(decimals);
  }

  getTierColorClass(tier: MysticTier): string {
    return `tier-${tier}`;
  }

  // Add sort toggle method (around line ~520):

  toggleSort(column: 'label' | 'kind' | 'dps' | 'dpv' | 'score'): void {
    if (this.sortBy() === column) {
      // Toggle direction
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column: default desc for numeric, asc for label/kind
      this.sortBy.set(column);
      this.sortDir.set(column === 'label' || column === 'kind' ? 'asc' : 'desc');
    }
  }

  // Helper to get best available tier stats (T3 preferred, fallback to T2)
  private getUsageBestTierStats(
    usage: MysticUsageDefinition,
  ): { dps: number | null; dpv: number; score: number | null } | null {
    const t3 = usage.tiers[3];
    const t2 = usage.tiers[2];
    const tier = t3 ?? t2;
    if (!tier) return null;

    const derived = computeDerivedMetrics(usage, tier);
    return {
      dps: derived.dps,
      dpv: derived.dpv,
      score: derived.mysticScore,
    };
  }

  // ---------------------------------------------------------------------------
  // ECharts Option Builders
  // ---------------------------------------------------------------------------

  private buildBurstChartOption(): EChartsOption {
    const points = this.burstChartPoints();
    const highlighted = this.burstHighlightedIds();
    const pinned = this.pinnedEntries();
    const yMode = this.burstYAxis();

    // Calculate damage range for bubble size normalization
    const damages = points.map((p) => p.avgDamage);
    const minDmg = Math.min(...damages);
    const maxDmg = Math.max(...damages);
    const dmgRange = maxDmg - minDmg || 1;

    // Tier jitter to prevent exact overlap
    const tierJitter: Record<MysticTier, number> = { 2: -0.08, 3: 0, 4: 0.08 };

    // Separate background vs highlighted points
    const backgroundPoints: ChartDataPoint[] = [];
    const highlightedPoints: ChartDataPoint[] = [];

    for (const p of points) {
      const key = makePinnedKey(p.usageId, p.tier);
      if (highlighted.has(key) || pinned.has(key)) {
        highlightedPoints.push(p);
      } else {
        backgroundPoints.push(p);
      }
    }

    const series: EChartsOption['series'] = [];

    // Background series (all tiers combined, grey, no bonuses)
    if (backgroundPoints.length > 0) {
      series.push({
        name: 'Background',
        type: 'scatter',
        silent: false,
        itemStyle: {
          color: '#212837',
        },
        data: backgroundPoints.map((p) => {
          const sizeNorm = (p.avgDamage - minDmg) / dmgRange;
          const baseSize = BUBBLE_SIZE.min + sizeNorm * (BUBBLE_SIZE.max - BUBBLE_SIZE.min);

          return {
            value: [
              (p.animTimeSeconds ?? 0) + (tierJitter[p.tier] ?? 0),
              yMode === 'dps' ? p.dps : p.avgDamage,
            ],
            symbolSize: baseSize,
            itemStyle: {
              color: 'rgba(148, 163, 184, 0.25)',
              opacity: 0.5,
            },
            emphasis: {
              scale: true,
              scaleSize: 4,
              itemStyle: { borderWidth: 2, borderColor: '#fff' },
            },
            usageId: p.usageId,
            tier: p.tier,
            pointData: p,
          };
        }),
        emphasis: { focus: 'self' },
      });
    }

    // Highlighted series (grouped by tier for legend)
    const highlightedByTier = new Map<MysticTier, ChartDataPoint[]>();
    for (const p of highlightedPoints) {
      if (!highlightedByTier.has(p.tier)) {
        highlightedByTier.set(p.tier, []);
      }
      highlightedByTier.get(p.tier)!.push(p);
    }

    for (const [tier, tierPoints] of highlightedByTier) {
      const color = TIER_COLORS[tier];

      series.push({
        name: `T${tier}`,
        type: 'scatter',
        itemStyle: {
          color: color.main,
        },
        data: tierPoints.map((p) => {
          const key = makePinnedKey(p.usageId, p.tier);
          const isPinned = pinned.has(key);
          const isHighlighted = highlighted.has(key);

          // Apply normalized size with bonuses
          const sizeNorm = (p.avgDamage - minDmg) / dmgRange;
          let symbolSize = BUBBLE_SIZE.min + sizeNorm * (BUBBLE_SIZE.max - BUBBLE_SIZE.min);
          if (isHighlighted) symbolSize += BUBBLE_SIZE.highlightBonus;
          if (isPinned) symbolSize += BUBBLE_SIZE.pinnedBonus;

          const shortLabel = p.label.length > 20 ? p.label.substring(0, 18) + '…' : p.label;

          return {
            value: [
              (p.animTimeSeconds ?? 0) + (tierJitter[tier] ?? 0),
              yMode === 'dps' ? p.dps : p.avgDamage,
            ],
            symbolSize,
            itemStyle: {
              color: isPinned ? color.highlight : color.main,
              borderColor: isPinned ? '#fff' : 'transparent',
              borderWidth: isPinned ? 2 : 0,
            },
            label: {
              show: true,
              formatter: shortLabel,
              position: 'top',
              fontSize: 9,
              color: '#e5e7eb',
              distance: 5,
            },
            emphasis: {
              scale: true,
              scaleSize: 4,
              itemStyle: { borderWidth: 2 },
            },
            usageId: p.usageId,
            tier: p.tier,
            pointData: p,
          };
        }),
      });
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        textStyle: { color: '#f5f5f7', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = (params as { data?: { pointData?: ChartDataPoint } }).data?.pointData;
          if (!p) return '';
          return this.formatBurstTooltip(p);
        },
      },
      legend: {
        show: true,
        top: 10,
        textStyle: { color: '#a1a7b7' },
        data: [
          'Background',
          ...Array.from(highlightedByTier.keys())
            .sort()
            .map((t) => `T${t}`),
        ],
      },
      grid: {
        left: 70,
        right: 40,
        top: 50,
        bottom: 70,
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          bottom: 10,
          height: 20,
          borderColor: 'rgba(148, 163, 184, 0.3)',
          fillerColor: 'rgba(66, 195, 198, 0.2)',
          handleStyle: { color: '#42c3c6' },
          textStyle: { color: '#a1a7b7' },
        },
      ],
      xAxis: {
        type: 'value',
        name: 'Animation Time (s)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: { color: '#a1a7b7', fontSize: 12 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#a1a7b7' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      yAxis: {
        type: 'value',
        name: yMode === 'dps' ? 'DPS' : 'Total Damage',
        nameLocation: 'middle',
        nameGap: 55,
        nameTextStyle: { color: '#a1a7b7', fontSize: 12 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#a1a7b7' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      series,
      animation: true,
      animationDuration: 500,
      animationEasing: 'cubicOut',
    };
  }

  private buildEfficiencyChartOption(): EChartsOption {
    const points = this.chartDataPoints();
    const highlighted = this.efficiencyHighlightedIds();
    const pinned = this.pinnedEntries();

    // Calculate damage range for bubble size normalization
    const damages = points.map((p) => p.avgDamage);
    const minDmg = Math.min(...damages);
    const maxDmg = Math.max(...damages);
    const dmgRange = maxDmg - minDmg || 1;

    // Tier jitter on vitality (smaller since vitality values are larger)
    const tierJitter: Record<MysticTier, number> = { 2: -1.5, 3: 0, 4: 1.5 };

    // Separate background vs highlighted
    const backgroundPoints: ChartDataPoint[] = [];
    const highlightedPoints: ChartDataPoint[] = [];

    for (const p of points) {
      const key = makePinnedKey(p.usageId, p.tier);
      if (highlighted.has(key) || pinned.has(key)) {
        highlightedPoints.push(p);
      } else {
        backgroundPoints.push(p);
      }
    }

    const series: EChartsOption['series'] = [];

    // Background series (grey, no bonuses)
    if (backgroundPoints.length > 0) {
      series.push({
        name: 'Background',
        type: 'scatter',
        itemStyle: {
          color: '#212837',
        },
        silent: false,
        data: backgroundPoints.map((p) => {
          const sizeNorm = (p.avgDamage - minDmg) / dmgRange;
          const baseSize = BUBBLE_SIZE.min + sizeNorm * (BUBBLE_SIZE.max - BUBBLE_SIZE.min);

          return {
            value: [p.effectiveVitality + (tierJitter[p.tier] ?? 0), p.dpv],
            symbolSize: baseSize,
            itemStyle: {
              color: 'rgba(148, 163, 184, 0.25)',
              opacity: 0.5,
            },
            emphasis: {
              scale: true,
              scaleSize: 4,
              itemStyle: { borderWidth: 2, borderColor: '#fff' },
            },
            usageId: p.usageId,
            tier: p.tier,
            pointData: p,
          };
        }),
        emphasis: { focus: 'self' },
      });
    }

    // Highlighted series by tier
    const highlightedByTier = new Map<MysticTier, ChartDataPoint[]>();
    for (const p of highlightedPoints) {
      if (!highlightedByTier.has(p.tier)) {
        highlightedByTier.set(p.tier, []);
      }
      highlightedByTier.get(p.tier)!.push(p);
    }

    for (const [tier, tierPoints] of highlightedByTier) {
      const color = TIER_COLORS[tier];

      series.push({
        name: `T${tier}`,
        type: 'scatter',
        itemStyle: {
          color: color.main,
        },
        data: tierPoints.map((p) => {
          const key = makePinnedKey(p.usageId, p.tier);
          const isPinned = pinned.has(key);
          const isHighlighted = highlighted.has(key);

          // Apply normalized size with bonuses
          const sizeNorm = (p.avgDamage - minDmg) / dmgRange;
          let symbolSize = BUBBLE_SIZE.min + sizeNorm * (BUBBLE_SIZE.max - BUBBLE_SIZE.min);
          if (isHighlighted) symbolSize += BUBBLE_SIZE.highlightBonus;
          if (isPinned) symbolSize += BUBBLE_SIZE.pinnedBonus;

          const shortLabel = p.label.length > 20 ? p.label.substring(0, 18) + '…' : p.label;

          return {
            value: [p.effectiveVitality + (tierJitter[tier] ?? 0), p.dpv],
            symbolSize,
            itemStyle: {
              color: isPinned ? color.highlight : color.main,
              borderColor: isPinned ? '#fff' : 'transparent',
              borderWidth: isPinned ? 2 : 0,
            },
            label: {
              show: true,
              formatter: shortLabel,
              position: 'top',
              fontSize: 9,
              color: '#e5e7eb',
              distance: 5,
            },
            emphasis: {
              scale: true,
              scaleSize: 4,
              itemStyle: { borderWidth: 2 },
            },
            usageId: p.usageId,
            tier: p.tier,
            pointData: p,
          };
        }),
      });
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        textStyle: { color: '#f5f5f7', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = (params as { data?: { pointData?: ChartDataPoint } }).data?.pointData;
          if (!p) return '';
          return this.formatEfficiencyTooltip(p);
        },
      },
      legend: {
        show: true,
        top: 10,
        textStyle: { color: '#a1a7b7' },
        data: [
          'Background',
          ...Array.from(highlightedByTier.keys())
            .sort()
            .map((t) => `T${t}`),
        ],
      },
      grid: {
        left: 70,
        right: 40,
        top: 50,
        bottom: 70,
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          bottom: 10,
          height: 20,
          borderColor: 'rgba(148, 163, 184, 0.3)',
          fillerColor: 'rgba(66, 195, 198, 0.2)',
          handleStyle: { color: '#42c3c6' },
          textStyle: { color: '#a1a7b7' },
        },
      ],
      xAxis: {
        type: 'value',
        name: 'Vitality Cost',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: { color: '#a1a7b7', fontSize: 12 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#a1a7b7' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      yAxis: {
        type: 'value',
        name: 'Damage per Vitality',
        nameLocation: 'middle',
        nameGap: 55,
        nameTextStyle: { color: '#a1a7b7', fontSize: 12 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#a1a7b7' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      series,
      animation: true,
      animationDuration: 500,
      animationEasing: 'cubicOut',
    };
  }

  private buildComparisonChartOption(): EChartsOption {
    const data = this.comparisonData();
    const metric = this.comparisonMetric();
    const mode = this.comparisonMode();

    if (data.length === 0) {
      return {
        backgroundColor: 'transparent',
        title: {
          text: 'No usages with both T2 and T3 data',
          left: 'center',
          top: 'center',
          textStyle: { color: '#6b7280', fontSize: 14 },
        },
      };
    }

    const labels = data.map((d) => d.label);
    const t2Values = data.map((d) => d.displayT2);
    const t3Values = data.map((d) => d.displayT3);

    const metricNames: Record<string, string> = {
      dpv: 'Damage per Vitality',
      dps: 'DPS',
      damage: 'Total Damage',
      score: 'Mystic Score',
    };

    const axisName = mode === 'percent' ? 'Percent Gain (%)' : metricNames[metric];

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        textStyle: { color: '#f5f5f7', fontSize: 12 },
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const p = params as { seriesName: string; data: number; name: string }[];
          if (!p || p.length === 0) return '';

          const name = p[0].name;
          const row = data.find((d) => d.label === name);
          if (!row) return '';

          let tip = `<div style="font-weight: 600; margin-bottom: 4px;">${name}</div>`;
          tip += `<div style="font-size: 11px;">`;

          if (mode === 'percent') {
            const gain = (((row.t3Value - row.t2Value) / row.t2Value) * 100).toFixed(1);
            tip += `T2: ${row.t2Value.toFixed(0)}<br/>`;
            tip += `T3: ${row.t3Value.toFixed(0)}<br/>`;
            tip += `<strong>Gain: ${gain}%</strong>`;
          } else {
            tip += `T2: ${row.t2Value.toFixed(0)}<br/>`;
            tip += `T3: ${row.t3Value.toFixed(0)}`;
          }

          tip += `</div>`;
          return tip;
        },
      },
      legend: {
        show: mode === 'absolute',
        top: 10,
        textStyle: { color: '#a1a7b7' },
        data: mode === 'absolute' ? ['T2', 'T3'] : ['Gain'],
      },
      grid: {
        left: 120,
        right: 30,
        top: 50,
        bottom: 20,
      },
      xAxis: {
        type: 'value',
        name: axisName,
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: { color: '#a1a7b7', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: {
          color: '#a1a7b7',
          fontSize: 10,
          formatter: mode === 'percent' ? '{value}%' : '{value}',
        },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#a1a7b7', fontSize: 10, width: 100, overflow: 'truncate' },
      },
      series:
        mode === 'absolute'
          ? [
              {
                name: 'T2',
                type: 'bar',
                data: t2Values,
                itemStyle: { color: TIER_COLORS[2].main },
                barGap: '10%',
              },
              {
                name: 'T3',
                type: 'bar',
                data: t3Values,
                itemStyle: { color: TIER_COLORS[3].main },
              },
            ]
          : [
              {
                name: 'Gain',
                type: 'bar',
                data: t3Values,
                itemStyle: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  color: (params: any): string => {
                    const value = Number(params?.data ?? 0);
                    return value >= 0 ? TIER_COLORS[3].main : TIER_COLORS[2].main;
                  },
                },
              },
            ],
      animation: true,
      animationDuration: 500,
    };
  }

  // ---------------------------------------------------------------------------
  // Tooltip Formatters
  // ---------------------------------------------------------------------------

  private formatBurstTooltip(p: ChartDataPoint): string {
    return `
      <div style="font-weight: 600; margin-bottom: 4px;">${p.label}</div>
      <div style="font-size: 11px; opacity: 0.8; margin-bottom: 6px;">T${p.tier} • ${p.kind}</div>
      <div style="display: grid; grid-template-columns: auto auto; gap: 2px 12px; font-size: 12px;">
        <span style="opacity: 0.7;">Anim Time:</span><span>${this.formatNumber(p.animTimeSeconds, 2)}s</span>
        <span style="opacity: 0.7;">Avg Damage:</span><span>${this.formatNumber(p.avgDamage)}</span>
        <span style="opacity: 0.7;">DPS:</span><span>${this.formatNumber(p.dps)}</span>
        <span style="opacity: 0.7;">Vitality:</span><span>${p.effectiveVitality}</span>
        <span style="opacity: 0.7;">DpV:</span><span>${this.formatNumber(p.dpv)}</span>
        <span style="opacity: 0.7;">Score:</span><span>${this.formatNumber(p.mysticScore)}</span>
      </div>
      <div style="font-size: 10px; opacity: 0.5; margin-top: 6px;">Click to pin/unpin</div>
    `;
  }

  private formatEfficiencyTooltip(p: ChartDataPoint): string {
    return `
      <div style="font-weight: 600; margin-bottom: 4px;">${p.label}</div>
      <div style="font-size: 11px; opacity: 0.8; margin-bottom: 6px;">T${p.tier} • ${p.kind}</div>
      <div style="display: grid; grid-template-columns: auto auto; gap: 2px 12px; font-size: 12px;">
        <span style="opacity: 0.7;">Vitality:</span><span>${p.effectiveVitality}</span>
        <span style="opacity: 0.7;">DpV:</span><span>${this.formatNumber(p.dpv)}</span>
        <span style="opacity: 0.7;">Avg Damage:</span><span>${this.formatNumber(p.avgDamage)}</span>
        ${p.dps != null ? `<span style="opacity: 0.7;">DPS:</span><span>${this.formatNumber(p.dps)}</span>` : ''}
        ${p.mysticScore != null ? `<span style="opacity: 0.7;">Score:</span><span>${this.formatNumber(p.mysticScore)}</span>` : ''}
      </div>
      <div style="font-size: 10px; opacity: 0.5; margin-top: 6px;">Click to pin/unpin</div>
    `;
  }
}
