import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function IconButton({
  icon: Icon,
  onClick,
  active,
  label,
  size = 'md',
}: {
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = { sm: 'w-8 h-8', md: 'w-11 h-11', lg: 'w-14 h-14' }[size];
  const iconSize = { sm: 14, md: 18, lg: 22 }[size];
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        'no-drag flex items-center justify-center rounded-full transition-colors duration-200',
        dims,
        active ? 'bg-accent text-white' : 'bg-white/[0.06] text-ink hover:bg-white/[0.1]'
      )}
    >
      <Icon size={iconSize} strokeWidth={1.75} />
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'no-drag relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-accent' : 'bg-white/10'
      )}
    >
      <motion.span
        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="no-drag inline-flex items-center gap-0.5 p-1 rounded-full bg-white/[0.05] border border-white/[0.06]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'relative px-3.5 py-1.5 text-sm rounded-full transition-colors duration-200',
            value === opt.value ? 'text-white' : 'text-ink-muted hover:text-ink'
          )}
        >
          {value === opt.value && (
            <motion.span
              layoutId="segmented-bg"
              className="absolute inset-0 rounded-full bg-accent"
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="no-drag relative flex items-center h-6 w-full">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/10" />
      <div className="absolute h-1.5 rounded-full bg-accent" style={{ width: `${percent}%` }} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="relative w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft"
      />
    </div>
  );
}

export function ColorSwatchPicker({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="no-drag flex items-center gap-3 flex-wrap">
      {colors.map((c) => (
        <button
          key={c}
          aria-label={`Accent color ${c}`}
          onClick={() => onChange(c)}
          className="relative w-9 h-9 rounded-full transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: c }}
        >
          {value.toLowerCase() === c.toLowerCase() && (
            <motion.span
              layoutId="color-ring"
              className="absolute -inset-1.5 rounded-full border-2"
              style={{ borderColor: c }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
