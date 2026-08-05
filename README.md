# Divine Increase Business Network

A private Kingdom business community for members of **Spiritus Sanctus Ignis
Ministry** — showcase your business, discover trusted members, connect
professionally, and receive ministry support.

> "Reconciling the world and bringing His people back home."

This repository is the **project foundation only**: no backend, no database,
no auth. It's a modular HTML/CSS/vanilla-JS PWA shell built so future
features can be added section by section without restructuring.

---

## Folder structure

```
divine-increase-network/
├── index.html                # Foundation page: nav, hero, directory preview, showcase, footer
├── manifest.json             # PWA manifest (installable app metadata)
├── service-worker.js         # App-shell caching (offline-ready static assets)
│
├── css/
│   ├── main.css              # Entry point — imports every file below, in order
│   ├── base/
│   │   ├── variables.css     # Color system, type scale, spacing, radius, shadow, motion tokens
│   │   ├── reset.css         # Minimal modern reset
│   │   └── typography.css    # Heading/body styles, eyebrow labels, gradient text
│   ├── layout/
│   │   └── layout.css        # Container, section spacing, grid/stack/row utilities
│   └── components/
│       ├── glass.css         # .glass / .glass-strong surfaces + aurora glow
│       ├── nav.css           # Responsive nav bar + mobile drawer
│       ├── buttons.css       # .btn-primary / secondary / outline / ghost
│       ├── cards.css         # .card, .card-business, .card-stat, .card-grid
│       └── footer.css        # Site footer
│
├── js/
│   ├── main.js                # Entry point — wires up components, registers service worker
│   └── components/
│       ├── nav.js             # Mobile drawer open/close, scroll state, active-link handling
│       └── cards.js           # renderBusinessCard() — build directory cards from data
│
└── assets/
    ├── icons/                 # PWA icons (192, 512, maskable, favicon, apple-touch-icon)
    └── images/                # Reserved for future content images
```

## Design system

| Token group | Where | Notes |
|---|---|---|
| Color | `css/base/variables.css` | Deep navy base (`--color-ink-900`) with a restrained gold accent (`--color-gold-500`) standing for "Divine Increase." Gold is used for accents/borders/focus, never as a large fill, so it keeps meaning. |
| Type | `css/base/variables.css` + `typography.css` | **Fraunces** (display, headings only), **Inter** (body/UI), **JetBrains Mono** (eyebrows, labels, data). Loaded via Google Fonts in `index.html`. |
| Spacing | `--space-1` … `--space-10` | 8px-based scale. |
| Radius | `--radius-sm` … `--radius-full` | |
| Glass | `components/glass.css` | `.glass` / `.glass-strong` — frosted surfaces with a top-edge light highlight and hairline gold-tinted border. |

The signature visual motif is the **"increase" gold glow**: an ambient aurora
behind the hero (`.aurora`), and a matching thin gold top-border on every
`.card` that brightens on hover. Reuse it sparingly — it's meant to read as
a signature, not a background pattern.

## Components

- **Buttons** — `.btn` + modifier: `.btn-primary` (gold, primary action),
  `.btn-secondary` (glass), `.btn-outline`, `.btn-ghost`. Sizes: default,
  `.btn-sm`, `.btn-lg`.
- **Cards** — `.card.glass` base, plus `.card-business` (directory listing),
  `.card-stat` (numeric highlight). Lay out with `.card-grid` or
  `.card-grid-tight`.
- **Navigation** — `.site-nav` is a fixed glass bar; below 900px it collapses
  to a hamburger (`[data-nav-toggle]`) that opens `.nav-drawer`. State lives
  as `data-nav-open="true|false"` on `<body>`, driven by `js/components/nav.js`.
- **Footer** — `.site-footer` with brand block, link columns, social icons,
  and legal row. Responsive from a single column to a 3-column layout.

## Adding a new section

1. If it needs new component styles, add a file under `css/components/` and
   `@import` it from `css/main.css` (base → layout → components order).
2. If it needs behavior, add a module under `js/components/` and import it
   from `js/main.js`.
3. Reuse existing tokens (`var(--color-*)`, `var(--space-*)`, etc.) instead of
   hard-coding values — that's what keeps the system consistent as it grows.
4. If the section adds a new route/page, add its static assets to
   `SHELL_ASSETS` in `service-worker.js` so it's available offline.

## PWA notes

- `manifest.json` defines the installable app (name, icons, standalone
  display, theme color).
- `service-worker.js` uses cache-first for the app shell and network-first
  (with cache fallback) for everything else. No API/backend calls are cached
  yet since there is no backend.
- Icons were generated at 192px, 512px, and a 512px maskable variant, plus a
  favicon and Apple touch icon, all under `assets/icons/`.

## Explicitly out of scope (by request)

- No backend, API, or database of any kind.
- No authentication.
- No real member data — the directory section renders three sample cards via
  `js/components/cards.js` purely to demonstrate the component; replace with
  real data once a data layer exists.
