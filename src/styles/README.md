# WWM Helper – Styles / Design System

This folder contains the global design system for the WWM Helper app.

It is split into **tokens**, **base**, **components**, and **utilities**.  
Component-level SCSS files in `src/app/**` should _consume_ these pieces, not re-invent them.

> Core rule: **no hard-coded colors or font sizes in shared styles**.  
> All theme values live in `tokens/*.scss`. :contentReference[oaicite:2]{index=2}

---

## 1. Folder structure

```text
src/styles.scss               # Global entrypoint (wired in angular.json or styles array)

src/styles/
  base/
    _globals.scss             # html/body, base typography, links
    _reset.scss               # box-sizing reset

  components/
    _buttons.scss             # .btn-primary, .btn-secondary (global CTAs)
    _card.scss                # .card-surface, .card-padding
    _chip.scss                # .chip pills used in timer strip, timers, etc.
    _page.scss                # .page-shell / .page-section helpers

  tokens/
    _colors.scss              # all color tokens + CSS vars
    _elevation.scss           # shadows
    _radius.scss              # border-radius tokens
    _spacing.scss             # spacing scale + outer padding
    _typography.scss          # font stack, font sizes, heading helpers

  utilities/
    _layout.scss              # .u-flex, .u-stack, gap helpers
    _text.scss                # .text-muted, size utilities
    _visibility.scss          # .u-visually-hidden
```
