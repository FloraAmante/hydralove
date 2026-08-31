"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X, Droplet } from "lucide-react";

interface AdminMessagePopupModalProps {
  message?: string;
  boyfriendName: string;
  girlfriendName: string;
  updatedSignal: { timestamp: number; message: string } | null;
}

export function AdminMessagePopupModal({
  message,
  boyfriendName,
  girlfriendName,
  updatedSignal,
}: AdminMessagePopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState(message || "");

  useEffect(() => {
    if (updatedSignal && updatedSignal.message) {
      setCurrentDisplayMessage(updatedSignal.message);
      setIsOpen(true);
    }
  }, [updatedSignal]);

  if (!isOpen || !currentDisplayMessage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-pink-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 shadow-2xl border-2 border-pink-400 dark:border-pink-800 text-center overflow-hidden"
        >
          {/* Top Heart Pulse Badge */}
          <div className="w-14 h-14 rounded-full bg-pink-500 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-pink-300/50 dark:shadow-none animate-bounce">
            <Heart className="w-7 h-7 fill-white" />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>New Note From {boyfriendName}!</span>
          </h3>

          <p className="mt-4 text-base font-extrabold text-slate-800 dark:text-slate-100 italic leading-relaxed px-2">
            “{currentDisplayMessage}”
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>I&apos;ll drink water right now! ❤️</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
