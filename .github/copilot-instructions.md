## Quick guide for AI coding agents

**Purpose:** Help an AI contributor become productive in this Next.js + TypeScript app quickly.

**Big picture**:
- This is a Next.js (App Router) site (see `package.json` scripts). Pages live in the `app/` folder.
- Shared UI lives in `app/components/` (e.g. `Table.tsx`, `QuickTest.tsx`, `Calculator.tsx`). Small, self-contained React components with inline styles and client-side state are the norm.
- Routing is file-system based: `app/add`, `app/sub`, `app/mul`, `app/calculator` map to user-facing routes.
- Fonts are loaded via `next/font` in `app/layout.tsx` and global CSS in `app/globals.css`.

**Build / dev workflows**:
- Development: `npm run dev` (runs `next dev`).
- Build: `npm run build` then `npm run start` for production. Lint: `npm run lint`.
- This repo targets Next 16 / React 19 (check `package.json`) — assume App Router conventions.

**Project-specific patterns & conventions**:
- Client components explicitly use `"use client"` at top of the file; add it when using browser-only APIs or state.
- Components prefer inline style objects over CSS modules or Tailwind in most places — preserve this when editing UI unless intentionally migrating.
- `Table.tsx` computes a dynamic cell size to avoid horizontal scroll by targeting a content width of 980px — keep that sizing logic when changing table layout.
- Keyboard handlers (e.g. `Calculator.tsx`) use refs to store functions and attach a single `keydown` listener on `window`. When refactoring, preserve the ref pattern to avoid stale closures.
- Quick tests and random generators are implemented in `QuickTest.tsx` — they create deterministic UX (5 questions, start/reset flow). Keep the UX flow (start -> answer -> results) intact.

**TypeScript & tooling**:
- `tsconfig.json` uses `strict: true` and path alias `@/*` -> `./*`. Follow existing typing style and avoid disabling `strict`.
- ESLint is configured with `eslint-config-next`; use `npm run lint` to check changes.

**Integration points & assumptions**:
- No server API routes or database connections are present; all logic runs in the browser (client components). Changes that add server-side behavior should add clear new files under `app/api` or `src` and mention deployment implications.
- Styling is mostly inline; if you add global styles, update `app/globals.css`.

**Where to look for examples**:
- Homepage / routing: `app/page.tsx`
- Shared components: `app/components/Table.tsx`, `app/components/QuickTest.tsx`, `app/components/Calculator.tsx`
- Fonts & layout: `app/layout.tsx`
- Scripts & deps: `package.json`

**Good prompts / tasks for the AI**:
- "Refactor `Table.tsx` to extract `Grid` into a small helper while preserving the 980px sizing behaviour and the header highlight interaction."
- "Add unit tests for the calculator normalization logic — show how to extract the normalization into a pure function and test it."
- "Convert the inline styles in `app/page.tsx` to a small shared style object while preserving visual output." 

If any part of this file is unclear or you'd like more detail (example diffs, specific refactors, tests), tell me which area to expand and I'll iterate.
