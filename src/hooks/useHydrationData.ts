"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyHydration, WaterEntry, UserSettings, ReminderSettings } from "@/types";
import { CONFIG, STORAGE_KEYS, ACHIEVEMENTS } from "@/lib/constants";

export function getTodayDateString(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: CONFIG.GIRLFRIEND_NAME,
  boyfriendName: CONFIG.BOYFRIEND_NAME,
  dailyGoal: CONFIG.DEFAULT_GOAL_ML,
  defaultDrinkSize: CONFIG.DEFAULT_DRINK_SIZE,
  loveMode: true,
  darkMode: "system",
  reminderTone: "gentle_chime",
  romanticMessagesEnabled: true,
  customBoyfriendMessage: "Drink water, sleepyhead. I love you! ❤️",
};

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: true,
  startTime: "08:00",
  endTime: "22:00",
  intervalMinutes: 60,
};

export function useHydrationData() {
  const [records, setRecords] = useState<Record<string, DailyHydration>>({});
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastDeletedEntry, setLastDeletedEntry] = useState<{ date: string; entry: WaterEntry; index: number } | null>(null);
  const [lastAddedEntry, setLastAddedEntry] = useState<{ date: string; entryId: string } | null>(null);
  const [adminMessageUpdatedSignal, setAdminMessageUpdatedSignal] = useState<{ timestamp: number; message: string } | null>(null);

  // Load from LocalStorage safely
  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem(STORAGE_KEYS.HYDRATION_DATA);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS);

      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        if (typeof parsed === "object" && parsed !== null) {
          setRecords(parsed);
        }
      }

      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (typeof parsed === "object" && parsed !== null) {
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      }

      if (storedReminders) {
        const parsed = JSON.parse(storedReminders);
        if (typeof parsed === "object" && parsed !== null) {
          setReminders({ ...DEFAULT_REMINDERS, ...parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load local storage data:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // BroadcastChannel & LocalStorage Event Listeners for immediate cross-tab / same-page sync
  useEffect(() => {
    // 1. BroadcastChannel API
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("hydralove_admin_messages");
      channel.onmessage = (event) => {
        if (event.data && event.data.type === "NEW_ADMIN_MESSAGE") {
          const msg = event.data.message;
          setSettings((prev) => ({ ...prev, customBoyfriendMessage: msg }));
          setAdminMessageUpdatedSignal({ timestamp: Date.now(), message: msg });
        }
      };
    }

    // 2. Storage event fallback for older browsers or external tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER_SETTINGS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.customBoyfriendMessage) {
            setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            setAdminMessageUpdatedSignal({ timestamp: Date.now(), message: parsed.customBoyfriendMessage });
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Save updates to LocalStorage and broadcast signal
  const saveRecords = useCallback((newRecords: Record<string, DailyHydration>) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(STORAGE_KEYS.HYDRATION_DATA, JSON.stringify(newRecords));
    } catch (e) {
      console.error("Failed to save records to localStorage", e);
    }
  }, []);

  const saveSettings = useCallback((newSettings: UserSettings) => {
    const isCustomMsgChanged = settings.customBoyfriendMessage !== newSettings.customBoyfriendMessage;
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(newSettings));
      if (isCustomMsgChanged) {
        const msg = newSettings.customBoyfriendMessage || "";
        setAdminMessageUpdatedSignal({ timestamp: Date.now(), message: msg });

        // Broadcast to other open tabs/windows via BroadcastChannel
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("hydralove_admin_messages");
          channel.postMessage({ type: "NEW_ADMIN_MESSAGE", message: msg });
          channel.close();
        }
      }
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [settings.customBoyfriendMessage]);

  const saveReminders = useCallback((newReminders: ReminderSettings) => {
    setReminders(newReminders);
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(newReminders));
    } catch (e) {
      console.error("Failed to save reminders to localStorage", e);
    }
  }, []);

  // Current day data
  const todayStr = getTodayDateString();
  const todayRecord: DailyHydration = records[todayStr] || {
    date: todayStr,
    goal: settings.dailyGoal,
    entries: [],
  };

  const todayTotal = todayRecord.entries.reduce((acc, curr) => acc + curr.amount, 0);
  const todayPercentage = Math.min(100, Math.round((todayTotal / (todayRecord.goal || settings.dailyGoal)) * 100));

  // Add water
  const addWater = useCallback(
    (amount: number) => {
      const dateStr = getTodayDateString();
      const newEntry: WaterEntry = {
        id: "entry_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        amount,
        timestamp: new Date().toISOString(),
      };

      const existingRecord = records[dateStr] || {
        date: dateStr,
        goal: settings.dailyGoal,
        entries: [],
      };

      const updatedRecord: DailyHydration = {
        ...existingRecord,
        goal: existingRecord.goal || settings.dailyGoal,
        entries: [newEntry, ...existingRecord.entries],
      };

      const updatedRecords = {
        ...records,
        [dateStr]: updatedRecord,
      };

      saveRecords(updatedRecords);
      setLastAddedEntry({ date: dateStr, entryId: newEntry.id });

      saveReminders({
        ...reminders,
        lastDismissedOrLoggedTime: new Date().toISOString(),
      });

      return newEntry;
    },
    [records, settings.dailyGoal, saveRecords, saveReminders, reminders]
  );

  // Delete water entry
  const deleteWater = useCallback(
    (entryId: string, dateStr: string = getTodayDateString()) => {
      const targetRecord = records[dateStr];
      if (!targetRecord) return;

      const entryIndex = targetRecord.entries.findIndex((e) => e.id === entryId);
      if (entryIndex === -1) return;

      const deletedEntry = targetRecord.entries[entryIndex];
      const newEntries = targetRecord.entries.filter((e) => e.id !== entryId);

      const updatedRecords = {
        ...records,
        [dateStr]: {
          ...targetRecord,
          entries: newEntries,
        },
      };

      setLastDeletedEntry({ date: dateStr, entry: deletedEntry, index: entryIndex });
      saveRecords(updatedRecords);
    },
    [records, saveRecords]
  );

  // Undo delete
  const undoDelete = useCallback(() => {
    if (!lastDeletedEntry) return;

    const { date, entry } = lastDeletedEntry;
    const targetRecord = records[date] || {
      date,
      goal: settings.dailyGoal,
      entries: [],
    };

    const updatedEntries = [entry, ...targetRecord.entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    saveRecords({
      ...records,
      [date]: {
        ...targetRecord,
        entries: updatedEntries,
      },
    });

    setLastDeletedEntry(null);
  }, [lastDeletedEntry, records, saveRecords, settings.dailyGoal]);

  // Undo last added entry
  const undoLastAdd = useCallback(() => {
    if (!lastAddedEntry) return;
    deleteWater(lastAddedEntry.entryId, lastAddedEntry.date);
    setLastAddedEntry(null);
  }, [lastAddedEntry, deleteWater]);

  // Edit water entry
  const editWater = useCallback(
    (entryId: string, newAmount: number, dateStr: string = getTodayDateString()) => {
      const targetRecord = records[dateStr];
      if (!targetRecord) return;

      const updatedEntries = targetRecord.entries.map((e) => (e.id === entryId ? { ...e, amount: newAmount } : e));

      saveRecords({
        ...records,
        [dateStr]: {
          ...targetRecord,
          entries: updatedEntries,
        },
      });
    },
    [records, saveRecords]
  );

  // Streak calculations
  const calculateStreak = useCallback(() => {
    let streak = 0;
    let maxStreak = 0;
    let currentTemp = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    const todayRecordCurrent = records[getTodayDateString(today)];
    const todayGoalMet = todayRecordCurrent
      ? todayRecordCurrent.entries.reduce((a, b) => a + b.amount, 0) >= (todayRecordCurrent.goal || settings.dailyGoal)
      : false;

    if (!todayGoalMet) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = getTodayDateString(checkDate);
      const rec = records[dateStr];
      const goal = rec?.goal || settings.dailyGoal;
      const total = rec ? rec.entries.reduce((a, b) => a + b.amount, 0) : 0;

      if (total >= goal && total > 0) {
        currentTemp += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    streak = todayGoalMet ? currentTemp + 1 : currentTemp;

    const sortedDates = Object.keys(records).sort();
    let tempMax = 0;
    let running = 0;
    sortedDates.forEach((d) => {
      const r = records[d];
      const tot = r.entries.reduce((a, b) => a + b.amount, 0);
      if (tot >= (r.goal || settings.dailyGoal)) {
        running += 1;
        if (running > tempMax) tempMax = running;
      } else {
        running = 0;
      }
    });

    maxStreak = Math.max(tempMax, streak);

    return { currentStreak: streak, maxStreak, todayGoalMet };
  }, [records, settings.dailyGoal]);

  const { currentStreak, maxStreak, todayGoalMet } = calculateStreak();

  const totalSipsAllTime = Object.values(records).reduce((acc, rec) => acc + rec.entries.length, 0);

  const unlockedAchievements = ACHIEVEMENTS.filter((ach) =>
    ach.unlockedIf({
      totalSips: totalSipsAllTime,
      currentStreak,
      goalReachedToday: todayGoalMet,
      maxStreak,
    })
  );

  const clearTodayData = useCallback(() => {
    const updated = { ...records };
    delete updated[todayStr];
    saveRecords(updated);
  }, [records, todayStr, saveRecords]);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.HYDRATION_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.REMINDER_SETTINGS);
    setRecords({});
    setSettings(DEFAULT_SETTINGS);
    setReminders(DEFAULT_REMINDERS);
  }, []);

  return {
    isLoaded,
    records,
    settings,
    reminders,
    todayRecord,
    todayTotal,
    todayPercentage,
    todayGoalMet,
    currentStreak,
    maxStreak,
    totalSipsAllTime,
    unlockedAchievements,
    lastDeletedEntry,
    adminMessageUpdatedSignal,
    addWater,
    deleteWater,
    editWater,
    undoDelete,
    undoLastAdd,
    saveSettings,
    saveReminders,
    clearTodayData,
    resetAllData,
  };
}
