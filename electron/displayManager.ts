import { screen, BrowserWindow, type Display } from 'electron';
import { glanceStore } from './store.js';

export interface DisplaySummary {
  id: number;
  label: string;
  bounds: Electron.Rectangle;
  isPrimary: boolean;
  isInternal: boolean;
}

/** Returns every display currently connected, in a serializable shape for the renderer. */
export function listDisplays(): DisplaySummary[] {
  const primary = screen.getPrimaryDisplay();
  return screen.getAllDisplays().map((d: Display, i: number) => ({
    id: d.id,
    label: d.id === primary.id ? 'Main Display' : `Display ${i + 1}`,
    bounds: d.bounds,
    isPrimary: d.id === primary.id,
    isInternal: d.internal ?? false,
  }));
}

/** Moves the given window fully onto the target display and (optionally) fullscreens it. */
export function moveWindowToDisplay(win: BrowserWindow, displayId: number, fullscreen = true): void {
  const target = screen.getAllDisplays().find((d) => d.id === displayId);
  if (!target) return;

  // Leaving fullscreen before repositioning avoids OS-level snapping glitches on Windows.
  if (win.isFullScreen()) win.setFullScreen(false);

  const { x, y, width, height } = target.bounds;
  win.setBounds({ x: x + 40, y: y + 40, width: Math.min(1280, width - 80), height: Math.min(800, height - 80) });

  if (fullscreen) {
    // setFullScreen needs the window to already be positioned on the target display.
    setImmediate(() => win.setFullScreen(true));
  }

  glanceStore.set('window.lastDisplayId', displayId);
}

/**
 * Watches for display topology changes. If the display the window currently lives on
 * disappears (e.g. tablet running SpaceDesk disconnects), the window is returned to
 * the primary display automatically, per spec.
 */
export function watchDisplays(win: BrowserWindow): () => void {
  const handleChange = () => {
    if (win.isDestroyed()) return;
    const currentBounds = win.getBounds();
    const stillConnected = screen
      .getAllDisplays()
      .some((d) => rectanglesIntersect(d.bounds, currentBounds));

    if (!stillConnected) {
      const primary = screen.getPrimaryDisplay();
      moveWindowToDisplay(win, primary.id, false);
    }
  };

  screen.on('display-removed', handleChange);
  screen.on('display-added', handleChange);
  screen.on('display-metrics-changed', handleChange);

  return () => {
    screen.removeListener('display-removed', handleChange);
    screen.removeListener('display-added', handleChange);
    screen.removeListener('display-metrics-changed', handleChange);
  };
}

function rectanglesIntersect(a: Electron.Rectangle, b: Electron.Rectangle): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
