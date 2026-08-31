"use client";

import { useState, useEffect, useCallback } from "react";
import { ReminderSettings } from "@/types";
import { ROTATING_REMINDER_MESSAGES } from "@/lib/constants";

export function useNotifications(reminders: ReminderSettings, name: string) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [activeToast, setActiveToast] = useState<{ id: string; message: string; title?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch (e) {
      console.error("Error requesting notification permission:", e);
      return "denied";
    }
  }, []);

  // Pick a random message based on current mood/category
  const getRandomMessage = useCallback(() => {
    const categories = [ROTATING_REMINDER_MESSAGES.cute, ROTATING_REMINDER_MESSAGES.romantic, ROTATING_REMINDER_MESSAGES.playful];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const msg = category[Math.floor(Math.random() * category.length)];
    return msg.replace(/Malar|pretty girl|sleepyhead/g, name || "love");
  }, [name]);

  // Show a notification (browser push if permitted + in-app toast)
  const sendNotification = useCallback(
    (title: string = "HydraLove 💧❤️", body?: string) => {
      const messageBody = body || getRandomMessage();

      // Show in-app banner toast
      setActiveToast({
        id: "toast_" + Date.now(),
        title,
        message: messageBody,
      });

      // Browser Web Notification if allowed
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          const n = new Notification(title, {
            body: messageBody,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: "hydralove_reminder",
          });

          n.onclick = () => {
            window.focus();
            n.close();
          };
        } catch (e) {
          console.warn("Could not dispatch native notification:", e);
        }
      }
    },
    [getRandomMessage]
  );

  // Interval reminder background check loop (Smart reminders)
  useEffect(() => {
    if (!reminders.enabled) return;

    const checkAndTriggerReminder = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = reminders.startTime.split(":").map(Number);
      const [endH, endM] = reminders.endTime.split(":").map(Number);

      const startMinutes = startH * 60 + (startM || 0);
      const endMinutes = endH * 60 + (endM || 0);

      // Outside specified reminder hours
      if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        return;
      }

      // Check smart postpone: if water was logged in last 30 mins
      if (reminders.lastDismissedOrLoggedTime) {
        const lastTime = new Date(reminders.lastDismissedOrLoggedTime).getTime();
        const diffMinutes = (now.getTime() - lastTime) / (1000 * 60);

        if (diffMinutes < 30) {
          // Postpone reminder
          return;
        }
      }

      // Check last trigger time stored in sessionStorage to prevent spamming
      const lastTriggered = sessionStorage.getItem("hydralove_last_reminder_trigger");
      if (lastTriggered) {
        const elapsedMin = (now.getTime() - parseInt(lastTriggered, 10)) / (1000 * 60);
        if (elapsedMin < reminders.intervalMinutes) {
          return;
        }
      }

      // Trigger reminder
      sendNotification();
      sessionStorage.setItem("hydralove_last_reminder_trigger", now.getTime().toString());
    };

    // Check every 1 minute
    const timer = setInterval(checkAndTriggerReminder, 60000);
    return () => clearInterval(timer);
  }, [reminders, sendNotification]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    activeToast,
    dismissToast,
  };
}
