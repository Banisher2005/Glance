import { contextBridge, ipcRenderer } from 'electron';

/**
 * Everything the renderer is allowed to touch. Kept intentionally narrow —
 * no raw ipcRenderer, no Node globals — per Electron security best practice.
 */
const glanceBridge = {
  displays: {
    list: () => ipcRenderer.invoke('window:listDisplays'),
    moveTo: (displayId: number, fullscreen = true) =>
      ipcRenderer.invoke('window:moveToDisplay', displayId, fullscreen),
  },
  window: {
    setFullscreen: (value: boolean) => ipcRenderer.invoke('window:setFullscreen', value),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    close: () => ipcRenderer.invoke('window:close'),
    toggleAlwaysOnTop: (value: boolean) => ipcRenderer.invoke('window:toggleAlwaysOnTop', value),
  },
  system: {
    snapshot: () => ipcRenderer.invoke('system:snapshot'),
    idleSeconds: () => ipcRenderer.invoke('system:idleSeconds'),
    onIdleChanged: (cb: (isIdle: boolean) => void) => {
      const listener = (_e: unknown, isIdle: boolean) => cb(isIdle);
      ipcRenderer.on('system:idleChanged', listener);
      return () => {
        ipcRenderer.removeListener('system:idleChanged', listener);
      };
    },
  },
  photos: {
    pickFolder: () => ipcRenderer.invoke('photos:pickFolder'),
    list: () => ipcRenderer.invoke('photos:list'),
  },
  store: {
    get: <T = unknown>(key: string) => ipcRenderer.invoke('store:get', key) as Promise<T>,
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
  },
};

contextBridge.exposeInMainWorld('glance', glanceBridge);

export type GlanceBridge = typeof glanceBridge;
