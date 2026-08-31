"use client";

import { motion } from "framer-motion";
import { Droplet, Heart, CheckCircle } from "lucide-react";
import { CONFIG } from "@/lib/constants";
import { UserSettings } from "@/types";

interface OnboardingModalProps {
  onComplete: (name: string, goal: number, allowReminders: boolean) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(CONFIG.GIRLFRIEND_NAME);
  const [goal, setGoal] = useState<number>(CONFIG.DEFAULT_GOAL_ML);
  const [reminders, setReminders] = useState<boolean>(true);

  const handleFinish = () => {
    onComplete(name, goal, reminders);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-sky-100 dark:border-slate-800 text-center relative overflow-hidden"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? "w-6 bg-sky-500" : "w-1.5 bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div>
            <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-sky-950 text-sky-500 mx-auto flex items-center justify-center mb-4">
              <Droplet className="w-8 h-8 fill-sky-400 stroke-sky-500 animate-bounce" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              HydraLove 💧❤️
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
              A little sip of love, all day long.
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Let&apos;s get started
            </button>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">What&apos;s your name?</h3>
            <p className="text-xs text-slate-400 mt-1">So I can greet you warmly every day ❤️</p>

            <div className="mt-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-center text-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-400"
                placeholder="Your name"
              />
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full mt-6 py-3.5 rounded-2xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">What&apos;s your daily goal?</h3>
            <p className="text-xs text-slate-400 mt-1">You can change this anytime.</p>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {CONFIG.GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    goal === g
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {g} ml
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full mt-8 py-3.5 rounded-2xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Gentle Reminders */}
        {step === 4 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Want gentle reminders?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              I&apos;ll remind you to drink water throughout your day.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setReminders(true);
                  setStep(5);
                }}
                className="w-full py-3.5 rounded-2xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Yes, remind me 💧</span>
              </button>

              <button
                onClick={() => {
                  setReminders(false);
                  setStep(5);
                }}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs transition-all cursor-pointer"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ready */}
        {step === 5 && (
          <div>
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-500 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 fill-pink-400 stroke-pink-500" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              You&apos;re all set ❤️
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Let&apos;s take your first sip, {name}.
            </p>

            <button
              onClick={handleFinish}
              className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Drink Water 💧
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

import { useState } from "react";
