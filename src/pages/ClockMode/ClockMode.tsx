import { motion } from 'framer-motion';
import { useClock } from '@/hooks/useClock';
import { useWeather } from '@/hooks/useWeather';
import { useBurnInOffset } from '@/hooks/useBurnInOffset';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatClock, formatDateLong } from '@/utils/time';
import { WeatherIcon } from '@/components/ui/WeatherIcon';

export function ClockMode() {
  const now = useClock();
  const clockFormat = useSettingsStore((s) => s.clockFormat);
  const { data: weather } = useWeather();
  const offset = useBurnInOffset();
  const { primary, suffix } = formatClock(now, clockFormat);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ x: offset.x, y: offset.y }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="flex flex-col items-center"
      >
        <div className="flex items-end gap-4">
          <h1 className="font-display font-semibold tabular text-clock leading-none text-ink">{primary}</h1>
          {suffix && <span className="text-clock-md text-ink-muted font-display mb-4">{suffix}</span>}
        </div>

        <p className="mt-4 text-2xl text-ink-muted font-medium tracking-wide">{formatDateLong(now)}</p>

        {weather && (
          <div className="mt-8 flex items-center gap-3 px-5 py-3 rounded-full glass-panel">
            <WeatherIcon condition={weather.condition} className="w-6 h-6 text-accent" />
            <span className="text-xl tabular text-ink">{weather.temperature}\u00b0</span>
            <span className="text-ink-faint">|</span>
            <span className="text-base text-ink-muted">{weather.locationLabel}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
