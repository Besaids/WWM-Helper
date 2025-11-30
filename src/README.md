# WWM Helper – Frontend Overview

This folder contains the Angular 21 frontend for the **Where Winds Meet Helper**.

The app is a single–page "companion" site focused on:

- Surfacing important **timers / reset windows**.
- Tracking **daily / weekly checklists**.
- Providing a small **in–page music player**.
- Giving a lightweight **home dashboard** that links these pieces together.

The codebase is small but opinionated:

- Angular 21, **standalone components**, new control flow, Signals.
- **Service-based architecture** with clear separation of concerns.
- Centralized **config/data** (timers, checklist, music tracks) under `app/configs`.
- **Signal-based reactive state** with OnPush change detection throughout.
- A single **layout shell** around all routed pages.
- A separate **design system** in `src/styles/**` (see `styles/README.md`).
- Centralized **localStorage handling** under `app/utils/storage/**` with versioning and cleanup.

---

## 1. Tech stack & entrypoints

**Tech**

- Angular 21 (standalone components).
- TypeScript with strict mode enabled.
- RxJS for reactive streams.
- Luxon (time/date calculations).
- Bootstrap + Bootstrap Icons (for base styling).
- Custom SCSS design system under `src/styles/**`.

**Entry files**

- `main.ts`
  - Bootstraps the app with `bootstrapApplication(App, appConfig)`.
  - Runs `runStorageMigrations()` and `cleanupChecklistStorage()` before bootstrapping.

- `app/app.config.ts`
  - Application config:
    - `provideRouter(routes)` – routing.
    - `provideZoneChangeDetection({ eventCoalescing: true })`.
    - `provideBrowserGlobalErrorListeners()`.
    - `GlobalErrorHandler` as custom error handler.

- `app/app.routes.ts`
  - Route table:
    - `''` → redirect to `home`.
    - `/home` → `HomeComponent`.
    - `/timers` → `TimersComponent`.
    - `/checklist` → `ChecklistComponent`.
    - `**` → redirect to `home`.

- `app/app.ts`
  - Root component (`<app-root>`).
  - Standalone.
  - Renders `<app-layout>` with `ChangeDetectionStrategy.OnPush`.

---

## 2. Layout shell

**Location:** `app/components/layout`

- `layout.component.ts`
  - Standalone component with OnPush change detection.
  - Imports `NavbarComponent`, `TimerStripComponent`, `RouterOutlet`.

- `layout.component.html`
  - High–level shell structure:

    ```html
    <div class="app-shell">
      <app-navbar></app-navbar>
      <app-timer-strip></app-timer-strip>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <!-- Footer content with links -->
      </footer>
    </div>
    ```

  - Every routed page (`Home`, `Timers`, `Checklist`) is injected into `<router-outlet>`.

- `layout.component.scss`
  - Overall app background, main area padding, and footer styling.
  - Footer inner width aligned via shared `.page-shell` helper from the styles system.

**Key idea:**  
`LayoutComponent` defines the chrome around the app; feature pages focus only on their own content.

---

## 3. Components & feature areas

### 3.1 Navbar & music player

**Navbar**

- Folder: `app/components/navbar`
- Responsibility:
  - Sticky top bar with logo + navigation links (`Home / Timers / Checklist`).
  - Responsive behavior (desktop nav vs mobile hamburger).
  - Mobile menu state managed with signal for OnPush compatibility: `isMenuOpen = signal(false)`.

**Music player**

- Folder: `app/components/music-player`
- Responsibility:
  - Small audio player pinned directly below the navbar (inside `NavbarComponent`).
  - Plays a curated playlist of tracks defined in `app/configs/music-tracks.ts`.
  - Persists state in `localStorage` via `app/utils/storage/player-storage.ts`.

- **Architecture:**
  - **Component** (`music-player.component.ts`):
    - Orchestrates UI interactions and delegates to services.
    - Uses OnPush change detection.
  - **Store** (`app/services/music-player/player-store.ts`):
    - Signal-based reactive state (current track, playing, volume, muted, shuffle, enabled tracks).
    - Computed signals for derived state (e.g., `enabledCount`).
  - **Audio Service** (`app/services/music-player/player-audio.service.ts`):
    - Manages HTML5 `Audio` element.
    - Handles playback, seeking, volume, and event listeners.
    - Updates store signals for time/duration changes.
  - **Storage** (`app/utils/storage/player-storage.ts`):
    - `loadPlayerState()` / `savePlayerState()` functions.
    - Uses versioned storage with backward compatibility.
  - **Utilities** (`app/components/music-player/time-format.ts`):
    - Pure function for formatting time displays.

### 3.2 Timer strip + timers page

**Timer Strip**

- Folder: `app/components/timer-strip`
- Responsibility:
  - Thin horizontal bar below navbar and music player.
  - Subscribes to `TimerService.timerChips$` and the user’s enabled timer IDs.
  - Renders a row of "chips" showing current and upcoming timers.
  - **Chips are sorted by soonest upcoming reset / event** so the leftmost chip is always “next up”.
  - Uses global `.chip` style plus local tweaks for icons, spacing and countdown typography.

**Timers page**

- Folder: `app/components/timers`
- Responsibility:
  - Let players choose **which timers appear in the strip** and read contextual info about each one.
  - Top **“Timers” settings card**:
    - Lists all timers with:
      - Custom **diamond-shaped toggles** (CSS-only, backed by real checkboxes for accessibility).
      - Timer label.
      - Live countdown text.
      - A pill **Details / Hide** button with fixed width and a right-aligned chevron.
    - Visibility state is persisted per-browser so choices survive reloads.
    - New users start with **Daily Reset**, **Weekly Reset**, and **Arena 1v1** enabled.
  - Per-timer **details drawers**:
    - Clicking **Details / Hide** expands a short textual summary.
    - A **Show more / Show less** link reveals or hides the full long-form guide (daily/weekly resets, Arena windows, Fireworks events, Mirage Boat, etc.).
    - All time references in these guides are expressed explicitly in **UTC**; the live countdowns still drive the practical usage.
  - The previous static “Timers & resets” three-column section has been replaced by these drawers so the page stays compact but all depth is still available on demand.

**Timer service + architecture**

- **Service** (`app/services/timer/timer.service.ts`):
  - Converts static definitions into live chips.
  - `timerChips$` observable emits every second.
  - Uses Luxon `DateTime` in UTC for all calculations.

- **Builder** (`app/services/timer/timer-chip.builder.ts`):
  - Pure function: `buildTimerChip(def, now)` → `TimerChip`.
  - No side effects; easy to test.

- **Utilities** (`app/services/timer/timer-schedule.utils.ts`):
  - Schedule calculation helpers:
    - `getNextBoundary()` – For simple schedules (daily, weekly, weekly-multi).
    - `getDailyMultiBoundary()` – For arena-style multi-window schedules.
    - `getWeeklyRangeBoundary()` – For range-based schedules (e.g., Seats bidding).
    - `formatRemaining()` – Duration formatting logic.

- **Config** (`app/configs/timer-definitions.ts`):
  - Array of `TimerDefinition` objects (daily reset, weekly reset, arena, fireworks, Mirage Boat, etc.).
  - Pure data; no time logic.

- **Models** (`app/models/`):
  - `timer-definition.model.ts` – Types for schedule shapes.
  - `timer-chip.model.ts` – UI representation.

### 3.3 Checklist page

**Folder:** `app/components/checklist`

- Responsibility:
  - Two–tab page: **Daily** and **Weekly** tasks.
  - **Freeplay ideas** section for optional activities.
  - Persists completed state across sessions with cycle-based keys.

**Architecture:**

- **Component** (`checklist.component.ts`):
  - Delegates state management to `ChecklistStateService`.
  - Uses `ResetWatchService` to detect cycle changes and reload the page.
  - OnPush change detection with signal-based active tab.

- **Service** (`app/services/checklist/checklist-state.service.ts`):
  - Encapsulates all checklist state logic.
  - Methods: `isChecked()`, `toggle()`, `resetTab()`, `refreshCycleIds()`.
  - Loads/saves state using versioned storage with cycle-based keys:
    - `wwm-checklist-daily-<cycleId>`
    - `wwm-checklist-weekly-<cycleId>`
  - Falls back to legacy raw JSON for backward compatibility.

- **Reset Watch** (`app/services/reset/reset-watch.service.ts`):
  - Observable stream `resetChange$` that emits when daily/weekly cycle changes.
  - Checks once per minute using RxJS `interval`.
  - Uses `distinctUntilChanged` to only emit on actual changes.
  - Prevents repeated cycle ID calculations across components.

- **Config** (`app/configs/`):
  - `daily-checklist.ts` – `DAILY_CHECKLIST` items.
  - `weekly-checklist.ts` – `WEEKLY_CHECKLIST` items.
  - `freeplay-ideas.ts` – `FREEPLAY_IDEAS` items.
  - `cycle-ids.ts` – `getDailyCycleId()` and `getWeeklyCycleId()` functions.
  - `reset-config.ts` – Centralized reset time constants.

- **Models** (`app/models/checklist.model.ts`):
  - Types: `ChecklistItem`, `FreeplayIdea`, `ChecklistFrequency`, `ChecklistImportance`, `ChecklistTag`.

### 3.4 Home page

**Folder:** `app/components/home`

- Responsibility:
  - Entry dashboard with high-level overview + shortcuts.
  - Cards for today's daily tasks, weekly priorities, and external resources.

- Implementation:
  - Uses `signal(new Date())` for current date display.
  - Updates date signal once per minute using `interval()` with `takeUntilDestroyed()`.
  - Picks highlight items from checklist definitions (small subset for display).
  - Uses global CTA buttons (`.btn-primary`, `.btn-secondary`) and card styles.

---

## 4. Data/configuration modules

**Folder:** `app/configs`

- `timer-definitions.ts` – Timer schedule definitions.
- `daily-checklist.ts` – Daily checklist items.
- `weekly-checklist.ts` – Weekly checklist items.
- `freeplay-ideas.ts` – Optional activity suggestions.
- `cycle-ids.ts` – Cycle ID calculation utilities.
- `reset-config.ts` – Reset time constants (hours, weekdays).
- `music-tracks.ts` – Music player track list.
- `index.ts` – Re-exports all configs.

---

## 5. Models

**Folder:** `app/models`

- `timer-definition.model.ts` – Timer schedule types.
- `timer-chip.model.ts` – UI representation of timers.
- `checklist.model.ts` – Checklist item and freeplay idea types.
- `index.ts` – Re-exports all models.

---

## 6. Services

**Folder:** `app/services`

### Timer Services (`app/services/timer/`)

- `timer.service.ts` – Core service exposing `timerChips$` observable.
- `timer-chip.builder.ts` – Pure builder function.
- `timer-schedule.utils.ts` – Schedule calculation utilities.
- `timer-preferences.service.ts` – Persists which timers are visible in the strip using versioned localStorage and exposes `enabledTimerIds$` plus sensible defaults (Daily / Weekly / Arena 1v1).

### Checklist Services (`app/services/checklist/`)

- `checklist-state.service.ts` – State management for checklist items.

### Music Player Services (`app/services/music-player/`)

- `player-store.ts` – Signal-based state store.
- `player-audio.service.ts` – Audio element management.
- Storage helpers in `app/utils/storage/player-storage.ts`.

### Reset Services (`app/services/reset/`)

- `reset-watch.service.ts` – Cycle change detection observable.

All service folders have `index.ts` barrel exports.

---

## 7. Styles

Global styles and design system live outside `app`:

- Entry file: `../styles.scss` – Wires in tokens, base, components, utilities.
- Design system: `../styles/**` – See `../styles/README.md` for full documentation.

Component-level SCSS in `app/components/**` should:

- Use global tokens/utilities from `src/styles`.
- Avoid duplicating card/chip/button/page patterns defined there.

---

## 8. Utils & storage

**Folder:** `app/utils`

- `global-error-handler.ts` – Custom `ErrorHandler` for centralized error logging.
- `storage/` – Centralized storage management:

### Storage Utilities (`app/utils/storage/`)

- `storage.ts` – Core storage helpers:
  - `STORAGE_PREFIX = 'wwm-'` – Prefix for all localStorage keys.
  - `STORAGE_SCHEMA_VERSION` – Global schema version number.
  - `getSafeLocalStorage()` – Safe access to localStorage (handles SSR/errors).
  - `loadJsonFromStorage<T>(key)` / `saveJsonToStorage(key, value)` – Raw JSON helpers.
  - `Versioned<T>` – Wrapper type `{ version, data }`.
  - `loadVersioned<T>(key)` / `saveVersioned<T>(key, data)` – Versioned payload helpers.

- `storage-migrations.ts` – Migration framework:
  - `runStorageMigrations()` – Runs on app startup.
  - Tracks applied migrations via `wwm-schema-version` key.
  - Framework ready for future schema evolution.

- `checklist-storage.ts` – Automatic cleanup:
  - `cleanupChecklistStorage()` – Runs on app startup.
  - Keeps only current daily and weekly cycle keys.
  - Deletes old cycle keys to prevent unbounded growth.

- `player-storage.ts` – Music player persistence:
  - `loadPlayerState()` / `savePlayerState()` functions.
  - Uses versioned storage with backward compatibility.

**Bootstrap behavior (main.ts):**

- `runStorageMigrations()` runs before Angular bootstraps.
- `cleanupChecklistStorage()` runs before Angular bootstraps.
- Happens on every full page load (not on route changes).

---

## 9. How to add or change things

### Add a new page

1. Create a standalone component under `app/components/<feature>/`.
2. Add OnPush change detection strategy.
3. Add a route in `app/app.routes.ts`.
4. Use `.page-shell` + `card-surface` / `card-padding` for consistent layout.
5. If the page needs data, add it to `app/configs` instead of hardcoding.

### Add a new service

1. Create service under `app/services/<domain>/`.
2. Use `@Injectable({ providedIn: 'root' })`.
3. Export from domain's `index.ts`.
4. For state, use signals for reactive values.
5. Keep services focused on single responsibility.

### Add a new timer / checklist item

- **Timer:**
  - Add entry to `TIMER_DEFINITIONS` in `app/configs/timer-definitions.ts`.
  - Ensure `schedule.type` is supported by timer utilities.

- **Checklist:**
  - Add to `DAILY_CHECKLIST` / `WEEKLY_CHECKLIST` / `FREEPLAY_IDEAS`.
  - Use a stable `id` (becomes part of localStorage key).

### Update styles / theme

- Change tokens in `src/styles/tokens/*.scss`.
- If a new reusable pattern appears, promote it to:
  - `src/styles/components/*.scss` (for structured components).
  - `src/styles/utilities/*.scss` (for small helpers).

### Evolve storage structure

When changing stored data shape:

1. Bump `STORAGE_SCHEMA_VERSION` in `app/utils/storage/storage.ts`.
2. Add migration functions in `app/utils/storage/storage-migrations.ts`:
   - Read old keys.
   - Transform to new shape.
   - Write as `Versioned<T>` payloads.
3. Update cleanup helpers if key patterns change.
4. Keep fallback to `loadJsonFromStorage` for legacy payloads.

---

## 10. Architecture principles

### Service Layer

- **Single responsibility:** Each service handles one domain (timer, checklist, music, reset).
- **Dependency injection:** Services inject into components; components don't create service instances.
- **Pure functions:** Utilities are pure where possible (builders, formatters, calculators).

### State Management

- **Signals:** All reactive state uses Angular signals.
- **OnPush:** All components use OnPush change detection for performance.
- **Computed values:** Derived state uses `computed()` signals.
- **Immutability:** Signal updates create new references when needed.

### Storage

- **Versioning:** All persisted state uses versioned payloads.
- **Backward compatibility:** Falls back to legacy formats when loading.
- **Cleanup:** Automatic removal of stale keys on app startup.
- **Namespacing:** All keys prefixed with `wwm-`.

### Component Design

- **Smart components:** Container components that inject services and manage state.
- **Presentation components:** Components that receive data via signals and emit events.
- **No business logic in templates:** Complex logic lives in services or component methods.

---

## 11. Maintenance notes

- This file is **authoritative** – update it when adding features or changing architecture.
- Keep `styles/README.md` in sync with token or component changes.
- Use `project-log.md` for date-stamped bullet entries of what changed between sessions.
- When bumping storage schema version, document the migration in both code and `project-log.md`.
