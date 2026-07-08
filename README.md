# Glance

A premium ambient dashboard for a second display — built for Windows, inspired by Apple's StandBy mode, designed for power users running a spare monitor (or an Android tablet via SpaceDesk) next to their main screen.

## Stack

Electron · React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · React Query · Recharts · Lucide · `systeminformation` · `electron-store`

## Getting started

```bash
npm install
npm run dev:electron   # Vite dev server + Electron, with hot reload
```

Other scripts:

```bash
npm run build           # typecheck + build the renderer
npm run build:electron  # compile the main/preload process
npm run package         # full production build + electron-builder installer
npm run typecheck       # tsc --noEmit across the renderer
npm run lint             # eslint
```

## Project layout

```
electron/          Main process: window/display management, IPC, persisted store
  ipc/              One file per IPC surface (system stats, photos, window control)
src/
  components/
    ui/             Design-system primitives (GlassCard, ProgressRing, controls…)
    layout/         App chrome: window bar, mode dots, page transitions
    cards/          Individual dashboard widgets, each fully self-contained
  pages/            One folder per fullscreen mode
  hooks/            Data fetching + behaviour hooks (clock, idle, nav gestures…)
  services/         External integrations (weather, quotes, calendar, now-playing)
  stores/           Zustand state: settings, navigation, tasks, pomodoro
  types/            Shared TypeScript types + the preload bridge's ambient types
```

Adding a new fullscreen mode is three steps: create a folder under `src/pages`, add its id to `MODES` in `src/stores/navigationStore.ts`, and register the component in the `PAGES` map in `src/App.tsx`.

## Design system

Dark-first, near-monochrome, glassmorphic surfaces (`glass-card` / `glass-panel` utility classes), an 8px spacing rhythm, and a single configurable accent color driven by CSS variables (`--accent`, `--accent-soft`) so every gradient, ring, and highlight updates live from Settings.

## Status

See [TODO.md](./TODO.md) for exactly what's fully wired up versus what's stubbed with a documented next step (Spotify OAuth, Windows/Google Calendar, app icon, etc). Every mode in the brief renders and is interactive today; a few external integrations that need real API credentials ship with clearly-labeled demo data so nothing in the UI is ever blank.

=======
# Glance-
A premium "StandBy mode for Windows second screens"
