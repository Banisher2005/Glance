import { useEffect, useState, useCallback } from 'react';

export interface DisplaySummary {
  id: number;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  isPrimary: boolean;
  isInternal: boolean;
}

export function useDisplays() {
  const [displays, setDisplays] = useState<DisplaySummary[]>([]);

  const refresh = useCallback(async () => {
    if (!window.glance) return;
    const list = await window.glance.displays.list();
    setDisplays(list);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  const moveToSecondDisplay = useCallback(async () => {
    const secondary = displays.find((d) => !d.isPrimary);
    if (!secondary) return;
    await window.glance.displays.moveTo(secondary.id, true);
  }, [displays]);

  return {
    displays,
    hasSecondDisplay: displays.some((d) => !d.isPrimary),
    moveToSecondDisplay,
    refresh,
  };
}
