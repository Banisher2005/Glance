import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSettingsStore, applyAccentColor } from '@/stores/settingsStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useModeNavigation } from '@/hooks/useModeNavigation';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import { WindowChrome } from '@/components/layout/WindowChrome';
import { ModeDots } from '@/components/layout/ModeDots';
import { PageTransition } from '@/components/layout/PageTransition';

import { ClockMode } from '@/pages/ClockMode/ClockMode';
import { MinimalClockMode } from '@/pages/MinimalClockMode/MinimalClockMode';
import { ProductivityDashboard } from '@/pages/ProductivityDashboard/ProductivityDashboard';
import { SystemMonitor } from '@/pages/SystemMonitor/SystemMonitor';
import { MusicMode } from '@/pages/MusicMode/MusicMode';
import { PhotoMode } from '@/pages/PhotoMode/PhotoMode';
import { FocusMode } from '@/pages/FocusMode/FocusMode';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import type { ModeId } from '@/types';

const PAGES: Record<ModeId, () => React.ReactElement> = {
  clock: ClockMode,
  'minimal-clock': MinimalClockMode,
  productivity: ProductivityDashboard,
  system: SystemMonitor,
  music: MusicMode,
  photo: PhotoMode,
  focus: FocusMode,
  settings: SettingsPage,
};

export default function App() {
  const hydrated = useSettingsStore((s) => s.hydrated);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateTasks = useTasksStore((s) => s.hydrate);
  const accentColor = useSettingsStore((s) => s.accentColor);
  const activeMode = useNavigationStore((s) => s.activeMode);
  const direction = useNavigationStore((s) => s.direction);
  const setMode = useNavigationStore((s) => s.setMode);

  useModeNavigation(activeMode !== 'settings');
  useIdleDetection(hydrated);

  useEffect(() => {
    hydrateSettings();
    hydrateTasks();
  }, [hydrateSettings, hydrateTasks]);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  // Restore last mode once settings/window state has hydrated from disk.
  useEffect(() => {
    if (!hydrated || !window.glance) return;
    window.glance.store.get<string>('window.lastMode').then((lastMode) => {
      if (lastMode && lastMode in PAGES) setMode(lastMode as ModeId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return <div className="h-screen w-screen bg-base" />;
  }

  const ActivePage = PAGES[activeMode];

  return (
    <div className="relative h-screen w-screen bg-base overflow-hidden">
      <WindowChrome />
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <PageTransition key={activeMode} direction={direction}>
            <ActivePage />
          </PageTransition>
        </AnimatePresence>
      </div>
      <ModeDots />
    </div>
  );
}
