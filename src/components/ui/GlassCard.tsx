import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  delay?: number;
}

/** Base surface for every dashboard widget: consistent glass, radius, and entrance motion. */
export function GlassCard({ children, className, title, icon, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card flex flex-col', className)}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2.5 mb-4 text-ink-muted">
          {icon}
          {title && <h3 className="text-sm font-medium tracking-wide uppercase text-ink-muted">{title}</h3>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
