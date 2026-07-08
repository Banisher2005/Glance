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

  const bounds = saved.bounds ?? {
    x: primary.bounds.x + 80,
    y: primary.bounds.y + 80,
    width: 1280,
    height: 800,
  };

  mainWindow = new BrowserWindow({
    ...bounds,
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

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (saved.isFullscreen && glanceStore.get('settings.autoFullscreen')) {
      mainWindow?.setFullScreen(true);
    }
  });

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
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return mainWindow;
}
