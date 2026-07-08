# Glance — TODO

Status as of this build. Legend: ✅ done & functional · 🟡 functional with a documented limitation · ⬜ not started.

## Core Architecture
- ✅ Electron + React + TypeScript + Vite + Tailwind + Framer Motion + Zustand + React Query scaffold
- ✅ `electron-store`-backed persistence (window bounds, last mode, last display, all settings, tasks)
- ✅ Typed `window.glance` preload bridge (context isolation on, node integration off, sandboxed)
- ✅ Modular page/card architecture — every card is an independent component, every page is a folder
- ✅ Strict TypeScript across renderer and main process, `tsc -b --noEmit` and `tsc -p electron/tsconfig.json` both pass clean
- ✅ Production build verified (`vite build` → renderer + main + preload all compile)

## Window & Display Behaviour
- ✅ Remembers last monitor, last mode, last window size/position, fullscreen state
- ✅ "Move to Second Display" button — detects all connected monitors, moves + fullscreens instantly
- ✅ Auto-return to primary display if the second monitor disconnects (`display-removed` watcher)
- ✅ Frameless window with custom auto-hiding top chrome (drag region + traffic-light-style controls)
- ✅ Single-instance lock (a second launch focuses the existing window instead of opening a duplicate)

## Dashboard Modes
- ✅ **Clock Mode** — StandBy-style huge clock, date, live weather chip
- ✅ **Minimal Clock Mode** — time, date, weather, battery only, dimmed for nighttime
- ✅ **Productivity Dashboard** — time/date, weather, upcoming events, tasks, pomodoro, goal, quote, battery, network, all as independent cards in a responsive grid
- ✅ **System Monitor** — live CPU (total + per-core), RAM, GPU, disk, thermal, network throughput, top 5 processes, polling real OS data via `systeminformation` every 2s
- 🟡 **Music Mode** — full UI (huge art, progress bar, transport controls, ambient color wash) wired to a provider abstraction. Ships with a demo provider so the page is fully interactive out of the box. Spotify Web API integration is scaffolded (`src/services/nowPlayingService.ts`) but needs a registered client ID + OAuth flow — see "Music Mode" below.
- ✅ **Photo Mode** — folder picker (native dialog), fullscreen slideshow, Ken Burns pan/zoom (alternating directions), blurred ambient background fill, clock overlay
- ✅ **Focus Mode** — large pomodoro ring, active task, today's goal, distraction counter, quote
- ✅ **Settings** — accent color, theme, font size, transparency, animations toggle, clock format, units, weather location search (live geocoding), photo folder, always-on-top, auto-fullscreen, remember-last-monitor, launch-on-startup, idle timeout, burn-in protection, auto-brightness toggle

## Navigation
- ✅ Arrow keys, mouse wheel, and touch swipe all step between modes, with a gesture-debounce so one swipe/scroll doesn't fire multiple page changes
- ✅ Animated page transitions (Framer Motion, direction-aware)
- ✅ Bottom mode-dot indicator with click-to-jump

## Ambient Features
- ✅ Idle detection via `powerMonitor.getSystemIdleTime()` — auto-switches to Clock Mode after the configured timeout, resumes the previous page on activity
- ✅ Burn-in protection — slow, subtle pixel-offset drift on static pages (clock, minimal clock), toggle in Settings
- 🟡 Auto Brightness Theme — the settings toggle and store field exist; the actual morning/afternoon/night accent-shift logic is not yet implemented. Small follow-up: an interval that reads the hour and calls `applyAccentColor` with a time-appropriate variant.

## Weather
- ✅ Live current conditions, feels-like, high/low, hourly forecast (12h) and 7-day daily forecast via Open-Meteo (no API key required)
- ✅ Location search/geocoding built into Settings

## Calendar
- 🟡 Card and data-fetching hook are complete and wired up, but return deterministic local demo events. Windows Calendar has no public JS/Node API — reading it requires either a native N-API addon around the WinRT `AppointmentStore`, or signing in via Microsoft Graph. Google Calendar is a standard OAuth2 + REST integration and is the more practical first target. See `src/services/calendarService.ts` for the swap-in point.

## Tasks
- ✅ Local tasks: add, complete, delete, persisted via electron-store
- ⬜ Chrono API integration (mentioned as "future support" in the brief) — no public "Chrono API" for tasks was identifiable at spec time; needs the specific service confirmed before building the integration.

## Music Mode — Spotify OAuth (next step)
To finish real Spotify support:
1. Register an app at https://developer.spotify.com/dashboard, add `glance://callback` (or a loopback URL) as a redirect URI.
2. Implement Authorization Code + PKCE in a new `electron/ipc/spotify.ts`, opening the auth URL in the system browser and catching the redirect via a custom protocol (`app.setAsDefaultProtocolClient('glance')`).
3. Store the refresh token in `electron-store` (or better, `keytar`/OS keychain) and exchange it for access tokens on demand.
4. Flip `SpotifyProvider` in `src/services/nowPlayingService.ts` from stubbed to live — the `getSnapshot`/`play`/`pause`/`next`/`previous`/`seek` methods already call the right endpoints; only token wiring is missing.
5. Windows Media Session (system-wide "now playing", not just Spotify) is a separate, larger effort: it requires a native addon bridging `GlobalSystemMediaTransportControlsSessionManager` (WinRT), since there's no Node binding for it today.

## Packaging
- ✅ `electron-builder` config present in `package.json` (`npm run package`)
- ⬜ Real app icon (`src/assets/icon.ico`) — currently unset; drop in a 256×256 `.ico` before packaging a release build
- ⬜ Code signing — not configured; unsigned builds will show a Windows SmartScreen warning

## Known Follow-ups
- Weather, calendar, and tasks each degrade gracefully with empty/placeholder states when unconfigured — verified in Settings and each card.
- No automated test suite yet. Given the visual/animation-heavy nature of the app, Playwright screenshot tests would be the highest-leverage addition.
