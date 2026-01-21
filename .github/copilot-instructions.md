## Quick guide for AI coding agents
## Quick guide for AI coding agents

Purpose: Help an AI contributor become productive in this Next.js + TypeScript app.

Big picture
- App Router Next.js site: all pages live under `app/` (e.g. `app/add`, `app/sub`, `app/mul`, `app/calculator`).
- UI is client-heavy: most components live in `app/components/` and are small, self-contained React client components.
- Styling is mostly inline React style objects; a small global stylesheet lives at `app/globals.css`/`globals.scss`.
- Fonts loaded via `next/font` in `app/layout.tsx`; note `export const dynamic = "force-static"` to force static generation.

Build & developer workflows
- Dev: `npm run dev` (next dev). Build: `npm run build` && `npm run start`. Lint: `npm run lint`.
- TypeScript: `strict: true` in `tsconfig.json`. Path alias `@/*` → `./*` is used; keep strict typing.

Project-specific patterns (concrete, observable)
- Client components must include `"use client"` when using state or browser APIs (search `app/components/*`).
- Inline styles are the norm — preserve this style unless intentionally centralizing styles.
- Grid sizing: `app/components/Tabel.tsx` computes cell size to fit a 980px content width; keep logic when changing tables.
- Keyboard listeners: patterns exist in `Calculator.tsx` and `TestFulger.tsx`: keep handlers stable by storing callbacks in refs and attaching a single `window` `keydown` listener.
- Test flow: `TestFulger.tsx` generates a deterministic 5-question flow (start → answer → results). Avoid changing UX flow unless requested.

Integration points & constraints
- No server APIs or DBs in the repo — all logic runs client-side. Add server routes only under `app/api` and document deployment implications.
- Minimal external deps; check `package.json` before adding new packages.

Files to inspect for patterns and examples
- `app/layout.tsx` — fonts, `dynamic = "force-static"`, global styles.
- `app/components/Calculator.tsx` — input normalization, keyboard handling, evaluation safety.
- `app/components/Tabel.tsx` — grid sizing and TestFulger modal usage.
- `app/components/TestFulger.tsx` — question-generation logic, keyboard-only input (AnswerPad), timer, result rendering.

Suggested prompts for the AI
- "Extract calculator normalization into a pure function and add unit tests for it (see `app/components/Calculator.tsx`)."
- "Refactor Tabel's `Grid` rendering into a helper while preserving the 980px sizing and header highlight behavior (see `app/components/Tabel.tsx`)."
- "Improve test determinism in `TestFulger.tsx` by extracting question-generation into a pure function and unit-testing edge cases."

If anything here is unclear or you'd like more detailed examples/diffs, tell me which file or area to expand and I will iterate.
- "Add unit tests for the calculator normalization logic — show how to extract the normalization into a pure function and test it."
