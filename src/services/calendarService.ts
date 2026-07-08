import type { CalendarEvent } from '@/types';

/**
 * Windows Calendar has no public JS/Node API — reading it requires either the
 * WinRT AppointmentStore (via a native N-API addon) or Microsoft Graph with an
 * account sign-in. Google Calendar is a standard OAuth + REST integration.
 * Both are tracked in TODO.md ("Calendar — Windows & Google integration").
 *
 * Until one is wired up, this returns deterministic local demo events so the
 * Productivity Dashboard's calendar card is never empty during development.
 */
export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  const now = new Date();
  const at = (hoursFromNow: number, durationMin: number): [Date, Date] => {
    const start = new Date(now.getTime() + hoursFromNow * 3_600_000);
    const end = new Date(start.getTime() + durationMin * 60_000);
    return [start, end];
  };

  const [s1, e1] = at(1.5, 30);
  const [s2, e2] = at(3, 60);
  const [s3, e3] = at(6, 45);

  return [
    { id: '1', title: 'Design sync', start: s1, end: e1, location: 'Zoom' },
    { id: '2', title: 'Deep work block', start: s2, end: e2 },
    { id: '3', title: '1:1 with manager', start: s3, end: e3, location: 'Meeting Room 2' },
  ];
}
