# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt 4 (Vue 3) SSR dashboard of new Web Platform features and their browser adoption (Baseline status). Server fetches data from GitHub releases (`web-features`, `mdn/browser-compat-data`), validates and enriches it, caches it; the client does all filtering/sorting/search in the browser. Deployed at https://web-features.lttr.cz.

## Commands

```bash
pnpm dev          # Dev server, http://localhost:3000
pnpm build        # Production build
pnpm generate     # Static generation
pnpm preview      # Preview production build
pnpm start        # Run built server (node .output/server/index.mjs)

pnpm verify       # format + lint:fix + typecheck + test — run before commits
pnpm typecheck    # nuxi typecheck
pnpm lint:fix     # eslint --fix
pnpm format       # prettier
```

There is **no real test suite** — `pnpm test` is `exit 0`. "Verifying" means typecheck + lint pass and the page renders.

Node 22.x, pnpm 9 (corepack). Prefer `vp`/`vpx` per the user's global tooling prefs, falling back to `pnpm` where vp lacks a Nuxt equivalent.

## Architecture

**Stack:** Nuxt 4, Vue 3 `<script setup>`, TypeScript, Nuxt UI v4 + nuxt-headlessui (prefix `H`), TailwindCSS, Fuse.js (search), Zod v4 (validation), VueUse. No state-management library — composables + refs only.

### Data flow

1. `server/api/features.ts` is the single endpoint. It fetches the two source packages **in parallel** via cached functions, then enriches each feature in place.
2. `server/utils/web-features-package.ts` — resolves the latest `web-features` GitHub release, downloads `data.json`, validates with the Zod schema in `app/utils/web-features-input.ts`. Wrapped in `defineCachedFunction`.
3. `server/utils/browser-compat-data.ts` — fetches the latest BCD release but **only extracts a flat `dot-path → mdn_url` map** (`extractMdnUrls`). This is deliberate: caching the full ~80MB+ BCD object caused OOM (see commit `6ba5c84`).
4. `server/utils/interop-2025-mapping.ts` — static map of Interop 2025 focus areas → web-features IDs; used to set `feature.isInterop2025`.
5. `app/pages/index.vue` calls `useFetch("/api/features")` once. All filtering, sorting, search, and counts are `computed`/`shallowRef` on the client — no re-fetching.
6. Filter state (`view`, `sort`, `search`, `group`) is initialized from URL query params and reflected back to the URL.

### Caching

- API data: `defineCachedFunction` server-side.
- Page: `$production` route rule `"/": { swr: 60 * 60 }` — stale-while-revalidate, 1 hour. Configured in `nuxt.config.ts`.

### Types & validation

- **Input** (`app/utils/web-features-input.ts`): Zod schema for the raw upstream `data.json`. The upstream shape drifts — schema changes here are the usual cause of "feature failed validation". Some tombstone/moved features are intentionally skipped before validation (commit `dce8ec9`).
- **Output** (`app/utils/web-features-output.ts`): the shapes the client consumes — `WebFeaturesPackage`, `EnhancedCompatFeature`, the `ENGINES`/browser-grouping config, and types re-exported from the `web-features` npm package.
- `app/utils/types.ts` — the `WebFeature` type used throughout, including the added fields (`isInterop2025`, `compatFeaturesEnhanced`).
- Date strings from upstream may contain `≤`; `sanitizeDate` in `features.ts` strips it (upstream PR #1398).

### Sorting & search

- `app/utils/sorting.ts` — named sorting functions (`sortingFunctions` keyed by `SortingFunctionsName`); default `sortByDateDescFutureLast`. Year separators render only when sorted by date and not searching.
- Fuse.js config lives inline in `index.vue` (keys: name ×5, description, compat_features; `useExtendedSearch`, threshold 0.4).

### Layout & components

- `app/app.vue` + `app/layouts/default.vue` — shell.
- `app/components/` — `FeaturesFilter` (header controls, `v-model`-bound to the page's filter refs), `FeaturesList` (the list/virtual rendering), `BaselineIndicator`, `CompatModal`, `LogoBrowsers`, `HeaderDescription`.
- `app/assets/baseline/` — SVGs for Baseline (high/low/limited, with `-dark` variants) and browser logos.

## Conventions

- `<script setup>` + Composition API only; rely on Nuxt **auto-imports** for components, composables, and everything under `app/utils/`.
- ESLint config is `@lttr/nuxt-config-eslint` composed over Nuxt's flat config; Prettier for formatting (no semicolons, double quotes — see `.prettierrc`).
- `tsconfig.json` uses Nuxt v4 project references (`.nuxt/tsconfig.*.json`); don't add `compilerOptions` here.
- `@total-typescript/ts-reset` is active (`reset.d.ts`) — `.filter(Boolean)`, `JSON.parse`, etc. are stricter-typed.

## Deployment

Nixpacks (`nixpacks.toml`): installs corepack + `pnpm install --frozen-lockfile`, starts `node .output/server/index.mjs`. The `@oxc-*/binding-linux-x64-gnu` packages are pinned as regular (not optional) deps so the Linux build resolves them.
