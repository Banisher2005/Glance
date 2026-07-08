import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

const variants = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * 32, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: 1 | -1) => ({ opacity: 0, x: direction * -32, scale: 0.98 }),
};

export function PageTransition({ children, direction }: { children: ReactNode; direction: 1 | -1 }) {
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);

  return (
    <motion.div
      custom={direction}
      variants={animationsEnabled ? variants : undefined}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}
