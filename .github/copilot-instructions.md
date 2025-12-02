# WWM Helper – AI Coding Agent Instructions

**Where Winds Meet Helper** is an Angular 21 standalone SPA providing timers, checklists, and guides for the game "Where Winds Meet". Built with modern Angular patterns, Luxon for time handling, and a comprehensive design system.

## Architecture Overview

### Tech Stack
- **Angular 21** – Standalone components, signals, OnPush change detection
- **Luxon** – UTC-based datetime calculations for game resets and timers
- **Howler.js** – Music player audio management
- **Bootstrap 5 + Icons** – Base UI components and icon library
- **SCSS** – Design system with tokens, mixins, and utilities

### Core Concepts

**UTC-First Time Handling**
- All game resets and timers operate in UTC (game server time)
- Daily reset: 21:00 UTC | Weekly reset: Sunday 21:00 UTC
- Use Luxon's `DateTime.utc()` for all time calculations
- Cycle IDs are ISO date strings (e.g., `2025-12-02`) derived from reset times via `getDailyCycleId()` / `getWeeklyCycleId()`

**Service-Based Architecture**
- Components are thin presentation layers
- Business logic lives in `@Injectable({ providedIn: 'root' })` services
- State management via Angular signals (not NgRx/observables unless streaming)
- Storage layer uses versioned payloads in `localStorage` with migration support

**Reactive State with Signals**
- Prefer signals over observables for synchronous state (e.g., `PlayerStore`, `TimerPreferencesService`)
- Use observables for streams (e.g., `interval(1000)` for timer ticks, `ResetWatchService.resetChange$`)
- All components use `ChangeDetectionStrategy.OnPush`

## Project Structure

```
src/app/
  components/     # Standalone UI components (timers, checklist, guides, layout)
  services/       # Business logic services (timer, checklist, music-player, reset)
  configs/        # Static definitions (timer-definitions, daily-checklist, reset-config)
  models/         # TypeScript interfaces and types
  utils/          # Storage helpers, global error handler
src/styles/       # Design system (tokens, mixins, base, components, utilities)
```

## Design System Guidelines

**Always use design tokens** – Never hard-code colors, shadows, or spacing.

### Import Pattern (Angular 21)
```scss
// ✅ Correct
@use 'tokens/colors' as *;
@use 'mixins/capsule' as *;

// ❌ Wrong (no styles/ prefix)
@use 'styles/tokens/colors' as *;
```

### Key Token Files
- `tokens/_colors.scss` – `$accent-teal`, `$accent-gold-soft`, `$text-primary`, etc.
- `tokens/_surfaces.scss` – `$surface-layer-1` through `$surface-layer-5` (0.6→0.96 alpha)
- `tokens/_gradients.scss` – `$gradient-radial-base`, `$gradient-radial-teal-core`, etc.
- `tokens/_shadows.scss` – `$shadow-depth-1` through `$shadow-depth-4`, `$glow-teal-soft/strong`
- `tokens/_motion.scss` – `$motion-fast/base/slow/emphasize` (120ms→300ms)
- `tokens/_spacing.scss`, `tokens/_radius.scss`, `tokens/_typography.scss`

### Common Mixins
```scss
// Card-like surfaces with consistent layering
@include capsule($layer: 3, $radius: 0.75rem, $padding: 1rem);

// Pill-shaped buttons
@include pill-base;      // Solid background
@include pill-outline;   // Transparent with border

// Diamond toggle indicator (requires __inner element)
@include diamond-toggle;

// Accent glows
@include glow(teal, soft);
```

**Rule**: No raw hex colors, `rgba()` values, or inline gradients in component SCSS. Use tokens only.

## Common Development Patterns

### Adding a New Timer
1. Add definition to `configs/timer-definitions.ts`:
   ```typescript
   {
     id: 'new-event',
     label: 'New Event',
     shortLabel: 'Event',
     icon: 'bi-star',
     schedule: { type: 'daily', hour: 12, minute: 0 },
   }
   ```
2. Schedule types: `daily`, `weekly`, `weekly-multi`, `weekly-range`, `daily-multi`, `weekly-times`
3. Timer service automatically picks up new definitions; no component changes needed
4. Add details drawer in `timers.component.html` with `@case ('new-event')` for documentation

### Adding a Checklist Item
1. Add to `configs/daily-checklist.ts` or `configs/weekly-checklist.ts`:
   ```typescript
   {
     id: 'new-task',
     label: 'Task Label',
     description: 'Detailed explanation',
     category: 'Combat',
     isOptional: false,
     frequency: 'daily',
   }
   ```
2. Checklist service handles persistence automatically
3. State keys are cycle-scoped: `wwm-checklist-daily-2025-12-02`

### Storage Best Practices
- Use `saveVersioned<T>(key, data)` / `loadVersioned<T>(key)` for all persistence
- Prefix all keys with `STORAGE_PREFIX` (currently `wwm-`)
- Handle SSR safety with `getSafeLocalStorage()` (returns `null` if unavailable)
- Implement backward compatibility: load versioned, fall back to legacy JSON, then re-save versioned

### Time Calculations
```typescript
import { DateTime } from 'luxon';

const now = DateTime.utc();
const nextReset = now.set({ hour: 21, minute: 0, second: 0, millisecond: 0 });
if (now >= nextReset) nextReset = nextReset.plus({ days: 1 });
```
- Never use local time zones for game logic (only for user-facing display if explicitly required)
- ISO weekdays: 1=Monday, 7=Sunday

### Component Patterns
- All components are standalone (`standalone: true`)
- Use `inject()` for DI (not constructor injection)
- Signal-based local state (`signal()`, `computed()`)
- Use `takeUntilDestroyed()` for observable cleanup
- Avoid template subscriptions with `async` pipe for OnPush; use signals instead

## Testing & Development

### Running the App
```bash
npm start        # Dev server (localhost:4200)
npm run build    # Production build
npm run test     # Vitest unit tests
npm run lint     # ESLint + Angular lint
npm run format   # Prettier (printWidth: 100, singleQuote: true)
```

### Important Files
- `angular.json` – Build config; note `stylePreprocessorOptions.includePaths: ["src/styles"]`
- `package.json` – Scripts, dependencies, Prettier config
- `src/styles/README.md` – Comprehensive design system documentation
- `src/README.md` – Feature-level docs (less detailed than styles README)
- `src/project-log.md` – Development changelog (add entries when making significant changes)

## Common Pitfalls

**Style Imports**: Angular 21 changed SCSS resolution. Use `@use 'tokens/colors'` not `@use 'styles/tokens/colors'`.

**Change Detection**: All components use OnPush. If view doesn't update, check signal mutations or use `.set()` / `.update()`.

**Guild Timers**: Two timers (`guild-breaking-army`, `guild-test-your-skills`) are user-configurable with custom schedules. Check `GuildEventTimersService` for override logic.

**Cycle Boundaries**: Checklist state keys include cycle IDs. When daily/weekly reset occurs, the key changes and old state becomes inaccessible (by design). Use `ResetWatchService.resetChange$` to detect transitions.

**Trading Timers**: Trade Week resets Friday 21:00 UTC (not daily reset). Price peak checks are Tuesday 21:00 UTC. See `guides/trading` for full context.

## Resources

- Design system: `src/styles/README.md`
- Changelog: `src/project-log.md`
- License: AGPL-3.0-only (code); assets © Besaids
- GitHub Pages: https://besaids.github.io/WWM-Helper/
