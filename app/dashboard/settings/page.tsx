"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { 
  User, Settings, Sun, Moon, Bell, Shield, Database, 
  Trash2, RefreshCw, Sparkles, AlertCircle, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user, role, fullName, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // States
  const [profileName, setProfileName] = useState(fullName || "");
  const [swNotice, setSwNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration error due to theme switching
  useEffect(() => {
    setMounted(true);
    setProfileName(fullName || "");
  }, [fullName]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSwNotice("Profile settings saved inside sandbox state!");
      setTimeout(() => setSwNotice(null), 3000);
    }, 1200);
  };

  const handleClearCaches = () => {
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
      });
      setSwNotice("PWA Cache storage swept successfully!");
      setTimeout(() => setSwNotice(null), 3000);
    } else {
      setSwNotice("PWA Storage not available in standard environments.");
      setTimeout(() => setSwNotice(null), 3000);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Notice Overlay */}
      <AnimatePresence>
        {swNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold flex items-center gap-2.5 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>{swNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              System Settings
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Core Settings
          </h1>
          <p className="text-xs text-foreground/60">
            Edit your profiles details, toggle UI dark themes, and flush localized cache storages.
          </p>
        </div>
      </motion.div>

      {/* Main settings grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Details Edit Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-400" />
            Personal Profile Details
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="glass-input text-xs px-3 py-2 rounded-lg w-full opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Active Academic Role</label>
                <input
                  type="text"
                  disabled
                  value={role || ""}
                  className="glass-input text-xs px-3 py-2 rounded-lg w-full opacity-60 cursor-not-allowed uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">System Key ID</label>
                <input
                  type="text"
                  disabled
                  value={user?.id || ""}
                  className="glass-input text-[10px] px-3 py-2 rounded-lg w-full opacity-60 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1 transition-all cursor-pointer"
              >
                {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Save Profile Details"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Visual Settings Toggles */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-400" />
              Interface Settings
            </h3>

            {mounted && (
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-foreground/80">Interface Dark Theme</h5>
                    <p className="text-[9px] text-foreground/45 mt-0.5">Toggle visual display parameters</p>
                  </div>

                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-foreground/80">Cybernetic Alerts</h5>
                    <p className="text-[9px] text-foreground/45 mt-0.5">Receive audio/visual inbox updates</p>
                  </div>

                  <span className="inline-flex px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-extrabold uppercase text-[9px] font-mono border border-emerald-500/20">
                    Active
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-500 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            Wipe Credentials Session
          </button>
        </motion.div>
      </div>

      {/* Storage and caches controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PWA Sync and Cache Controls */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-400" />
            Service Worker Storage Sync
          </h3>

          <p className="text-xs text-foreground/60 leading-relaxed font-sans">
            Readers School supports fully compliant offline PWA service operations. If you encounter rendering lag or stale stylesheets during deployments, flush the client service worker database cache:
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleClearCaches}
              className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Sweep Offline Caches
            </button>
          </div>
        </motion.div>

        {/* System parameters logs details */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-400" />
            System Parameters
          </h3>

          <div className="space-y-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>Next.js Framework:</span>
              <span className="font-bold text-indigo-400">15.x Production App</span>
            </div>
            <div className="p-2 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>Zustand Context:</span>
              <span className="font-bold text-indigo-400">Integrated Store v4.x</span>
            </div>
            <div className="p-2 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>PWA Offline Mode:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-0.5">Manifest Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
