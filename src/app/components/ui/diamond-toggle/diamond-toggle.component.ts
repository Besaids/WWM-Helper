import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-diamond-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diamond-toggle.component.html',
  styleUrls: ['./diamond-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiamondToggleComponent {
  @Input() checked = false;
  @Input() disabled = false;

  // So you can do (checkedChange)="onToggleTimer(id)"
  @Output() checkedChange = new EventEmitter<boolean>();

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
