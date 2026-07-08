import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Plus, X, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTasksStore } from '@/stores/tasksStore';

export function TasksCard() {
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const toggleTask = useTasksStore((s) => s.toggleTask);
  const removeTask = useTasksStore((s) => s.removeTask);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    addTask(title);
    setDraft('');
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <GlassCard icon={<ListChecks size={16} strokeWidth={1.75} />} title={`Tasks \u00b7 ${remaining} left`} className="flex-1">
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {tasks.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2.5 group"
            >
              <button
                onClick={() => toggleTask(t.id)}
                aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
                className="no-drag w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-colors"
                style={{ backgroundColor: t.done ? 'var(--accent)' : 'transparent' }}
              >
                {t.done && <Check size={12} className="text-white" />}
              </button>
              <span className={`text-sm flex-1 truncate ${t.done ? 'text-ink-faint line-through' : 'text-ink'}`}>
                {t.title}
              </span>
              <button
                onClick={() => removeTask(t.id)}
                aria-label="Delete task"
                className="no-drag opacity-0 group-hover:opacity-100 text-ink-faint hover:text-ink transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && <p className="text-ink-faint text-sm">Add today's first task below.</p>}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task"
          className="no-drag flex-1 bg-white/[0.05] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent/50 transition-colors"
        />
        <button
          onClick={submit}
          aria-label="Add task"
          className="no-drag w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-ink transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </GlassCard>
  );
}
