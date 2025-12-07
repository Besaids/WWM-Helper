# WWM Helper – AI Coding Agent Instructions

**Where Winds Meet Helper** is an Angular 21 standalone SPA providing timers, checklists, path guides, and tools for the game **Where Winds Meet**. It uses UTC-based reset logic, a shared SCSS design system, and a structured game-asset manifest that also feeds the tooltip system.

This file is for AI coding agents (Copilot, ChatGPT, etc.) to understand project conventions and where to look for context.

---

## 1. Architecture Overview

### Tech Stack

- **Angular 21** – Standalone components, signals, OnPush change detection
- **Luxon** – UTC-based datetime calculations for all game resets and timers
- **Howler.js** – Music player audio management
- **Bootstrap 5 + Icons** – Base UI and icon set
- **SCSS** – Design system with tokens, mixins, base, components, utilities

### Core Time/State Concepts

- All game resets and timers operate in **UTC** (game server time), never local time.
- Reset times:
  - **Daily reset**: 21:00 UTC
  - **Weekly reset**: Sunday 21:00 UTC
- Cycle IDs are ISO date strings:
  - `getDailyCycleId()`
  - `getWeeklyCycleId()`

### Service & Component Patterns

- Components are **standalone**.
- Use `inject()` for DI.
- Prefer **signals** for local state and OnPush components.
- Use observables only for streams and terminate with `takeUntilDestroyed()`.

---

## 2. Project Structure

High level:

```text
src/app/
  components/
  services/
  configs/
  models/
  utils/

src/styles/
  base/
  components/
  mixins/
  tokens/
  utilities/

src/assets/
  game/
  guides/
  music/
  portal/
```

Important docs / configs:

- `src/styles/README.md`
- `src/assets/README_game-assets.md` (game assets + tooltip manifest context)
- `src/app/models/game-assets.model.ts`
- `src/app/configs/tooltip/game-assets.ts`
- `src/app/configs/tooltip/tooltip-defaults.config.ts`
- `src/README.md`

---

## 3. Design System Rules (SCSS)

**Do not introduce ad-hoc theme values in component SCSS.**  
Always use tokens & mixins.

### Imports

Typical pattern:

```scss
@use 'tokens/colors' as *;
@use 'tokens/spacing' as *;
@use 'mixins/capsule' as *;
```

### Token Categories

- Colors
- Surfaces
- Gradients
- Shadows
- Motion
- Radius
- Spacing
- Typography
- Elevation (legacy)

### Mixins & Utilities

Common mixins:

- `capsule`
- `pill-base` / `pill-outline`
- `diamond-toggle`
- `glow()`

Utilities (examples):

- `.u-flex`, `.u-stack`, `.u-gap-*`
- `.text-muted`, `.u-text-xs/sm/lg`
- `.u-visually-hidden`

**New reusable patterns** go to:

- `utilities/` for layout/text helpers  
- `components/` for shared visual patterns  
- `mixins/` for low-level logic  

Do not duplicate existing layout, chip, card, or button patterns in local SCSS.

---

## 4. Game Assets Usage

### Source of Truth

Game assets are **not** discovered by scanning `assets/` directly; they are described by a manifest and types:

- `src/app/models/game-assets.model.ts`
- `src/app/configs/tooltip/game-assets.ts`
- `src/app/configs/tooltip/README_game-assets.md`

Each asset in `GAME_ASSETS` includes:

- Semantics (description, system tags).
- Category and kind (currency, system, navigation, path, item).
- UI usage notes.
- Size and aspect ratio.
- Optional preferred tooltip variant.

### Rules for AI / Copilot

1. **Use only `assets/game/` for in-game concepts.**  
   - `assets/guides/` → guide screenshots only.  
   - `assets/music/` → audio / cover art.  
   - `assets/portal/` → web app branding.

2. Pick icons via **manifest metadata**, not by guessing file paths.
3. Use `width`, `height`, and `aspect_ratio` from `GAME_ASSETS` for layout decisions.
4. Avoid scattering raw file paths across components; prefer centralized configs.

When you need to know what an asset is or how to use it, look at:

- The `GameAssetDefinition` entry in `game-assets.ts`.
- The extra context in `README_game-assets.md`.

---

## 5. Common Development Patterns

### Timers

- Add definitions in `src/app/configs/timers/**` (or existing timer config files).
- Always use UTC for calculations.
- Use helper functions for cycle IDs and duration math; do not roll your own ad-hoc date logic.

### Checklists

- Definitions live in `src/app/configs/checklists/**`.
- Use signals for UI state where possible.
- Follow existing checklist toggle UI patterns (pin, hide, reset, completion counts).

### Guides

- Use `src/styles/base/_guides.scss` and related styles.
- Use game assets from the manifest instead of random images.

---

## 6. Storage & Privacy

- Consent is stored in `localStorage`.
- Storage versions must be migrated deliberately; do not break existing keys.
- There is **no backend**; everything is client-side.
- Keep new keys namespaced and versioned when appropriate.

---

## 7. Pitfalls to Avoid

- Using **local time** for game logic instead of UTC.
- Hardcoding raw colors in component SCSS instead of tokens.
- Misusing icons (wrong currency/system for the context).
- Changing storage shapes without version bumps or migration.
- Duplicating UI patterns instead of extracting shared styles/components.

---

## 8. Quick Reference

- Design system → `src/styles/README.md`
- Game assets + tooltip context → `src/assets/README_game-assets.md`
- Game assets model → `src/app/models/game-assets.model.ts`
- Game assets manifest → `src/app/configs/tooltip/game-assets.ts`
- Tooltip defaults + bindings → `src/app/configs/tooltip/tooltip-defaults.config.ts`
- Root overview → `src/README.md`

---

## 9. Tooltip System & Contextual Helpers

The app has a reusable tooltip system built around:

- `TooltipConfig` (imageUrl, title, description, linkUrl, linkLabel, variant)
- `TooltipVariant`: `"controlHint" | "inlineInfo" | "resourcePreview" | "scheduledItem"`
- A registry service that maps string keys → `TooltipConfig`
- A global `[appTooltip]` directive that can take either a registry key or an inline config

When you write or edit UI code, always consider whether a tooltip would improve clarity with **minimal clutter**, especially in guides, timers, and checklists.

### 9.1. Tooltip defaults & asset integration

Tooltip defaults are built from the game assets manifest plus static entries:

- `src/app/configs/tooltip/game-assets.ts`  
  → Exports `GAME_ASSETS: GameAssetDefinition[]`.

- `src/app/configs/tooltip/tooltip-defaults.config.ts`:
  - Indexes `GAME_ASSETS` by `id`:
    - `GAME_ASSETS_BY_ID[asset.id] = asset;`
  - Defines `ASSET_TOOLTIP_BINDINGS: Record<string, string>`:
    - Left side: tooltip ID used in templates, e.g. `"system.energy"`.
    - Right side: `GameAssetDefinition.id`, e.g. `"system.energy_small"`.
  - Defines `STATIC_TOOLTIPS: TooltipConfigMap`:
    - Hand-written content for generic controls, checklist actions, timer badges, etc.
  - Builds asset-derived tooltips:
    - `buildAssetTooltips()` loops over `ASSET_TOOLTIP_BINDINGS`, finds the asset in `GAME_ASSETS_BY_ID`, and yields `TooltipConfig`:
      - `imageUrl = asset.file`
      - `title = asset.label`
      - `description = asset.description` (or notes)
      - `variant = asset.tooltip_variant ?? 'inlineInfo'`
  - Exposes:
    - `getDefaultTooltips(): TooltipConfigMap` which merges `STATIC_TOOLTIPS` and `buildAssetTooltips()`.

The registry seeding flow is:

```ts
tooltipRegistry.registerAll(getDefaultTooltips());
```

**Do not** reimplement this logic in components; reuse `getDefaultTooltips()` and add new bindings in `ASSET_TOOLTIP_BINDINGS` or `STATIC_TOOLTIPS` as needed.

---

### 9.2. When to consider adding a tooltip

Treat these as strong candidates for `[appTooltip]`:

- **Inline domain terms** in text:
  - Named currencies, items, regions, modes, systems, paths, etc.
  - Example concepts: premium currencies, Dreamscape, path names, Path Guide.

- **Interactive controls** that are not self-explanatory:
  - Icon-only buttons, toggles, small chips that change state or filter content.

- **Links** that jump to detailed guides or tools:
  - Trading guides, interactive map, Chinese Chess tool.

- **Timer/checklist entries** that represent time-based events:
  - Named events in the timers and checklist definitions.

Do **not** use tooltips for information that is *required* to use the UI; that belongs in visible text or a dedicated section, not hidden behind hover.

---

### 9.3. Choosing the right variant

Use `variant` consistently:

- `controlHint`
  - For buttons and controls.
  - Text-only tooltip; short, action-oriented description.
  - Example: settings icon, reset button, pin/unpin controls.

- `inlineInfo`
  - For inline terms in prose.
  - Can use any combination of image/title/description, including **image-only**.
  - This is the default for “glossary-style” tooltips when a term maps to a game asset.

- `resourcePreview`
  - For links that open a guide, tool, or external resource.
  - Typically: title + one-line description, optional thumbnail, optional CTA link.

- `scheduledItem`
  - For items that represent time-based events (timers, weekly/daily tasks).
  - Title + short explanation; optionally mention schedule in the description.

When you add `[appTooltip]` and don’t specify a variant, assume `"inlineInfo"`.

---

### 9.4. Using the tooltip registry vs inline configs

Prefer the **registry** for anything that appears in multiple places:

- Add or update keys in the tooltip registry defaults or bindings for recurring concepts:
  - Example keys: `"system.energy"`, `"currency.echo_bead"`, `"currency.echo_jade"`, `"timer-badge.active"`.
- Then use them like:
  - `[appTooltip]="'currency.echo_jade'"` on inline text.
  - `[appTooltip]="'timer-badge.active'"` on an active timer badge.

Use **inline config objects** only when:

- The tooltip is clearly a one-off and will not be reused elsewhere, **and**
- It’s simpler to keep it local than to create a registry entry.

When in doubt, favour registry keys; this keeps content consistent and easy to update.

---

### 9.5. Picking images and text from GAME_ASSETS

When building a tooltip for a game concept, use the **GAME_ASSETS manifest** as the source of truth:

- Check `src/app/configs/tooltip/game-assets.ts` and `README_game-assets.md` for:
  - Matching `id` and label.
  - Category, system tags, and UI usage notes.
  - Icon file paths and size/aspect ratio info.

Use the asset metadata to populate `TooltipConfig` (directly or via bindings):

- `imageUrl`: the correct icon path from `asset.file`.
- `title`: the display name from `asset.label`.
- `description`: a short summary based on `asset.description` and/or `asset.ui_usage_notes`.

Do **not** hardcode random image paths or descriptions when the manifest already has a canonical asset; always try to reuse existing definitions.

---

### 9.6. Template integration patterns

When editing HTML templates:

**Inline term with tooltip (glossary-style)**

- Wrap the term in an element and attach `[appTooltip]`:
  ```html
  <span class="has-tooltip" [appTooltip]="'currency.echo_jade'">
    Echo Jade
  </span>
  ```
- Keep styling consistent by reusing helper classes (e.g. `.has-tooltip`).

**Control hint on a button**

- Attach a `controlHint` variant in `STATIC_TOOLTIPS` and reference its key:
  ```html
  <button
    type="button"
    class="icon-button"
    [appTooltip]="'checklist.pin'">
    <!-- icon -->
  </button>
  ```

**Guide/tool preview on links**

- For internal guides/tools, use `resourcePreview`:
  - Configure in `STATIC_TOOLTIPS` with title + short description and optional `linkUrl`/`linkLabel`.

**Event/timer explanation**

- For timer/checklist items, use `scheduledItem` and give a short explanation of what the event is and why a player cares.

---

### 9.7. Tooltip keys from GAME_ASSETS

When you create tooltip registry entries for game concepts, derive the key from
`GAME_ASSETS` (`src/app/configs/tooltip/game-assets.ts`) if you find it there:

- Treat the manifest `id` as the canonical concept id
  (e.g. `currency.echo_jade`, `system.energy`, `sect_paths.bellstrike_splendor`).
- Tooltip keys should align with one of these patterns:
  - Prefer: use the id directly → `[appTooltip]="'currency.echo_jade'"`.
  - Or, use a simple alias that is mapped in `ASSET_TOOLTIP_BINDINGS`:
    - e.g. `'system.energy'` → `'system.energy_small'`.

Do **not** invent arbitrary keys like `"currency-echo-jade"` when a manifest id exists.
Reuse the manifest id or an explicit alias in `ASSET_TOOLTIP_BINDINGS` so tooltips,
assets, and guides stay in sync.

---

### 9.8. Mapping asset categories to tooltip usage

When scanning `GAME_ASSETS`, use `category`, `kind`, and `game_system_tags`
to decide where tooltips are appropriate:

- `category: "currency"` (`kind: "currency-icon"`)
  - Inline term tooltips on currency names (Echo Bead, Echo Jade, Commerce Coin, etc.).
  - Use `variant: "inlineInfo"`; usually image + title + 1-line description.

- `category: "items"` (`kind: "gacha-ticket-icon"` or similar)
  - Inline tooltips for named tickets or items referenced in guides/checklists.

- `category: "system"` (`kind: "system-icon"`)
  - Explanatory tooltips for systems like Energy and Stamina when they appear in prose
    or checklist/timer labels.

- `category: "sect_paths"` (`kind: "path-icon"`)
  - Tooltips on Path names in Path Guide UIs (`Bellstrike – Splendor`, `Silkbind – Deluge`, etc.).
  - Use `variant: "inlineInfo"` with image + title + description taken from the manifest.

- `category: "navigation"` (`kind: "nav-icon"` / `"menu-nav-icon"`)
  - Use for navigation-style or “hub” concepts in the UI: sections, helper boxes, or links that conceptually match the in-game menus (quests, professions, season, sects, settings, etc.).
  - Good candidates:
    - Headings or pills for “Season”, “Battle Pass”, “Quests”, “Sects”, “Professions”, “Settings / Options”.
    - Links or cards that act like “go to this hub” actions.
  - Use `variant: "resourcePreview"` on links or “hub cards”, or `variant: "inlineInfo"` for inline labels.

Use `game_system_tags` and `ui_usage_notes` to infer *where* in the UI a tooltip makes sense
(e.g. weekly-capped currencies in weekly checklists, co-op currencies in co-op guides).
Do **not** blindly add tooltips to every occurrence; prefer first-use in a section or
high-impact locations (titles, labels, key bullets).

When wiring tooltips into Timers or Checklists:

- Look at each timer/checklist item’s semantics (id, label, category, tags).
- Try to match them against `GAME_ASSETS` using:
  - `category` + `kind` (e.g. currencies for economy tasks; system icons for “Energy”/“Stamina”; navigation icons for “Season” or “Battle Pass” sections).
  - `game_system_tags` (e.g. `["gacha", "season"]`, `["bounties"]`, `["coop"]`).
- If you find a clear match, use that asset as the tooltip `imageUrl` with:
  - `variant: "scheduledItem"` for timers and recurring checklist tasks.
  - A short `description` explaining why this timer/task matters, based on existing helper copy or `ui_usage_notes`.

Do not force an icon if the mapping is ambiguous; in that case, use a text-only tooltip.

---

### 9.9. Reuse manifest text for tooltip content

When creating a `TooltipConfig` from a `GameAssetDefinition`:

- `title` → use `asset.label`.
- `imageUrl` → use `asset.file`.
- `description` → base this on `asset.description` and/or `asset.ui_usage_notes`.
  - Prefer a short paraphrase or direct reuse.
  - Do **not** invent a new, conflicting description when manifest text already
    explains the concept.

If the tooltip needs more detail than fits comfortably in 1–3 lines, link to or
create a separate guide instead; keep the tooltip short.

There might be cases where you need to combine multiple assets into one tooltip
(e.g. a tooltip explaining a system that uses several currencies). In those cases,
use the manifest text as a starting point but feel free to paraphrase or summarize.

There might also be cases where just using an image and title is sufficient
(e.g. inline glossary tooltips). In those cases, omit the description entirely if it
doesn’t add value.

There might also be cases where just an image is sufficient
(e.g. very common currencies).

---

### 9.10. Which assets are valid for tooltip images

Only treat the following as canonical sources for tooltip imagery:

- Entries in `GAME_ASSETS` from `src/app/configs/tooltip/game-assets.ts`
  (these point into `assets/game/...`).

Do **not** automatically use:

- `assets/guides/...` images (inline guide screenshots/figures).
- `assets/music/...` audio or cover art (used by the music player).
- `assets/banners/...` banner images (used on guide/tool cards and hero sections).
- `assets/portal/...` branding and logo images (used for site chrome, not in-game concepts).

If a tooltip needs an image, first try to find a matching entry in `GAME_ASSETS`.
If no suitable asset exists, use a text-only tooltip and avoid guessing arbitrary
paths under `assets/guides`, `assets/banners`, `assets/portal`, or similar.

---

### 9.11. Using aspect ratio to pick tooltip layout

`GAME_ASSETS` includes `width`, `height`, and `aspect_ratio` for each asset.
Use this to choose sensible image sizing in tooltips:

- Near-square icons (aspect ratio about `1:1`, `7:6`, etc.)
  - Good for small icon thumbnails inside tooltips.
  - Use `image-only`, `image-title`, or `full` layouts with the small/medium
    image classes.

- Very wide or very flat assets (path banners, system bars)
  - Avoid shoving them into tiny square containers.
  - Prefer `full` or `image-description` layouts with a wider tooltip, or skip
    the image entirely and rely on title + description.

When in doubt, default to text-first (`title-description`) and only include an
image if it clearly improves recognition without making the tooltip awkward.

---

### 9.12. Seeding the tooltip registry from the asset manifest

When you need many tooltips for game concepts, prefer **binding to `GAME_ASSETS`**
rather than hardcoding tooltips in each component:

- Add or update entries in:
  - `ASSET_TOOLTIP_BINDINGS` (for asset-based tooltips).
  - `STATIC_TOOLTIPS` (for non-asset control/tooltips).
- Let `buildAssetTooltips()` and `getDefaultTooltips()` generate the configs.
- Seed the registry once using `tooltipRegistry.registerAll(getDefaultTooltips())`.

You can still override specific keys manually for special cases, but default to
“manifest → bindings → `getDefaultTooltips()` → registry → `[appTooltip]`” as the main flow.

---

### 9.13. Tooltip registry organization patterns

When working with tooltip keys, follow these conventions:

- **Game asset tooltips**: Use manifest IDs directly or aliases in `ASSET_TOOLTIP_BINDINGS`.
  - e.g. `'currency.echo_jade'`, `'system.energy'`, `'sect_paths.stonesplit_might'`.
- **UI control tooltips**: `checklist.*`, `timer.*`, `control.*`, etc.
  - e.g. `'checklist.pin'`, `'checklist.hide'`, `'timer.details-button'`.
- **Timer/checklist state tooltips**: `timer-badge.*` or `timer-state.*`.
  - e.g. `'timer-badge.active'`, `'timer-state.warning'`, `'timer-state.urgent'`.

Components should rarely need to call `registerAll` themselves; prefer using
shared defaults from `tooltip-defaults.config.ts`. When you must register
component-specific tooltips, pick keys that fit the naming scheme above.

---

### 9.14. Conditional tooltip application patterns

When tooltips should only appear in certain states (e.g. warning/urgent timer states), use `@if/@else` blocks to conditionally wrap elements:

```html
@if (state.type === 'warning' || state.type === 'urgent') {
  <span
    class="value"
    [appTooltip]="state.type === 'urgent' ? 'timer-state.urgent' : 'timer-state.warning'">
    {{ value }}
  </span>
} @else {
  <span class="value">
    {{ value }}
  </span>
}
```

This keeps normal content clean while still providing context when it matters most.

