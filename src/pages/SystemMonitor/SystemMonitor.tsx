import { Cpu, MemoryStick, HardDrive, Thermometer, Activity, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useSystemStats } from '@/hooks/useSystemStats';

function Gauge({ label, percent, sub }: { label: string; percent: number; sub?: string }) {
  const color = percent > 85 ? '#FF6B6B' : percent > 60 ? '#FFC069' : 'var(--accent)';
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing percent={percent} size={104} strokeWidth={9} color={color}>
        <span className="text-xl font-display font-semibold tabular text-ink">{percent}%</span>
      </ProgressRing>
      <span className="text-sm text-ink-muted">{label}</span>
      {sub && <span className="text-xs text-ink-faint tabular">{sub}</span>}
    </div>
  );
}

export function SystemMonitor() {
  const { data, isLoading } = useSystemStats(true);

  if (isLoading || !data) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-white/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-10 pt-24 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <GlassCard icon={<Cpu size={16} />} title="CPU" className="items-center">
            <Gauge label="Load" percent={data.cpu.load} sub={`${data.cpu.speedGhz.toFixed(1)} GHz`} />
          </GlassCard>
          <GlassCard icon={<MemoryStick size={16} />} title="Memory" className="items-center">
            <Gauge label="RAM" percent={data.memory.percent} sub={`${data.memory.usedGb} / ${data.memory.totalGb} GB`} />
          </GlassCard>
          {data.gpu[0] && (
            <GlassCard icon={<Zap size={16} />} title="GPU" className="items-center">
              <Gauge label={data.gpu[0].name.slice(0, 16)} percent={data.gpu[0].load ?? 0} />
            </GlassCard>
          )}
          <GlassCard icon={<Thermometer size={16} />} title="Thermal" className="items-center justify-center">
            <span className="text-4xl font-display font-semibold tabular text-ink">
              {data.temperatureC ?? '\u2014'}\u00b0
            </span>
            <span className="text-sm text-ink-muted mt-1">CPU Temperature</span>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassCard icon={<HardDrive size={16} />} title="Storage">
            <div className="flex flex-col gap-3">
              {data.disks.map((d) => (
                <div key={d.mount}>
                  <div className="flex justify-between text-sm text-ink-muted mb-1">
                    <span>{d.mount}</span>
                    <span className="tabular">
                      {d.usedGb} / {d.totalGb} GB
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${d.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard icon={<Activity size={16} />} title="Per-Core Load">
            <div className="grid grid-cols-4 gap-2">
              {data.cpu.cores.map((load, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-full h-16 rounded-md bg-white/5 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-md bg-accent/70 transition-all duration-700"
                      style={{ height: `${load}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-faint">C{i}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Top Processes">
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {data.topProcesses.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink truncate">{p.name}</span>
                <div className="flex items-center gap-5 text-ink-faint tabular">
                  <span>{p.cpu}% CPU</span>
                  <span>{p.memPercent}% MEM</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
