"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Undo2 } from "lucide-react";
import { CONFIG } from "@/lib/constants";

interface QuickAddProps {
  onAdd: (amount: number) => void;
  onUndoLast?: () => void;
  showUndoBtn?: boolean;
  girlfriendName: string;
}

export function QuickAdd({ onAdd, onUndoLast, showUndoBtn, girlfriendName }: QuickAddProps) {
  const [lastAddedAmount, setLastAddedAmount] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelect = (amount: number) => {
    onAdd(amount);
    setLastAddedAmount(amount);

    const cuteEncouragements = [
      `+${amount} ml added 💧 You're doing good, ${girlfriendName} ❤️`,
      `+${amount} ml 💧 Good girl. Keep going ❤️`,
      `+${amount} ml 💙 Another sip of love!`,
      `+${amount} ml 💧 Proud of you taking care of yourself!`,
    ];

    const randomMsg = cuteEncouragements[Math.floor(Math.random() * cuteEncouragements.length)];
    setToastMessage(randomMsg);

    // Auto hide toast after 4 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 px-2">
      {/* Toast Feedback for Recent Sip */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-pink-500 text-white font-medium text-sm flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
              <span>{toastMessage}</span>
            </div>
            {showUndoBtn && onUndoLast && (
              <button
                onClick={() => {
                  onUndoLast();
                  setToastMessage(null);
                }}
                className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preset Amount Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CONFIG.DEFAULT_QUICK_SIZES.map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(size)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-sky-300 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>+{size} ml</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
