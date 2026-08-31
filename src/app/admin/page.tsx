"use client";

import { useHydrationData } from "@/hooks/useHydrationData";
import { BOYFRIEND_PERSONAL_MESSAGES } from "@/lib/constants";
import { CLOUD_ENDPOINTS } from "@/lib/supabase";
import { ShieldCheck, Heart, Send, Sparkles, Activity, CheckCircle2, RefreshCw, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LiveStatsData {
  todayTotal: number;
  todayPercentage: number;
  dailyGoal: number;
  entriesCount: number;
  lastSipTimestamp: string | null;
  updatedAt: string | null;
}

export default function AdminPage() {
  const { settings, saveSettings, todayRecord, todayTotal, todayPercentage } = useHydrationData();
  const [customMsg, setCustomMsg] = useState(settings.customBoyfriendMessage || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSendingCloud, setIsSendingCloud] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStatsData | null>(null);

  // Poll live stats from cloud DB (Malar's live data from India)
  useEffect(() => {
    const fetchLiveCloudStats = async () => {
      try {
        const res = await fetch(`${CLOUD_ENDPOINTS.STATS_DB}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.todayTotal === "number") {
            setLiveStats(data);
          }
        }
      } catch (e) {
        // Fallback to local
      }
    };

    fetchLiveCloudStats();
    const interval = setInterval(fetchLiveCloudStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const dispatchToCloudDB = async (messageText: string) => {
    setIsSendingCloud(true);

    // Save locally
    saveSettings({
      ...settings,
      customBoyfriendMessage: messageText,
    });

    try {
      // Push message directly to Cloud DB (KV storage)
      await fetch(CLOUD_ENDPOINTS.MESSAGE_RELAY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sentBy: settings.boyfriendName,
          timestamp: new Date().toISOString(),
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Cloud DB Push error:", err);
    } finally {
      setIsSendingCloud(false);
    }
  };

  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    dispatchToCloudDB(customMsg);
  };

  const handleQuickPreset = (presetText: string) => {
    setCustomMsg(presetText);
    dispatchToCloudDB(presetText);
  };

  const activeStats = liveStats || {
    todayTotal,
    todayPercentage,
    dailyGoal: settings.dailyGoal,
    entriesCount: todayRecord.entries.length,
    lastSipTimestamp: todayRecord.entries[0] ? todayRecord.entries[0].timestamp : null,
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0 space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-sky-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 font-bold text-xs mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Boyfriend Cloud Console 👑</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          Remote Control for {settings.name} ❤️
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Connected via Cloud Database. Send notes from US to India & monitor her sips in real time!
        </p>
      </div>

      {/* Live Hydration Stats Monitor for US -> India */}
      <div className="bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 dark:from-sky-950/50 dark:to-slate-900 border border-sky-200 dark:border-sky-900/60 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Her Live Hydration (India)</span>
          </h3>
          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Cloud Database Syncing
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center my-3 bg-white/70 dark:bg-slate-900/80 p-3 rounded-2xl border border-sky-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Daily Goal</span>
            <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
              {activeStats.dailyGoal} ml
            </span>
          </div>

          <div className="border-x border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Drank Today</span>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
              {activeStats.todayTotal} ml
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Hydrated</span>
            <span className="text-sm font-extrabold text-pink-500">
              {activeStats.todayPercentage}%
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1 font-medium">
          <span>Total Sips Logged: {activeStats.entriesCount}</span>
          <span>
            Last Sip:{" "}
            {activeStats.lastSipTimestamp
              ? new Date(activeStats.lastSipTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "None yet"}
          </span>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-sky-500/10 dark:from-pink-950/40 dark:to-sky-950/40 border border-pink-200 dark:border-pink-900/40 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Message Active
          </span>
          <span className="text-[10px] bg-pink-200/50 dark:bg-pink-900/50 px-2 py-0.5 rounded-full">
            Cloud Synced
          </span>
        </div>

        <p className="text-base font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed pl-3 border-l-2 border-pink-400 my-2">
          “{settings.customBoyfriendMessage || "Drink water, sleepyhead. I love you! ❤️"}”
        </p>

        <div className="text-right text-xs font-bold text-pink-500">
          — {settings.boyfriendName} ❤️
        </div>
      </div>

      {/* Send Custom Message Form */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Send className="w-4 h-4 text-sky-500" />
          <span>Dispatch Cloud Notification (US to India)</span>
        </h2>

        <form onSubmit={handleSaveMessage} className="space-y-3">
          <textarea
            rows={3}
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="e.g. Drink water, idiot. I love you. ❤️"
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-pink-400 leading-relaxed"
          />

          <div className="flex items-center justify-between">
            {savedSuccess ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pushed to Cloud DB & Pop-Up Sent! ❤️</span>
              </motion.span>
            ) : (
              <span className="text-[11px] text-slate-400">Triggers pop-up on her device in India</span>
            )}

            <button
              type="submit"
              disabled={isSendingCloud}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSendingCloud ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Remote Pop-Up 💌</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick One-Tap Presets */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Quick Remote Presets</span>
        </h2>

        <div className="space-y-2">
          {[
            "Drink water, idiot. I love you. ❤️",
            "Take a sip for me, pretty girl! 💧💙",
            "I'm super proud of you. Drink some water and get rest! 🌸",
            "Emergency meeting: you + a glass of water. Now. 😤❤️",
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPreset(preset)}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>“{preset}”</span>
              <span className="text-[10px] text-pink-500 font-bold ml-2 shrink-0">Send</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
