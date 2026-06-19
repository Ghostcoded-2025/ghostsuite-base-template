# Styling

**Scope**: Theme, layout widths, and **canonical Tailwind class strings** for repeated UI roles. **`main.css`**, Vue templates, PWA view wiring: **`docs/frontend-conventions.md`**.

## Tooling

| Item | Notes |
| --- | --- |
| `tailwind.config.js` | Content globs; **Manrope** as `font-sans`; **`gc.*`** tokens map to **CSS variables** in `main.css` (dark/light); **`brand.*`**, extended **`gray.*`** (`cloud` … `phantom`) |
| `src/assets/main.css` | `@tailwind` base/components/utilities; **`theme-dark`** / **`theme-light`** on `<html>` set **`--gc-*`** RGB channels; **focus-visible** ring uses **`ring-gc-accent`** + theme offset; **`html`** is **`100dvh`** with **`overflow: hidden`**; **`body`** is fixed to the dynamic viewport, **`overflow-x: clip`**, no document scroll; **`#app`** is a flex column filling the height; horizontal padding on **`body`** is **`max(0.75rem, env(safe-area-inset-*))`** so standalone PWA keeps a minimum side gutter when side insets are zero |
| `src/lib/theme.ts` | **`applyTheme`**, **`getStoredTheme`** — persists **`gc-theme`** (`dark` \| `light`); updates **`theme-color`** meta |
| `src/stores/theme.ts` | Pinia store; **`ThemeToggle`** in app sidebar, marketing nav, and bare auth pages |

**Reuse** existing views, shared components, or recipes below before new stacks. Extract a **Vue component** when the same pattern appears **≥3** times.

## Shell and tone

- **Theme**: Default **dark** Ghostcoded shell. **Light** mode toggles **`theme-light`** on `<html>` (preference in **`localStorage`** key **`gc-theme`**; inline script in **`index.html`** applies before paint). All **`gc-*`** utilities follow CSS variables — no per-view palette forks.
- **Authenticated app**: **`bg-gc-bg`**, `text-gc-text`, secondary `text-gc-muted`, borders `border-gc-border`, elevated surfaces `bg-gc-surface`. Accent **`gc.accent`** (aqua/teal) for primary actions, active nav, and focus rings. Primary buttons use **`text-gc-on-accent`** (not `text-gc-bg`).
- **Layout**: [`AppShellLayout`](src/components/AppShellLayout.vue) — fixed **`w-56`** sidebar on `lg+`, mobile **top bar** + slide-in drawer. **Safe area**: drawer uses **`pt-[env(safe-area-inset-top)]`**; the bar uses **`pt-[env(safe-area-inset-top,0px)]`** plus **`min-h-[calc(3.5rem+env(safe-area-inset-top,0px))]`**; **`pb-[env(safe-area-inset-bottom)]`** on **`<main>`**. **Scroll** lives in **`<main>`** only (`overflow-y-auto`, `overflow-x-hidden`, `overscroll-y-contain`, `touch-pan-y`). Page content uses **`max-w-3xl`** inside views; marketing uses **`max-w-6xl`**.
- **Marketing / auth** (logged out): Same dark header bar or full-bleed hero; no app sidebar until signed in.
- **`index.html`**: Inline theme bootstrap; **`theme-color`** **`#0a0a0b`** (dark) or **`#fafafa`** (light) via **`applyTheme`**; viewport includes **`viewport-fit=cover`**; **`apple-mobile-web-app-status-bar-style`** + **`apple-mobile-web-app-title`** for iOS home-screen chrome.

**Palettes**: Prefer **`gc-*`** utilities for product UI. Legacy **`gray-*`** remains valid for one-off contrast; migrate touchpoints to `gc` when editing a file.

## Shared components

| Component | Role |
| --- | --- |
| `src/components/ui/GcCard.vue` | Bordered surface + optional title |
| `src/components/ui/GcPageHero.vue` | Page title band: gradient panel, optional `eyebrow` / slots `actions` / `toolbar` |
| `src/components/ui/GcButton.vue` | `primary` / `secondary` / `danger` / `ghost` |
| `src/components/ui/GcPasswordField.vue` | Password input with show/hide toggle |
| `src/components/AppLogo.vue` | Placeholder logo — replace in your fork |

## Layout widths

| Context | Pattern |
| --- | --- |
| Auth | `max-w-sm`, centered `min-h-dvh`, `px-4 py-12`, `space-y-6` between major blocks |
| Main app content | `mx-auto min-w-0 w-full max-w-3xl px-4 py-8 sm:py-10` inside shell main |
| Long-form (e.g. install) | `max-w-3xl`, `min-h-dvh`, bottom **`safe-area`** padding, `space-y-6`/`space-y-8` between cards; **`gc-*`** surfaces |

## Recipes

**Primary CTA — accent**  
`inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gc-accent bg-gc-accent px-4 py-2 text-sm font-medium text-gc-on-accent hover:bg-gc-accent/90 disabled:opacity-50`

Or use **`GcButton`** `variant="primary"`.

**Secondary / outline**  
`border border-gc-border bg-gc-surface-hover text-gc-text` — or **`GcButton`** `variant="secondary"`.

**Ghost / subtle**  
`text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text`

**Form label**  
`block text-sm text-gc-muted` (optional `font-medium`)

**Text input (dark)**  
`mt-1 block w-full rounded-lg border border-gc-border bg-gc-bg px-3 py-2 text-sm text-gc-text placeholder:text-gc-muted`

**Select (dark)**  
`rounded-lg border border-gc-border bg-gc-bg px-3 py-2 text-sm text-gc-text`

**Inline link**  
`text-gc-accent hover:underline`

**Card**  
Use **`GcCard`** or `rounded-xl border border-gc-border bg-gc-surface p-4 shadow-sm`

| Feedback | Classes |
| --- | --- |
| Error | `text-sm text-red-400` |
| Success | `rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200` |
| Warning | `rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100` |

**Modal — backdrop**  
`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4`

**Modal — panel**  
`max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-gc-border bg-gc-surface p-6 shadow-lg`

**Modal — title**  
`text-base font-medium text-gc-text`

**Modal — footer**  
`mt-6 flex justify-end gap-2`

**Modal — cancel**  
`rounded-lg border border-gc-border px-3 py-1.5 text-sm text-gc-text hover:bg-gc-surface-hover`

**Modal — primary**  
Prefer **`GcButton`** `primary` or `rounded-lg bg-gc-accent px-3 py-1.5 text-sm font-medium text-gc-on-accent hover:bg-gc-accent/90`

**Font Awesome solid** (beside `text-sm`)  
`h-4 w-4`, `text-gc-muted`

**Loading**  
Full page: `min-h-screen flex items-center justify-center bg-gc-bg` + `text-sm text-gc-muted`

New repeated role → add a **recipe line** (or **one** linked component). Change **`tailwind.config.js`** or **canonical strings** here → update **this file** in the **same change**.
