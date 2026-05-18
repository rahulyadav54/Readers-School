"use client";

import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { Sun, Moon, Bell, Search, Menu, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, notificationCount, clearNotifications } = useUIStore();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Prevent hydration error due to theme switching
  useEffect(() => {
    setMounted(true);
  }, []);

  const userInitial = user?.email ? user.email.slice(0, 2).toUpperCase() : "ST";
  const userName = user?.user_metadata?.full_name || "Academic Cadet";
  const userRole = user?.user_metadata?.role || "Cadet";

  return (
    <header className="glass-panel sticky top-0 z-40 w-full px-4 py-3 sm:px-6 flex items-center justify-between border-b border-foreground/5 bg-background/50 backdrop-blur-md">
      {/* Sidebar Mobile Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/75 hover:text-foreground transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Greeting */}
        <div className="hidden sm:block">
          <h2 className="text-xs uppercase font-semibold tracking-widest text-foreground/50">Academy System</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-outfit text-foreground/90">Cadet: {userName}</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse animate-float" />
            <Link 
              href="/dashboard/admin" 
              className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/10 hover:bg-violet-600/20 text-[#7C3AED] dark:text-violet-400 border border-violet-500/25 text-[10px] font-extrabold uppercase tracking-wider transition-all"
            >
              <span>Admin ERP</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Utilities Search, Theme, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Futuristic Search Field */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search terminal..."
            className="glass-input w-48 lg:w-64 pl-9 pr-4 py-1.5 rounded-lg text-xs"
          />
        </div>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-foreground/5 border border-foreground/5 text-foreground/75 hover:text-foreground transition-all cursor-pointer relative"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </motion.div>
          </button>
        )}

        {/* Notifications Tray */}
        <button
          onClick={clearNotifications}
          className="p-2 rounded-lg hover:bg-foreground/5 border border-foreground/5 text-foreground/75 hover:text-foreground transition-all relative"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm shadow-rose-500/25">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Card Toggler */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-indigo-500/10 cursor-pointer border border-white/10"
          >
            {userInitial}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                {/* Backdrop Clicker */}
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="glass-panel absolute right-0 mt-2.5 w-56 rounded-xl p-3 shadow-xl z-50 border border-foreground/5 flex flex-col"
                >
                  <div className="px-2.5 py-2 border-b border-foreground/5 mb-2">
                    <p className="text-xs font-semibold text-foreground/90 truncate">{userName}</p>
                    <p className="text-[10px] text-foreground/50 truncate font-mono uppercase mt-0.5">{user?.email}</p>
                    <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[9px] font-semibold uppercase">
                      {userRole}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 p-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors rounded-lg text-xs font-medium text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Secure Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
