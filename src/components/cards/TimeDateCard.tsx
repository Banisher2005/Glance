import { Clock as ClockIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useClock } from '@/hooks/useClock';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatClock, formatDateLong } from '@/utils/time';

export function TimeDateCard() {
  const now = useClock();
  const clockFormat = useSettingsStore((s) => s.clockFormat);
  const { primary, suffix } = formatClock(now, clockFormat);

  return (
    <GlassCard icon={<ClockIcon size={16} strokeWidth={1.75} />} title="Now" className="justify-center">
      <div className="flex items-end gap-2">
        <span className="text-5xl font-display font-semibold tabular text-ink">{primary}</span>
        {suffix && <span className="text-lg text-ink-muted mb-1">{suffix}</span>}
      </div>
      <p className="mt-1 text-ink-muted">{formatDateLong(now)}</p>
    </GlassCard>
  );
}
