export function formatClock(date: Date, format: '12h' | '24h'): { primary: string; suffix: string } {
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '24h') {
    return { primary: `${hours24.toString().padStart(2, '0')}:${minutes}`, suffix: '' };
  }

  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { primary: `${hours12}:${minutes}`, suffix: hours24 >= 12 ? 'PM' : 'AM' };
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatHourLabel(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric' });
}
