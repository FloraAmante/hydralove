"use client";

import { useState } from "react";
import { WaterEntry } from "@/types";
import { Droplet, Trash2, Edit2, Check, X, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WaterLogProps {
  entries: WaterEntry[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newAmount: number) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function WaterLog({ entries, onDelete, onEdit, onUndo, canUndo }: WaterLogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(250);

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  const startEdit = (entry: WaterEntry) => {
    setEditingId(entry.id);
    setEditValue(entry.amount);
  };

  const saveEdit = (id: string) => {
    if (editValue > 0) {
      onEdit(id, editValue);
    }
    setEditingId(null);
  };

  const totalToday = entries.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Today&apos;s sips</span>
          <span className="text-sky-500 font-normal text-sm">💧 ({entries.length})</span>
        </h3>

        {canUndo && onUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo delete</span>
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="py-8 text-center text-slate-400 dark:text-slate-400 flex flex-col items-center gap-2">
          <Droplet className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-1" />
          <p className="text-sm font-medium">No sips yet 💧</p>
          <p className="text-xs text-slate-400">Let&apos;s start with one glass.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-500 dark:text-sky-300">
                    <Droplet className="w-4 h-4 fill-sky-400 dark:fill-sky-400 stroke-none" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                      {formatTime(entry.timestamp)}
                    </p>
                    {editingId === entry.id ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-20 px-2 py-0.5 text-xs font-bold bg-white dark:bg-slate-800 border border-sky-300 rounded-lg text-slate-800 dark:text-slate-100"
                        />
                        <span className="text-xs font-medium text-slate-400">ml</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {entry.amount} ml
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {editingId === entry.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(entry.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
            <span>Today&apos;s Total</span>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{totalToday} ml</span>
          </div>
        </div>
      )}
    </div>
  );
}
