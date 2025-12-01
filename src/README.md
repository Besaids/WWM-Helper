# WWM Helper – Styles / Design System

This folder contains the global design system for the WWM Helper app.

It is split into **tokens**, **mixins**, **base**, **components**, and **utilities**.  
Component-level SCSS files in `src/app/**` should _consume_ these pieces, not re-invent them.

> Core rule: **no hard-coded colors or font sizes in component SCSS**.  
> All theme values live in `tokens/*.scss`.  
> Common patterns use `mixins/*.scss`.

---

## 1. Folder structure

```text
src/styles.scss               # Global entrypoint (wired in angular.json)

src/styles/
  base/
    _globals.scss             # html/body, base typography, links
    _reset.scss               # box-sizing reset

  components/
    _buttons.scss             # .btn-primary, .btn-secondary (global CTAs)
    _card.scss                # .card-surface, .card-padding
    _chip.scss                # .chip pills used in timer strip, timers, etc.
    _page.scss                # .page-shell / .page-section helpers

  mixins/
    _capsule.scss             # capsule($layer, $radius, $padding) – card/row surfaces
    _pill.scss                # pill-base / pill-outline – button variants
    _toggle.scss              # diamond-toggle – shared toggle pattern
    _glow.scss                # glow($color, $intensity) – accent glow helper

  tokens/
    _colors.scss              # color palette + CSS custom properties
    _surfaces.scss            # layered surface alpha scale (layer-1 through layer-5)
    _gradients.scss           # radial gradients for backgrounds and toggles
    _motion.scss              # animation timing tokens (fast/base/slow/emphasize)
    _shadows.scss             # elevation depths + accent glows (teal/gold)
    _radius.scss              # border-radius tokens
    _spacing.scss             # spacing scale + outer padding
    _typography.scss          # font stack, font sizes, heading helpers
    _elevation.scss           # legacy shadows (deprecated in favor of _shadows.scss)

  utilities/
    _layout.scss              # .u-flex, .u-stack, gap helpers
    _text.scss                # .text-muted, size utilities
    _visibility.scss          # .u-visually-hidden
```

---

## 2. Design System Quick Rules

### 2.1 Token Usage

**Always use tokens for:**

- **Colors:** Use `$text-primary`, `$accent-teal`, `$accent-gold-soft`, etc. from `tokens/_colors.scss`
- **Surfaces:** Use `$surface-layer-1` through `$surface-layer-5` from `tokens/_surfaces.scss`
- **Gradients:** Use `$gradient-radial-base`, `$gradient-radial-teal-core`, etc. from `tokens/_gradients.scss`
- **Shadows:** Use `$shadow-depth-1` through `$shadow-depth-4` and `$glow-teal-soft/strong` from `tokens/_shadows.scss`
- **Motion:** Use `$motion-fast`, `$motion-base`, `$motion-slow` from `tokens/_motion.scss`
- **Spacing:** Use `$spacing-outer-x` and scale (`$space-1` through `$space-6`) from `tokens/_spacing.scss`
- **Radius:** Use `$radius-card`, `$radius-pill`, `$radius-toggle` from `tokens/_radius.scss`
- **Typography:** Use `$font-size-xs/sm/md/lg/xl` from `tokens/_typography.scss`

**Never use:**

- Raw hex colors like `#f5d28b`, `#42c3c6`, etc. in component SCSS
- Raw RGBA values like `rgba(15, 23, 42, 0.84)` outside token files
- Inline gradient definitions
- Hard-coded animation timings

### 2.2 Mixin Patterns

**Capsule mixin** (`mixins/_capsule.scss`):

```scss
@use 'mixins/capsule' as *;

.my-row {
  @include capsule($layer: 3, $radius: 0.75rem, $padding: 1rem);
}
```

- Use for card-like rows, list items, or any surface needing consistent layering
- `$layer` accepts 1-5 (matches `$surface-layer-1` through `$surface-layer-5`)
- Includes border, shadow, and transitions automatically

**Pill button mixins** (`mixins/_pill.scss`):

```scss
@use 'mixins/pill' as *;

.my-button {
  @include pill-base; // Solid background with hover states
}

.my-outline-button {
  @include pill-outline; // Transparent with border
}
```

- Use for pill-shaped buttons (tabs, action buttons, toggles)
- Consistent sizing, padding, and transition timing
- Handles hover, active, and focus states

**Diamond toggle mixin** (`mixins/_toggle.scss`):

```scss
@use 'mixins/toggle' as *;

.my-toggle {
  @include diamond-toggle;
}

// Add inner core element in your template:
// <div class="my-toggle">
//   <div class="my-toggle__inner"></div>
// </div>
```

- Use for checkbox-style toggles with diamond indicator
- Requires inner element with `__inner` suffix (e.g., `.my-toggle__inner`)
- Handles unchecked (gold outline) and checked (teal core with glow) states

**Glow helper** (`mixins/_glow.scss`):

```scss
@use 'mixins/glow' as *;

.my-element:hover {
  @include glow(teal, soft);
}
```

- Use for adding accent glows on hover or active states
- Supports `teal`/`gold` colors and `soft`/`strong` intensities
- Uses tokenized shadow values

### 2.3 Import Paths

Angular 21 requires relative imports **without** the `styles/` prefix:

```scss
// ✅ Correct
@use 'tokens/colors' as *;
@use 'mixins/capsule' as *;

// ❌ Wrong
@use 'styles/tokens/colors' as *;
@use 'styles/mixins/capsule' as *;
```

### 2.4 Component SCSS Guidelines

**Do:**

- Import only the tokens/mixins you need
- Use `@use` with namespaces (e.g., `@use 'tokens/colors' as *`)
- Leverage global components (`.card-surface`, `.card-padding`, `.chip`)
- Apply mixins for common patterns (capsules, pills, toggles)
- Keep component styles minimal and specific to that component

**Don't:**

- Set page-level backgrounds (use layout's global background)
- Re-invent card surfaces, pills, or toggles
- Use raw colors or RGBA values
- Define gradients inline
- Override global token values

---

## 3. Token Reference

### 3.1 Colors (`tokens/_colors.scss`)

**Backgrounds:**

- `$bg-root`, `$bg-elevated`, `$bg-soft`, `$bg-strip`

**Surfaces:**

- `$surface-card`, `$surface-chip`

**Accents:**

- `$accent-gold`, `$accent-gold-soft`, `$accent-gold-highlight`, `$accent-gold-dim`, `$accent-gold-active`
- `$accent-teal`, `$accent-red`

**Text:**

- `$text-primary`, `$text-secondary`, `$text-muted`, `$text-muted-strong`

**Borders:**

- `$border-subtle`

**Buttons:**

- `$btn-accent-text`, `$btn-secondary-border`, `$btn-secondary-border-hover`

### 3.2 Surfaces (`tokens/_surfaces.scss`)

Five-layer alpha scale over `rgba(15, 23, 42)`:

- `$surface-layer-1` – 0.6 alpha (most transparent)
- `$surface-layer-2` – 0.72 alpha
- `$surface-layer-3` – 0.84 alpha
- `$surface-layer-4` – 0.92 alpha
- `$surface-layer-5` – 0.96 alpha (most opaque)

Use higher layers for more prominent surfaces (modals, drawers), lower layers for subtle backgrounds.

### 3.3 Gradients (`tokens/_gradients.scss`)

**Background:**

- `$gradient-radial-base` – Main app background gradient

**Toggle cores:**

- `$gradient-radial-teal-core` – Active toggle fill
- `$gradient-radial-teal-soft` – Soft teal gradient
- `$gradient-radial-teal-hover` – Teal hover state
- `$gradient-radial-gold-core` – Gold accent gradient

### 3.4 Motion (`tokens/_motion.scss`)

**Timing:**

- `$motion-fast` – 120ms (quick interactions)
- `$motion-base` – 160ms (standard transitions)
- `$motion-slow` – 240ms (deliberate animations)
- `$motion-emphasize` – 300ms (emphasized state changes)

**Easing:**

- `$motion-ease` – Cubic-bezier for smooth acceleration/deceleration

### 3.5 Shadows (`tokens/_shadows.scss`)

**Elevation:**

- `$shadow-depth-1` – Subtle depth (cards)
- `$shadow-depth-2` – Moderate depth (raised cards)
- `$shadow-depth-3` – Strong depth (modals)
- `$shadow-depth-4` – Maximum depth (drawers)

**Glows:**

- `$glow-teal-soft`, `$glow-teal-strong` – Teal accent glows
- `$glow-gold-soft` – Gold accent glow

### 3.6 Radius (`tokens/_radius.scss`)

- `$radius-card` – 0.75rem (cards, panels)
- `$radius-pill` – 2rem (pill buttons, chips)
- `$radius-toggle` – 0.35rem (toggles, small controls)

### 3.7 Spacing (`tokens/_spacing.scss`)

**Layout:**

- `$spacing-outer-x` – 1.75rem (horizontal page padding)

**Scale:**

- `$space-1` through `$space-6` (0.25rem to 2rem)

### 3.8 Typography (`tokens/_typography.scss`)

**Font stack:**

- `$font-family-base` – System font stack with fallbacks

**Sizes:**

- `$font-size-xs`, `$font-size-sm`, `$font-size-md`, `$font-size-lg`, `$font-size-xl`

**Line heights:**

- `$line-height-base`, `$line-height-headings`

---

## 4. Common Patterns

### 4.1 Card Surfaces

Use global `.card-surface` + `.card-padding` for consistent cards:

```html
<div class="card-surface card-padding">
  <!-- Card content -->
</div>
```

### 4.2 Pill Buttons

For inline action buttons, use pill mixins:

```scss
.my-action-btn {
  @include pill-outline;
  // Add component-specific overrides if needed
}
```

### 4.3 Timer/Checklist Rows

For list rows with consistent surfaces, use capsule mixin:

```scss
.my-list-row {
  @include capsule($layer: 3, $radius: 0.5rem, $padding: 0.75rem 1rem);
  // Add row-specific layout
}
```

### 4.4 Diamond Toggles

For visibility toggles or checkboxes with diamond indicators:

```scss
.my-toggle {
  @include diamond-toggle;
  // Ensure template has inner element:
  // <div class="my-toggle"><div class="my-toggle__inner"></div></div>
}
```

---

## 5. Migration Guide

### 5.1 Replacing Raw Colors

**Before:**

```scss
.my-element {
  color: #f5d28b;
  background: rgba(15, 23, 42, 0.84);
}
```

**After:**

```scss
@use 'tokens/colors' as *;
@use 'tokens/surfaces' as *;

.my-element {
  color: $accent-gold-soft;
  background: $surface-layer-3;
}
```

### 5.2 Replacing Inline Gradients

**Before:**

```scss
.my-element {
  background: radial-gradient(circle at center, rgba(66, 195, 198, 0.4), transparent);
}
```

**After:**

```scss
@use 'tokens/gradients' as *;

.my-element {
  background: $gradient-radial-teal-soft;
}
```

### 5.3 Replacing Bespoke Card Styles

**Before:**

```scss
.my-card {
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

**After:**

```scss
@use 'mixins/capsule' as *;

.my-card {
  @include capsule($layer: 5, $radius: 0.75rem, $padding: 1.25rem);
}
```

### 5.4 Replacing Pill Buttons

**Before:**

```scss
.my-button {
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  background: transparent;
  border: 1px solid rgba(228, 184, 106, 0.5);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: rgba(228, 184, 106, 0.12);
    border-color: #e4b86a;
  }
}
```

**After:**

```scss
@use 'mixins/pill' as *;

.my-button {
  @include pill-outline;
}
```

---

## 6. Future Enhancements

### 6.1 Stylelint Integration

Add `stylelint.config.js` to enforce token usage:

```js
module.exports = {
  rules: {
    'color-no-hex': true, // Disallow hex colors outside tokens/
    'function-disallowed-list': ['rgba', 'rgb'], // Disallow raw rgba/rgb
  },
};
```

### 6.2 Consistency Scripts

Create `scripts/verify-style-consistency.mjs` to scan for violations:

```bash
npm run lint:styles      # Run stylelint
npm run check:styles     # Verify no raw colors in components
```

### 6.3 Additional Tokens

Consider adding:

- `--glow-red-soft` for urgent timer states
- `--motion-spring` for playful animations
- Additional surface layers for complex overlays

### 6.4 Dark Mode Support

Prepare for theme switching:

- Keep all colors in CSS custom properties (already done)
- Add `[data-theme="light"]` variants in token files
- Test component isolation from hard-coded values

---

## 7. Maintenance Notes

- Treat this README as **authoritative** for style system guidelines
- When adding new tokens:
  - Add to appropriate `tokens/*.scss` file
  - Document in this README's token reference section
  - Update migration guide with usage examples
- When creating new mixins:
  - Add to `mixins/*.scss`
  - Document in "Mixin Patterns" section with usage example
  - Consider adding to "Common Patterns" if widely applicable
- When refactoring components:
  - Ensure all raw colors/RGBA values are replaced with tokens
  - Apply appropriate mixins for common patterns
  - Update component-specific documentation in `src/README.md` if needed

---

## 8. Where the design system is used today

The tokens and mixins documented here are now wired through most of the app. When you’re changing styles, it helps to know which pieces already consume the system and should stay aligned with it.

### 8.1 High-traffic feature screens

- **Timers**
  - Timer rows use the `capsule` mixin for surfaces.
  - Visibility toggles and per-timer checkboxes use the shared `diamond-toggle` pattern.
  - Details / Hide pill buttons use `pill-outline` for consistent CTAs.
  - Urgent countdown styling (e.g. timers under 10 minutes) uses the red accent tokens.

- **Checklist**
  - Daily / Weekly cards use `capsule` for card shells.
  - View-mode tabs (Detailed / Simple) and the reset button use `pill-base` / `pill-outline`.
  - Checklist item toggles are implemented with the same diamond-toggle mixin used by Timers.

- **Home & Guides**
  - Home section cards (Timers / Checklists / Guides / External resources) are all capsules.
  - In-guide callouts (e.g. Trading / Commerce guide sections) use card helpers + typography tokens.
  - The scroll-to-top button on long guides uses button tokens for radius, colors and motion.

- **Music player**
  - Player surface and playlist drawer use surface-layer tokens and elevation shadows.
  - Transitions (open/close drawer, hover states) use motion tokens.

### 8.2 Layout & chrome

- **Navbar**
  - Background, underline accent and hover states use color, gradient and shadow tokens.
- **App shell & footer**
  - Background gradient and noise overlay use `gradients` tokens for color and intensity.
  - Footer uses the same surface layer and border tokens as other low-emphasis cards.

When adding new components or pages (for example, future Guides beyond Trading), prefer copying patterns from these existing consumers instead of creating fresh ad‑hoc styles. That keeps the app visually cohesive and makes future theme changes cheaper.
