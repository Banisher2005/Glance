import type { NowPlaying } from '@/types';

/**
 * Now-playing data source contract. Music Mode is UI-complete and works against
 * any provider implementing this interface.
 *
 * Two providers ship today:
 *  - SpotifyProvider: real integration, requires a Spotify app client ID (see TODO.md,
 *    "Music Mode — Spotify OAuth"). Until credentials are configured it throws, and the
 *    UI falls back to DemoProvider so the mode is never blank during development.
 *  - DemoProvider: deterministic local data so the page is fully interactive without
 *    any external account. Swap out once OAuth is wired up.
 *
 * Windows Media Session (system-wide "now playing", not just Spotify) requires a native
 * addon (GlobalSystemMediaTransportControlsSessionManager via node-ffi or a small Rust/C++
 * bridge) since Node/Electron has no built-in binding for it. Tracked in TODO.md.
 */
export interface NowPlayingProvider {
  getSnapshot(): Promise<NowPlaying>;
  play(): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  seek(ms: number): Promise<void>;
}

class DemoProvider implements NowPlayingProvider {
  private playing = true;
  private progress = 42_000;
  private readonly track: Omit<NowPlaying, 'isPlaying' | 'progressMs'> = {
    title: 'Weightless',
    artist: 'Marconi Union',
    album: 'Distance',
    artworkUrl: null,
    durationMs: 210_000,
    dominantColor: '#5B6BFF',
  };

  async getSnapshot(): Promise<NowPlaying> {
    return { ...this.track, isPlaying: this.playing, progressMs: this.progress };
  }
  async play() {
    this.playing = true;
  }
  async pause() {
    this.playing = false;
  }
  async next() {
    this.progress = 0;
  }
  async previous() {
    this.progress = 0;
  }
  async seek(ms: number) {
    this.progress = ms;
  }
}

class SpotifyProvider implements NowPlayingProvider {
  // TODO: populate via Settings once the OAuth flow (Authorization Code + PKCE) is
  // implemented in electron/ipc/spotify.ts and a client ID is registered at
  // https://developer.spotify.com/dashboard.
  private accessToken: string | null = null;

  get isConnected(): boolean {
    return this.accessToken !== null;
  }

  async getSnapshot(): Promise<NowPlaying> {
    if (!this.accessToken) throw new Error('Spotify not connected');
    const res = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) throw new Error('Spotify request failed');
    const data = await res.json();
    return {
      isPlaying: data.is_playing,
      title: data.item?.name ?? '',
      artist: data.item?.artists?.map((a: { name: string }) => a.name).join(', ') ?? '',
      album: data.item?.album?.name ?? '',
      artworkUrl: data.item?.album?.images?.[0]?.url ?? null,
      progressMs: data.progress_ms ?? 0,
      durationMs: data.item?.duration_ms ?? 0,
      dominantColor: '#5B6BFF',
    };
  }
  async play() {
    /* TODO: PUT /v1/me/player/play */
  }
  async pause() {
    /* TODO: PUT /v1/me/player/pause */
  }
  async next() {
    /* TODO: POST /v1/me/player/next */
  }
  async previous() {
    /* TODO: POST /v1/me/player/previous */
  }
  async seek() {
    /* TODO: PUT /v1/me/player/seek */
  }
}

const demoProvider = new DemoProvider();
const spotifyProvider = new SpotifyProvider();

/** Returns Spotify when connected, otherwise the demo provider so Music Mode stays alive. */
export function getNowPlayingProvider(): NowPlayingProvider {
  return spotifyProvider.isConnected ? spotifyProvider : demoProvider;
}

export function getDemoProvider(): NowPlayingProvider {
  return demoProvider;
}
