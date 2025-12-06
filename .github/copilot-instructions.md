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
