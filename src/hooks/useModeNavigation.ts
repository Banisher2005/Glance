import { useEffect, useRef } from 'react';
import { useNavigationStore } from '@/stores/navigationStore';

const WHEEL_THRESHOLD = 60;
const SWIPE_THRESHOLD = 50;
const GESTURE_COOLDOWN_MS = 450;

/**
 * Wires arrow keys, mouse wheel, and touch swipes to mode carousel navigation.
 * A short cooldown after each step prevents one wheel gesture or swipe from
 * firing multiple page changes.
 */
export function useModeNavigation(enabled = true): void {
  const step = useNavigationStore((s) => s.step);
  const lastStepAt = useRef(0);
  const wheelAccum = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canStep = () => {
      const now = performance.now();
      if (now - lastStepAt.current < GESTURE_COOLDOWN_MS) return false;
      lastStepAt.current = now;
      return true;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (canStep()) step(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (canStep()) step(-1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      wheelAccum.current += e.deltaY + e.deltaX;
      if (Math.abs(wheelAccum.current) > WHEEL_THRESHOLD) {
        if (canStep()) step(wheelAccum.current > 0 ? 1 : -1);
        wheelAccum.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
      const dx = touchStartX.current - endX;
      const dy = touchStartY.current - endY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (canStep()) step(dx > 0 ? 1 : -1);
      } else if (Math.abs(dy) > SWIPE_THRESHOLD) {
        if (canStep()) step(dy > 0 ? 1 : -1);
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, step]);
}
