"use client";

import { Flame, Trophy, Award, Lock } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/constants";
import { motion } from "framer-motion";

interface StreakCardProps {
  currentStreak: number;
  maxStreak: number;
}

export function StreakCard({ currentStreak, maxStreak }: StreakCardProps) {
  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800/80 dark:to-orange-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-3xl p-5 shadow-xs my-4 flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <motion.div
          animate={currentStreak > 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="p-3 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-300/50 dark:shadow-none"
        >
          <Flame className="w-6 h-6 fill-amber-200 stroke-orange-100" />
        </motion.div>

        <div>
          <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Hydration streak 🔥
          </h4>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
            {currentStreak} <span className="text-sm font-semibold text-slate-500">day streak</span>
          </p>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xs text-slate-400 dark:text-slate-500 block">Best Record</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          {maxStreak} days
        </span>
      </div>
    </div>
  );
}

interface AchievementsListProps {
  unlockedIds: string[];
}

export function AchievementsList({ unlockedIds }: AchievementsListProps) {
  return (
    <div className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs my-4">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-sky-500" />
        <span>Achievements</span>
        <span className="text-xs text-slate-400 font-normal">
          ({unlockedIds.length}/{ACHIEVEMENTS.length})
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                isUnlocked
                  ? "bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 shadow-xs"
                  : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60"
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{ach.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
