export type ModeId =
  | 'clock'
  | 'productivity'
  | 'system'
  | 'music'
  | 'photo'
  | 'minimal-clock'
  | 'focus'
  | 'settings';

export interface ModeDefinition {
  id: ModeId;
  label: string;
  /** Whether this mode appears in the primary swipeable mode carousel. Settings does not. */
  inCarousel: boolean;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  dueAt: number | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
}

export interface WeatherSnapshot {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  high: number;
  low: number;
  locationLabel: string;
  hourly: { time: Date; temperature: number; condition: WeatherCondition }[];
  daily: { date: Date; high: number; low: number; condition: WeatherCondition }[];
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string | null;
  progressMs: number;
  durationMs: number;
  dominantColor: string;
}

export type SettingsSlice = import('../stores/settingsStore').SettingsState;
