import { Injectable } from '@angular/core';
import { TooltipConfig } from '../../models/tooltip.model';

/**
 * Registry for tooltip configurations.
 * Maps string keys to TooltipConfig objects.
 * Domain-agnostic – specific entries are registered elsewhere.
 */
@Injectable({ providedIn: 'root' })
export class TooltipRegistryService {
  private readonly registry = new Map<string, TooltipConfig>();

  /**
   * Register a tooltip configuration with a unique key.
   */
  register(id: string, config: TooltipConfig): void {
    this.registry.set(id, config);
  }

  /**
   * Register multiple tooltip configurations at once.
   */
  registerAll(configs: Record<string, TooltipConfig>): void {
    Object.entries(configs).forEach(([id, config]) => {
      this.registry.set(id, config);
    });
  }

  /**
   * Retrieve a tooltip configuration by key.
   * Returns undefined if not found.
   */
  get(id: string): TooltipConfig | undefined {
    return this.registry.get(id);
  }

  /**
   * Check if a tooltip configuration exists for the given key.
   */
  has(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Remove a tooltip configuration by key.
   */
  unregister(id: string): void {
    this.registry.delete(id);
  }

  /**
   * Clear all registered tooltip configurations.
   */
  clear(): void {
    this.registry.clear();
  }
}
