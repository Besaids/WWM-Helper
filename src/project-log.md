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
