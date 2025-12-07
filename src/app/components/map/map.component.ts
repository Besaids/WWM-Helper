// map.component.ts
import { AfterViewInit, ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TooltipDirective } from '../../directives';

type MapSource = 'mapgenie' | 'chinese';

interface MapOption {
  id: MapSource;
  label: string;
  url: string;
  disclaimer?: string;
}

@Component({
  standalone: true,
  selector: 'app-map',
  imports: [CommonModule, TooltipDirective],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  private readonly sanitizer = inject(DomSanitizer);

  readonly selectedMap = signal<MapSource>('mapgenie');

  readonly mapOptions: MapOption[] = [
    {
      id: 'mapgenie',
      label: 'MapGenie',
      url: 'https://mapgenie.io/where-winds-meet/maps/world',
    },
    {
      id: 'chinese',
      label: 'Chinese Map',
      url: 'https://map.17173.com/yysls',
      disclaimer:
        "This map is in Chinese. Use your browser's auto-translate feature on the full website for the best experience.",
    },
  ];

  // pre-sanitized URLs for use in iframe [src]
  readonly safeMapUrls: Record<MapSource, SafeResourceUrl> = {
    mapgenie: this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://mapgenie.io/where-winds-meet/maps/world',
    ),
    chinese: this.sanitizer.bypassSecurityTrustResourceUrl('https://map.17173.com/yysls'),
  };

  get currentMap(): MapOption {
    return this.mapOptions.find((m) => m.id === this.selectedMap()) || this.mapOptions[0];
  }

  get currentMapSafeUrl(): SafeResourceUrl {
    return this.safeMapUrls[this.currentMap.id];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToMap();
    }, 0);
  }

  selectMap(mapId: MapSource): void {
    this.selectedMap.set(mapId);
  }

  private scrollToMap(): void {
    const el = document.getElementById('top');
    if (!el) return;

    const headerOffset = 80;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const targetY = rect.top + scrollTop - headerOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }
}
