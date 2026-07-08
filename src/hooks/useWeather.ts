import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '@/services/weatherService';
import { useSettingsStore } from '@/stores/settingsStore';

/** Fetches live weather for the user's configured location, refreshing every 15 minutes. */
export function useWeather(enabled = true) {
  const location = useSettingsStore((s) => s.weatherLocation);
  const units = useSettingsStore((s) => s.units);

  return useQuery({
    queryKey: ['weather', location?.lat, location?.lon, units],
    queryFn: () => fetchWeather(location!.lat, location!.lon, location!.label, units),
    enabled: enabled && !!location,
    refetchInterval: 15 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
}
