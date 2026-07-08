import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageOff, FolderOpen } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatClock, formatDateShort } from '@/utils/time';

const SLIDE_DURATION_MS = 10_000;

// Alternating Ken Burns directions so consecutive photos don't feel identical.
const KEN_BURNS_VARIANTS = [
  { scale: [1, 1.12], x: [0, -20], y: [0, 10] },
  { scale: [1.12, 1], x: [-20, 10], y: [10, -10] },
  { scale: [1, 1.1], x: [10, -10], y: [-10, 10] },
];

export function PhotoMode() {
  const now = useClock();
  const clockFormat = useSettingsStore((s) => s.clockFormat);
  const photoFolder = useSettingsStore((s) => s.photoFolder);
  const update = useSettingsStore((s) => s.update);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!window.glance) return;
    window.glance.photos.list().then(setImages);
  }, [photoFolder]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const pickFolder = async () => {
    const folder = await window.glance?.photos.pickFolder();
    if (folder) update('photoFolder', folder);
  };

  const { primary, suffix } = formatClock(now, clockFormat);

  if (images.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-ink-muted">
        <ImageOff size={40} strokeWidth={1.25} />
        <p>No photos yet. Choose a folder to start the slideshow.</p>
        <button
          onClick={pickFolder}
          className="no-drag flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel text-sm text-ink hover:bg-white/[0.08] transition-colors"
        >
          <FolderOpen size={15} /> Choose Photo Folder
        </button>
      </div>
    );
  }

  const variant = KEN_BURNS_VARIANTS[index % KEN_BURNS_VARIANTS.length];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Blurred ambient duplicate fills letterboxed edges for non-matching aspect ratios */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-40"
        style={{ backgroundImage: `url(${images[index]})` }}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={images[index]}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
          initial={{ opacity: 0, scale: variant.scale[0], x: variant.x[0], y: variant.y[0] }}
          animate={{ opacity: 1, scale: variant.scale[1], x: variant.x[1], y: variant.y[1] }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2 },
            default: { duration: SLIDE_DURATION_MS / 1000, ease: 'linear' },
          }}
        />
      </AnimatePresence>

      <div className="absolute bottom-10 left-10 z-10 text-white drop-shadow-lg">
        <div className="flex items-end gap-2">
          <span className="text-6xl font-display font-semibold tabular">{primary}</span>
          {suffix && <span className="text-xl mb-1 opacity-80">{suffix}</span>}
        </div>
        <p className="opacity-80 mt-1">{formatDateShort(now)}</p>
      </div>
    </div>
  );
}
