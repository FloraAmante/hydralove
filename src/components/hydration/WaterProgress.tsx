"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Droplet, Heart } from "lucide-react";

interface WaterProgressProps {
  currentMl: number;
  goalMl: number;
  percentage: number;
  onAddWater: (amount: number) => void;
  defaultDrinkSize: number;
}

export function WaterProgress({ currentMl, goalMl, percentage, onAddWater, defaultDrinkSize }: WaterProgressProps) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number }>>([]);
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger burst particles when progress reaches 100%
  useEffect(() => {
    if (percentage >= 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#60a5fa", "#f472b6", "#ec4899", "#93c5fd"],
        });
      } catch (e) {
        console.log("Confetti trigger:", e);
      }
    }
  }, [percentage]);

  const handleMainButtonClick = () => {
    // Pulse circle
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 800);

    // Spawn bubbles inside water
    const newBubbles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 70 + 15,
      delay: Math.random() * 0.4,
      size: Math.random() * 8 + 4,
    }));
    setBubbles((prev) => [...prev.slice(-10), ...newBubbles]);

    // Spawn floating heart particles
    const newHearts = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 60 + 20,
    }));
    setFloatingHearts((prev) => [...prev.slice(-6), ...newHearts]);

    onAddWater(defaultDrinkSize);
  };

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full">
      {/* Outer Circular Container */}
      <motion.div
        animate={isPulsing ? { scale: [1, 1.04, 0.98, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-b from-sky-100/80 via-white to-pink-100/60 dark:from-slate-800 dark:to-slate-900 shadow-xl shadow-sky-100/50 dark:shadow-none border border-sky-200/50 dark:border-slate-700/60 flex items-center justify-center group"
      >
        {/* Inner Liquid Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 flex items-center justify-center shadow-inner">
          {/* Animated Water Fill Layer */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-400 via-sky-300 to-sky-200 dark:from-sky-600 dark:via-sky-500 dark:to-sky-400"
            initial={{ height: "0%" }}
            animate={{ height: `${clampedPercentage}%` }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
          >
            {/* Wave animation top overlay */}
            <div className="absolute top-0 left-0 right-0 -translate-y-1/2 overflow-hidden h-4">
              <motion.div
                className="w-[200%] h-6 bg-sky-200/70 dark:bg-sky-400/50 rounded-[40%]"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
            </div>

            {/* Rising Bubbles */}
            {bubbles.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0.8, y: 40, scale: 0.5 }}
                animate={{ opacity: 0, y: -120, scale: 1.2 }}
                transition={{ duration: 1.5, delay: b.delay }}
                onAnimationComplete={() => setBubbles((prev) => prev.filter((p) => p.id !== b.id))}
                className="absolute bottom-2 rounded-full bg-white/70 shadow-sm"
                style={{
                  left: `${b.left}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
              />
            ))}
          </motion.div>

          {/* Floating Heart Particles */}
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, y: 20, scale: 0.6 }}
                animate={{ opacity: 0, y: -140, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                onAnimationComplete={() => setFloatingHearts((prev) => prev.filter((p) => p.id !== h.id))}
                className="absolute bottom-10 z-20 pointer-events-none text-pink-400"
                style={{ left: `${h.left}%` }}
              >
                <Heart className="w-5 h-5 fill-pink-400 stroke-pink-500" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Center Text Overlay */}
          <div className="relative z-10 flex flex-col items-center text-center p-4 selection:bg-none">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-xs mb-2 border border-sky-100 dark:border-slate-700"
            >
              <Droplet className="w-7 h-7 text-sky-500 fill-sky-400 dark:text-sky-300 dark:fill-sky-400" />
            </motion.div>

            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {currentMl.toLocaleString()} <span className="text-lg font-medium text-slate-500 dark:text-slate-400">ml</span>
            </span>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
              of {goalMl.toLocaleString()} ml
            </span>

            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-sky-600 dark:text-sky-300 font-bold text-sm shadow-xs border border-sky-200/50 dark:border-slate-700">
              {clampedPercentage}% hydrated
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Hydration Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleMainButtonClick}
        className="mt-6 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 text-white font-bold text-base shadow-lg shadow-sky-300/40 dark:shadow-none hover:shadow-xl hover:shadow-sky-400/50 transition-all cursor-pointer border border-sky-300/30"
      >
        <Droplet className="w-5 h-5 fill-white stroke-sky-200 animate-pulse" />
        <span>I drank water 💧</span>
      </motion.button>
    </div>
  );
}
