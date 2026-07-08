import { CloudSun, MapPin } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { useWeather } from '@/hooks/useWeather';
import { useSettingsStore } from '@/stores/settingsStore';

export function WeatherCard() {
  const location = useSettingsStore((s) => s.weatherLocation);
  const units = useSettingsStore((s) => s.units);
  const { data: weather, isLoading } = useWeather();

  if (!location) {
    return (
      <GlassCard icon={<CloudSun size={16} strokeWidth={1.75} />} title="Weather">
        <p className="text-ink-muted text-sm">
          Set a location in Settings to see live weather here.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard icon={<CloudSun size={16} strokeWidth={1.75} />} title="Weather">
      {isLoading || !weather ? (
        <div className="h-20 rounded-lg bg-white/5 animate-pulse" />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-semibold tabular text-ink">{weather.temperature}\u00b0</span>
              <span className="text-ink-faint text-sm">{units === 'imperial' ? 'F' : 'C'}</span>
            </div>
            <p className="text-ink-muted text-sm mt-1 flex items-center gap-1">
              <MapPin size={12} /> {weather.locationLabel}
            </p>
            <p className="text-ink-faint text-xs mt-0.5">
              H:{weather.high}\u00b0 L:{weather.low}\u00b0 &middot; Feels {weather.feelsLike}\u00b0
            </p>
          </div>
          <WeatherIcon condition={weather.condition} className="w-14 h-14 text-accent shrink-0" />
        </div>
      )}
    </GlassCard>
  );
}
