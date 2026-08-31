"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Droplet } from "lucide-react";

interface LoveMessageProps {
  boyfriendName: string;
  customMessage?: string;
  rotatingMessages: string[];
}

export function LoveMessage({ boyfriendName, customMessage, rotatingMessages }: LoveMessageProps) {
  // Select rotating message based on day of month so it changes daily
  const dayIndex = new Date().getDate() % rotatingMessages.length;
  const currentMsg = customMessage || rotatingMessages[dayIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-sky-500/10 dark:from-pink-950/40 dark:to-sky-950/40 border border-pink-200/60 dark:border-pink-900/40 rounded-3xl p-5 shadow-sm relative overflow-hidden my-6"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Heart className="w-24 h-24 text-pink-500 fill-pink-500" />
      </div>

      <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" />
        <span>From me ❤️</span>
      </div>

      <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed z-10 relative pl-3 border-l-2 border-pink-400">
        “{currentMsg}”
      </p>

      <div className="mt-3 flex items-center justify-end text-xs font-semibold text-pink-500 dark:text-pink-400 gap-1">
        <span>— {boyfriendName}</span>
        <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-none" />
      </div>
    </motion.div>
  );
}

export function DailyWinCard({ percentage, goalMet }: { percentage: number; goalMet: boolean }) {
  let title = "";
  let body = "";

  if (goalMet) {
    title = "You did it! 💧";
    body = "You reached your hydration goal today. I'm so proud of you! ❤️";
  } else if (percentage >= 50) {
    title = `You're at ${percentage}% 💙`;
    body = "A few more sips and you've got this.";
  } else {
    title = "No pressure ❤️";
    body = "Just start with one glass. Every little sip counts.";
  }

  return (
    <div className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs mb-6">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <Droplet className="w-3.5 h-3.5 text-sky-500" />
        <span>Today&apos;s little win ❤️</span>
      </h4>
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{body}</p>
    </div>
  );
}
