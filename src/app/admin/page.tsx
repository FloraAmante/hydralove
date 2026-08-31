"use client";

import { useHydrationData } from "@/hooks/useHydrationData";
import { BOYFRIEND_PERSONAL_MESSAGES } from "@/lib/constants";
import { ShieldCheck, Heart, Send, Sparkles, Droplet, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { settings, saveSettings, clearTodayData, resetAllData } = useHydrationData();
  const [customMsg, setCustomMsg] = useState(settings.customBoyfriendMessage || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({
      ...settings,
      customBoyfriendMessage: customMsg,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleQuickPreset = (presetText: string) => {
    setCustomMsg(presetText);
    saveSettings({
      ...settings,
      customBoyfriendMessage: presetText,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0 space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-sky-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 font-bold text-xs mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Boyfriend Admin Control 👑</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          Messages for {settings.name} ❤️
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Send a custom note that instantly displays inside {settings.name}&apos;s HydraLove app!
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-sky-500/10 dark:from-pink-950/40 dark:to-sky-950/40 border border-pink-200 dark:border-pink-900/40 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Preview on Her Screen
          </span>
          <span className="text-[10px] bg-pink-200/50 dark:bg-pink-900/50 px-2 py-0.5 rounded-full">
            Active
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
          <span>Write a New Note</span>
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
                <span>Updated & Live! ❤️</span>
              </motion.span>
            ) : (
              <span className="text-[11px] text-slate-400">Appears immediately in her app</span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Send to Her App 💌
            </button>
          </div>
        </form>
      </div>

      {/* Quick One-Tap Presets */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Quick One-Tap Presets</span>
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
