import { useEffect, useState } from 'react';

/** Ticks once a second. Cheap enough for multiple mounts (Clock, Minimal Clock, dashboard cards). */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
