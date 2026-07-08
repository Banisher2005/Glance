import { useQuery } from '@tanstack/react-query';
import type { SystemSnapshot } from '../../electron/ipc/system';

/** Polls live CPU/GPU/RAM/disk/network/battery/thermal data every 2 seconds. */
export function useSystemStats(enabled: boolean) {
  return useQuery<SystemSnapshot>({
    queryKey: ['system-snapshot'],
    queryFn: () => window.glance.system.snapshot(),
    enabled: enabled && !!window.glance,
    refetchInterval: 2000,
    staleTime: 1500,
  });
}
