## 2025-12-03 – Custom Checklist System & Home Page Redesign

### Overview

Implemented a complete custom checklist system allowing users to create their own daily and weekly tasks, alongside a major home page redesign featuring a three-column layout with logo, timer state indicators, and expanded pinned task organization.

### Custom Checklist System

#### Features Added

- **3-Step Modal Wizard**:
  1. Task Type Selection (Daily vs Weekly with reset time explanations)
  2. Details Input (label, description, tags with character limits)
  3. Review & Confirm
- **Task Types**:
  - **Daily Tasks**: Reset every day at 21:00 UTC
  - **Weekly Tasks**: Reset every Sunday at 21:00 UTC
- **Multi-Select Tag System**:
  - Up to 5 tags per task from curated list (Combat, PvP, PvE, Economy, etc.)
  - Visual checkboxes with disabled state when limit reached
- **Completion Counter**: 
  - Tracks how many times each task has been completed in the current cycle
  - Green badge with checkmark icon displays count when > 0
  - Counters reset automatically with the task's cycle

#### Checklist Architecture Expansion

- **Registry Pattern**: `ChecklistRegistryService` centralizes type definitions and item retrieval
  - Six checklist types: `daily`, `weekly`, `seasonal-daily`, `seasonal-weekly`, `seasonal-period`, `custom`
  - Dynamic cycle key generation per type
  - Unified `getItemsForType()` interface
- **Custom Checklist Service**: Full CRUD operations with localStorage persistence
  - Versioned storage at `wwm-custom-checklist` key
  - Auto-generates IDs with timestamp and random suffix
  - Maps importance (`daily`/`weekly`) to category names
  - Text sanitization on all user inputs
- **State Service Updates**: Added completion counter tracking
  - Per-cycle storage: `wwm-checklist-counts-{type}-{cycleId}`
  - `incrementCompletionCount()` / `decrementCompletionCount()` methods
  - Counters persist within cycle, reset automatically on cycle change

#### Data Model Expansions

- **`ChecklistFrequency`**: Extended from 2 types to 6 (`daily`, `weekly`, `seasonal-daily`, `seasonal-weekly`, `seasonal-period`, `custom`)
- **`ChecklistImportance`**: Expanded from `core`|`optional` to include `daily`|`weekly` for custom items
- **`ChecklistItem`**: Added optional fields:
  - `expired: boolean` – for seasonal/event tasks
  - `isCustom?: boolean` – flag for user-created items
  - `createdAt?: string` – ISO timestamp
  - `seasonId?: string` – ties item to specific season
- **New Interfaces**:
  - `ChecklistTypeConfig` – registry type definition
  - `CustomChecklistItemFormData` – form data shape
  - `CustomChecklistStorage` – versioned storage payload
  - `CUSTOM_CHECKLIST_LIMITS` – validation constants

#### UI/UX Features

- **Modal Integration**:
  - "Add custom item" button in Custom tab
  - Edit mode skips type selection step
  - Duplicate name detection (case-insensitive)
  - Scroll lock when modal open, click-outside-to-close
- **Checklist Display Updates**:
  - Custom items appear in two new importance sections (`daily`, `weekly`)
  - Custom items prioritized above system items (sorted by `isCustom` flag first)
  - Edit (pencil icon) and delete (trash icon) buttons on hover
  - Completion counter badge with green styling
  - Empty state message when no custom items exist
- **Modal Styling**:
  - Cyan gradient theme matching custom timer modal
  - Radio card selection for task types with icons
  - Tag selector with checkbox grid layout
  - Progress indicators: active uses cyan gradient, complete uses green
  - Standardized button styling across modals

#### Storage & Persistence

- **Custom Items**: `wwm-custom-checklist` (version 1, global, non-cycle)
- **Completion Counts**: `wwm-checklist-counts-{type}-{cycleId}` (per-cycle)
- **Checklist State**: `wwm-checklist-{type}-{cycleId}` (checked items, per-cycle)
- **Preferences**: `wwm-helper.checklist.prefs` (pinned/hidden, non-cycle)

### Home Page Redesign

#### Three-Column Hero Layout

- **New Grid Structure**: `1fr auto 1fr` (left card | logo | right card)
  - Left: "Where Winds Meet Helper" hero text (same content, equal width card)
  - Center: WWM wheat logo (180px, 70% opacity, hidden on mobile <960px)
  - Right: "Upcoming events" (equal width to hero, max 4 timers)
- **Logo Styling**:
  - Uses `assets/portal/wwm-wheat-256.png`
  - Drop shadow for depth
  - Subtle hover effect (opacity 0.7 → 0.85, scale 1.0 → 1.05)
  - Completely hidden on mobile to prevent scrolling clutter

#### Timer State Indicators

- **Active Events (Green)**:
  - Border: `rgba(34, 197, 94, 0.6)` with soft glow
  - Applied when label includes "(open)"
- **Warning Gradient (Yellow → Red)**:
  - 30 minutes: Yellow `rgb(234, 179, 8)`
  - Interpolates to Red `rgb(239, 68, 68)` at 0 minutes
  - Border color + glow shadow with CSS custom properties
  - Gradient progress calculated: `1 - (seconds / 1800)`
- **Timer State Logic**:
  - Matches timer-strip component behavior
  - Parses remaining time strings to seconds
  - Active > Warning/Urgent > Normal priority
  - Uses `TimerState` interface with `warningProgress` tracking

#### Expanded Pinned Tasks

- **Full-Width Card**: Pinned tasks now span entire width below hero
- **Three-Bucket Organization**:
  - **Daily**: Regular daily + seasonal-daily + custom daily tasks
  - **Weekly**: Regular weekly + seasonal-weekly + custom weekly tasks
  - **Season Goals**: Seasonal-period tasks only
- **Conditional Rendering**: Only displays buckets with pinned items (hides empty buckets)
- **Priority Sorting**: Custom items appear first within each bucket (then alphabetical by label)
- **Visual Distinction**: Custom items get subtle cyan border/background (no "Custom" badge)
- **Grid Layout**: `repeat(auto-fit, minmax(300px, 1fr))` for responsive columns

#### Reactive State Management

- **Signal-Based Triggers**: `refreshTrigger` signal forces `pinnedBuckets` recomputation
- **Immediate Updates**: Items disappear instantly when checked (via `refreshTrigger.update()`)
- **Change Detection**: `ChangeDetectorRef.markForCheck()` ensures OnPush components update
- **Timer State Computation**: Each timer gets `state` and `warningStyle` calculated in `upcomingTimers` computed signal

### Technical Implementation

#### Components Modified

- `home.component.ts/html/scss` – Complete redesign with three-column layout, timer states, and bucket organization
- `checklist.component.ts/html/scss` – Integrated custom modal, added importance sections, completion counters
- `custom-checklist-modal.component.ts/html/scss` – Full 3-step wizard implementation

#### Services Created/Updated

- `checklist-registry.service.ts` – NEW: Type registry with dynamic item loading
- `custom-checklist.service.ts` – NEW: CRUD service for custom tasks
- `checklist-state.service.ts` – UPDATED: Added completion counter tracking

#### Models Extended

- `checklist.model.ts` – Expanded frequency types, importance types, added custom-related interfaces

### Styling Consistency

- **Design Token Usage**: All colors, surfaces, shadows from token system
- **Modal Standardization**: Both custom timer and custom checklist modals now use identical cyan gradient theme
- **Border Colors**: Fixed undefined variable errors (`$color-border-subtle` → `$border-subtle`)
- **Active States**: Unified green/yellow/red indicators across timer strip and home page

### Bug Fixes & Polish

- Fixed import path for custom checklist modal component
- Added missing importance filter sections for custom items display
- Fixed completion counter loading (missing `loadCompletionCountsForType()` call)
- Removed unused "Custom" badge from home page pinned items
- Fixed change detection issues with `refreshTrigger` signal pattern
- Corrected SCSS variable names to match token system

### Files Modified/Created

**New Files:**
- `src/app/services/checklist/checklist-registry.service.ts`
- `src/app/services/checklist/custom-checklist.service.ts`
- `src/app/components/checklist/custom-checklist-modal/custom-checklist-modal.component.ts/html/scss`

**Modified Files:**
- `src/app/models/checklist.model.ts`
- `src/app/services/checklist/checklist-state.service.ts`
- `src/app/components/checklist/checklist.component.ts/html/scss`
- `src/app/components/home/home.component.ts/html/scss`
- `src/app/components/timers/custom-timer-modal/custom-timer-modal.component.scss`

### Known Limitations

- Seasonal checklist configs are placeholder arrays (ready for future season content)
- Season ID tracking uses hardcoded `s1-2025` placeholder (TODO: implement proper season detection)
- Custom checklist items cannot be reordered (display order is: custom first, then alphabetical)

### Future Enhancements (Potential)

- Import/export custom checklist items
- Custom item templates/presets
- Drag-and-drop reordering within buckets
- Seasonal content population when seasons launch
- Checklist item priorities/weighting system

## 2025-12-02 – Custom Timers System Implementation

### Overview

Implemented a complete custom timer system allowing users to create, edit, and delete their own timers with full localStorage persistence and real-time updates.

### Features Added

#### Custom Timer Creation

- **4-Step Modal Wizard**:
  1. Timer Type Selection (Recurring vs Event)
  2. Basic Information (label, icon, summary)
  3. Schedule Configuration (6 schedule types for recurring, date/category for events)
  4. Review & Confirm
- **Timer Types**:
  - **Recurring Timers**: Daily, Weekly, Daily-Multi, Weekly-Multi, Weekly-Times, Weekly-Range
  - **Event Timers**: One-time countdown timers with end date and category
- **Auto-Generated Short Labels**: System automatically creates compact labels for timer strip from user's main label
  - Creates acronyms when possible (e.g., "Fireworks Festival" → "FF")
  - Falls back to intelligent truncation
  - Removes need for manual short label input

#### User Experience Improvements

- **Local Time Input**: All schedule inputs use user's local timezone, automatically converted to UTC on save
- **Timezone Conversion**: Bidirectional conversion (UTC↔Local) when editing existing timers
- **Icon Picker**: 40+ curated Bootstrap icons with collapsible drawer interface
- **Real-Time Preview**: Shows how timer will appear in timer strip during creation

#### Validation & Safety

- **Duplicate Name Prevention**: Case-insensitive check prevents creating timers with identical names
- **Daily-Multi Overlap Detection**: Validates time windows don't overlap when window duration is set
- **Weekly-Range Validation**: Ensures close time is after open time
- **Form Validation**: Step-by-step validation prevents proceeding with incomplete/invalid data
- **XSS Protection**: All user text inputs sanitized before storage

#### Edit & Delete Functionality

- **Edit Mode**:
  - Skips Timer Type step (type cannot be changed)
  - Pre-fills all form fields with existing timer data
  - Converts stored UTC values back to local time for editing
  - Back button disabled on Basic Info step when editing
- **Delete Confirmation**: Confirmation dialog before deleting custom timers
- **Action Buttons**: Edit/delete buttons appear on hover for event timer cards
- **Details Drawer**: Custom recurring timers show summary or fallback message in details panel

#### Integration

- **Custom Recurring Timers**: Appear in main timer settings list with toggle controls
- **Custom Event Timers**: Appear in "Limited-Time Content" section with compact cards
- **Timer Strip**: Custom timers appear in top navigation strip when enabled
- **Real-Time Updates**: Custom timers update every second alongside built-in timers
- **Automatic Expiration**: Event timers disappear automatically after end date

#### Storage & Data Management

- **Versioned localStorage**: Uses `wwm-custom-timers` key with version 1 payload structure
- **CRUD Operations**: Full Create, Read, Update, Delete support via `CustomTimerService`
- **Signal-Based State**: Reactive state management with Angular signals
- **Observable Integration**: Converts signals to observables for timer service integration
- **UTC Storage**: All times stored in UTC ISO format for consistency

#### UI/UX Polish

- **Compact Create Button**: "Create Custom Timer" button sized to content (full-width on mobile)
- **Event Timer Card Layout**: Icon + action buttons in horizontal row without extra vertical space
- **Action Button Styling**: Subtle, always-visible buttons with hover effects
- **Modal Overlay**: Scroll lock, click-outside-to-close, proper z-index stacking
- **Progress Indicator**: Visual step tracker shows current position in wizard
- **Responsive Design**: Mobile-optimized layouts and touch-friendly controls

### Technical Details

#### Architecture

- **Services**: `CustomTimerService` (CRUD), `TimerService` (recurring integration), `EventTimerService` (event integration)
- **Components**: `CustomTimerModalComponent` (4-step wizard), `TimersComponent` (page container)
- **Models**: `CustomTimerDefinition`, `CustomTimerFormData`, `CUSTOM_TIMER_LIMITS`
- **Storage Utilities**: Versioned save/load with SSR safety checks

#### Schedule Types Supported

1. **Daily**: Single time each day (e.g., "21:00 daily")
2. **Weekly**: Single time each week (e.g., "Sunday 21:00")
3. **Daily-Multi**: Multiple times per day, optional window duration (e.g., "10:00, 22:00 with 2h windows")
4. **Weekly-Multi**: Same time on multiple weekdays (e.g., "Fri & Sat 20:30")
5. **Weekly-Times**: Different times on different weekdays (e.g., "Sat 12:30, Sun 00:30")
6. **Weekly-Range**: Open/close window (e.g., "Mon 01:00 - Fri 13:00")

#### Event Timer Categories

- Battle Pass
- Season
- Gacha Banner
- Special Gacha
- Limited Event
- Other

### Files Modified

- `src/app/models/custom-timer.model.ts` - Type definitions and limits
- `src/app/services/timer/custom-timer.service.ts` - CRUD service with localStorage
- `src/app/services/timer/timer.service.ts` - Integrated custom recurring timers
- `src/app/services/timer/event-timer.service.ts` - Integrated custom event timers
- `src/app/components/timers/timers.component.ts/html/scss` - Main timers page updates
- `src/app/components/timers/custom-timer-modal/custom-timer-modal.component.ts/html/scss` - Complete modal implementation

### Known Limitations

- Short labels limited to 15 characters
- Timer labels limited to 40 characters
- Maximum 6 time slots for daily-multi
- Maximum 7 time slots for weekly-times
- Event timers require future dates (no past dates allowed)
- No validation for weekly-range close-after-open across week boundaries (future enhancement)

### Future Enhancements (Potential)

- Import/export custom timers
- Timer templates/presets
- Sharing custom timers between users
- Advanced repeat patterns (e.g., "every 3rd Tuesday")
- Timer groups/categories
- Notifications/alerts integration

## 2025-12-01

### Home Page Enhancements & Timer Improvements

### New Features

- **Home Page Dynamic Sections**
  - Added "Upcoming events" card showing top timers based on priority and time
  - Added "Pinned tasks" card displaying user's pinned checklist items
  - Dynamic timer count: scales from 5 (minimum) to match pinned task count (~0.75 ratio)
  - Timers now sorted by: active status first, then remaining time (removed priority-based sorting)
  - "Not configured" guild timers automatically pushed to end of list
- **Pinned Tasks Integration**
  - Split display between Daily and Weekly sections
  - Interactive checklist toggles work directly from home page
  - Empty state message when no tasks are pinned
  - Always-visible card provides consistent layout
  - Auto-updates when tasks are checked/unchecked

### UI/UX Improvements

- **Timer Strip Enhancements**
  - **Warning Gradient System**: 30m→0m countdown with color transition
    - 30 minutes: Yellow (`rgb(234, 179, 8)`)
    - 15 minutes: Orange (interpolated)
    - 0 minutes: Red (`rgb(239, 68, 68)`)
  - **Active Event Indicator**: Green styling for events currently in progress
    - Green border and glow effect
    - Detects "(open)" in timer labels
  - Dynamic CSS custom properties for smooth color transitions

- **Home Page Layout**
  - Two-column grid layout (1.6fr / 1.4fr) matching main content cards
  - Pill-shaped corners on timer and task items for consistency
  - Responsive: single column on mobile (<960px)
  - Proper alignment with cards below

- **Checklist Component Refinements**
  - Fixed whole-row clickability issue (only diamond/text trigger toggle now)
  - Removed teal border glow from completed items
  - Action buttons (pin/hide) moved outside toggle component
  - Larger, centered action buttons with active state colors (gold/red)
  - Reset checked state when hiding items
  - Removed pin-based sorting (items stay in original order)

### Technical Changes

- **Home Component (`home.component.ts`)**
  - Added `BehaviorSubject` for reactive pinned count tracking
  - Implemented `upcomingTimers$` with dynamic slicing based on pinned tasks
  - Removed priority-based sorting in favor of time-based
  - Added `getTimerState()` and `getWarningStyle()` methods for timer strip

- **Timer Strip Component (`timer-strip.component.ts`)**
  - New `TimerState` interface with warning progress tracking
  - RGB color interpolation for gradient warnings
  - `getTimerState()` method for active/warning/urgent/normal classification
  - `getWarningStyle()` returns CSS custom properties for dynamic coloring

- **Checklist Toggle Component**
  - Restructured from `<label>` wrapper to `<div>` with proper label associations
  - Unique `checkboxId` generation for accessibility
  - Fixed TypeScript errors and ESLint warnings
  - Proper `[attr.for]` binding for native HTML behavior

### Bug Fixes

- Resolved accessibility warnings about label association
- Fixed keyboard event warnings in checklist toggle
- Corrected cursor behavior (pointer only on interactive elements)
- Fixed strikethrough extending through action buttons

### Code Quality

- Changed index signature to `Record<string, string>` type
- Improved type safety throughout components
- Better separation of concerns (styling on correct elements)
- Consistent use of SCSS tokens for motion and colors

### Configuration

- Daily checklist: 12 items (6 core, 6 optional)
- Weekly checklist: 13 items (10 core, 3 optional)
- Timer definitions: 11 timers with various schedule types
- Music player: 20 tracks in rotation

### Trading / Commerce – timers, checklist & guide

**New Trading timers**

- Added two Trading-related global timers to `TIMER_DEFINITIONS`:
  - **Trade Price Check** – daily reminder aligned with the “likely peak” sell window; helps you log in and check Local % and Remote buyers.
  - **Trade Week Reset** – weekly timer for the Friday 21:00 UTC Trade Week rotation (three new Trading Goods + reset of the Price Bulletin story).
- Timers use UTC and standard timer chip styling; both are toggleable in the Timers settings card and appear in the top strip when enabled.
- Timer detail drawers document:
  - How Local vs Remote fluctuation works.
  - Why Trade Week reset and mid-week checks matter.
  - Links back to the Trading / Commerce guide for the full explanation.

**New Trading checklist entries**

- **Daily (optional, Economy)**
  - `daily-trading-buy-goods` – “Trade – buy weekly goods at Feng’s Tradehall (Fri→Sun).”
    - Explains buying up to slot cap from the three weekly goods after the Friday trade reset; recommends the “30 + 30 + 20” pattern (two most expensive items first).
  - `daily-trading-check-prices` – “Trade – check prices and offload goods.”
    - Suggests using the Trading timers to remember mid-week checks, watching Local % and Remote Price lists (guild members / friends), and clearing stock before the next Friday 21:00 UTC reset.
- **Weekly (optional, Economy)**
  - `weekly-trading-loop` – “Run your weekly Trading / Commerce loop.”
    - Summarises the whole loop: buy after Trade Week reset, hold/sell over the week, ensure no Trading Goods remain in your bag when the next Trade Week starts.

**New daily activity – Well of Heaven Special Training**

- Added an optional daily checklist item for **Well of Heaven Special Training**:
  - Category: Adventure / Attributes.
  - Notes that the activity is found via Wandering Paths → Casual Co-op → Adventure, with “Sprint & Sweat” at Qinghe – West Heaven’s Pier.
  - Emphasises it awards **Constitution** (up to +10 over 10 days) which is required to equip certain gear pieces.

---

### Trading / Commerce Guide & Guides hub

**Guides routing & structure**

- Introduced a new Guides hub and first in-app guide:
  - Route: `/guides` – hub page (currently forwards straight into Trading but is ready to list more guides in future).
  - Route: `/guides/trading` – **Trading / Commerce Guide**.
- Guide page layout:
  - Hero title + short description of what the guide covers.
  - Horizontal pill navigation (`Overview`, `Resets`, `Price Bulletin`, `Local vs Remote`, `Slots & weekly loop`, `Guild techniques`, `Timers & checklists`) bound to in-page anchors.
  - Content is pure explanatory copy; no per-patch balance numbers to keep the guide durable.

**Trading / Commerce content**

- Documented how Trading Goods work:
  - Each Trade Week the game selects **three Trading Goods**: 1 × Local Fluctuation, 2 × Remote Fluctuation.
  - Old-week goods in your bag still exist but are outside the structured loop; the guide explicitly recommends having **no Trading Goods** in your bag at the next Friday 21:00 UTC reset.
- Clarified resets in global UTC (converted from CN/UTC+8 references):
  - **Trade Week reset** – Friday 21:00 UTC.
  - **Weekly reset** – Sunday 21:00 UTC (used as the “stock has definitely refreshed at least once” milestone).
- Price Bulletin section:
  - Where to open it (Zang Qiyue in Kaifeng, or “Check Announcements” in the Trade Commission UI).
  - What it shows: current three Trading Goods, which is Local vs Remote, “Go to purchase” locations, and the week-long `Time remaining` countdown.
- Local vs Remote behaviour:
  - **Local** – your buy and sell price both move up/down together during the week; you buy low and sell high on your own world.
  - **Remote** – your local price is fixed; you instead look for other players’ worlds (Remote Price / Co-op Sale) where the sell price is higher.
- Inventory & mansion loop:
  - Recommends renting the big mansion (Feng’s Tradehall) for +60 Trading slots (80 total baseline) as the practical threshold for taking Trading seriously.
  - Describes the 80-slot buying pattern: max both expensive goods to 30 each, then fill remaining 20 with the last item.
  - Explains the week-long loop: buy shortly after Trade Week reset, hold and hunt good Remote buyers around mid-week peaks, dump everything before the next Trade Week.

**Guild techniques & timers/checklists integration**

- Added a section explaining relevant guild techniques under **Wealth Through Trade**:
  - **Selling bonus** – increases Commerce Coins gained when exchanging Trading Goods with guild members.
  - **Market Tax** – reduces tax when exchanging Trading Goods with guild members.
  - Clarifies that these bonuses apply to trading with guild members (and guild NPC), not random players.
- Final section describes how WWM Helper surfaces Trading support:
  - Trade Week Reset + Trade Price Check timers.
  - The three Trading checklist items (buy goods, check prices, run weekly loop).
  - Encourages using timers for the “when” and the checklist for “did I actually do it”.

**Images & figures**

- Added `guide-figure` blocks with responsive sizing clamps for:
  - **Price Bulletin overview** – shows the three goods, fluctuation type and “Time remaining”.
  - **Local price fluctuation** – example of Local % changing on your own world.
  - **Guild Wealth Through Trade** techniques – Selling bonus and Market Tax panels.
  - **Trade house renting** – Feng’s Tradehall housing choices, highlighting the big mansion for +60 slots.
  - **Trade Commission map location** – Kaifeng city map screenshot showing where the Trade Commission/Price Bulletin NPC is.
- Each figure has descriptive alt text and captions tied to the relevant sections.

**Scroll-to-top button**

- Added a floating, circular **“back to top”** button on the Trading guide only:
  - Uses existing `btn-primary` styling plus a fixed bottom-right position.
  - Appears once the user has scrolled past a threshold; smooth-scrolls back to the top of the guide.
  - Fully keyboard accessible and uses `aria-label="Back to top"`.

**Sources & disclaimer**

- Appended a **Sources & disclaimer** block to the guide:
  - Credits the Reddit guide “Where Winds Meet – The Ultimate Guide (Part 4)” by u/Silent-Musician-7918 as inspiration.
  - States that all timings/behaviour have been verified and adjusted for the global (UTC) schedule through direct play.
  - Notes that all values are subject to change with patches; the guide reflects currently observed behaviour.

---

### Home page – evergreen landing redesign

- Reworked the Home page away from “live” checklist content into an evergreen hub:

**Hero**

- New static hero copy:
  - Explains that WWM Helper is a lightweight companion with timers, checklists and guides.
- Single primary CTA:
  - **“Open today’s checklist”** button linking to `/checklist?tab=daily`.
  - Removed redundant hero buttons for timers/guides since each section now has its own card CTA.

**Section cards**

- Replaced the old “core daily priorities / weekly goals” content with three persistent section cards:
  1. **Timers**
     - Describes reset tracking, world/event timers (including Trading), and the configurable top strip.
     - “Open timers” link to `/timers`.

  2. **Checklists**
     - Explains daily/weekly lists, detailed vs compact view modes, and local-storage persistence.
     - “Open checklist” link to `/checklist?tab=daily`.

  3. **Guides**
     - Describes long-form system guides, currently starting with Trading / Commerce, plus future expansion.
     - “Browse guides” link to `/guides`.

- Each card summarises “What you’ll find here” using bullet points; content is high-level and resilient to future checklist/timer changes.

**External resources card**

- Renamed bottom card from **“Guides & resources”** to **“External resources”** to avoid confusion with in-app Guides.
- Subtitle now clarifies it is a bundle of official/community links only.
- Link list unchanged: official site, official Discord, Steam page, wiki and both Reddit communities.

## 2025-11-30

### Guild Event Timers – Breaking Army & Test Your Skills

**Goal**

- Support two special guild events whose schedules are configured by the guild leader in-game and can vary per player:
  - **Breaking Army** (solo boss challenge)
  - **Test Your Skills** (internal guild arena)
- Keep the global timers in UTC, but let users transcribe the in-game card (weekday, time, UTC+offset) and have the app count down like any other repeating window.

**Data & Services**

- Introduced a dedicated **Guild Event Timers** service to hold per-user overrides in `localStorage` keyed by timer ID.
  - Stores:
    - `timezoneOffsetMinutes` (card’s UTC offset in minutes)
    - `slots`: an array of `{ weekday, hour, minute }` for up to two weekly windows.
  - Exposes `scheduleOverrides$` observable so other services can layer guild overrides on top of the base `TIMER_DEFINITIONS`.
- Updated `TimerService`:
  - Combines the regular `tick$` stream with `guildTimers.scheduleOverrides$`.
  - For two special timer IDs:
    - `guild-breaking-army`
    - `guild-test-your-skills`
  - If no override exists yet, their chips render as:
    - `remaining: "Not configured"`
    - No schedule helpers are called (prevents bogus UTC math).
  - If an override exists, it clones the definition with the user’s schedule and passes that into `buildTimerChip`, so these timers behave like normal 1-hour windows (open → close → next slot).

**Timers UI – per-guild configuration**

- Extended `timers.component.html` to add **Details drawers** for:
  - `@case ('guild-breaking-army')`
  - `@case ('guild-test-your-skills')`
- Each guild drawer includes:
  - Explanatory text describing the event and reminding that the schedule is guild-leader-defined and 1-hour long.
  - A “Schedule” configuration block with:
    - **Event timezone (card)** – `UTC + N` selector, where `N` is taken from `guildUtcOffsets` (hours); persisted as minutes.
    - **Slot 1** and **Slot 2** weekday selectors:
      - Defaults to Monday if no stored value is present.
      - Restore the correct weekday after reload using `[selected]` bindings per option.
    - Separate **hour** and **minute** dropdowns for each slot:
      - Hour options: 0–23, rendered as `00–23`.
      - Minute options: 0, 15, 30, 45.
      - Restore persisted values via `[selected]` on options (fixed earlier bug where `[value]` on `<select>` didn’t re-select after async load).
  - **Save** button:
    - Calls `saveGuildTimer(timerId, tzMinutes, slots)` to write into the guild timer service and `localStorage`.
  - **Delete** button:
    - Calls `deleteGuildTimer(timerId)` to clear overrides and return the timer to “Not configured”.

**Timers styling – guild configuration**

- Extended `timers.component.scss` with a small guild-config sub-layout:
  - `.guild-timer-config` – Adds top border, spacing and vertical layout for the configuration block underneath the timer description.
  - `.guild-timer-field` / `__tz` – Compact pill-style wrapper for the `UTC +` selector, using existing surface/shadow tokens so it matches timer controls.
  - `.guild-timer-slot` – Flex row for each slot:
    - Weekday select on the left.
    - Narrow hour/minute selects grouped tightly on the right.
    - Wraps neatly on smaller widths.
  - `.guild-timer-slot__time` – Narrow width and slight negative margin to visually pull hour/minute closer together.
  - `.guild-timer-actions` – Horizontal `Save` / `Delete` row using the existing `.btn-primary` / `.btn-secondary` button styles, aligned with the rest of the app’s button language.

---

### Global Typography & Responsive Polish

**Base font size**

- Increased global root font size in `styles/base/_globals.scss`:
  - `html { font-size: 18px; }`
- Motivation:
  - Improve legibility; several users reported the default text size felt too small on desktop.

**Music player responsiveness**

- The larger base font caused the music player’s `current / total` time label to overflow its right edge.
  - Root cause: `.music-player` was hard-capped at `max-width: 420px` while internal text grew with `rem`.
- Fix:
  - Relaxed/removed the fixed desktop max width so the player can grow horizontally with its container:
    - New pattern: `max-width: min(100%, 32rem);` on desktop; `max-width: 100%` on mobile.
  - Kept the existing mobile media-query behavior:
    - Slightly smaller title/subtitle fonts.
    - Narrower volume slider.
    - Controls allowed to wrap on very small widths.
- Result: the player now scales cleanly with the new typography; the `0:00 / 3:42` label stays inside the card on both desktop and mobile without layout glitches.

**Checklist mobile header alignment**

- Problem:
  - In the checklist cards, `.idea h3` used `display: flex` with `justify-content: space-between` for title + category (e.g. `CONTENT / EXPLORATION`).
  - On mobile with larger font size, long titles wrapped to multiple lines, causing the category label to sit at inconsistent vertical positions (visually “floating” mid-block).
- Fix:
  - Added a mobile override for small screens:
    - `.idea h3` switches to `flex-direction: column; align-items: flex-start;`.
    - The category becomes a stacked subtitle directly under the title (smaller font size).
  - Desktop behavior is unchanged (title left, category right in a single row).
- Result:
  - Consistent, readable alignment of checklist categories on mobile without sacrificing the denser desktop layout.

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
