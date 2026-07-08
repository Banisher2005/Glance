import { app, BrowserWindow, powerMonitor } from 'electron';
import { createMainWindow, getMainWindow } from './windowManager.js';
import { registerWindowIpc } from './ipc/window.js';
import { registerSystemIpc } from './ipc/system.js';
import { registerPhotoIpc } from './ipc/photos.js';
import { glanceStore } from './store.js';

// Single instance lock — Glance is a fullscreen dashboard, a second copy makes no sense.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    registerWindowIpc();
    registerSystemIpc();
    registerPhotoIpc();
    createMainWindow();

    app.setLoginItemSettings({ openAtLogin: glanceStore.get('settings.launchOnStartup') });

    // Idle detection: broadcast idle state to the renderer, which owns the
    // "switch to Clock Mode and resume previous page" behaviour.
    let wasIdle = false;
    setInterval(() => {
      const win = getMainWindow();
      if (!win || win.isDestroyed()) return;
      const idleSeconds = powerMonitor.getSystemIdleTime();
      const thresholdSeconds = glanceStore.get('settings').idleTimeoutMinutes * 60;
      const isIdle = idleSeconds >= thresholdSeconds;
      if (isIdle !== wasIdle) {
        wasIdle = isIdle;
        win.webContents.send('system:idleChanged', isIdle);
      }
    }, 5000);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
