import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, X, Monitor, Settings as SettingsIcon, Maximize2 } from 'lucide-react';
import { IconButton } from '@/components/ui/controls';
import { useNavigationStore } from '@/stores/navigationStore';
import { useDisplays } from '@/hooks/useDisplays';

/**
 * Thin auto-hiding top bar. Fullscreen dashboards shouldn't show chrome, so this
 * only reveals itself on mouse-move-to-top-edge, per "distraction-free" brief.
 */
export function WindowChrome() {
  const [visible, setVisible] = useState(true);
  const setMode = useNavigationStore((s) => s.setMode);
  const { displays, moveToSecondDisplay, hasSecondDisplay } = useDisplays();

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 h-16"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="drag-region flex items-center justify-between h-16 px-5"
          >
            <div className="flex items-center gap-2 text-ink-muted text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Glance
            </div>

            <div className="flex items-center gap-2">
              {hasSecondDisplay && (
                <button
                  onClick={moveToSecondDisplay}
                  className="no-drag flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel text-sm text-ink hover:bg-white/[0.08] transition-colors"
                >
                  <Monitor size={15} strokeWidth={1.75} />
                  Move to Second Display
                </button>
              )}
              <IconButton icon={SettingsIcon} label="Settings" onClick={() => setMode('settings')} />
              <IconButton
                icon={Maximize2}
                label="Toggle fullscreen"
                onClick={() => window.glance?.window.setFullscreen(true)}
              />
              <IconButton icon={Minus} label="Minimize" onClick={() => window.glance?.window.minimize()} />
              <IconButton icon={X} label="Close" onClick={() => window.glance?.window.close()} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {displays.length === 0 && null}
    </div>
  );
}
