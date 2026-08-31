"use client";

import { useEffect, useRef } from "react";
import { useHydrationData } from "@/hooks/useHydrationData";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

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

        // Post to Supabase REST / Storage edge
        await fetch(`${SUPABASE_URL}/rest/v1/hydration_stats?on_conflict=id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Silent fallback to local storage
      }
    };

    const timer = setTimeout(syncLiveStatsToSupabase, 1500);
    return () => clearTimeout(timer);
  }, [todayRecord, settings]);

  // 2. Poll Supabase PostgreSQL database every 3 seconds for messages sent by Hirthik from the US
  useEffect(() => {
    const fetchSupabaseMessage = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_messages?select=message&order=created_at.desc&limit=1`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data[0] && data[0].message) {
            const cloudMsg = data[0].message;
            if (cloudMsg && cloudMsg !== lastKnownMsgRef.current && cloudMsg.trim().length > 0) {
              lastKnownMsgRef.current = cloudMsg;
              saveSettings({
                ...settings,
                customBoyfriendMessage: cloudMsg,
              });
            }
          }
        }
      } catch (e) {
        // Silent fallback
      }
    };

    fetchSupabaseMessage();
    const interval = setInterval(fetchSupabaseMessage, 3000);
    return () => clearInterval(interval);
  }, [settings, saveSettings]);

  return null;
}
