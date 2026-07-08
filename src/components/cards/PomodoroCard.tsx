import { Timer, Play, Pause, SkipForward } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { IconButton } from '@/components/ui/controls';
import { usePomodoroStore, POMODORO_DURATIONS } from '@/stores/pomodoroStore';
import { usePomodoroTick } from '@/hooks/usePomodoroTick';
import { formatDuration } from '@/utils/time';

const PHASE_LABEL: Record<string, string> = {
  focus: 'Focus',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
};

export function PomodoroCard() {
  usePomodoroTick();
  const { phase, secondsRemaining, isRunning, toggleRunning, skip } = usePomodoroStore();
  const percent = 100 - (secondsRemaining / POMODORO_DURATIONS[phase]) * 100;

  return (
    <GlassCard icon={<Timer size={16} strokeWidth={1.75} />} title="Pomodoro">
      <div className="flex items-center gap-5">
        <ProgressRing percent={percent} size={84} strokeWidth={6}>
          <span className="text-lg font-display font-semibold tabular text-ink">
            {formatDuration(secondsRemaining * 1000)}
          </span>
        </ProgressRing>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-ink-muted">{PHASE_LABEL[phase]}</span>
          <div className="flex items-center gap-2">
            <IconButton icon={isRunning ? Pause : Play} label={isRunning ? 'Pause' : 'Start'} onClick={toggleRunning} active size="sm" />
            <IconButton icon={SkipForward} label="Skip" onClick={skip} size="sm" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
