import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LayoutComponent } from './components/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout></app-layout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('wwm-helper');
}
