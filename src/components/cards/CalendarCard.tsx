import { CalendarDays } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

export function CalendarCard() {
  const { data: events, isLoading } = useCalendarEvents();

  return (
    <GlassCard icon={<CalendarDays size={16} strokeWidth={1.75} />} title="Upcoming">
      {isLoading && <div className="h-24 rounded-lg bg-white/5 animate-pulse" />}
      {!isLoading && (!events || events.length === 0) && (
        <p className="text-ink-muted text-sm">Nothing on your calendar. Enjoy the quiet.</p>
      )}
      <ul className="flex flex-col gap-3">
        {events?.map((e) => (
          <li key={e.id} className="flex items-center gap-3">
            <div className="w-1 self-stretch rounded-full bg-accent/70" />
            <div className="flex-1 min-w-0">
              <p className="text-ink text-sm font-medium truncate">{e.title}</p>
              <p className="text-ink-faint text-xs">
                {e.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                {e.location ? ` \u00b7 ${e.location}` : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
