export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: string; // ISO string
}

export interface DailyHydration {
  date: string; // YYYY-MM-DD in local timezone
  goal: number;
  entries: WaterEntry[];
}

export interface ReminderSettings {
  enabled: boolean;
  startTime: string; // "08:00"
  endTime: string; // "22:00"
  intervalMinutes: number;
  lastDismissedOrLoggedTime?: string; // ISO string for smart delay logic
}

export interface UserSettings {
  name: string;
  boyfriendName: string;
  dailyGoal: number;
  defaultDrinkSize: number;
  loveMode: boolean;
  darkMode: "light" | "dark" | "system";
  reminderTone: string;
  romanticMessagesEnabled: boolean;
  customBoyfriendMessage?: string;
}

export interface AchievementUnlock {
  id: string;
  unlockedAt: string; // ISO string
}
