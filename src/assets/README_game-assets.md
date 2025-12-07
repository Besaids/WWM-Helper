# WWM Helper – Game Assets Manifest

This doc is **context for AI + humans**, not a full wiring guide. It explains what the
game-assets manifest is for, how it’s shaped, and how it relates to tooltips.

The actual logic lives in the TypeScript files; this file just describes patterns
and shows small snippets.

---

## Goal

In-game UI assets from _Where Winds Meet_ (icons for currencies, systems, menus,
paths, etc.) are centralized so that:

- We know **what** each asset represents in game systems.
- We know **how** it should normally be used in the UI.
- We know **how big / what shape** it is (for layout decisions).
- We can specify a **preferred tooltip variant** per asset when needed.

This enables:

- Consistent tooltips and inline labels.
- Smarter auto-generation of UI and guides.
- Less hard-coded strings in components.

---

## Where things live

All paths are under `src/app/`:

- `models/game-assets.model.ts`  
  Type model for assets (`GameAssetDefinition` and related types).

- `configs/tooltip/game-assets.ts`  
  Canonical manifest of in-game assets, exported as a typed array:

  ```ts
  import { GameAssetDefinition } from '../../models';

  export const GAME_ASSETS: GameAssetDefinition[] = [
    /* ... */
  ];
  ```

- `configs/tooltip/tooltip-defaults.config.ts`  
  Tooltip defaults and asset-derived tooltip builder:
  - Indexes `GAME_ASSETS` by `id`.
  - Binds tooltip IDs → asset IDs (`ASSET_TOOLTIP_BINDINGS`).
  - Provides handwritten, non-asset tooltips (`STATIC_TOOLTIPS`).
  - Exposes `getDefaultTooltips()` to seed the registry at startup.

> Only `assets/game/**` is treated as **in-game assets** for reasoning.  
> Other folders:
>
> - `assets/guides/**`: guide-specific screenshots, ad hoc.
> - `assets/music/**`: music media.
> - `assets/portal/**`: web app / branding assets.

---

## Model overview

Defined in `models/game-assets.model.ts`:

```ts
import { TooltipVariant } from './tooltip.model';

export type GameAssetCategory =
  | 'currency'
  | 'items'
  | 'navigation'
  | 'sect_paths'
  | 'system';

export type GameAssetKind =
  | 'currency-icon'
  | 'gacha-ticket-icon'
  | 'nav-icon'
  | 'menu-nav-icon'
  | 'path-icon'
  | 'system-icon';

export type GameSystemTag = /* long union of tags; see file for full list */;

export type AspectRatioString = `${number}:${number}`;

export interface GameAssetDefinition {
  id: string;
  category: GameAssetCategory;
  file: string;
  label: string;
  kind: GameAssetKind;
  source: string;
  description: string;
  game_system_tags: GameSystemTag[];
  ui_usage_notes: string;
  width: number;
  height: number;
  aspect_ratio: AspectRatioString;
  tooltip_variant?: TooltipVariant; // optional preferred tooltip variant
}
```

Key ideas:

- `id` is the canonical identifier (e.g. `"currency.echo_jade"`).
- `file` is the relative path under `/assets`.
- `game_system_tags` are for filtering / grouping / semantic reasoning.
- `tooltip_variant` lets an asset opt into a specific tooltip layout; otherwise
  the system uses a default.

---

## Manifest shape

`configs/tooltip/game-assets.ts` exports a **flat array** of `GameAssetDefinition`
objects; there is no nesting.

Example:

```ts
export const GAME_ASSETS: GameAssetDefinition[] = [
  {
    id: 'currency.echo_jade',
    category: 'currency',
    file: 'assets/game/currency/currency-echo-jade.png',
    label: 'Echo Jade',
    kind: 'currency-icon',
    source: 'Where Winds Meet (in-game capture)',
    description:
      'High-value earnable premium-like currency used at special merchants and systems. Commonly spent on Resonating Melodies, Inner Way materials, and other power-progression items.',
    game_system_tags: ['currency', 'premium_like', 'inner_way', 'gacha', 'economy'],
    ui_usage_notes:
      'Use when describing where to spend Echo Jade efficiently (Resonating Melodies, Inner Ways, etc.) or when labelling Echo Jade sinks in checklists.',
    width: 560,
    height: 480,
    aspect_ratio: '7:6',
    // tooltip_variant: 'resourcePreview', // optional; omit for default
  },
  // more assets…
];
```

If you add new assets, follow this shape and keep `id` unique.

---

## Tooltip integration – high level

The tooltip system is built on top of `GAME_ASSETS` plus a small binding layer.

Types are in `tooltip.model.ts`:

```ts
export type TooltipVariant = 'controlHint' | 'inlineInfo' | 'resourcePreview' | 'scheduledItem';

export interface TooltipConfig {
  imageUrl?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  linkLabel?: string;
  variant?: TooltipVariant;
}

export type TooltipConfigMap = Record<string, TooltipConfig>;
```

### What tooltip-defaults.config.ts does

1. **Index assets by ID** for fast lookup:

   ```ts
   const GAME_ASSETS_BY_ID: Record<string, GameAssetDefinition> = GAME_ASSETS.reduce(
     (acc, asset) => {
       acc[asset.id] = asset;
       return acc;
     },
     {} as Record<string, GameAssetDefinition>,
   );
   ```

2. **Map tooltip IDs → asset IDs**:

   ```ts
   const ASSET_TOOLTIP_BINDINGS: Record<string, string> = {
     // aliasing system resources to small icons
     'system.energy': 'system.energy_small',
     'system.stamina': 'system.stamina_small',

     // 1:1 currency mappings
     'currency.echo_jade': 'currency.echo_jade',
     // ... more
   };
   ```

   - Left side = tooltip ID used in templates:  
     `[appTooltip]="'currency.echo_jade'"`.
   - Right side = `GameAssetDefinition.id` that supplies the data.

3. **Define static (non-asset) tooltips**:

   ```ts
   export const STATIC_TOOLTIPS: TooltipConfigMap = {
     'common.open_guide': {
       title: 'Open Guide',
       description: 'Go to the guide for more information about this feature.',
       variant: 'controlHint',
     },
     'timer.details-button': {
       title: 'View timer details',
       description: 'Show information about when and why this timer matters.',
       variant: 'controlHint',
     },
     // checklist controls, state badges, etc…
   };
   ```

4. **Build asset-derived tooltips**:

   ```ts
   export function buildAssetTooltips(): TooltipConfigMap {
     const result: TooltipConfigMap = {};

     for (const [tooltipId, assetId] of Object.entries(ASSET_TOOLTIP_BINDINGS)) {
       const asset = GAME_ASSETS_BY_ID[assetId];
       if (!asset) continue;

       result[tooltipId] = {
         imageUrl: asset.file,
         title: asset.label,
         description: asset.description,
         variant: asset.tooltip_variant ?? 'inlineInfo',
       };
     }

     return result;
   }
   ```

5. **Expose a helper that merges everything**:

   ```ts
   export function getDefaultTooltips(): TooltipConfigMap {
     return {
       ...STATIC_TOOLTIPS,
       ...buildAssetTooltips(),
     };
   }
   ```

A separate seed service (not documented here in detail) calls
`tooltipRegistry.registerAll(getDefaultTooltips())` at startup.

---

## How to think about this as an AI / code generator

When generating code or content:

- Prefer **explicit tooltip IDs** that line up with `ASSET_TOOLTIP_BINDINGS` or
  `GAME_ASSETS.id`. Example:
  - In TS config: `tooltipId: 'currency.echo_jade'`.
  - In templates: `[appTooltip]="'currency.echo_jade'"`.
- Use `GameAssetDefinition` fields semantically:
  - `label` for human-facing names.
  - `description` for “what is this / what does it do”.
  - `ui_usage_notes` for “how the helper should present this”.
  - `game_system_tags` to pick the right asset for a context (e.g. `currency` +
    `gacha` vs `currency` + `activity`).
- Only set `tooltip_variant` on the asset if you want a non-default tooltip
  layout (e.g. `resourcePreview`); otherwise let it default to `"inlineInfo"`.

When in doubt:

- Do **not** duplicate labels/descriptions in components.
- Instead:
  - Add / update a `GameAssetDefinition`,
  - Wire (or reuse) a tooltip ID in `ASSET_TOOLTIP_BINDINGS`,
  - Use that tooltip ID in templates or configs.
