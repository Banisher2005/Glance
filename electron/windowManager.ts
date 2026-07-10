import { BrowserWindow, screen } from 'electron';
import path from 'node:path';
import { glanceStore } from './store.js';
import { watchDisplays } from './displayManager.js';

const isDev = !!process.env.VITE_DEV_SERVER_URL;

let mainWindow: BrowserWindow | null = null;
let stopWatchingDisplays: (() => void) | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function createMainWindow(): BrowserWindow {
  const saved = glanceStore.get('window');
  const primary = screen.getPrimaryDisplay();

  // Validate persisted bounds — if they're off-screen, fall back to primary display.
  let bounds = saved.bounds;
  if (bounds) {
    const onAnyScreen = screen
      .getAllDisplays()
      .some((d) => {
        const db = d.bounds;
        return (
          bounds!.x < db.x + db.width &&
          bounds!.x + bounds!.width > db.x &&
          bounds!.y < db.y + db.height &&
          bounds!.y + bounds!.height > db.y
        );
      });
    if (!onAnyScreen) {
      console.warn('[Glance] Persisted bounds are off-screen, resetting to primary display.');
      bounds = null;
    }
  }

  const finalBounds = bounds ?? {
    x: primary.bounds.x + 80,
    y: primary.bounds.y + 80,
    width: 1280,
    height: 800,
  };

  mainWindow = new BrowserWindow({
    ...finalBounds,
    minWidth: 480,
    minHeight: 320,
    backgroundColor: '#0A0A0C',
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    alwaysOnTop: glanceStore.get('settings.alwaysOnTop'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // ─── Production diagnostics on webContents ───────────────────────────
  mainWindow.webContents.on('did-fail-load', (_e, errorCode, errorDescription, validatedURL) => {
    console.error(`[Glance] did-fail-load: ${errorCode} ${errorDescription} URL=${validatedURL}`);
  });

  mainWindow.webContents.on('render-process-gone', (_e, details) => {
    console.error('[Glance] render-process-gone:', details);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Glance] Renderer did-finish-load');
  });

  mainWindow.webContents.on('preload-error', (_e, preloadPath, error) => {
    console.error(`[Glance] preload-error: path=${preloadPath}`, error);
  });

  mainWindow.webContents.on('console-message', (_e, level, message, line, sourceId) => {
    if (level >= 2) { // warnings and errors
      console.warn(`[Renderer L${level}] ${message} (${sourceId}:${line})`);
    }
  });

  // ─── Window show logic ───────────────────────────────────────────────
  mainWindow.once('ready-to-show', () => {
    console.log('[Glance] ready-to-show fired');
    mainWindow?.show();
    if (saved.isFullscreen && glanceStore.get('settings.autoFullscreen')) {
      mainWindow?.setFullScreen(true);
    }
  });

  // Safety net: if ready-to-show hasn't fired within 8 seconds, force-show
  // the window so the user isn't left staring at nothing.
  const safetyTimer = setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      console.warn('[Glance] ready-to-show did not fire within 8s — force-showing window');
      mainWindow.show();
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    }
  }, 8000);

  mainWindow.once('ready-to-show', () => clearTimeout(safetyTimer));

  // Persist bounds + fullscreen state as the user moves/resizes the window,
  // so "remembers last window size" survives restarts.
  const persistBounds = () => {
    if (!mainWindow || mainWindow.isDestroyed() || mainWindow.isFullScreen()) return;
    glanceStore.set('window.bounds', mainWindow.getBounds());
  };
  mainWindow.on('resize', persistBounds);
  mainWindow.on('move', persistBounds);
  mainWindow.on('enter-full-screen', () => glanceStore.set('window.isFullscreen', true));
  mainWindow.on('leave-full-screen', () => glanceStore.set('window.isFullscreen', false));

  mainWindow.on('closed', () => {
    stopWatchingDisplays?.();
    mainWindow = null;
  });

  stopWatchingDisplays = watchDisplays(mainWindow);

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('[Glance] Loading file:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  return mainWindow;
}
