"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Heart, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: History },
    { href: "/love", label: "Love", icon: Heart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-sky-100 dark:border-slate-800 px-6 py-2 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 py-1.5 px-3 text-xs font-semibold cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 bg-sky-100/70 dark:bg-sky-950/60 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? "text-sky-500 fill-sky-100 dark:fill-sky-950 dark:text-sky-400 stroke-2"
                    : "text-slate-400 dark:text-slate-500 stroke-1.5"
                }`}
              />
              <span
                className={`text-[11px] transition-colors ${
                  isActive ? "text-sky-600 dark:text-sky-400 font-bold" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: History },
    { href: "/love", label: "Love", icon: Heart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-sky-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2.5 rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-300/40">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">HydraLove 💧</h1>
          <p className="text-[11px] text-slate-400">A little sip of love</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-500 text-white shadow-md shadow-sky-300/30 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-white/20" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 text-center">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Made with ❤️ for Malar</p>
        <p className="text-[10px] text-slate-400 mt-1">HydraLove v1.0 • Client-side</p>
      </div>
    </aside>
  );
}
