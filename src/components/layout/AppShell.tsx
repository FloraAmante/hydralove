"use client";

import { useHydrationData } from "@/hooks/useHydrationData";
import { MobileNav, DesktopSidebar } from "@/components/layout/Navigation";
import { CloudSyncManager } from "@/components/love/CloudSyncManager";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { settings } = useHydrationData();

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50/70 via-white to-pink-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-sky-200`}>
      {/* Background Cross-Continent Cloud Sync Manager */}
      <CloudSyncManager />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Viewport */}
      <main className="flex-1 min-h-screen overflow-y-auto relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
