import { useEffect } from 'react';
import { usePomodoroStore } from '@/stores/pomodoroStore';

export function usePomodoroTick(): void {
  const tick = usePomodoroStore((s) => s.tick);
  const isRunning = usePomodoroStore((s) => s.isRunning);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);
}
