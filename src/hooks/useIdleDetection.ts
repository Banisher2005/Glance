import { useEffect } from 'react';
import { useNavigationStore } from '@/stores/navigationStore';

/**
 * Subscribes to main-process idle notifications and drives the "auto switch to
 * Clock Mode when idle, resume previous page on activity" behaviour.
 */
export function useIdleDetection(enabled: boolean): void {
  const enterIdle = useNavigationStore((s) => s.enterIdle);
  const exitIdle = useNavigationStore((s) => s.exitIdle);

  useEffect(() => {
    if (!enabled || !window.glance) return;
    const unsubscribe = window.glance.system.onIdleChanged((isIdle) => {
      if (isIdle) enterIdle();
      else exitIdle();
    });
    return unsubscribe;
  }, [enabled, enterIdle, exitIdle]);
}
