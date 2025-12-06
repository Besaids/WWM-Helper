/**
 * Tooltip content model – domain-agnostic configuration for tooltips.
 * All content fields are optional, but at least one of imageUrl, title, or description
 * must be present for the tooltip to render.
 */

export type TooltipVariant = 'controlHint' | 'inlineInfo' | 'resourcePreview' | 'scheduledItem';

export interface TooltipConfig {
  /** Small thumbnail or icon image */
  imageUrl?: string;

  /** Short label or name */
  title?: string;

  /** Short explanatory text (1–3 lines) */
  description?: string;

  /** Optional URL for a CTA link */
  linkUrl?: string;

  /** Caption for the CTA link (e.g., "Open details") */
  linkLabel?: string;

  /** Usage variant – affects expected content patterns */
  variant?: TooltipVariant;
}

/**
 * Layout mode derived from which content fields are present.
 * Used internally by TooltipComponent to select the appropriate template.
 */
export type TooltipLayoutMode =
  | 'image-only'
  | 'title-only'
  | 'image-title'
  | 'image-description'
  | 'title-description'
  | 'full';

/**
 * Determines the layout mode based on which content fields are present.
 */
export function getTooltipLayoutMode(config: TooltipConfig): TooltipLayoutMode {
  const hasImage = !!config.imageUrl;
  const hasTitle = !!config.title;
  const hasDescription = !!config.description;

  if (hasImage && hasTitle && hasDescription) {
    return 'full';
  }
  if (hasImage && hasTitle) {
    return 'image-title';
  }
  if (hasImage && hasDescription) {
    return 'image-description';
  }
  if (hasTitle && hasDescription) {
    return 'title-description';
  }
  if (hasImage) {
    return 'image-only';
  }
  return 'title-only';
}

/**
 * Validates that a tooltip config has at least one required content field.
 */
export function isValidTooltipConfig(config: TooltipConfig | null | undefined): boolean {
  if (!config) return false;
  return !!(config.imageUrl || config.title || config.description);
}
