import { motion } from 'framer-motion';
import { BatteryMedium } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { useWeather } from '@/hooks/useWeather';
import { useBurnInOffset } from '@/hooks/useBurnInOffset';
import { useSystemStats } from '@/hooks/useSystemStats';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatClock } from '@/utils/time';
import { WeatherIcon } from '@/components/ui/WeatherIcon';

/** Dimmed, near-black page for overnight use — nothing but the essentials. */
export function MinimalClockMode() {
  const now = useClock();
  const clockFormat = useSettingsStore((s) => s.clockFormat);
  const { data: weather } = useWeather();
  const { data: stats } = useSystemStats(true);
  const offset = useBurnInOffset();
  const { primary, suffix } = formatClock(now, clockFormat);

  return (
    <div className="h-full w-full flex items-center justify-center bg-black">
      <motion.div
        animate={{ x: offset.x, y: offset.y }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="flex flex-col items-center opacity-70"
      >
        <div className="flex items-end gap-3">
          <h1 className="font-display font-medium tabular text-clock-md leading-none text-ink-muted">{primary}</h1>
          {suffix && <span className="text-xl text-ink-faint mb-2">{suffix}</span>}
        </div>

        <div className="mt-4 flex items-center gap-4 text-ink-faint text-sm">
          {weather && (
            <span className="flex items-center gap-1.5">
              <WeatherIcon condition={weather.condition} className="w-4 h-4" />
              {weather.temperature}\u00b0
            </span>
          )}
          {stats?.battery.hasBattery && (
            <span className="flex items-center gap-1.5">
              <BatteryMedium className="w-4 h-4" strokeWidth={1.5} />
              {stats.battery.percent}%
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
