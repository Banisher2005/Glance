import { Play, Pause, SkipForward, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { IconButton } from '@/components/ui/controls';
import { usePomodoroStore, POMODORO_DURATIONS } from '@/stores/pomodoroStore';
import { usePomodoroTick } from '@/hooks/usePomodoroTick';
import { useTasksStore } from '@/stores/tasksStore';
import { formatDuration } from '@/utils/time';
import { getQuoteOfTheDay } from '@/services/quoteService';

const PHASE_LABEL: Record<string, string> = {
  focus: 'Focus Session',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
};

export function FocusMode() {
  usePomodoroTick();
  const { phase, secondsRemaining, isRunning, toggleRunning, skip, goal, distractionCount, logDistraction } =
    usePomodoroStore();
  const activeTask = useTasksStore((s) => s.tasks.find((t) => t.id === s.activeTaskId));
  const percent = 100 - (secondsRemaining / POMODORO_DURATIONS[phase]) * 100;
  const quote = getQuoteOfTheDay();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 px-8">
      <span className="text-sm tracking-widest uppercase text-ink-muted">{PHASE_LABEL[phase]}</span>

      <ProgressRing percent={percent} size={280} strokeWidth={14}>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-display font-semibold tabular text-ink">
            {formatDuration(secondsRemaining * 1000)}
          </span>
          <div className="flex items-center gap-3 mt-6">
            <IconButton icon={isRunning ? Pause : Play} label={isRunning ? 'Pause' : 'Start'} onClick={toggleRunning} active size="lg" />
            <IconButton icon={SkipForward} label="Skip" onClick={skip} size="lg" />
          </div>
        </div>
      </ProgressRing>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-3 text-center max-w-lg"
      >
        {activeTask && (
          <p className="text-ink text-lg">
            Working on <span className="font-medium">{activeTask.title}</span>
          </p>
        )}
        {goal && <p className="text-ink-muted text-sm">Today's goal: {goal}</p>}
        <p className="text-ink-faint text-sm italic mt-2">\u201c{quote.text}\u201d</p>
      </motion.div>

      <button
        onClick={logDistraction}
        className="no-drag flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-ink-muted hover:text-ink transition-colors"
      >
        <MousePointerClick size={14} /> Distractions today: {distractionCount}
      </button>
    </div>
  );
}
