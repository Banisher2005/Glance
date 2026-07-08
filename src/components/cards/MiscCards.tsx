import { useState } from 'react';
import { Target, Quote as QuoteIcon, BatteryFull, BatteryCharging, Wifi, WifiOff } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { getQuoteOfTheDay } from '@/services/quoteService';
import { useSystemStats } from '@/hooks/useSystemStats';

export function GoalCard() {
  const goal = usePomodoroStore((s) => s.goal);
  const setGoal = usePomodoroStore((s) => s.setGoal);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);

  return (
    <GlassCard icon={<Target size={16} strokeWidth={1.75} />} title="Today's Goal">
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            setGoal(draft.trim());
            setEditing(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="What matters most today?"
          className="no-drag w-full bg-white/[0.05] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent/50"
        />
      ) : (
        <button onClick={() => setEditing(true)} className="no-drag text-left w-full">
          <p className="text-ink text-lg font-medium leading-snug">
            {goal || <span className="text-ink-faint font-normal">Tap to set today's goal</span>}
          </p>
        </button>
      )}
    </GlassCard>
  );
}

export function QuoteCard() {
  const quote = getQuoteOfTheDay();
  return (
    <GlassCard icon={<QuoteIcon size={16} strokeWidth={1.75} />} title="Quote of the Day">
      <p className="text-ink text-base leading-relaxed italic">\u201c{quote.text}\u201d</p>
      <p className="text-ink-faint text-sm mt-2">\u2014 {quote.author}</p>
    </GlassCard>
  );
}

export function BatteryCard() {
  const { data: stats } = useSystemStats(true);
  if (!stats?.battery.hasBattery) return null;
  const { percent, isCharging, timeRemainingMin } = stats.battery;

  return (
    <GlassCard
      icon={isCharging ? <BatteryCharging size={16} strokeWidth={1.75} /> : <BatteryFull size={16} strokeWidth={1.75} />}
      title="Battery"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-semibold tabular text-ink">{percent}%</span>
        {isCharging && <span className="text-xs text-accent">Charging</span>}
      </div>
      {timeRemainingMin && !isCharging && (
        <p className="text-ink-faint text-xs mt-1">{Math.round(timeRemainingMin / 60)}h {timeRemainingMin % 60}m remaining</p>
      )}
    </GlassCard>
  );
}

export function NetworkCard() {
  const { data: stats } = useSystemStats(true);
  const connected = !!stats && (stats.network.rxSec > 0 || stats.network.txSec > 0 || !!stats.network.iface);

  return (
    <GlassCard icon={connected ? <Wifi size={16} strokeWidth={1.75} /> : <WifiOff size={16} strokeWidth={1.75} />} title="Network">
      <p className="text-ink text-sm">{stats?.network.iface ?? 'Unknown interface'}</p>
      <div className="flex items-center gap-4 mt-2 text-xs text-ink-faint tabular">
        <span>\u2193 {stats?.network.rxSec ?? 0} KB/s</span>
        <span>\u2191 {stats?.network.txSec ?? 0} KB/s</span>
      </div>
    </GlassCard>
  );
}
