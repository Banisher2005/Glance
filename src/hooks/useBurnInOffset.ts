import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

const SHIFT_INTERVAL_MS = 90_000;
const MAX_OFFSET_PX = 6;

/** Returns a slowly-drifting {x,y} offset to apply as a transform on static pages. */
export function useBurnInOffset(): { x: number; y: number } {
  const enabled = useSettingsStore((s) => s.burnInProtection);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 });
      return;
    }
    const id = setInterval(() => {
      setOffset({
        x: Math.round((Math.random() - 0.5) * 2 * MAX_OFFSET_PX),
        y: Math.round((Math.random() - 0.5) * 2 * MAX_OFFSET_PX),
      });
    }, SHIFT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled]);

  return offset;
}
