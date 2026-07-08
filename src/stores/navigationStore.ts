import { create } from 'zustand';
import type { ModeDefinition, ModeId } from '@/types';

export const MODES: ModeDefinition[] = [
  { id: 'clock', label: 'Clock', inCarousel: true },
  { id: 'productivity', label: 'Dashboard', inCarousel: true },
  { id: 'system', label: 'System', inCarousel: true },
  { id: 'music', label: 'Music', inCarousel: true },
  { id: 'photo', label: 'Photos', inCarousel: true },
  { id: 'focus', label: 'Focus', inCarousel: true },
  { id: 'minimal-clock', label: 'Night', inCarousel: true },
  { id: 'settings', label: 'Settings', inCarousel: false },
];

const CAROUSEL_IDS = MODES.filter((m) => m.inCarousel).map((m) => m.id);

interface NavigationState {
  activeMode: ModeId;
  /** Mode to return to once the user comes back from idle/auto clock mode. */
  preIdleMode: ModeId | null;
  isIdle: boolean;
  direction: 1 | -1;
  setMode: (mode: ModeId) => void;
  step: (delta: 1 | -1) => void;
  enterIdle: () => void;
  exitIdle: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeMode: 'clock',
  preIdleMode: null,
  isIdle: false,
  direction: 1,

  setMode: (mode) => {
    const currentIndex = CAROUSEL_IDS.indexOf(get().activeMode);
    const nextIndex = CAROUSEL_IDS.indexOf(mode);
    set({
      activeMode: mode,
      direction: nextIndex >= currentIndex ? 1 : -1,
    });
    window.glance?.store.set('window.lastMode', mode);
  },

  step: (delta) => {
    const ids = CAROUSEL_IDS;
    const currentIndex = ids.indexOf(get().activeMode);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + delta + ids.length) % ids.length;
    get().setMode(ids[nextIndex]);
  },

  enterIdle: () => {
    const current = get().activeMode;
    if (current === 'minimal-clock' || current === 'clock') return;
    set({ preIdleMode: current, isIdle: true, activeMode: 'clock', direction: 1 });
  },

  exitIdle: () => {
    const { preIdleMode } = get();
    set({ isIdle: false, activeMode: preIdleMode ?? get().activeMode, preIdleMode: null });
  },
}));

export { CAROUSEL_IDS };
