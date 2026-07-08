import { TimeDateCard } from '@/components/cards/TimeDateCard';
import { WeatherCard } from '@/components/cards/WeatherCard';
import { CalendarCard } from '@/components/cards/CalendarCard';
import { TasksCard } from '@/components/cards/TasksCard';
import { PomodoroCard } from '@/components/cards/PomodoroCard';
import { GoalCard, QuoteCard, BatteryCard, NetworkCard } from '@/components/cards/MiscCards';

export function ProductivityDashboard() {
  return (
    <div className="h-full w-full overflow-y-auto px-10 pt-24 pb-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-min">
        <TimeDateCard />
        <WeatherCard />
        <CalendarCard />
        <TasksCard />
        <PomodoroCard />
        <GoalCard />
        <QuoteCard />
        <BatteryCard />
        <NetworkCard />
      </div>
    </div>
  );
}
