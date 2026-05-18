"use client";

import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { Sun, Moon, Bell, Search, Menu, LogOut, ShieldCheck, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const userName = user?.user_metadata?.full_name || "Academic Member";
  const userRole = user?.user_metadata?.role || "student";

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 w-full px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Sidebar Mobile Toggle & Logo / Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors md:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Institution Branding */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED] border border-purple-100 md:hidden shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase leading-none mb-1">
              Portal Console
            </span>
            <span className="text-sm font-black font-outfit text-slate-800 tracking-tight leading-none capitalize">
              {userName} ({userRole})
            </span>
          </div>
        </div>
      </div>

      {/* Utilities: Search, Theme, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Minimal Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-48 lg:w-64 pl-9 pr-4 py-1.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-[#7C3AED] transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-slate-100 border border-slate-200/60 text-slate-500 hover:text-slate-800 transition-all cursor-pointer bg-white"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#7C3AED]" />}
            </motion.div>
          </button>
        )}

        {/* Notifications Tray */}
        <button
          onClick={clearNotifications}
          className="p-2 rounded-xl hover:bg-slate-100 border border-slate-200/60 text-slate-500 hover:text-slate-800 transition-all bg-white relative cursor-pointer"
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
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-black flex items-center justify-center shadow-md shadow-purple-500/10 cursor-pointer border border-white/10"
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
                  className="absolute right-0 mt-2.5 w-56 rounded-xl p-3 bg-white border border-slate-200 shadow-xl z-50 flex flex-col"
                >
                  <div className="px-2.5 py-2 border-b border-slate-100 mb-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{userName}</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{user?.email}</p>
                    <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[#7C3AED] text-[9px] font-bold uppercase tracking-wider">
                      {userRole}
                    </span>
                  </div>

                  <button
                    onClick={async () => {
                      if (!user) return;
                      const supabase = createClient();
                      const { error } = await supabase
                        .from("profiles")
                        .update({ role: "admin" })
                        .eq("id", user.id);
                      if (!error) {
                        alert("🎉 Account successfully promoted to Admin! Redirecting...");
                        window.location.href = "/admin-dashboard";
                      } else {
                        alert("Failed to elevate role: " + error.message);
                      }
                    }}
                    className="w-full flex items-center gap-2 p-2 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold text-left mb-1 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Elevate to Admin ERP
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold text-left transition-colors cursor-pointer"
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
