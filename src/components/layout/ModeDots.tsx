import { motion } from 'framer-motion';
import { CAROUSEL_IDS, useNavigationStore } from '@/stores/navigationStore';
import { MODES } from '@/stores/navigationStore';

/** Bottom-center dot indicator + click-to-jump, mirroring iOS StandBy page dots. */
export function ModeDots() {
  const activeMode = useNavigationStore((s) => s.activeMode);
  const setMode = useNavigationStore((s) => s.setMode);

  if (activeMode === 'settings') return null;

  return (
    <div className="no-drag fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full glass-panel">
      {CAROUSEL_IDS.map((id) => {
        const mode = MODES.find((m) => m.id === id)!;
        const isActive = id === activeMode;
        return (
          <button
            key={id}
            aria-label={`Switch to ${mode.label}`}
            onClick={() => setMode(id)}
            className="relative flex items-center justify-center w-6 h-6"
          >
            <motion.span
              className="rounded-full bg-white"
              animate={{
                width: isActive ? 18 : 6,
                height: 6,
                opacity: isActive ? 1 : 0.35,
                backgroundColor: isActive ? 'var(--accent)' : '#ffffff',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            />
          </button>
        );
      })}
    </div>
  );
}
