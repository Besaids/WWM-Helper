# WWM Helper – AI Coding Agent Instructions

**Where Winds Meet Helper** is an Angular 21 standalone SPA providing timers, checklists, path guides, and tools for the game **Where Winds Meet**. It uses UTC-based reset logic, a shared SCSS design system, and a structured game-asset manifest.

---

## 1. Architecture Overview

### Tech Stack

- **Angular 21** – Standalone components, signals, OnPush change detection
- **Luxon** – UTC-based datetime calculations for all game resets and timers
- **Howler.js** – Music player audio management
- **Bootstrap 5 + Icons** – Base UI and icon set
- **SCSS** – Design system with tokens, mixins, base, components, utilities

### Core Time/State Concepts

- All game resets and timers operate in **UTC** (game server time), never local time
- Reset times:
  - **Daily reset**: 21:00 UTC
  - **Weekly reset**: Sunday 21:00 UTC
- Cycle IDs are ISO date strings:
  - `getDailyCycleId()`
  - `getWeeklyCycleId()`

### Service & Component Patterns

- Components are **standalone**
- Use `inject()` for DI
- Prefer **signals** for local state and OnPush components
- Use observables only for streams and terminate with `takeUntilDestroyed()`

---

## 2. Project Structure

```
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

Important docs:

- `src/styles/README.md`
- `src/assets/README_game-assets.md`
- `src/assets/game-assets.json`
- `src/project-log.md`
- `src/README.md`

---

## 3. Design System Rules (SCSS)

**No ad-hoc theme values in component SCSS.**  
Always use tokens & mixins.

### Imports

```
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

Utilities:

- `.u-flex`, `.u-stack`, `.u-gap-*`
- `.text-muted`, `.u-text-xs/sm/lg`
- `.u-visually-hidden`

**New reusable patterns** go to:

- `utilities/` for layout/text helpers  
- `components/` for shared visual patterns  
- `mixins/` for low-level logic  

---

## 4. Game Assets Usage

### Source of Truth

- `src/assets/game-assets.json`
- `src/assets/README_game-assets.md`

Each asset includes semantics, category, system tags, UI usage notes, and size.

### Rules for Copilot

1. **Use only `assets/game/` for in-game logic.**
2. Pick correct icons via metadata.
3. Use `width`, `height`, and `aspect_ratio` for layout decisions.
4. Avoid scattering raw file paths; use centralized mappings.

---

## 5. Common Development Patterns

### Timers

- Add definitions in `configs/timers`
- Always use UTC
- Use helper functions for cycle IDs

### Checklists

- Definitions in `configs/checklists`
- Use signals for state
- Follow existing checklist toggle UI

### Guides

- Use `base/_guides.scss`
- Use game assets from manifest

---

## 6. Storage & Privacy

- Consent stored in localStorage  
- Storage versions must be migrated cleanly  
- No backend; everything is client-side  

---

## 7. Pitfalls to Avoid

- Local time for game logic
- Raw colors in SCSS
- Icon misuse
- Unversioned storage changes
- Duplicating UI patterns

---

## 8. Quick Reference

- Design system → `src/styles/README.md`
- Game assets → `src/assets/README_game-assets.md`
- Changelog → `src/project-log.md`
- Root overview → `src/README.md`

---

## 9. Tooltip System & Contextual Helpers

The app has a reusable tooltip system built around:

- `TooltipConfig` (imageUrl, title, description, linkUrl, linkLabel, variant)
- `TooltipVariant`: "controlHint" | "inlineInfo" | "resourcePreview" | "scheduledItem"
- A registry service that maps string keys → TooltipConfig
- A global `[appTooltip]` directive that can take either a registry key or an inline config

When you write or edit UI code, always consider whether a tooltip would improve clarity with **minimal clutter**, especially in guides, timers, and checklists.

### 9.1. When to consider adding a tooltip

Treat these as strong candidates for `[appTooltip]`:

- **Inline domain terms** in text:
  - Named currencies, items, regions, modes, systems, etc.
  - Example: “Echo Beads”, “Dreamscape”, “Path Guide” (generic names here; use actual game concepts in the codebase).

- **Interactive controls** that are not self-explanatory:
  - Icon-only buttons, toggles, small chips that change state or filter content.

- **Links** that jump to detailed guides or tools:
  - “Trading Guide”, “Interactive Map”, “Chinese Chess tool”, etc.

- **Timer/checklist entries** that represent time-based events:
  - Named events in the timers and checklist definitions.

Do **not** use tooltips for information that is *required* to use the UI; that belongs in visible text or a dedicated section, not hidden behind hover.

### 9.2. Choosing the right variant

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

### 9.3. Using the tooltip registry vs inline configs

Prefer the **registry** for anything that appears in multiple places:

- Add or update keys in the tooltip registry service for recurring concepts:
  - Example keys (pseudo): `"currency-echo-bead"`, `"event-fireworks"`, `"guide-trading"`.
- Then use them like:
  - `[appTooltip]="'currency-echo-bead'"` on inline text.
  - `[appTooltip]="'guide-trading'"` on a guide link.

Use **inline config objects** only when:

- The tooltip is clearly a one-off and will not be reused elsewhere, **and**
- It’s simpler to keep it local than to create a registry entry.

When in doubt, favour registry keys; this keeps content consistent and easy to update.

### 9.4. Picking images and text from game assets

When building a tooltip for a game concept, use the **game asset manifest** as the source of truth:

- Check `src/assets/game-assets.json` and `src/assets/README_game-assets.md` for:
  - Matching names/aliases
  - Category, system tags, and UI usage notes
  - Icon file paths and size/aspect ratio info
- Use the asset metadata to populate `TooltipConfig`:
  - `imageUrl`: the correct icon path from `assets/game/...`
  - `title`: the display name from metadata (not a made-up string)
  - `description`: a short summary based on the asset’s semantics and usage notes

Do **not** hardcode random image paths or descriptions when the manifest already has a canonical asset; always try to reuse existing definitions.

### 9.5. Template integration patterns

When editing HTML templates:

- **Inline term with tooltip (glossary-style)**:
  - Wrap the term in a span or small element and attach `[appTooltip]`:
    - e.g. `<span class="has-tooltip" [appTooltip]="'currency-echo-bead'">Echo Bead</span>`
  - Use the helper host classes (e.g. `.has-tooltip`) where appropriate to keep styling consistent.

- **Control hint on a button**:
  - Attach `variant: 'controlHint'` in the config or registry entry.
  - Keep the description short and action-focused.

- **Guide/tool preview on links**:
  - For internal guides/tools, use `variant: 'resourcePreview'`.
  - Provide title + short description, optional image, and (optionally) `linkUrl`/`linkLabel` for a CTA.

- **Event/timer explanation**:
  - For items in timers/checklists, attach `variant: 'scheduledItem'` and give a short explanation of what the event is and why a player cares.

### 9.6. Avoid overuse

When editing or generating content:

- Prefer adding a tooltip to the **first occurrence** of a term in a section, not every occurrence.
- Skip tooltips for very obvious everyday words or UI text.
- If the tooltip text grows beyond a couple of sentences, consider linking to or creating a dedicated guide instead and keep the tooltip short.

The goal is to make the app easier to understand **without** increasing visual clutter or hiding important information behind hover-only interactions.

### 9.7 Tooltip keys from game-assets.json

When you create tooltip registry entries for game concepts, derive the key from
`src/assets/game-assets.json` if you find it there:

- Treat the manifest `id` as the canonical concept id
  (e.g. `currency.echo_jade`, `system.energy`, `sect_paths.bellstrike_splendor`).
- Tooltip registry keys MUST follow one of these patterns:
  - Prefer: use the id directly → `[appTooltip]="'currency.echo_jade'"`.
  - Or, if namespacing is needed: prefix with `asset.` → `[appTooltip]="'asset.currency.echo_jade'"`.

Do NOT invent arbitrary keys like `"currency-echo-jade"` when a manifest id exists.
Reuse the manifest id consistently so tooltips, assets, and guides stay in sync.

### 9.8 Mapping asset categories to tooltip usage

When scanning `game-assets.json`, use `category`, `kind`, and `game_system_tags`
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

- `category: "navigation"` (`kind: "menu-nav-icon"`)
  - Use for navigation-style or “hub” concepts in the UI: sections, helper boxes, or links that conceptually match the in-game menus (quests, professions, season, sects, settings, etc.).
  - Good candidates:
    - Headings or pills for “Season”, “Battle Pass”, “Quests”, “Sects”, “Professions”, “Settings / Options”.
    - Links or cards that act like “go to this hub” actions.
  - Use `variant: "resourcePreview"` on links or “hub cards”, or `variant: "inlineInfo"` for inline labels.
  - Keep the image small (icon-sized) and rely on the label/description for context; these are menu icons, not full illustrations.

Use `game_system_tags` and `ui_usage_notes` to infer *where* in the UI a tooltip makes sense
(e.g. weekly-capped currencies in weekly checklists, co-op currencies in co-op guides).
Do NOT blindly add tooltips to every occurrence; prefer first-use in a section or
high-impact locations (titles, labels, key bullets).

When wiring tooltips into Timers or Checklists:

- Look at each timer/checklist item’s semantics (id, label, category, tags).
- Try to match them against `game-assets.json` using:
  - `category` + `kind` (e.g. currencies for economy tasks; system icons for “Energy”/“Stamina”; navigation icons for “Season” or “Battle Pass” sections).
  - `game_system_tags` (e.g. `["gacha", "season"]`, `["bounties"]`, `["coop"]`).
- If you find a clear match, use that asset as the tooltip `imageUrl` with:
  - `variant: "scheduledItem"` for timers and recurring checklist tasks.
  - A short `description` explaining why this timer/task matters, based on existing helper copy or `ui_usage_notes`.

Do not force an icon if the mapping is ambiguous; in that case, use a text-only tooltip.

### 9.9 Reuse manifest text for tooltip content

When creating a `TooltipConfig` from a `game-assets.json` entry:

- `title` → use the asset `label`.
- `imageUrl` → use the `file` path.
- `description` → base this on the manifest `description` and/or `ui_usage_notes`.
  - Prefer a short paraphrase or direct reuse.
  - Do NOT invent a new, conflicting description when manifest text already
    explains the concept.

If the tooltip needs more detail than fits comfortably in 1–3 lines, link to or
create a separate guide instead; keep the tooltip short.

There might also be cases where you need to combine multiple assets into one tooltip
(e.g. a tooltip explaining a game system that uses several currencies). In those cases,
use the manifest text as a starting point but feel free to paraphrase or summarize.

There might also be cases where just using an image and title is sufficient
(e.g. inline glossary tooltips). In those cases, omit the description entirely if it
doesn’t add value.

There might also be cases where just an image is sufficient
(e.g. very common currencies like Echo Bead).

### 9.10 Which assets are valid for tooltip images

Only treat the following as canonical sources for tooltip imagery:

- Entries in `src/assets/game-assets.json` (these point into `assets/game/...`).

Do NOT automatically use:

- `assets/guides/...` images (inline guide screenshots/figures).
- `assets/music/...` audio or cover art (used by the music player).
- `assets/banners/...` banner images (used on guide/tool cards and hero sections).
- `assets/portal/...` branding and logo images (used for site chrome, not in-game concepts).

If a tooltip needs an image, first try to find a matching entry in `game-assets.json`.
If no suitable asset exists, use a text-only tooltip and avoid guessing arbitrary
paths under `assets/guides`, `assets/banners`, `assets/portal`, or similar.


### 9.11 Using aspect ratio to pick tooltip layout

`game-assets.json` includes `width`, `height`, and `aspect_ratio` for each asset.
Use this to choose sensible image sizing in tooltips:

- Near-square icons (aspect ratio about 1:1, 7:6, etc.)
  - Good for small icon thumbnails inside tooltips.
  - Use `image-only`, `image-title`, or `full` layouts with the small/medium
    image classes.

- Very wide or very flat assets (path banners, system bars)
  - Avoid shoving them into tiny square containers.
  - Prefer `full` or `image-description` layouts with a wider tooltip, or skip
    the image entirely and rely on title + description.

When in doubt, default to text-first (`title-description`) and only include an
image if it clearly improves recognition without making the tooltip awkward.

### 9.12 Seeding the tooltip registry from the asset manifest

When you need many tooltips for game concepts, prefer seeding the registry from
`game-assets.json` instead of hand-writing configs one by one:

- Read the manifest (at build time or via a small config map) and, for each entry
  you care about, register a `TooltipConfig` using:
  - `imageUrl` = `file`
  - `title` = `label`
  - `description` = a shortened version of `description` or `ui_usage_notes`
  - `variant` = `"inlineInfo"` by default, or a better match based on `category`
    and `game_system_tags`.

You can still override specific keys manually for special cases, but default to
“manifest → registry → [appTooltip]” as the main flow.
