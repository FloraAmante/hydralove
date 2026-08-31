"use client";

import { useEffect, useRef } from "react";
import { useHydrationData } from "@/hooks/useHydrationData";
import { supabase } from "@/lib/supabase";

export function CloudSyncManager() {
  const { settings, todayRecord, saveSettings } = useHydrationData();
  const lastKnownMsgRef = useRef<string>(settings.customBoyfriendMessage || "");

  // 1. Sync Malar's live hydration stats to Supabase PostgreSQL database
  useEffect(() => {
    if (!todayRecord) return;

    const syncLiveStatsToSupabase = async () => {
      try {
        const total = todayRecord.entries.reduce((a, b) => a + b.amount, 0);
        const goal = todayRecord.goal || settings.dailyGoal;
        const pct = Math.min(100, Math.round((total / goal) * 100));

        const payload = {
          id: "current_stats",
          girlfriend_name: settings.name,
          boyfriend_name: settings.boyfriendName,
          daily_goal: goal,
          today_total: total,
          today_percentage: pct,
          entries_count: todayRecord.entries.length,
          last_sip_timestamp: todayRecord.entries[0] ? todayRecord.entries[0].timestamp : null,
          updated_at: new Date().toISOString(),
        };

        await supabase.from("hydration_stats").upsert(payload, { onConflict: "id" });
      } catch (e) {
        // Fallback to local storage
      }
    };

    const timer = setTimeout(syncLiveStatsToSupabase, 1500);
    return () => clearTimeout(timer);
  }, [todayRecord, settings]);

  // 2. Poll Supabase PostgreSQL database every 2.5s for messages sent by Hirthik from the US
  useEffect(() => {
    const fetchSupabaseMessage = async () => {
      try {
        const { data, error } = await supabase
          .from("admin_messages")
          .select("message")
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && Array.isArray(data) && data[0] && data[0].message) {
          const cloudMsg = data[0].message;
          if (cloudMsg && cloudMsg !== lastKnownMsgRef.current && cloudMsg.trim().length > 0) {
            lastKnownMsgRef.current = cloudMsg;
            saveSettings({
              ...settings,
              customBoyfriendMessage: cloudMsg,
            });
          }
        }
      } catch (e) {
        // Silent catch
      }
    };

    fetchSupabaseMessage();
    const interval = setInterval(fetchSupabaseMessage, 2500);
    return () => clearInterval(interval);
  }, [settings, saveSettings]);

  return null;
}
