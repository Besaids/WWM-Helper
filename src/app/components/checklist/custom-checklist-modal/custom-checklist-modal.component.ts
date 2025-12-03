// src/app/components/checklist/custom-checklist-modal/custom-checklist-modal.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChecklistItem,
  ChecklistImportance,
  ChecklistTag,
  CustomChecklistItemFormData,
  CUSTOM_CHECKLIST_LIMITS,
} from '../../../models';
import { CustomChecklistService } from '../../../services/checklist/custom-checklist.service';

type FormStep = 'type' | 'basic' | 'review';

@Component({
  selector: 'app-custom-checklist-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-checklist-modal.component.html',
  styleUrls: ['./custom-checklist-modal.component.scss'],
})
export class CustomChecklistModalComponent implements OnInit, OnChanges {
  private readonly customChecklistService = inject(CustomChecklistService);

  @Input() isOpen = false;
  @Input() editingItem?: ChecklistItem;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<CustomChecklistItemFormData>();

  // Expose limits to template
  readonly limits = CUSTOM_CHECKLIST_LIMITS;

  // Form state
  readonly currentStep = signal<FormStep>('type');
  readonly formData = signal<Partial<CustomChecklistItemFormData>>({});

  // Importance options (Daily or Weekly for custom items)
  readonly importanceOptions: { value: ChecklistImportance; label: string; description: string }[] =
    [
      { value: 'daily', label: 'Daily Task', description: 'Resets every day at 21:00 UTC' },
      { value: 'weekly', label: 'Weekly Task', description: 'Resets every Sunday at 21:00 UTC' },
    ];

  // Tag options
  readonly tagOptions: { value: ChecklistTag; label: string }[] = [
    { value: 'solo', label: 'Solo' },
    { value: 'multiplayer', label: 'Multiplayer' },
    { value: 'guild', label: 'Guild' },
    { value: 'combat', label: 'Combat' },
    { value: 'social', label: 'Social' },
    { value: 'economy', label: 'Economy' },
    { value: 'exploration', label: 'Exploration' },
    { value: 'leisure', label: 'Leisure' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'progression', label: 'Progression' },
    { value: 'stats', label: 'Stats' },
    { value: 'mounts', label: 'Mounts' },
    { value: 'premium', label: 'Premium' },
    { value: 'reward', label: 'Reward' },
    { value: 'cosmetics', label: 'Cosmetics' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.lockScroll();
        if (this.editingItem) {
          this.loadExistingItem(this.editingItem);
        } else {
          this.resetForm();
        }
      } else {
        this.unlockScroll();
      }
    }

    if (changes['editingItem'] && this.isOpen && this.editingItem) {
      this.loadExistingItem(this.editingItem);
    }
  }

  ngOnInit(): void {
    if (this.editingItem) {
      this.loadExistingItem(this.editingItem);
    } else {
      this.resetForm();
    }
  }

  private lockScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  private checkDuplicateLabel(): string | null {
    const currentLabel = this.formData().label?.trim().toLowerCase();
    if (!currentLabel) return null;

    const existingItems = this.customChecklistService.getAll();
    const editing = this.editingItem;

    const duplicate = existingItems.find(
      (item) => item.label.trim().toLowerCase() === currentLabel && item.id !== editing?.id,
    );

    if (duplicate) {
      return `A checklist item named "${duplicate.label}" already exists. Please choose a different name.`;
    }

    return null;
  }

  getDuplicateLabelError(): string | null {
    return this.checkDuplicateLabel();
  }

  // Step navigation
  goToStep(step: FormStep): void {
    this.currentStep.set(step);
  }

  canProceedFromType(): boolean {
    return !!this.formData().importance;
  }

  canProceedFromBasic(): boolean {
    const data = this.formData();
    return (
      !!data.label &&
      data.label.length >= this.limits.LABEL_MIN_LENGTH &&
      data.label.length <= this.limits.LABEL_MAX_LENGTH &&
      (!data.description || data.description.length <= this.limits.DESCRIPTION_MAX_LENGTH) &&
      (!data.tags || data.tags.length <= this.limits.MAX_TAGS) &&
      !this.checkDuplicateLabel()
    );
  }

  // Form submission
  onSubmit(): void {
    const data = this.formData();

    // Set category based on importance
    data.category = this.getCategoryFromImportance(data.importance!);

    this.save.emit(data as CustomChecklistItemFormData);
    this.onClose();
  }

  onClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.formData.set({
      importance: undefined,
      label: '',
      description: '',
      tags: [],
    });
    this.currentStep.set('type');
  }

  private loadExistingItem(item: ChecklistItem): void {
    const data: Partial<CustomChecklistItemFormData> = {
      importance: item.importance,
      category: item.category,
      label: item.label,
      description: item.description,
      tags: item.tags || [],
    };

    this.formData.set(data);
    // Skip Type step when editing - go straight to Basic Info
    this.currentStep.set('basic');
  }

  // Helper for template
  updateFormData(updates: Partial<CustomChecklistItemFormData>): void {
    this.formData.update((data) => ({ ...data, ...updates }));
  }

  toggleTag(tag: ChecklistTag): void {
    const current = this.formData().tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : current.length < this.limits.MAX_TAGS
        ? [...current, tag]
        : current;

    this.updateFormData({ tags: updated });
  }

  isTagSelected(tag: ChecklistTag): boolean {
    return this.formData().tags?.includes(tag) ?? false;
  }

  getImportanceLabel(): string {
    const option = this.importanceOptions.find((o) => o.value === this.formData().importance);
    return option?.label || '';
  }

  getImportanceDescription(): string {
    const option = this.importanceOptions.find((o) => o.value === this.formData().importance);
    return option?.description || '';
  }

  getSelectedTagsDisplay(): string {
    const tags = this.formData().tags || [];
    if (tags.length === 0) return 'No tags selected';
    return tags.map((t) => this.capitalizeFirst(t)).join(', ');
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getCategoryFromImportance(importance: ChecklistImportance): string {
    switch (importance) {
      case 'daily':
        return 'Daily Tasks';
      case 'weekly':
        return 'Weekly Tasks';
      case 'core':
        return 'Core Priorities';
      case 'optional':
        return 'Optional Tasks';
      default:
        return 'Custom';
    }
  }
}
