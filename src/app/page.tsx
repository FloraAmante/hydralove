"use client";

import { useState, useEffect } from "react";
import { useHydrationData } from "@/hooks/useHydrationData";
import { useNotifications } from "@/hooks/useNotifications";
import { WaterProgress } from "@/components/hydration/WaterProgress";
import { QuickAdd } from "@/components/hydration/QuickAdd";
import { WaterLog } from "@/components/hydration/WaterLog";
import { StreakCard, AchievementsList } from "@/components/achievements/StreakCard";
import { LoveMessage, DailyWinCard } from "@/components/love/LoveMessage";
import { NotificationPermissionCard } from "@/components/reminders/NotificationPermission";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DailyLoveMessageModal } from "@/components/love/DailyLoveMessage";
import { AdminMessagePopupModal } from "@/components/love/AdminMessagePopupModal";
import { STORAGE_KEYS, BOYFRIEND_PERSONAL_MESSAGES } from "@/lib/constants";
import { Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const {
    isLoaded,
    settings,
    reminders,
    todayRecord,
    todayTotal,
    todayPercentage,
    todayGoalMet,
    currentStreak,
    maxStreak,
    unlockedAchievements,
    lastDeletedEntry,
    adminMessageUpdatedSignal,
    addWater,
    deleteWater,
    editWater,
    undoDelete,
    undoLastAdd,
    saveSettings,
    saveReminders,
  } = useHydrationData();

  const { permission, isSupported, requestPermission, sendNotification, activeToast, dismissToast } = useNotifications(
    reminders,
    settings.name
  );

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [greetingIcon, setGreetingIcon] = useState("☀️");

  // Fire push notification whenever a new admin message is dispatched
  useEffect(() => {
    if (adminMessageUpdatedSignal && settings.customBoyfriendMessage) {
      sendNotification(
        `New Message from ${settings.boyfriendName} ❤️`,
        settings.customBoyfriendMessage
      );
    }
  }, [adminMessageUpdatedSignal, sendNotification, settings.boyfriendName, settings.customBoyfriendMessage]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
      setGreetingIcon("☀️");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
      setGreetingIcon("🌤️");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
      setGreetingIcon("🌙");
    } else {
      setGreeting("Hey sleepyhead");
      setGreetingIcon("🌙");
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const done = localStorage.getItem(STORAGE_KEYS.FIRST_TIME_DONE);
      if (!done) {
        setShowOnboarding(true);
      }
    }
  }, [isLoaded]);

  const handleOnboardingComplete = (name: string, goal: number, allowReminders: boolean) => {
    saveSettings({
      ...settings,
      name,
      dailyGoal: goal,
    });
    saveReminders({
      ...reminders,
      enabled: allowReminders,
    });
    if (allowReminders) {
      requestPermission();
    }
    localStorage.setItem(STORAGE_KEYS.FIRST_TIME_DONE, "true");
    setShowOnboarding(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-3 text-sky-500 font-semibold">
          <Heart className="w-10 h-10 fill-sky-400" />
          <span>Loading HydraLove...</span>
        </div>
      </div>
    );
  }

  const is150Percent = todayPercentage >= 150;
  const is100Percent = todayPercentage >= 100 && todayPercentage < 150;

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0">
      {/* Onboarding Modal */}
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      {/* Daily Love Message Popup */}
      <DailyLoveMessageModal girlfriendName={settings.name} boyfriendName={settings.boyfriendName} />

      {/* Real-time Admin Message Popup Notification */}
      <AdminMessagePopupModal
        message={settings.customBoyfriendMessage}
        boyfriendName={settings.boyfriendName}
        girlfriendName={settings.name}
        updatedSignal={adminMessageUpdatedSignal}
      />

      {/* In-App Toast Notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={dismissToast}
            className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-800 border border-pink-300 dark:border-slate-700 shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{activeToast.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeToast.message}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
              Tap to dismiss
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Greeting */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {greeting}, {settings.name} {greetingIcon}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Your body deserves a little care today. <span className="italic text-pink-500 font-semibold">“One little sip at a time.”</span>
        </p>
      </div>

      {/* Notification Permission Card */}
      <NotificationPermissionCard
        permission={permission}
        isSupported={isSupported}
        onRequestPermission={requestPermission}
        reminders={reminders}
      />

      {/* Main Hydration Circle Card */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-sky-100/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
        <WaterProgress
          currentMl={todayTotal}
          goalMl={todayRecord.goal || settings.dailyGoal}
          percentage={todayPercentage}
          onAddWater={addWater}
          defaultDrinkSize={settings.defaultDrinkSize}
        />

        {/* Quick Add Buttons */}
        <QuickAdd
          onAdd={addWater}
          onUndoLast={undoLastAdd}
          showUndoBtn={true}
          girlfriendName={settings.name}
        />
      </div>

      {/* Easter Egg Celebrations */}
      {is150Percent && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-4 rounded-3xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 text-center"
        >
          <p className="text-sm font-bold text-sky-800 dark:text-sky-200">
            Okay okay 😭 we get it. You&apos;re VERY hydrated. 💧😂
          </p>
          <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">— {settings.boyfriendName}</p>
        </motion.div>
      )}

      {is100Percent && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-4 rounded-3xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-900 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-pink-500">💧💧💧</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
            Hydrated. Beautiful. Still mine. ❤️
          </p>
          <p className="text-xs font-semibold text-pink-500 mt-0.5">— {settings.boyfriendName}</p>
        </motion.div>
      )}

      {/* Water Log */}
      <WaterLog
        entries={todayRecord.entries}
        onDelete={deleteWater}
        onEdit={editWater}
        onUndo={undoDelete}
        canUndo={Boolean(lastDeletedEntry)}
      />

      {/* Streak Card */}
      <StreakCard currentStreak={currentStreak} maxStreak={maxStreak} />

      {/* Achievements Card */}
      <AchievementsList unlockedIds={unlockedAchievements.map((a) => a.id)} />

      {/* Love Message Card */}
      {settings.loveMode && (
        <LoveMessage
          boyfriendName={settings.boyfriendName}
          customMessage={settings.customBoyfriendMessage}
          rotatingMessages={BOYFRIEND_PERSONAL_MESSAGES}
        />
      )}

      {/* Daily Win Summary */}
      <DailyWinCard percentage={todayPercentage} goalMet={todayGoalMet} />
    </div>
  );
}
