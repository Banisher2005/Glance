import { useQuery } from '@tanstack/react-query';
import { getNowPlayingProvider } from '@/services/nowPlayingService';

export function useNowPlaying(enabled: boolean) {
  return useQuery({
    queryKey: ['now-playing'],
    queryFn: () => getNowPlayingProvider().getSnapshot(),
    enabled,
    refetchInterval: 3000,
  });
}
