// src/app/services/seo/seo.service.ts
import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoData } from '../../models';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private readonly siteBase = 'https://besaids.github.io/WWM-Helper';
  private readonly defaultImage = `${this.siteBase}/assets/portal/wwm-logo.png`;

  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const snap = this.getDeepestRoute(this.route);
        const seo = (snap.snapshot.data?.['seo'] ?? null) as SeoData | null;

        // Fallback to current index.html values if route has no seo block.
        const title = seo?.title ?? this.doc.title;
        const description =
          seo?.description ??
          this.doc.querySelector('meta[name="description"]')?.getAttribute('content') ??
          '';

        const path = this.router.url.split('?')[0].split('#')[0];
        const canonicalUrl = this.normalizeCanonical(
          `${this.siteBase}${path === '/' ? '/' : path}`,
        );

        this.apply({ title, description, image: seo?.image ?? this.defaultImage }, canonicalUrl);
      });
  }

  private getDeepestRoute(r: ActivatedRoute): ActivatedRoute {
    let cur = r;
    while (cur.firstChild) cur = cur.firstChild;
    return cur;
  }

  private normalizeCanonical(url: string): string {
    // Keep trailing slash only for root.
    if (url === this.siteBase) return `${this.siteBase}/`;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  private apply(seo: SeoData, canonicalUrl: string): void {
    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: seo.image ?? this.defaultImage });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: seo.image ?? this.defaultImage });

    // Canonical link
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }
}
