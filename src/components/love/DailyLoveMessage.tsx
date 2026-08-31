"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";
import { DAILY_LOVE_MESSAGES, STORAGE_KEYS } from "@/lib/constants";
import { getTodayDateString } from "@/hooks/useHydrationData";

interface DailyLovePopupProps {
  girlfriendName: string;
  boyfriendName: string;
}

export function DailyLoveMessageModal({ girlfriendName, boyfriendName }: DailyLovePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEYS.DAILY_LOVE_LAST_SHOWN);
      const today = getTodayDateString();

      if (lastShown !== today) {
        // Pick message based on date
        const msgIndex = new Date().getDate() % DAILY_LOVE_MESSAGES.length;
        setMessage(DAILY_LOVE_MESSAGES[msgIndex]);
        setIsOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_LOVE_LAST_SHOWN, getTodayDateString());
    } catch (e) {
      console.error(e);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-pink-200 dark:border-pink-900 text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-200/50 dark:bg-pink-900/30 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-500 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
              <span>A little message for you</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </h3>

            <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed px-2">
              “{message}”
            </p>

            <div className="mt-6">
              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I will! Thank you, {boyfriendName} ❤️</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
