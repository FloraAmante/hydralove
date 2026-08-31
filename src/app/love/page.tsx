"use client";

import { useHydrationData } from "@/hooks/useHydrationData";
import { SPECIAL_LOVE_PAGE_NOTE, BOYFRIEND_PERSONAL_MESSAGES, DAILY_LOVE_MESSAGES } from "@/lib/constants";
import { Heart, Sparkles, Droplet, Send, MessageCircleHeart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LovePage() {
  const { settings, saveSettings } = useHydrationData();
  const [customInput, setCustomInput] = useState(settings.customBoyfriendMessage || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({
      ...settings,
      customBoyfriendMessage: customInput,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-500 mx-auto flex items-center justify-center mb-2">
          <Heart className="w-6 h-6 fill-pink-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          A little corner from me ❤️
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Made with all my care for {settings.name}.
        </p>
      </div>

      {/* Special Main Letter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-pink-500/10 via-rose-500/5 to-white dark:from-pink-950/40 dark:to-slate-900 border border-pink-200 dark:border-pink-900/60 rounded-3xl p-6 shadow-md mb-6 relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Sparkles className="w-20 h-20 text-pink-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
          {SPECIAL_LOVE_PAGE_NOTE.title}
        </h2>

        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed whitespace-pre-line font-medium">
          {SPECIAL_LOVE_PAGE_NOTE.content}
        </div>

        <p className="mt-6 text-right font-extrabold text-sm text-pink-600 dark:text-pink-400">
          {SPECIAL_LOVE_PAGE_NOTE.sign}
        </p>
      </motion.div>

      {/* Rotating Love Reminders */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
          <MessageCircleHeart className="w-4 h-4 text-pink-500" />
          <span>Little reminders from {settings.boyfriendName}</span>
        </h3>

        <div className="space-y-2.5">
          {BOYFRIEND_PERSONAL_MESSAGES.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2"
            >
              <span className="text-pink-500">❤️</span>
              <span>“{msg}”</span>
            </div>
          ))}
        </div>
      </div>

      {/* Boyfriend / Admin Message Customizer */}
      <div className="bg-gradient-to-r from-sky-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/90 border border-sky-200 dark:border-slate-700 rounded-3xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
          <Send className="w-4 h-4 text-sky-500" />
          <span>Custom Love Note</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Update the personal message displayed on the main home screen.
        </p>

        <form onSubmit={handleSaveCustomMessage} className="space-y-3">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Drink water, idiot. I love you! ❤️"
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-pink-400"
          />

          <div className="flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-bold">Message updated! ❤️</span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Save Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
