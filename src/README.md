# WWM Helper – Frontend Overview

This folder contains the Angular 21 frontend for the **Where Winds Meet Helper**.

The app is a single–page “companion” site focused on:

- Surfacing important **timers / reset windows**.
- Tracking **daily / weekly checklists**.
- Providing a small **in–page music player**.
- Giving a lightweight **home dashboard** that links these pieces together.

The codebase is small but opinionated:

- Angular 21, **standalone components**, new control flow, Signals.
- Centralised **config/data** (timers, checklist, music tracks) under `app/configs`.
- A single **layout shell** around all routed pages.
- A separate **design system** in `src/styles/**` (see `styles/README.md`).
- Centralised **localStorage handling** under `app/utils/**` with versioning and cleanup.

---

## 1. Tech stack & entrypoints

**Tech**

- Angular 21 (standalone components).
- TypeScript.
- RxJS.
- Luxon (time/date).
- Bootstrap + Bootstrap Icons (for some base styling).
- Custom SCSS design system under `src/styles/**`.

**Entry files**

- `main.ts`
  - Bootstraps the app with `bootstrapApplication(App, appConfig)`.
  - Runs storage migrations and checklist cleanup before bootstrapping.

- `app/app.config.ts`
  - Application config:
    - `provideRouter(routes)` – routing.
    - `provideHttpClient()` – HTTP (reserved for future use).
    - `provideZoneChangeDetection({ eventCoalescing: true })`.
    - `provideBrowserGlobalErrorListeners()`.

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
  - Renders `<app-layout>`; all real content is inside `LayoutComponent`.

---

## 2. Layout shell

**Location:** `app/components/layout`

- `layout.component.ts`
  - Standalone.
  - Imports `NavbarComponent`, `TimerStripComponent`, `RouterOutlet`.

- `layout.component.html`
  - High–level shell:

    ```html
    <div class="app-shell">
      <app-navbar></app-navbar>
      <app-timer-strip></app-timer-strip>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="app-footer-inner page-shell">
          <span class="app-footer-copy">
            Unofficial helper for <span class="app-footer-game">Where Winds Meet</span>.
          </span>

          <nav class="app-footer-links">
            <span>Find me on: </span>

            <a
              href="https://www.reddit.com/user/Besaids/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit User
            </a>

            <a
              href="https://discordapp.com/users/224358387448545280"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord User
            </a>

            <a
              href="https://suno.com/playlist/cda7ce2e-c15f-47ad-bb20-885a9ee22513"
              target="_blank"
              rel="noopener noreferrer"
            >
              Where Winds Met - Suno Playlist
            </a>
          </nav>
        </div>
      </footer>
    </div>
    ```

  - Every routed page (`Home`, `Timers`, `Checklist`) is injected into `<router-outlet>`.

- `layout.component.scss`
  - Overall app background, main area padding, and footer styling.
  - Footer inner width is aligned via the shared `.page-shell` helper from the styles system.

**Key idea:**  
`LayoutComponent` defines the chrome around the app; feature pages should focus only on their own content.

---

## 3. Components & feature areas

### 3.1 Navbar & music player

**Navbar**

- Folder: `app/components/navbar`
- Responsibility:
  - Sticky top bar with logo + navigation links (`Home / Timers / Checklist`).
  - Responsive behaviour (desktop nav vs mobile hamburger).
  - Sits at the top of the layout shell; header is full-width with padded edges (no `.page-shell` here).

**Music player**

- Folder: `app/components/music-player`
- Responsibility:
  - Small audio player pinned directly below the navbar (inside `NavbarComponent`).
  - Plays a curated playlist of tracks defined in `app/configs/music-tracks.ts`.
  - Keeps state in `localStorage` via the shared storage helpers:
    - Current track id.
    - Volume, mute state.
    - Shuffle on/off.
    - Enabled/disabled tracks.

- Implementation details:
  - Uses a plain `HTMLAudioElement` under the hood.
  - Tracks progress and duration with event listeners (`timeupdate`, `loadedmetadata`, `ended`).
  - Uses Angular signals for reactive state (current track, playing flag, volume, etc.).
  - Persists state using `loadVersioned` / `saveVersioned` from `app/utils/storage.ts`, with backward compatibility for pre-versioned data.

### 3.2 Timer strip + timers page

**Timer Strip**

- Folder: `app/components/timer-strip`
- Responsibility:
  - Thin horizontal bar below the navbar and music player.
  - Subscribes to `TimerService.timerChips$`.
  - Renders a row of “chips” showing current and upcoming timers (reset, arena, fireworks, etc.).
  - Each pill uses the global `.chip` style plus local tweaks.

**Timers page**

- Folder: `app/components/timers`
- Responsibility:
  - Detailed explanation of each timer:
    - Daily/weekly resets.
    - Arena windows.
    - Fireworks seats & show.
    - Group content cadence, etc.
  - Uses live timer chips inline in the text for context (global `.chip` + `.chip--timer`).

**Timer service + configs**

- `app/services/timer.service.ts`
  - Core logic; converts static schedule definitions into live “chips”.
  - Uses Luxon `DateTime` in UTC.
  - `timerChips$`:
    - Emits every second.
    - For each tick:
      - Reads current UTC time.
      - Builds a `TimerChip` for every `TimerDefinition` (id, labels, icon, remaining text).
  - Handles multiple schedule types:
    - `daily`, `weekly`, `weekly-multi`, `weekly-range`, `daily-multi`.
    - Computes “open vs closed”, next boundary, remaining durations.

- `app/configs/timer-definitions.ts`
  - Array of `TimerDefinition` objects that describe:
    - Daily reset, weekly reset.
    - Arena daily windows.
    - Fireworks seat open/close range.
    - Fireworks show schedule.
  - Pure data; no time logic here.

- `app/models/timer-definition.model.ts`
  - Types for schedule shapes (`TimerSchedule` variants).
- `app/models/timer-chip.model.ts`
  - Shape of what the UI displays (`TimerChip`).

### 3.3 Checklist page

**Folder:** `app/components/checklist`

- Responsibility:
  - Two–tab page:
    - **Daily** tab – daily tasks with core vs optional sections.
    - **Weekly** tab – weekly tasks.
  - A small **Freeplay ideas** section for “do when you feel like it” tasks.
  - Persists completed state across sessions using shared storage helpers.

**Behaviour:**

- Reads task definitions from `app/configs/checklist-definitions.ts`:
  - `DAILY_CHECKLIST`, `WEEKLY_CHECKLIST`, `FREEPLAY_IDEAS`.
  - Each item has:
    - `id`, `frequency`, `importance`, `category`, `label`, optional `description`, `tags`.

- Uses `localStorage` with cycle–based keys:
  - Daily: `wwm-checklist-daily-<cycleId>`
  - Weekly: `wwm-checklist-weekly-<cycleId>`

- `cycleId`s are computed from Luxon in `checklist-definitions.ts`:
  - `getDailyCycleId()`:
    - Identifies the current daily cycle based on the game reset time (21:00 UTC).
  - `getWeeklyCycleId()`:
    - Same idea but weekly, anchored at Sunday 21:00 UTC.

- Persistence details:
  - Uses `loadVersioned` / `saveVersioned` from `app/utils/storage.ts`.
  - Falls back to reading legacy raw JSON if versioned data is not present (backward compatible for existing users).
  - Keys are namespaced with `wwm-` (see storage section below).

### 3.4 Home page

**Folder:** `app/components/home`

- Responsibility:
  - Entry dashboard; high–level overview + shortcuts.
  - Cards for:
    - Today’s key daily tasks.
    - Weekly priorities.
    - External resources (official site, Discord, wiki, subreddit, etc.).

- Implementation details:
  - Imports checklist definitions.
  - Picks “highlight” items for daily/weekly (small subset for display).
  - Mostly static layout + text.
  - Uses global CTA buttons (`.btn-primary`, `.btn-secondary`) and card styles (`card-surface`, `card-padding`).

---

## 4. Data/configuration modules

**Folder:** `app/configs`

- `timer-definitions.ts`
  - Structured definitions for all timers.
  - Read by `TimerService`.

- `checklist-definitions.ts`
  - All checklist items and their metadata.
  - Utility functions `getDailyCycleId` / `getWeeklyCycleId`.

- `music-tracks.ts`
  - List of music tracks available for the music player:
    - `id`, title, optional description, file paths.

- `index.ts`
  - Re-exports config modules to simplify imports.

---

## 5. Models & services

**Folder:** `app/models`

- `timer-definition.model.ts`
  - Types for timer schedule definitions (`TimerSchedule`, `TimerDefinition`).
- `timer-chip.model.ts`
  - UI representation of a timer chip.

**Folder:** `app/services`

- `timer.service.ts`
  - Described above (timer computation).
- `index.ts`
  - Re-export for services.

---

## 6. Styles

Global styles and design system live outside `app`:

- Entry file: `../styles.scss`
  - Wires in tokens, base, shared components, utilities.
  - Imports Bootstrap CSS + Bootstrap Icons.
- Design system: `../styles/**`
  - See `../styles/README.md` for full documentation.

Component–level SCSS in `app/components/**` should:

- Use global tokens/utilities from `src/styles`.
- Avoid duplicating card/chip/button/page patterns defined there.

---

## 7. Utils & storage

**Folder:** `app/utils`

Current helpers:

- `storage.ts`
  - Core storage helpers.
  - `STORAGE_PREFIX = 'wwm-'` – all keys we own start with this prefix.
  - `STORAGE_SCHEMA_VERSION` – global storage schema version (number).
  - `getSafeLocalStorage()` – safe access to `window.localStorage` (handles SSR / errors).
  - `loadJsonFromStorage<T>(key)` / `saveJsonToStorage(key, value)` – raw JSON helpers.
  - `Versioned<T>` – wrapper type `{ version, data }`.
  - `loadVersioned<T>(key)` / `saveVersioned<T>(key, data)` – versioned payload helpers.

- `storage-migrations.ts`
  - `runStorageMigrations()` – central entrypoint to run migrations on app startup.
  - Uses a special `wwm-schema-version` key to track which migrations have already been applied.
  - Currently contains the framework only; real migrations can be added when `STORAGE_SCHEMA_VERSION` is bumped.

- `checklist-storage.ts`
  - `cleanupChecklistStorage()` – called on startup to prune old checklist keys.
  - Keeps only:
    - `wwm-checklist-daily-<currentDailyCycleId>`
    - `wwm-checklist-weekly-<currentWeeklyCycleId>`
  - Deletes any older cycle keys, preventing unbounded localStorage growth.

**Bootstrap behaviour (main.ts):**

- `runStorageMigrations()` is called before Angular bootstraps.
- `cleanupChecklistStorage()` is also called before Angular bootstraps.
- This happens on every full page load (initial open or hard refresh), not on internal route changes.

---

## 8. How to add or change things

### Add a new page

1. Create a standalone component under `app/components/<feature>/`.
2. Add a route in `app/app.routes.ts`.
3. Use:
   - A centered container pattern (e.g., your own wrapper or `.page-shell` + `card-surface` / `card-padding`).
   - Shared button/chip classes where appropriate.
4. If the page has structured data, add it to `app/configs` instead of hardcoding in the component.

### Add a new timer / checklist item

- **Timer**
  - Add a new entry to `TIMER_DEFINITIONS` in `app/configs/timer-definitions.ts`.
  - Ensure the chosen `schedule.type` is supported by `TimerService`.

- **Checklist**
  - Add to `DAILY_CHECKLIST` / `WEEKLY_CHECKLIST` / `FREEPLAY_IDEAS` in `app/configs/checklist-definitions.ts`.
  - Use a stable `id`; the id is part of the localStorage key.

### Update styles / theme

- Change tokens in `src/styles/tokens/*.scss`.
- If a new reusable pattern appears in multiple components, promote it to:
  - `src/styles/components/*.scss` (for structured components like cards/buttons/chips).
  - or `src/styles/utilities/*.scss` (for small layout/text helpers).

### Evolve storage structure

When you need to change the shape of stored data:

1. Bump `STORAGE_SCHEMA_VERSION` in `app/utils/storage.ts`.
2. Add migration functions in `app/utils/storage-migrations.ts` to:
   - Read old keys.
   - Transform them into the new shape.
   - Write them back as `Versioned<T>` payloads.
3. Optionally update `cleanupChecklistStorage()` or add new cleanup helpers if key patterns change.
4. Keep components reading via `loadVersioned` with a fallback to `loadJsonFromStorage` for legacy payloads.

---

## 9. Maintenance notes

- This file is meant to stay **authoritative** over time:
  - Whenever you add a new feature, route, major component, or config file, update this README.
  - Whenever you significantly change how timers, checklist, music player, or storage work, update the relevant section here.
- Keep `styles/README.md` in sync with any changes to tokens or shared components.
- Optionally maintain a `project-log.md` with date-stamped bullet entries to quickly see what changed between sessions.
