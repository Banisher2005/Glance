import { useQuery } from '@tanstack/react-query';
import { getUpcomingEvents } from '@/services/calendarService';

export function useCalendarEvents(enabled = true) {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: getUpcomingEvents,
    enabled,
    refetchInterval: 5 * 60 * 1000,
  });
}
