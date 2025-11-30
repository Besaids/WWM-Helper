## 2025-11-30

### Timers UX overhaul

**Timer visibility & preferences**

- Introduced persistent timer visibility settings:
  - Timers page now starts with a **“Timers” settings card** listing all timers.
  - Each row has:
    - A custom **diamond toggle** (CSS-only control built on top of a real checkbox for accessibility).
    - Timer label.
    - Live countdown.
    - A pill **Details / Hide** button with right-aligned chevron.
  - Visibility is stored in `localStorage` via a dedicated preferences service so choices survive reloads.
  - New-user defaults: **Daily Reset**, **Weekly Reset**, **Arena 1v1** are enabled by default.

- Timer strip now:
  - Combines `TimerService` chips with the user’s enabled IDs.
  - Sorts enabled timers by **soonest upcoming event** so the leftmost chip is the next thing happening.
  - Still updates every second in UTC via the existing timer service.

**Timers page content & drawers**

- Replaced the old “Timers & resets” three-column wall of text with **per-timer drawers**:
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
    - You can temporarily wear any outfits owned by the boat’s owner during the event.

**Styling polish**

- Implemented reusable **diamond timer toggles** with teal inner glow for “on” and gold outline for the frame; hover states communicate enabling/disabling.
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
