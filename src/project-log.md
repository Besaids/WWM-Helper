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
