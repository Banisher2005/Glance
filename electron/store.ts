import Store from 'electron-store';

/**
 * Shape of everything Glance persists between launches.
 * This is the single source of truth for "remembers last..." requirements.
 */
export interface GlanceStoreSchema {
  window: {
    lastDisplayId: number | null;
    lastMode: string;
    bounds: { x: number; y: number; width: number; height: number } | null;
    isFullscreen: boolean;
  };
  settings: {
    accentColor: string;
    clockFormat: '12h' | '24h';
    weatherLocation: { lat: number; lon: number; label: string } | null;
    units: 'metric' | 'imperial';
    animationsEnabled: boolean;
    launchOnStartup: boolean;
    theme: 'dark' | 'light' | 'auto';
    wallpaper: string | null;
    photoFolder: string | null;
    fontSize: 'small' | 'medium' | 'large';
    transparency: number; // 0 - 1
    alwaysOnTop: boolean;
    autoFullscreen: boolean;
    rememberLastMonitor: boolean;
    idleTimeoutMinutes: number;
    burnInProtection: boolean;
    autoBrightnessTheme: boolean;
  };
  tasks: Array<{ id: string; title: string; done: boolean; createdAt: number; dueAt: number | null }>;
}

export const defaultStore: GlanceStoreSchema = {
  window: {
    lastDisplayId: null,
    lastMode: 'clock',
    bounds: null,
    isFullscreen: false,
  },
  settings: {
    accentColor: '#6E6BFF',
    clockFormat: '24h',
    weatherLocation: null,
    units: 'metric',
    animationsEnabled: true,
    launchOnStartup: false,
    theme: 'dark',
    wallpaper: null,
    photoFolder: null,
    fontSize: 'medium',
    transparency: 0.8,
    alwaysOnTop: false,
    autoFullscreen: true,
    rememberLastMonitor: true,
    idleTimeoutMinutes: 5,
    burnInProtection: true,
    autoBrightnessTheme: false,
  },
  tasks: [],
};

export const glanceStore = new Store<GlanceStoreSchema>({
  name: 'glance-config',
  defaults: defaultStore,
});
