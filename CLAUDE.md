# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt 4 (Vue 3) SSR application displaying Web Platform features with browser adoption status. Fetches data from GitHub (web-features, browser-compat-data), caches server-side, filters/searches client-side.

## Commands

```bash
# Development
pnpm dev              # Dev server (default: http://localhost:3000)

# Build
pnpm build           # Production build
pnpm generate        # Static site generation
pnpm preview         # Preview production build
pnpm start           # Run production server

# Quality
pnpm verify          # Format + lint + typecheck + test (run before commits)
pnpm typecheck       # TypeScript check
pnpm lint:fix        # ESLint auto-fix
pnpm format          # Prettier
```

## Architecture

**Tech Stack:** Nuxt 4, Vue 3 Composition API, TypeScript, Nuxt UI, TailwindCSS, Fuse.js (search), Zod (validation)

**Directory Structure:**

- `/app` - Nuxt 4 app directory
  - `pages/` - File-based routing
  - `components/` - Auto-imported Vue components
  - `composables/` - Auto-imported composables
  - `utils/` - Auto-imported utilities
  - `assets/` - Images, SVGs, CSS
- `/server` - Server routes and utilities
  - `api/` - API endpoints (e.g., `/api/features`)
  - `utils/` - Server-only utilities

**Data Flow:**

1. Server API (`/server/api/features.get.ts`) fetches from GitHub releases
2. Server validates with Zod schemas, enriches data, caches (24h max-age, 1h stale)
3. Client fetches once on mount, stores in `shallowRef`
4. Client-side filtering/sorting/search (no re-fetching)
5. URL query params sync filter state using VueUse `useRouteQuery`

**Key Patterns:**

- **Composition API only** - all components use `<script setup>`
- **Auto-imports** - components, composables, utils imported automatically by Nuxt
- **Type safety** - Zod schemas generate TypeScript types
- **No state management library** - uses composables and refs
- **URL as state** - filter/search state persisted in query params
- **Virtual scrolling** - custom implementation for large feature lists
- **Performance** - `shallowRef` for large arrays, debounced search (200ms), CSS content-visibility

**Component Architecture:**

- Feature cards display status, baseline, browser compat
- Modals for detailed browser/spec data
- Filters and search in header
- Uses Nuxt UI components (UButton, UIcon, UModal, etc.)

**Server Caching:**

- Production: 1-hour stale-while-revalidate
- Fetches GitHub release assets, validates with Zod
- Type-safe with inferred types from Zod schemas

**Styling:**

- TailwindCSS with dark mode support
- Custom CSS variables for theming
- Scoped styles in components
- SVG assets for baseline indicators and browser logos

## Important Files

- `app/app.vue` - Root layout
- `app/pages/index.vue` - Main page with feature list
- `server/api/features.get.ts` - Main data fetching endpoint
- `app/composables/useFeatures.ts` - Client-side data management
- `app/utils/sorting.ts` - Sorting logic for feature list
- `nuxt.config.ts` - Nuxt configuration
