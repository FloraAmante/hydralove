"use client";

import { useEffect, useRef } from "react";
import { useHydrationData } from "@/hooks/useHydrationData";

export function CloudSyncManager() {
  const { settings, todayRecord, saveSettings } = useHydrationData();
  const lastKnownMsgRef = useRef<string>(settings.customBoyfriendMessage || "");

  // 1. Sync Malar's live hydration stats to public KV relay
  useEffect(() => {
    if (!todayRecord) return;

    const syncLiveStatsToCloud = async () => {
      try {
        const total = todayRecord.entries.reduce((a, b) => a + b.amount, 0);
        const goal = todayRecord.goal || settings.dailyGoal;
        const pct = Math.min(100, Math.round((total / goal) * 100));

        const payload = {
          girlfriend_name: settings.name,
          boyfriend_name: settings.boyfriendName,
          daily_goal: goal,
          today_total: total,
          today_percentage: pct,
          entries_count: todayRecord.entries.length,
          last_sip_timestamp: todayRecord.entries[0] ? todayRecord.entries[0].timestamp : null,
          updated_at: new Date().toISOString(),
        };

        await fetch("https://api.counterapi.dev/v1/hydralove/stats/up", { method: "GET" }).catch(() => {});

        // Save live JSON state to key-value cloud store (completely free, zero-auth public relay)
        await fetch("https://kvdb.io/4y9h9w79v5z9x9/hydralove_live_stats", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Silent fallback
      }
    };

    const timer = setTimeout(syncLiveStatsToCloud, 1500);
    return () => clearTimeout(timer);
  }, [todayRecord, settings]);

  // 2. Poll public KV database every 2 seconds for messages sent by Hirthik from the US
  useEffect(() => {
    const fetchCloudMessage = async () => {
      try {
        const response = await fetch(`https://kvdb.io/4y9h9w79v5z9x9/hydralove_custom_message?t=${Date.now()}`);
        if (response.ok) {
          const text = await response.text();
          let cloudMsg = text;
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
        // Silent fallback
      }
    };

    fetchCloudMessage();
    const interval = setInterval(fetchCloudMessage, 2000);
    return () => clearInterval(interval);
  }, [settings, saveSettings]);

  return null;
}
