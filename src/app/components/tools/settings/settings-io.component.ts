import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SettingsIoService } from '../../../services';
import {
  DEFAULT_EXPORT_OPTIONS,
  ImportValidationResult,
  SettingsExportOptions,
  SettingsImportOptions,
} from '../../../models';

type ImportMode = 'add' | 'overwrite';

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Component({
  selector: 'app-settings-io',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-io.component.html',
  styleUrls: ['./settings-io.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsIoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly settingsIo = inject(SettingsIoService);

  // Export state
  readonly exportOptions = signal<SettingsExportOptions>({ ...DEFAULT_EXPORT_OPTIONS });
  readonly exportJson = signal<string>('');
  readonly exportGenerated = signal(false);

  // Import state
  readonly importText = signal<string>('');
  readonly importOptions = signal<SettingsImportOptions>({
    scopes: { ...DEFAULT_EXPORT_OPTIONS },
    mode: 'add',
  });
  readonly validationResult = signal<ImportValidationResult | null>(null);

  // Toast notifications
  readonly toast = signal<ToastMessage | null>(null);
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  // Which section to highlight based on query param
  readonly highlightSection = signal<'checklists' | 'timers' | null>(null);

  // Computed: whether any export option is selected
  readonly hasExportSelection = computed(() => {
    const opts = this.exportOptions();
    return (
      opts.checklistCustomItems ||
      opts.checklistPinsHidden ||
      opts.timerCustomTimers ||
      opts.timerEnabledIds ||
      opts.timerGuildEvents
    );
  });

  // Computed: whether import is valid and can be applied
  readonly canImport = computed(() => {
    const result = this.validationResult();
    if (!result || !result.valid) return false;

    // Check that at least one scope with data is selected
    const opts = this.importOptions().scopes;
    const summary = result.summary;
    if (!summary) return false;

    const hasChecklistSelection =
      (opts.checklistCustomItems && summary.customChecklistItemCount > 0) ||
      (opts.checklistPinsHidden && (summary.pinnedCount > 0 || summary.hiddenCount > 0));

    const hasTimerSelection =
      (opts.timerCustomTimers && summary.customTimerCount > 0) ||
      (opts.timerEnabledIds && summary.enabledTimerCount > 0) ||
      (opts.timerGuildEvents && summary.guildEventCount > 0);

    return hasChecklistSelection || hasTimerSelection;
  });

  ngOnInit(): void {
    // Check for section query param
    const section = this.route.snapshot.queryParamMap.get('section');
    if (section === 'checklists' || section === 'timers') {
      this.highlightSection.set(section);
      // Scroll to appropriate card after render
      setTimeout(() => {
        const element = document.querySelector(
          section === 'checklists' ? '.export-card' : '.import-card',
        );
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // ---- Export methods ----

  updateExportOption(key: keyof SettingsExportOptions, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.exportOptions.update((opts) => ({ ...opts, [key]: checked }));
    // Clear previous export when options change
    this.exportGenerated.set(false);
    this.exportJson.set('');
  }

  generateExport(): void {
    const payload = this.settingsIo.buildExport(this.exportOptions());
    this.exportJson.set(JSON.stringify(payload, null, 2));
    this.exportGenerated.set(true);
  }

  async copyExportToClipboard(): Promise<void> {
    const json = this.exportJson();
    if (!json) return;

    try {
      await navigator.clipboard.writeText(json);
      this.showToast({ type: 'success', text: 'Export copied to clipboard!' });
    } catch {
      this.showToast({ type: 'error', text: 'Failed to copy to clipboard' });
    }
  }

  // ---- Import methods ----

  onImportTextChange(value: string): void {
    this.importText.set(value);
    this.validateImportInput();
  }

  private validateImportInput(): void {
    const text = this.importText().trim();
    if (!text) {
      this.validationResult.set(null);
      return;
    }

    const result = this.settingsIo.validateImport(text);
    this.validationResult.set(result);
  }

  updateImportScope(key: keyof SettingsExportOptions, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.importOptions.update((opts) => ({
      ...opts,
      scopes: { ...opts.scopes, [key]: checked },
    }));
  }

  setImportMode(mode: ImportMode): void {
    this.importOptions.update((opts) => ({ ...opts, mode }));
  }

  applyImport(): void {
    const result = this.validationResult();
    if (!result?.valid || !result.payload) {
      this.showToast({ type: 'error', text: 'Cannot import: validation failed' });
      return;
    }

    try {
      this.settingsIo.applyImport(result.payload, this.importOptions());

      // Build success message
      const summary = result.summary!;
      const opts = this.importOptions();
      const parts: string[] = [];

      if (opts.scopes.checklistCustomItems && summary.customChecklistItemCount > 0) {
        parts.push(`${summary.customChecklistItemCount} custom checklist item(s)`);
      }
      if (opts.scopes.checklistPinsHidden) {
        const count = summary.pinnedCount + summary.hiddenCount;
        if (count > 0) {
          parts.push(`${count} pin/hide preference(s)`);
        }
      }
      if (opts.scopes.timerCustomTimers && summary.customTimerCount > 0) {
        parts.push(`${summary.customTimerCount} custom timer(s)`);
      }
      if (opts.scopes.timerEnabledIds && summary.enabledTimerCount > 0) {
        parts.push(`${summary.enabledTimerCount} enabled timer(s)`);
      }
      if (opts.scopes.timerGuildEvents && summary.guildEventCount > 0) {
        parts.push(`${summary.guildEventCount} guild event config(s)`);
      }

      const modeText = opts.mode === 'add' ? 'merged with' : 'replaced';
      this.showToast({
        type: 'success',
        text: `Successfully ${modeText} your settings: ${parts.join(', ')}`,
      });

      // Clear import form
      this.importText.set('');
      this.validationResult.set(null);
    } catch (e) {
      this.showToast({
        type: 'error',
        text: `Import failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
      });
    }
  }

  // ---- Toast methods ----

  private showToast(message: ToastMessage): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast.set(message);
    this.toastTimeout = setTimeout(() => {
      this.toast.set(null);
    }, 5000);
  }

  dismissToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast.set(null);
  }

  // ---- Helper methods for template ----

  getImportModeDescription(): string {
    const mode = this.importOptions().mode;
    if (mode === 'add') {
      return 'New items will be added. Existing items with matching IDs will be updated with the imported version.';
    }
    return 'Your current settings for selected sections will be completely replaced with the imported data.';
  }
}
