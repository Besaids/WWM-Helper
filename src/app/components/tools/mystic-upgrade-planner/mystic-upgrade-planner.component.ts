import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  getDefaultTooltips,
  ITEMS_ASSETS,
  MYSTIC_SKILL_ASSETS,
  MYSTIC_SKILL_UPGRADES,
  MysticBreakthroughItemId,
  MysticSkillCategory,
  MysticSkillId,
  MysticSkillUpgradeConfig,
} from '../../../configs';
import { TooltipDirective } from '../../../directives';
import { MysticUpgradePlannerService, TooltipRegistryService } from '../../../services';
import { GlobalMaterialSummary, SkillUpgradePlan } from '../../../models';
import { FormsModule } from '@angular/forms';

// Human-readable labels for materials
const HERB_LABELS: Record<MysticBreakthroughItemId, string> = {
  'items.beautys_plume': "Beauty's Plume",
  'items.buddhas_tear_root': "Buddha's Tear Root",
  'items.frost_mushroom_mycelium': 'Frost Mushroom Mycelium',
  'items.jade_tower_pearl': 'Jade Tower Pearl',
  'items.jasmine_stamen': 'Jasmine Stamen',
  'items.vicious_fruit': 'Vicious Fruit',
};

const CATEGORY_LABELS: Record<MysticSkillCategory, string> = {
  offensive: 'Offensive',
  general: 'General',
  movement: 'Movement',
};

interface SkillViewModel {
  config: MysticSkillUpgradeConfig;
  label: string;
  iconUrl: string | null;
  categoryLabel: string;
  roleLabel: string;
  herbLabel: string | null;
}

@Component({
  standalone: true,
  selector: 'app-mystic-upgrade-planner',
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './mystic-upgrade-planner.component.html',
  styleUrls: ['./mystic-upgrade-planner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MysticUpgradePlannerComponent implements OnInit {
  private readonly planner = inject(MysticUpgradePlannerService);
  private readonly tooltipRegistry = inject(TooltipRegistryService);
  readonly ironLevels: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  // All skills as view models
  readonly allSkills: SkillViewModel[] = MYSTIC_SKILL_UPGRADES.map((config) => {
    const asset = MYSTIC_SKILL_ASSETS.find((a) => a.id === config.id);
    return {
      config,
      label: asset?.label ?? this.formatSkillName(config.id),
      iconUrl: asset?.file ?? null,
      categoryLabel: CATEGORY_LABELS[config.category],
      roleLabel: this.formatRole(config.role),
      herbLabel: config.materialItemId ? HERB_LABELS[config.materialItemId] : null,
    };
  });

  // Filter state
  readonly categoryFilter = signal<MysticSkillCategory | 'all'>('all');
  readonly upgradeableOnly = signal(true);
  readonly searchQuery = signal('');

  // Selection
  readonly selectedSkillId = signal<MysticSkillId | null>(null);

  // Target (defaults to max)
  readonly targetTier = signal(this.planner.maxTier());
  readonly targetRank = signal(this.planner.maxRankPerTier - 1);

  // Filtered skills
  readonly filteredSkills = computed(() => {
    const category = this.categoryFilter();
    const onlyUpgradeable = this.upgradeableOnly();
    const query = this.searchQuery().toLowerCase().trim();

    return this.allSkills.filter((skill) => {
      if (category !== 'all' && skill.config.category !== category) return false;
      if (onlyUpgradeable && !skill.config.upgradeable) return false;
      if (query && !skill.label.toLowerCase().includes(query)) return false;
      return true;
    });
  });

  // Selected skill details
  readonly selectedSkill = computed(() => {
    const id = this.selectedSkillId();
    if (!id) return null;
    return this.allSkills.find((s) => s.config.id === id) ?? null;
  });

  // Current progress for selected skill
  readonly selectedProgress = computed(() => {
    const id = this.selectedSkillId();
    if (!id) return null;
    return this.planner.getProgress(id);
  });

  // Upgrade plan for selected skill
  readonly selectedPlan = computed<SkillUpgradePlan | null>(() => {
    const id = this.selectedSkillId();
    const progress = this.selectedProgress();
    if (!id || !progress) return null;

    return this.planner.planUpgrade(id, progress, this.targetTier(), this.targetRank());
  });

  // Global summary
  readonly globalSummary = computed<GlobalMaterialSummary>(() => {
    // Trigger reactivity on progress map changes
    this.planner.progressMap();
    return this.planner.computeGlobalSummary(this.targetTier(), this.targetRank());
  });

  // Herb item entries for display
  readonly herbEntries = computed(() => {
    const summary = this.globalSummary();
    return Object.entries(summary.herbsByItem)
      .filter(([, count]) => count > 0)
      .map(([itemId, count]) => ({
        itemId: itemId as MysticBreakthroughItemId,
        label: HERB_LABELS[itemId as MysticBreakthroughItemId] ?? itemId,
        count,
        iconUrl: this.getItemIcon(itemId),
      }));
  });

  // Tier array for visual indicators
  readonly tiers = computed(() => Array.from({ length: this.planner.maxTier() }, (_, i) => i + 1));

  // Rank array (0-9)
  readonly ranks = Array.from({ length: this.planner.maxRankPerTier }, (_, i) => i);

  // Progress map for direct access in template
  readonly progressMap = this.planner.progressMap;

  ngOnInit(): void {
    this.tooltipRegistry.registerAll(getDefaultTooltips());
    // Select first upgradeable skill by default
    const firstUpgradeable = this.allSkills.find((s) => s.config.upgradeable);
    if (firstUpgradeable) {
      this.selectedSkillId.set(firstUpgradeable.config.id);
    }
  }

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  selectSkill(skillId: MysticSkillId): void {
    this.selectedSkillId.set(skillId);
  }

  toggleIncluded(skillId: MysticSkillId, event: Event): void {
    event.stopPropagation();
    this.planner.toggleIncluded(skillId);
  }

  updateCurrentTier(skillId: MysticSkillId, value: number): void {
    this.planner.updateProgress(skillId, { tier: value });
  }

  updateCurrentRank(skillId: MysticSkillId, value: number): void {
    this.planner.updateProgress(skillId, { rank: value });
  }

  setTargetTier(value: number): void {
    this.targetTier.set(value);
    // Ensure rank is valid
    if (value === this.planner.maxTier() && this.targetRank() >= this.planner.maxRankPerTier) {
      this.targetRank.set(this.planner.maxRankPerTier - 1);
    }
  }

  setTargetRank(value: number): void {
    this.targetRank.set(value);
  }

  resetProgress(): void {
    if (confirm('Reset all mystic skill progress to Tier 1, Rank 0?')) {
      this.planner.resetAll();
    }
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  isSelected(skillId: MysticSkillId): boolean {
    return this.selectedSkillId() === skillId;
  }

  getProgress(skillId: MysticSkillId) {
    return this.planner.getProgress(skillId);
  }

  trackBySkillId(_index: number, skill: SkillViewModel): string {
    return skill.config.id;
  }

  private formatSkillName(id: MysticSkillId): string {
    // Convert 'mystic_skill.dragons_breath' -> "Dragon's Breath"
    const name = id.replace('mystic_skill.', '').replace(/_/g, ' ');
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private formatRole(role: string): string {
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private getItemIcon(itemId: string): string | null {
    const asset = ITEMS_ASSETS.find((a) => a.id === itemId);
    return asset?.file ?? null;
  }

  getHerbLabel(itemId: MysticBreakthroughItemId): string {
    return HERB_LABELS[itemId] ?? itemId;
  }

  scrollToTop(): void {
    const el = document.getElementById('top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
