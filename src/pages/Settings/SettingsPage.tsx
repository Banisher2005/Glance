import { useState } from 'react';
import { ArrowLeft, Search, FolderOpen } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { SegmentedControl, Toggle, Slider, ColorSwatchPicker } from '@/components/ui/controls';
import { geocodeLocation } from '@/services/weatherService';

const ACCENT_COLORS = ['#6E6BFF', '#FF6B9D', '#3DDC97', '#FFB84D', '#4DB8FF', '#F3F3F5'];

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-white/[0.05] last:border-0">
      <div>
        <p className="text-ink text-sm font-medium">{label}</p>
        {description && <p className="text-ink-faint text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card mb-5">
      <h2 className="text-xs font-medium tracking-widest uppercase text-ink-muted mb-1">{title}</h2>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const s = useSettingsStore();
  const setMode = useNavigationStore((st) => st.setMode);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ lat: number; lon: number; label: string }[]>([]);

  const search = async () => {
    if (!query.trim()) return;
    setResults(await geocodeLocation(query));
  };

  const pickPhotoFolder = async () => {
    const folder = await window.glance?.photos.pickFolder();
    if (folder) s.update('photoFolder', folder);
  };

  return (
    <div className="h-full w-full overflow-y-auto px-10 pt-20 pb-20">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setMode('clock')}
          className="no-drag flex items-center gap-2 text-ink-muted hover:text-ink mb-6 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <h1 className="text-3xl font-display font-semibold text-ink mb-6">Settings</h1>

        <Section title="Appearance">
          <Row label="Accent Color">
            <ColorSwatchPicker colors={ACCENT_COLORS} value={s.accentColor} onChange={(v) => s.update('accentColor', v)} />
          </Row>
          <Row label="Theme">
            <SegmentedControl
              value={s.theme}
              onChange={(v) => s.update('theme', v)}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
          </Row>
          <Row label="Font Size">
            <SegmentedControl
              value={s.fontSize}
              onChange={(v) => s.update('fontSize', v)}
              options={[
                { value: 'small', label: 'S' },
                { value: 'medium', label: 'M' },
                { value: 'large', label: 'L' },
              ]}
            />
          </Row>
          <Row label="Transparency" description="Glass panel opacity">
            <div className="w-40">
              <Slider value={s.transparency} min={0.3} max={1} step={0.05} onChange={(v) => s.update('transparency', v)} />
            </div>
          </Row>
          <Row label="Animations" description="Disable for maximum performance">
            <Toggle checked={s.animationsEnabled} onChange={(v) => s.update('animationsEnabled', v)} />
          </Row>
        </Section>

        <Section title="Clock & Units">
          <Row label="Clock Format">
            <SegmentedControl
              value={s.clockFormat}
              onChange={(v) => s.update('clockFormat', v)}
              options={[
                { value: '24h', label: '24h' },
                { value: '12h', label: '12h' },
              ]}
            />
          </Row>
          <Row label="Units">
            <SegmentedControl
              value={s.units}
              onChange={(v) => s.update('units', v)}
              options={[
                { value: 'metric', label: '\u00b0C' },
                { value: 'imperial', label: '\u00b0F' },
              ]}
            />
          </Row>
        </Section>

        <Section title="Weather Location">
          <div className="flex items-center gap-2 py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Search city..."
              className="no-drag flex-1 bg-white/[0.05] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent/50"
            />
            <button onClick={search} className="no-drag w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-ink">
              <Search size={15} />
            </button>
          </div>
          {results.length > 0 && (
            <div className="flex flex-col gap-1 pb-3">
              {results.map((r) => (
                <button
                  key={`${r.lat}-${r.lon}`}
                  onClick={() => {
                    s.update('weatherLocation', r);
                    setResults([]);
                    setQuery('');
                  }}
                  className="no-drag text-left px-3 py-2 rounded-lg text-sm text-ink-muted hover:bg-white/[0.05] hover:text-ink transition-colors"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {s.weatherLocation && (
            <p className="text-ink-faint text-xs pb-1">Current: {s.weatherLocation.label}</p>
          )}
        </Section>

        <Section title="Photos">
          <Row label="Photo Folder" description={s.photoFolder ?? 'No folder selected'}>
            <button
              onClick={pickPhotoFolder}
              className="no-drag flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-ink transition-colors"
            >
              <FolderOpen size={14} /> Choose
            </button>
          </Row>
        </Section>

        <Section title="Window Behaviour">
          <Row label="Always On Top">
            <Toggle
              checked={s.alwaysOnTop}
              onChange={(v) => {
                s.update('alwaysOnTop', v);
                window.glance?.window.toggleAlwaysOnTop(v);
              }}
            />
          </Row>
          <Row label="Auto Fullscreen" description="When moved to a second display">
            <Toggle checked={s.autoFullscreen} onChange={(v) => s.update('autoFullscreen', v)} />
          </Row>
          <Row label="Remember Last Monitor">
            <Toggle checked={s.rememberLastMonitor} onChange={(v) => s.update('rememberLastMonitor', v)} />
          </Row>
          <Row label="Launch on Startup">
            <Toggle checked={s.launchOnStartup} onChange={(v) => s.update('launchOnStartup', v)} />
          </Row>
        </Section>

        <Section title="Ambient Behaviour">
          <Row label="Idle Timeout" description="Minutes before switching to Clock Mode">
            <div className="w-40">
              <Slider value={s.idleTimeoutMinutes} min={1} max={30} step={1} onChange={(v) => s.update('idleTimeoutMinutes', v)} />
            </div>
          </Row>
          <Row label="Burn-in Protection" description="Subtle drift, recommended for OLED">
            <Toggle checked={s.burnInProtection} onChange={(v) => s.update('burnInProtection', v)} />
          </Row>
          <Row label="Auto Brightness Theme" description="Shift accent by time of day">
            <Toggle checked={s.autoBrightnessTheme} onChange={(v) => s.update('autoBrightnessTheme', v)} />
          </Row>
        </Section>
      </div>
    </div>
  );
}
