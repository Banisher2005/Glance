import type { WeatherCondition, WeatherSnapshot } from '@/types';

// Open-Meteo WMO weather codes collapsed into our simplified condition set.
// https://open-meteo.com/en/docs — no API key required, generous free tier.
function codeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if ([1, 2].includes(code)) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'clear';
}

export async function fetchWeather(
  lat: number,
  lon: number,
  label: string,
  units: 'metric' | 'imperial'
): Promise<WeatherSnapshot> {
  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code');
  url.searchParams.set('hourly', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
  url.searchParams.set('temperature_unit', tempUnit);
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  const data = await res.json();

  const nowHourIndex = data.hourly.time.findIndex((t: string) => t === data.current.time.slice(0, 13) + ':00');
  const startIndex = Math.max(nowHourIndex, 0);

  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: codeToCondition(data.current.weather_code),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    locationLabel: label,
    hourly: data.hourly.time
      .slice(startIndex, startIndex + 12)
      .map((t: string, i: number) => ({
        time: new Date(t),
        temperature: Math.round(data.hourly.temperature_2m[startIndex + i]),
        condition: codeToCondition(data.hourly.weather_code[startIndex + i]),
      })),
    daily: data.daily.time.map((d: string, i: number) => ({
      date: new Date(d),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      condition: codeToCondition(data.daily.weather_code[i]),
    })),
  };
}

/** Resolves a human-readable place name to coordinates via Open-Meteo's free geocoder. */
export async function geocodeLocation(query: string): Promise<{ lat: number; lon: number; label: string }[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).map((r: { latitude: number; longitude: number; name: string; admin1?: string; country?: string }) => ({
    lat: r.latitude,
    lon: r.longitude,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
  }));
}
