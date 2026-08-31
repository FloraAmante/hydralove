"use client";

import { useEffect, useRef } from "react";
import { useHydrationData } from "@/hooks/useHydrationData";
import { CLOUD_ENDPOINTS } from "@/lib/supabase";

export function CloudSyncManager() {
  const { settings, todayRecord, saveSettings } = useHydrationData();
  const lastKnownMsgRef = useRef<string>(settings.customBoyfriendMessage || "");

  // 1. Sync Malar's live hydration stats to cloud DB whenever she drinks water
  useEffect(() => {
    if (!todayRecord) return;

    const syncLiveStatsToCloud = async () => {
      try {
        const payload = {
          name: settings.name,
          boyfriendName: settings.boyfriendName,
          dailyGoal: settings.dailyGoal,
          todayTotal: todayRecord.entries.reduce((a, b) => a + b.amount, 0),
          todayPercentage: Math.min(100, Math.round((todayRecord.entries.reduce((a, b) => a + b.amount, 0) / (todayRecord.goal || settings.dailyGoal)) * 100)),
          entriesCount: todayRecord.entries.length,
          lastSipTimestamp: todayRecord.entries[0] ? todayRecord.entries[0].timestamp : null,
          updatedAt: new Date().toISOString(),
        };

        await fetch(CLOUD_ENDPOINTS.STATS_DB, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Resilient fallback
      }
    };

    const timer = setTimeout(syncLiveStatsToCloud, 1000);
    return () => clearTimeout(timer);
  }, [todayRecord, settings]);

  // 2. Poll Cloud DB every 3 seconds for messages sent by Hirthik from the US
  useEffect(() => {
    const fetchCloudMessage = async () => {
      try {
        const response = await fetch(`${CLOUD_ENDPOINTS.MESSAGE_RELAY}?t=${Date.now()}`);
        if (response.ok) {
          const text = await response.text();
          let cloudMsg = "";
          try {
            const parsed = JSON.parse(text);
            cloudMsg = parsed.message || parsed;
          } catch {
            cloudMsg = text;
          }

          if (cloudMsg && cloudMsg !== lastKnownMsgRef.current && cloudMsg.trim().length > 0) {
            lastKnownMsgRef.current = cloudMsg;
            saveSettings({
              ...settings,
              customBoyfriendMessage: cloudMsg,
            });
          }
        }
      } catch (e) {
        // Resilient polling
      }
    };

    // Immediate check + fast 3s polling loop
    fetchCloudMessage();
    const interval = setInterval(fetchCloudMessage, 3000);
    return () => clearInterval(interval);
  }, [settings, saveSettings]);

  return null;
}
