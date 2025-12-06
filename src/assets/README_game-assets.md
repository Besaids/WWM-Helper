# WWM Helper – Game Assets Manifest

This folder describes **in-game UI assets** from _Where Winds Meet_ used by the WWM Helper web app.

The goal of `game-assets.json` is to give humans and LLMs enough **semantic** and **layout** context to:

- know **what** each asset represents in game systems,
- know **how** it should normally be used in the UI,
- know **how big** it is and what its **shape/aspect** is.

This makes it easier to auto-generate UI, guides, and code that refer to these assets correctly.

---

## Files

- `game-assets.json`  
  Canonical manifest of in-game assets under `assets/game/`.

> Only `assets/game/**` is treated as in-game assets for reasoning.  
> Other folders:
>
> - `assets/guides/**`: guide-specific screenshots, ad hoc.
> - `assets/music/**`: your own music media.
> - `assets/portal/**`: web app / branding assets.

---

## JSON structure

`game-assets.json` is a flat array of objects:

```jsonc
[
  {
    "id": "currency.echo_jade",
    "category": "currency",
    "file": "assets/game/currency/currency-echo-jade.png",
    "label": "Echo Jade",
    "kind": "currency-icon",
    "source": "Where Winds Meet (in-game capture)",
    "description": "High-value earnable premium-like currency used at special merchants and systems. Commonly spent on Resonating Melodies, Inner Way materials, and other power-progression items.",
    "game_system_tags": ["currency", "premium_like", "inner_way", "gacha", "economy"],
    "ui_usage_notes": "Use when describing where to spend Echo Jade efficiently (Resonating Melodies, Inner Ways, etc.) or when labelling Echo Jade sinks in checklists.",
    "width": 560,
    "height": 480,
    "aspect_ratio": "7:6",
  },
]
```

---

## Using this manifest with tooltips

The tooltip system in WWM Helper is built on top of this manifest:

- Each `id` in `game-assets.json` can double as a tooltip registry key.
  - Example: `id: "currency.echo_jade"` → `[appTooltip]="'currency.echo_jade'"`.
- Tooltip content should be derived from the asset:
  - `imageUrl` → `file`
  - `title` → `label`
  - `description` → short version of `description` or `ui_usage_notes`
  - `variant` → `default_tooltip_variant` (falling back to `"inlineInfo"`)

When scanning guides or templates:

- Use `aliases` as well as `label` to decide whether a phrase refers to a known asset.
- If multiple assets could match the same phrase, prefer:
  - Exact `label` match over alias match,
  - More specific `category`/`game_system_tags` for the current UI context.

Not every mention of a concept needs a tooltip; use this manifest to provide
good, consistent tooltips for **first mentions** and key UI elements, not to
blanket every occurrence.
