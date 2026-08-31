"use client";

import { useState } from "react";
import { useHydrationData, getTodayDateString } from "@/hooks/useHydrationData";
import { History, Calendar, Check, Droplet, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { records, settings } = useHydrationData();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = getTodayDateString(d);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const record = records[dateStr];
    const total = record ? record.entries.reduce((a, b) => a + b.amount, 0) : 0;
    const goal = record?.goal || settings.dailyGoal;
    const pct = Math.min(100, Math.round((total / goal) * 100));

    return {
      dateStr,
      dayName,
      total,
      goal,
      pct,
      isGoalMet: total >= goal && total > 0,
      displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  // Selected date record details
  const selectedRecord = records[selectedDate] || {
    date: selectedDate,
    goal: settings.dailyGoal,
    entries: [],
  };

  const selectedTotal = selectedRecord.entries.reduce((a, b) => a + b.amount, 0);
  const selectedPct = Math.min(100, Math.round((selectedTotal / (selectedRecord.goal || settings.dailyGoal)) * 100));

  const formatSelectedDateTitle = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-sky-500" />
          <span>Hydration History 📊</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your little daily sips over time.
        </p>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Last 7 Days</h3>

        <div className="flex items-end justify-between h-40 gap-2 px-1 pt-4">
          {last7Days.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            const barHeightPct = Math.max(10, item.pct);

            return (
              <div
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {item.pct}%
                </span>

                <div className="w-full h-28 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPct}%` }}
                    transition={{ duration: 0.5 }}
                    className={`w-full rounded-xl transition-colors ${
                      item.isGoalMet
                        ? "bg-gradient-to-t from-sky-500 to-sky-400"
                        : "bg-gradient-to-t from-sky-300 to-sky-200 dark:from-sky-700 dark:to-sky-600"
                    } ${isSelected ? "ring-2 ring-sky-500 shadow-md" : ""}`}
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`text-xs font-semibold block ${
                      isSelected ? "text-sky-600 dark:text-sky-400 font-bold" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.dayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Calendar Inspector */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatSelectedDateTitle(selectedDate)}
            </h3>
          </div>
          <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-1 rounded-full border border-sky-100 dark:border-sky-800">
            {selectedTotal} / {selectedRecord.goal || settings.dailyGoal} ml
          </span>
        </div>

        {selectedRecord.entries.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No sips recorded for this day.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {selectedRecord.entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Droplet className="w-4 h-4 text-sky-400 fill-sky-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{entry.amount} ml</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
