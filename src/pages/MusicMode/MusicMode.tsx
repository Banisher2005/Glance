import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { getNowPlayingProvider } from '@/services/nowPlayingService';
import { IconButton } from '@/components/ui/controls';
import { formatDuration } from '@/utils/time';

export function MusicMode() {
  const { data: track, isLoading } = useNowPlaying(true);
  const provider = getNowPlayingProvider();

  if (isLoading || !track) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-72 h-72 rounded-3xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  const progressPercent = track.durationMs ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      {/* Ambient background derived from the track's dominant color */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: `radial-gradient(circle at 50% 40%, ${track.dominantColor}33, transparent 70%)` }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <motion.div
          key={track.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-glow flex items-center justify-center bg-base-elevated"
        >
          {track.artworkUrl ? (
            <img src={track.artworkUrl} alt={track.album} className="w-full h-full object-cover" />
          ) : (
            <Music2 size={64} className="text-ink-faint" strokeWidth={1.25} />
          )}
        </motion.div>

        <div className="text-center max-w-md">
          <h2 className="text-2xl font-display font-semibold text-ink truncate">{track.title}</h2>
          <p className="text-ink-muted mt-1 truncate">{track.artist}</p>
        </div>

        <div className="w-80 md:w-96">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-ink-faint mt-1.5 tabular">
            <span>{formatDuration(track.progressMs)}</span>
            <span>{formatDuration(track.durationMs)}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <IconButton icon={SkipBack} label="Previous" onClick={() => provider.previous()} size="lg" />
          <IconButton
            icon={track.isPlaying ? Pause : Play}
            label={track.isPlaying ? 'Pause' : 'Play'}
            onClick={() => (track.isPlaying ? provider.pause() : provider.play())}
            active
            size="lg"
          />
          <IconButton icon={SkipForward} label="Next" onClick={() => provider.next()} size="lg" />
        </div>
      </div>
    </div>
  );
}
