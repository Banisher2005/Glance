import { ipcMain, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { glanceStore } from '../store.js';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']);

async function listImages(folder: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
      .map((e) => `file://${path.join(folder, e.name).replace(/\\/g, '/')}`);
  } catch {
    return [];
  }
}

export function registerPhotoIpc(): void {
  ipcMain.handle('photos:pickFolder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled || result.filePaths.length === 0) return null;
    const folder = result.filePaths[0];
    glanceStore.set('settings', { ...glanceStore.get('settings'), photoFolder: folder });
    return folder;
  });

  ipcMain.handle('photos:list', async () => {
    const folder = glanceStore.get('settings').photoFolder;
    if (!folder) return [];
    return listImages(folder);
  });
}
