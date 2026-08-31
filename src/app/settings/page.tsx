"use client";

import { useHydrationData } from "@/hooks/useHydrationData";
import { useNotifications } from "@/hooks/useNotifications";
import { ReminderStatusBadge } from "@/components/reminders/NotificationPermission";
import { CONFIG } from "@/lib/constants";
import { Settings, Bell, Heart, Sun, Trash2, Download, RefreshCw, Check } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const {
    settings,
    reminders,
    saveSettings,
    saveReminders,
    clearTodayData,
    resetAllData,
    records,
  } = useHydrationData();

  const { permission, requestPermission } = useNotifications(reminders, settings.name);

  const [confirmClearToday, setConfirmClearToday] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ records, settings, reminders }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hydralove_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-0 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-500" />
          <span>Settings ⚙️</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize HydraLove to fit your day perfectly.
        </p>
      </div>

      <ReminderStatusBadge permission={permission} remindersEnabled={reminders.enabled} />

      {/* Hydration Settings */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Hydration Goals</span>
        </h2>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
            Daily Water Goal (ml)
          </label>
          <div className="flex flex-wrap gap-2">
            {CONFIG.GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => saveSettings({ ...settings, dailyGoal: g })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  settings.dailyGoal === g
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                }`}
              >
                {g} ml
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Your hydration goal is a personal target and can be adjusted to your needs.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
            Default Sip Amount (ml)
          </label>
          <div className="flex gap-2">
            {CONFIG.DEFAULT_QUICK_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => saveSettings({ ...settings, defaultDrinkSize: sz })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  settings.defaultDrinkSize === sz
                    ? "bg-sky-500 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                }`}
              >
                {sz} ml
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <Bell className="w-4 h-4 text-sky-500" />
          <span>Your Reminders 💌</span>
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enable Reminders</span>
          <button
            onClick={() => saveReminders({ ...reminders, enabled: !reminders.enabled })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              reminders.enabled ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                reminders.enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {permission !== "granted" && (
          <button
            onClick={requestPermission}
            className="w-full py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs border border-sky-200 dark:border-sky-800 cursor-pointer"
          >
            Request Notification Permission 🔔
          </button>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Start Time</label>
            <input
              type="time"
              value={reminders.startTime}
              onChange={(e) => saveReminders({ ...reminders, startTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">End Time</label>
            <input
              type="time"
              value={reminders.endTime}
              onChange={(e) => saveReminders({ ...reminders, endTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Reminder Interval</label>
          <select
            value={reminders.intervalMinutes}
            onChange={(e) => saveReminders({ ...reminders, intervalMinutes: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes (Default)</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>
      </div>

      {/* Personalization */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Personalization</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Your Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => saveSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Boyfriend Name</label>
            <input
              type="text"
              value={settings.boyfriendName}
              onChange={(e) => saveSettings({ ...settings, boyfriendName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">❤️ Love Mode</span>
          <button
            onClick={() => saveSettings({ ...settings, loveMode: !settings.loveMode })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              settings.loveMode ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.loveMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Data & Privacy</span>
        </h2>

        <p className="text-xs text-slate-400">
          Your hydration data is stored locally on this device.
        </p>

        <button
          onClick={handleExportData}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Local Data JSON</span>
        </button>

        {confirmClearToday ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearTodayData();
                setConfirmClearToday(false);
              }}
              className="flex-1 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Confirm Clear Today
            </button>
            <button
              onClick={() => setConfirmClearToday(false)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-xs rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClearToday(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 cursor-pointer"
          >
            Clear Today&apos;s Sips
          </button>
        )}

        {confirmResetAll ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetAllData();
                setConfirmResetAll(false);
              }}
              className="flex-1 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Confirm Reset Everything
            </button>
            <button
              onClick={() => setConfirmResetAll(false)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-xs rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmResetAll(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 font-semibold text-xs hover:bg-rose-50 hover:text-rose-500 cursor-pointer"
          >
            Reset All Application Data
          </button>
        )}
      </div>
    </div>
  );
}
