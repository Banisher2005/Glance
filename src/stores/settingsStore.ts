import { create } from 'zustand';

export interface SettingsState {
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
  transparency: number;
  alwaysOnTop: boolean;
  autoFullscreen: boolean;
  rememberLastMonitor: boolean;
  idleTimeoutMinutes: number;
  burnInProtection: boolean;
  autoBrightnessTheme: boolean;
  hydrated: boolean;
}

interface SettingsActions {
  hydrate: () => Promise<void>;
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const FALLBACK: SettingsState = {
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
  hydrated: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  ...FALLBACK,

  hydrate: async () => {
    if (!window.glance) {
      set({ hydrated: true });
      return;
    }
    const persisted = await window.glance.store.get<Omit<SettingsState, 'hydrated'>>('settings');
    set({ ...FALLBACK, ...persisted, hydrated: true });
    applyAccentColor(get().accentColor);
  },

  update: (key, value) => {
    set({ [key]: value } as Pick<SettingsState, typeof key>);
    const next = { ...get() };
    delete (next as Partial<SettingsState>).hydrated;
    window.glance?.store.set('settings', next);
    if (key === 'accentColor') applyAccentColor(value as string);
  },
}));

/** Pushes the configurable accent color into CSS variables consumed across the app. */
export function applyAccentColor(hex: string): void {
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-soft', `${hex}33`);
}
