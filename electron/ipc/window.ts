import { ipcMain, app } from 'electron';
import { getMainWindow } from '../windowManager.js';
import { listDisplays, moveWindowToDisplay } from '../displayManager.js';
import { glanceStore, type GlanceStoreSchema } from '../store.js';

export function registerWindowIpc(): void {
  ipcMain.handle('window:listDisplays', () => listDisplays());

  ipcMain.handle('window:moveToDisplay', (_e, displayId: number, fullscreen: boolean) => {
    const win = getMainWindow();
    if (!win) return;
    moveWindowToDisplay(win, displayId, fullscreen);
  });

  ipcMain.handle('window:setFullscreen', (_e, value: boolean) => {
    getMainWindow()?.setFullScreen(value);
  });

  ipcMain.handle('window:minimize', () => getMainWindow()?.minimize());
  ipcMain.handle('window:close', () => getMainWindow()?.close());

  ipcMain.handle('window:toggleAlwaysOnTop', (_e, value: boolean) => {
    getMainWindow()?.setAlwaysOnTop(value);
    glanceStore.set('settings.alwaysOnTop', value);
  });

  // Generic persisted-store bridge so the renderer's Zustand stores can read/write
  // through electron-store without every field needing its own IPC channel.
  ipcMain.handle('store:get', (_e, key: string) => glanceStore.get(key as keyof GlanceStoreSchema));
  ipcMain.handle('store:set', (_e, key: string, value: unknown) => {
    glanceStore.set(key as keyof GlanceStoreSchema, value as never);
  });

  ipcMain.handle('app:getVersion', () => app.getVersion());
}
