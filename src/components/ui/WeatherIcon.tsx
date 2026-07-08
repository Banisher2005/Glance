import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import type { WeatherCondition } from '@/types';

const ICONS: Record<WeatherCondition, typeof Sun> = {
  clear: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  thunderstorm: CloudLightning,
  snow: Snowflake,
  fog: CloudFog,
};

export function WeatherIcon({ condition, className }: { condition: WeatherCondition; className?: string }) {
  const Icon = ICONS[condition];
  return <Icon className={className} strokeWidth={1.5} />;
}
