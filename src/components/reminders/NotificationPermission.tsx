"use client";

import { motion } from "framer-motion";
import { BellRing, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { ReminderSettings } from "@/types";

interface NotificationPermissionCardProps {
  permission: NotificationPermission;
  isSupported: boolean;
  onRequestPermission: () => void;
  reminders: ReminderSettings;
}

export function NotificationPermissionCard({
  permission,
  isSupported,
  onRequestPermission,
  reminders,
}: NotificationPermissionCardProps) {
  if (permission === "granted") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/90 border border-sky-200/80 dark:border-slate-700 rounded-3xl p-5 shadow-xs mb-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-300/40">
          <BellRing className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span>💌 A tiny favor?</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Would you like me to remind you to drink water throughout the day?
          </p>

          {!isSupported && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/50">
              Your browser doesn&apos;t support background reminders here. You can still use the in-app reminder system.
            </p>
          )}

          <div className="mt-3.5 flex items-center gap-2.5">
            <button
              onClick={onRequestPermission}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Yes, remind me 💧</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ReminderStatusBadge({
  permission,
  remindersEnabled,
}: {
  permission: NotificationPermission;
  remindersEnabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-4">
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${remindersEnabled ? "bg-emerald-500" : "bg-slate-400"}`} />
        <span>Reminders: {remindersEnabled ? "Enabled" : "Disabled"}</span>
      </div>

      <span className="text-slate-300">•</span>

      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            permission === "granted" ? "bg-emerald-500" : permission === "denied" ? "bg-rose-500" : "bg-amber-500"
          }`}
        />
        <span>
          Notifications: {permission === "granted" ? "Allowed" : permission === "denied" ? "Denied" : "Permission needed"}
        </span>
      </div>
    </div>
  );
}
