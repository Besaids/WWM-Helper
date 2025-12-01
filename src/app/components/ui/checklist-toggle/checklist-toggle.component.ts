import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-checklist-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-toggle.component.html',
  styleUrls: ['./checklist-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Let the component styles affect projected .checklist-item-label, etc.
  encapsulation: ViewEncapsulation.None,
})
export class ChecklistToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() ariaDescribedBy: string | null = null;

  @Output() checkedChange = new EventEmitter<boolean>();

  readonly checkboxId = `checklist-toggle-${nextId++}`;

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
