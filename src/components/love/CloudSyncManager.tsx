"use client";

import { useEffect } from "react";
import { useHydrationData, getTodayDateString } from "@/hooks/useHydrationData";
import { UserSettings, DailyHydration } from "@/types";

interface SyncPayload {
  settings?: UserSettings;
  todayRecord?: DailyHydration;
  timestamp?: number;
}

export function CloudSyncManager({
  apiKey = "hydralove_secret_key_123",
}: {
  apiKey?: string;
}) {
  const { settings, todayRecord, saveSettings } = useHydrationData();

  // 1. Send her live hydration stats to free cloud JSON bin every time she drinks water
  useEffect(() => {
    if (!todayRecord || todayRecord.entries.length === 0) return;

    const syncStatsToCloud = async () => {
      try {
        const payload: SyncPayload = {
          settings,
          todayRecord,
          timestamp: Date.now(),
        };

        // Uses free JSONbin.io endpoint or public edge kv
        await fetch("https://api.jsonbin.io/v3/b", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Bin-Private": "false",
            "X-Bin-Name": "hydralove_live_stats",
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Silent catch for offline resiliency
      }
    };

    const timer = setTimeout(syncStatsToCloud, 2000);
    return () => clearTimeout(timer);
  }, [todayRecord, settings]);

  // 2. Poll for remote messages sent by Hirthik from US across continents
  useEffect(() => {
    const pollRemoteMessages = async () => {
      try {
        const res = await fetch(
          `https://api.npoint.io/hydralove_admin_channel?t=${Date.now()}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.message && data.message !== settings.customBoyfriendMessage) {
            saveSettings({
              ...settings,
              customBoyfriendMessage: data.message,
            });
          }
        }
      } catch (e) {
        // Silent catch
      }
    };

    const interval = setInterval(pollRemoteMessages, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [settings, saveSettings]);

  return null;
}
