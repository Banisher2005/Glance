import type { GlanceBridge } from '../../electron/preload';

declare global {
  interface Window {
    glance: GlanceBridge;
  }
}

export {};
