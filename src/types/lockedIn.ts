export interface LockedInTask {
  id: string;
  text: string;
  completed: boolean;
  completedAt: string | null;
  date: string; // YYYY-MM-DD
  createdAt: string;
  durationMinutes?: number | null;
}

export interface DayStreakInfo {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isCompleted: boolean;
}

export interface StreakState {
  streakCount: number;
  weeklyCompletedDays: number;
  isFireActive: boolean;
  totalMinutesToday: number;
  days: DayStreakInfo[];
}

export interface HistoryDayGroup {
  date: string;
  formattedDate: string;
  totalTasks: number;
  completedTasks: number;
  totalMinutes: number;
  tasks: LockedInTask[];
}

export interface AllTimeStats {
  totalCompleted: number;
  totalMinutes: number;
  productiveDays: number;
}
