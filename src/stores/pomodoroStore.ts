import { create } from 'zustand';

export type PomodoroPhase = 'focus' | 'short-break' | 'long-break';

const DURATIONS: Record<PomodoroPhase, number> = {
  focus: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

interface PomodoroState {
  phase: PomodoroPhase;
  secondsRemaining: number;
  isRunning: boolean;
  completedFocusSessions: number;
  distractionCount: number;
  goal: string;
  tick: () => void;
  toggleRunning: () => void;
  reset: () => void;
  skip: () => void;
  setGoal: (goal: string) => void;
  logDistraction: () => void;
}

function nextPhase(phase: PomodoroPhase, completed: number): PomodoroPhase {
  if (phase !== 'focus') return 'focus';
  return (completed + 1) % 4 === 0 ? 'long-break' : 'short-break';
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  phase: 'focus',
  secondsRemaining: DURATIONS.focus,
  isRunning: false,
  completedFocusSessions: 0,
  distractionCount: 0,
  goal: '',

  tick: () => {
    const { secondsRemaining, isRunning } = get();
    if (!isRunning) return;
    if (secondsRemaining <= 1) {
      get().skip();
      return;
    }
    set({ secondsRemaining: secondsRemaining - 1 });
  },

  toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

  reset: () => set((s) => ({ secondsRemaining: DURATIONS[s.phase], isRunning: false })),

  skip: () => {
    const { phase, completedFocusSessions } = get();
    const completed = phase === 'focus' ? completedFocusSessions + 1 : completedFocusSessions;
    const next = nextPhase(phase, completedFocusSessions);
    set({ phase: next, secondsRemaining: DURATIONS[next], completedFocusSessions: completed, isRunning: false });
  },

  setGoal: (goal) => set({ goal }),
  logDistraction: () => set((s) => ({ distractionCount: s.distractionCount + 1 })),
}));

export { DURATIONS as POMODORO_DURATIONS };
