## 2025-11-30

### Design System Consolidation & SCSS Refactoring

**Motivation**

- The app had style inconsistencies across components:
  - Raw hex colors (`#f5d28b`, `#42c3c6`, etc.) scattered throughout component SCSS
  - Duplicate RGBA values for surfaces and overlays
  - Inline gradient definitions with no centralized tokens
  - No reusable mixins for common patterns (pills, capsules, toggles)
- This made the design harder to maintain and prone to drift over time

**New Token System**

Created comprehensive token files under `styles/tokens/`:

- **`_surfaces.scss`** – Five-layer alpha scale for card/overlay surfaces:
  - `--surface-layer-1` through `--surface-layer-5` (0.6, 0.72, 0.84, 0.92, 0.96 alpha)
  - Base color: `rgba(15, 23, 42)` for consistency with existing card surfaces

- **`_gradients.scss`** – Centralized gradient tokens:
  - `--gradient-radial-base` – Main app background gradient
  - `--gradient-radial-teal-core/soft/hover` – Toggle and active state gradients
  - `--gradient-radial-gold-core` – Gold accent gradient for special states

- **`_motion.scss`** – Animation timing tokens:
  - `--motion-fast/base/slow/emphasize` (120ms, 160ms, 240ms, 300ms)
  - `--motion-ease` – Cubic-bezier easing function for smooth transitions

- **`_shadows.scss`** – Elevation and glow effects:
  - `--shadow-depth-1/2/3/4` – Four-level depth scale for cards and overlays
  - `--glow-teal-soft/strong` – Teal accent glows for active states
  - `--glow-gold-soft` – Gold accent glow for hover/emphasis

- **Extended `_colors.scss`** – Added gold accent variants:
  - `--color-accent-gold-highlight` (`#f1c77a`) – Lighter gold for highlights
  - `--color-accent-gold-dim` (`#c9a45a`) – Dimmed gold for muted states
  - `--color-accent-gold-active` (`#f5d47b`) – Active/pressed gold state

**New Mixin System**

Created reusable pattern mixins under `styles/mixins/`:

- **`_capsule.scss`** – `capsule($layer, $radius, $padding)` mixin:
  - Generates consistent card/row surfaces with layered backgrounds
  - Accepts surface layer (1-5), border radius, and padding as parameters
  - Includes border, shadow, and transition properties
  - Used by timers rows, checklist rows, and other card-like elements

- **`_pill.scss`** – Pill button variants:
  - `pill-base` – Solid pill with background and hover states
  - `pill-outline` – Outlined pill with border and transparent background
  - Consistent sizing, padding, transitions, and active states
  - Used by timer details/toggle buttons, checklist tabs, reset buttons

- **`_toggle.scss`** – Diamond toggle pattern mixin:
  - `diamond-toggle` – Shared 45° rotated diamond shape with inner core
  - Handles unchecked (gold outline) and checked (teal core with glow) states
  - Smooth transitions for background, border, and shadow changes
  - Used by timer visibility toggles and checklist item toggles

- **`_glow.scss`** – Conditional glow helper:
  - `glow($color, $intensity)` mixin for applying accent glows
  - Supports teal/gold colors and soft/strong intensities
  - Uses tokenized shadow values from `_shadows.scss`

**Component Refactoring**

Systematically migrated all components to use tokens and mixins:

- **`timers.component.scss`**:
  - Replaced raw rgba surfaces with `capsule` mixin for timer rows
  - Used `pill-outline` mixin for details/toggle buttons
  - Tokenized all gold color variants (soft, dim, active)
  - Removed bespoke surface definitions

- **`checklist.component.scss`**:
  - Applied `capsule` mixin to checklist rows
  - Used `pill-base/pill-outline` for tabs and reset button
  - Tokenized all surface layers and shadows
  - Maintained typography scale using global tokens

- **`checklist-toggle.component.scss`**:
  - Implemented diamond toggle using shared mixin
  - Added `.checklist-toggle__diamond-core` inner element (60% size)
  - Tokenized gradients and colors for checked/unchecked states
  - Fixed visual "stick" appearance with proper flexbox centering

- **`diamond-toggle.component.scss`**:
  - Shares diamond-toggle pattern with `.diamond-toggle__inner` element
  - Consistent sizing (1.15rem outer, 60% inner)
  - Tokenized all state colors and transitions

- **`music-player.component.scss`**:
  - Tokenized playlist drawer shadow (`--shadow-depth-4`)
  - Applied surface layer tokens for backgrounds
  - Converted transitions to use motion tokens

- **`layout.component.scss`**:
  - Background uses `--gradient-radial-base` token
  - Maintains noise.png overlay with soft-light blend mode
  - Footer tokenized with surface and border tokens

- **`navbar.component.scss`**:
  - Active link underline uses tokenized gold→teal gradient
  - Applied `--shadow-depth-1` for subtle elevation
  - Tokenized all text and background colors

- **`timer-strip.component.scss`**:
  - Preserved original muted label (`--color-text-secondary`) and gold value (`--color-accent-gold-soft`)
  - Added `.timer-pill--urgent` variant:
    - Red border and text color for countdowns ≤10 minutes
    - Uses `--color-accent-red` token
  - Tokenized all surfaces and transitions

- **`timer-strip.component.ts`**:
  - Added `isUrgent(remaining: string)` method
  - Reuses existing `getRemainingSortKey` parser to detect ≤600 seconds
  - Returns boolean for template conditional styling

- **`timer-strip.component.html`**:
  - Bound `[class.timer-pill--urgent]="isUrgent(t.remaining)"`
  - Added `aria-live="polite"` on countdown for accessibility

- **`home.component.scss`**:
  - Tokenized all surfaces, shadows, and colors
  - Applied consistent card patterns using global tokens
  - Maintained responsive grid behavior

- **`footer.component.scss`**:
  - Extracted from `layout.component.scss` into dedicated file
  - `.app-footer-game` gets bold white text (`font-weight: 600`, `--color-text-primary`)
  - Links inherit default teal color from `base/_globals.scss`
  - Preserved separator pipes via `a + a::before` rule
  - Tokenized all surfaces, borders, and spacing

**Import Path Adjustments**

- Angular 21 requires relative imports without `styles/` prefix
- All component SCSS files use: `@use 'tokens/colors'` (not `@use 'styles/tokens/colors'`)
- Pattern applies to all token and mixin imports

**Visual Parity Maintenance**

- Iterative refinement to preserve original design during tokenization:
  - Timer strip: Maintained muted gray labels with gold countdown values
  - Footer: Restored bold white game name and teal link colors
  - Checklist toggles: Fixed diamond rendering with proper inner core sizing
- No visual changes to end users; purely architectural improvements

**Design System Benefits**

- **Consistency:** All components share the same color, spacing, and shadow values
- **Maintainability:** Theme changes require updating only token files
- **Reusability:** Mixins eliminate duplicate code across components
- **Scalability:** New components can adopt patterns immediately
- **Predictability:** Tokenized values prevent ad-hoc styling drift
- **Accessibility:** Motion tokens support future `prefers-reduced-motion` support

**Future-Proofing**

Next steps for continued consistency:

- **Stylelint integration:**
  - Add `stylelint.config.js` to disallow raw hex/rgba values outside `tokens/` folder
  - Enforce token usage at build time

- **Consistency verification:**
  - Create `scripts/verify-style-consistency.mjs` to scan for violations
  - Add npm scripts: `lint:styles` and `check:styles`

- **Documentation:**
  - Maintain `styles/README.md` with design system quick rules
  - Document mixin usage patterns and token selection guidelines

- **Optional enhancements:**
  - Add `--glow-red-soft` token for better urgent timer styling
  - Create additional mixins for frequently-used patterns (e.g., icon buttons)

---

### Checklist Enhancements

#### Detailed / Simple View Modes

- Added a view-density toggle with two modes:
  - **Detailed** – displays label, description, and tags.
  - **Simple** – displays label only for a compact layout.
- View preference is saved in `localStorage` separately for Daily and Weekly.
- Completion visuals (strike-through + muted colors) apply consistently in both modes.

#### New Diamond-Style Checklist Toggle

- Replaced old dash/check toggle with a diamond indicator matching the Timers UI.
- **Unchecked:** hollow gold diamond.
- **Checked:** teal-filled diamond with glow animation.
- Fully accessible (native checkbox under the hood).

#### Improved Completion Styling

- Completed items now:
  - Strike through the label.
  - Fade description and tags.
  - Keep consistent appearance in both view modes.

---

### Checklist Layout & Styling Consistency

#### Tabs & Reset Button

- Daily/Weekly tab pills restyled to unify with Timers.
- Reset checklist button given fixed width to prevent layout shift between "daily" and "weekly".

#### Card Styling

- Checklist cards now correctly inherit `.card-surface`:
  - Subtle border
  - Rounded radius
  - Soft glow/shadow
- Fixed SCSS overrides that previously removed the border.

---

### Background & App Shell Improvements

#### Gradient & Noise Overhaul

- Added layered background:
  1. Radial/linear dark gradient.
  2. Optional cyan bloom for atmospheric lighting.
  3. Seamless 512×512 ink-paper noise texture (soft-light blend).
- Eliminates banding and adds wuxia-inspired texture.

#### Consistency Fix

- Checklist and Timers now share identical background behavior.
- Fixed issue where pages appeared to have different bloom intensity.

---

### Timers Mobile UX Fixes

#### Auto-scrolling on "Details"

- On mobile, opening a timer row now scrolls that row into view.
- Prevents viewport jump caused by collapsing another row above/below.
- Desktop unaffected.

#### Mobile Alignment Fix

- Timer row metadata now uses `justify-content: space-between`.
- Countdown stays left; "Details" button aligns cleanly to the right.

---

### General Layout Cleanup

- Removed local SCSS overrides that clashed with global card tokens.
- Synced spacing, typography, and padding between Timers and Checklist.
- Verified consistent use of radius, border, and shadow tokens across both screens.

### Timers UX overhaul

**Timer visibility & preferences**

- Introduced persistent timer visibility settings:
  - Timers page now starts with a **"Timers" settings card** listing all timers.
  - Each row has:
    - A custom **diamond toggle** (CSS-only control built on top of a real checkbox for accessibility).
    - Timer label.
    - Live countdown.
    - A pill **Details / Hide** button with right-aligned chevron.
  - Visibility is stored in `localStorage` via a dedicated preferences service so choices survive reloads.
  - New-user defaults: **Daily Reset**, **Weekly Reset**, **Arena 1v1** are enabled by default.

- Timer strip now:
  - Combines `TimerService` chips with the user's enabled IDs.
  - Sorts enabled timers by **soonest upcoming event** so the leftmost chip is the next thing happening.
  - Still updates every second in UTC via the existing timer service.

**Timers page content & drawers**

- Replaced the old "Timers & resets" three-column wall of text with **per-timer drawers**:
  - Each timer row has:
    - A short, one-paragraph **summary**.
    - A **Show more / Show less** toggle that reveals the full guide content.
  - Long-form sections for **Daily Reset**, **Weekly Reset**, **Fireworks Seats**, **Fireworks Festival**, **Fireworks Show**, and **Mirage Boat** were moved into these drawers so the page stays compact by default.
- Updated all wording to be explicit about **UTC**:
  - Fireworks Festival: **Saturday 12:30 & Sunday 00:30 (UTC)**.
  - Fireworks Show (multiplayer): **Friday & Saturday at 20:30 (UTC)**.
  - Fireworks Seats bidding: **Monday 01:00 → Friday 13:00 (UTC)**.
  - Clarified that **Energy does not hard reset**; it regenerates 1 every 9 minutes in real time while other daily systems flip at reset.

**Mirage Boat documentation**

- Added a full guide section for the **Mirage Boat / Painted Cruise** event:
  - What it is:
    - Ultra-rare boat mount unlocked via 170 Mirage Torn Pages and used to start server-wide cruises.
  - When it runs:
    - Fixed weekly cruise around **Sunday evening / Monday morning (UTC)**, plus owner-triggered extra cruises.
  - How to join:
    - Follow the UI event icon, board at the dock, participate in mini-activities while the boat sails a fixed route.
  - Rewards & perks:
    - Earn **Fortune Points** for participation; claim rewards at 1,000 points.
    - Rewards are mailed if you leave early and scale with how much the owner funds the cruise.
    - You can temporarily wear any outfits owned by the boat's owner during the event.

**Styling polish**

- Implemented reusable **diamond timer toggles** with teal inner glow for "on" and gold outline for the frame; hover states communicate enabling/disabling.
- Standardised **Details / Hide** pill buttons:
  - Fixed width, left-aligned label, right-aligned chevron, gold border with subtle background.
- Aligned **Show more / Show less** link styling with the existing timer-strip accent color for consistency.

---

## 2025-11-29

### Major Refactoring: Service-Based Architecture

**Storage Layer Improvements**

- Created centralized storage utilities under `app/utils/storage/`:
  - `storage.ts` – Core versioned storage helpers with `STORAGE_PREFIX` and `STORAGE_SCHEMA_VERSION`
  - `storage-migrations.ts` – Migration framework for schema evolution
  - `checklist-storage.ts` – Automatic cleanup of old checklist cycle keys
  - `player-storage.ts` – Music player state persistence helpers
- All storage operations now use versioned payloads with backward compatibility for legacy data
- Storage migrations and cleanup run automatically on app bootstrap (in `main.ts`)

**Config Layer Restructuring**

- Split `checklist-definitions.ts` into modular files:
  - `daily-checklist.ts` – Daily checklist items
  - `weekly-checklist.ts` – Weekly checklist items
  - `freeplay-ideas.ts` – Optional activity suggestions
  - `cycle-ids.ts` – Cycle ID calculation utilities (`getDailyCycleId`, `getWeeklyCycleId`)
  - `reset-config.ts` – Centralized reset time configuration
- Created `models/checklist.model.ts` for checklist-related types

**Service Layer Introduction**

- Created service-based architecture for core features:

  **Checklist Services** (`app/services/checklist/`):
  - `checklist-state.service.ts` – Encapsulates checklist state management, persistence, and cycle tracking

  **Music Player Services** (`app/services/music-player/`):
  - `player-store.ts` – Signal-based reactive state store
  - `player-audio.service.ts` – HTML5 audio element management and playback control
  - Storage helpers moved to `app/utils/storage/player-storage.ts`

  **Reset Services** (`app/services/reset/`):
  - `reset-watch.service.ts` – Centralized cycle change detection with observable stream

  **Timer Services** (`app/services/timer/`):
  - Refactored `timer.service.ts` to use modular helper functions
  - `timer-chip.builder.ts` – Pure function for building timer chips from definitions
  - `timer-schedule.utils.ts` – Schedule calculation utilities (`getNextBoundary`, `getDailyMultiBoundary`, etc.)

**Component Updates**

- `ChecklistComponent` – Refactored to delegate state management to `ChecklistStateService` and use `ResetWatchService` for cycle changes
- `MusicPlayerComponent` – Refactored to use `PlayerStore`, `PlayerAudioService`, and modular storage helpers
- `HomeComponent` – Added day change detection with RxJS `interval` and `takeUntilDestroyed`
- `NavbarComponent` – Converted `isMenuOpen` from boolean to signal for OnPush change detection consistency
- All components now use `ChangeDetectionStrategy.OnPush` for optimal performance

**Error Handling**

- Added `global-error-handler.ts` as custom `ErrorHandler` implementation
- Registered in `app.config.ts` to centralize error logging

**Utilities**

- Created `time-format.ts` helper in `app/components/music-player/` for consistent time formatting
- Updated `app/utils/index.ts` to export only storage and error handler utilities

**Architecture Benefits**

- Clear separation of concerns (components, services, configs, models, utils)
- Testable service layer with dependency injection
- Centralized state management with signals
- Consistent storage patterns with versioning
- Observable-based cycle detection prevents repeated cycle ID calculations
- OnPush change detection throughout for performance
