"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/lib/store/uiStore";
import { CheckCircle2, ShieldAlert, Cpu, Sparkles, UserCheck, Layers, BarChart } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import Recharts to prevent hydration mismatch (standard Next.js 15 recommendation)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((mod) => mod.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Starter mock analytics dataset
const mockAnalyticsData = [
  { label: "Term 1", score: 82 },
  { label: "Term 2", score: 88 },
  { label: "Term 3", score: 85 },
  { label: "Term 4", score: 92 },
  { label: "Term 5", score: 90 },
  { label: "Term 6", score: 96 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { sidebarOpen, activeTab } = useUIStore();

  const userName = user?.user_metadata?.full_name || "Academic Cadet";
  const userEmail = user?.email || "pending@academy.org";
  const userRole = user?.user_metadata?.role || "student";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dynamic welcome header bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Academy Hub</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-3xl font-extrabold font-outfit tracking-tight">
            System Diagnostics
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Foundation baseline active and authenticated successfully.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Supabase Security Live
          </div>
        </div>
      </motion.div>

      {/* Grid of Diagnostics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Supabase authentication profile details */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Security Profile</h3>
              <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono mt-0.5">AUTH SESSION STATE</p>
            </div>
          </div>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">Name:</span>
              <span className="font-medium text-foreground/95 truncate max-w-[160px]">{userName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">Email:</span>
              <span className="font-medium text-foreground/95 truncate max-w-[160px]">{userEmail}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-foreground/55">Role:</span>
              <span className="font-semibold uppercase tracking-wider text-indigo-400">{userRole}</span>
            </div>
          </div>
        </div>

        {/* Zustand State controller details */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Global Zustand States</h3>
              <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono mt-0.5">REACTIVE DATA FLOW</p>
            </div>
          </div>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">Sidebar State:</span>
              <span className={sidebarOpen ? "text-emerald-400 font-semibold uppercase text-[10px]" : "text-amber-400 font-semibold uppercase text-[10px]"}>
                {sidebarOpen ? "OPEN / EXPANDED" : "COLLAPSED"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">Active Navigation:</span>
              <span className="font-medium text-foreground/95">{activeTab}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-foreground/55">Theme Colorway:</span>
              <span className="font-semibold text-purple-400">Cyber Indigo</span>
            </div>
          </div>
        </div>

        {/* PWA registration & compiler details */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Architecture Baseline</h3>
              <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono mt-0.5">COMPILER SPECS</p>
            </div>
          </div>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">Framework:</span>
              <span className="font-medium text-foreground/95 flex items-center gap-1">
                Next.js 15.x
                <Sparkles className="w-3 h-3 text-indigo-400" />
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-foreground/5">
              <span className="text-foreground/55">PWA Engine:</span>
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                Manifest + Service Worker
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-foreground/55">Styling engine:</span>
              <span className="font-medium text-foreground/95">Tailwind CSS v4</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mini Recharts Performance Demo Area */}
      <motion.div
        variants={itemVariants}
        className="glass-panel rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3.5 mb-8">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
            <BarChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-outfit">Visual Analytics Integration</h2>
            <p className="text-xs text-foreground/60">
              Recharts validation showing smooth, responsive rendering inside modular components.
            </p>
          </div>
        </div>

        {/* Dynamic chart wrapper */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke="currentColor"
                className="text-[10px] text-foreground/35"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-[10px] text-foreground/35"
                tickLine={false}
                axisLine={false}
                domain={[50, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                  fontSize: "11px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
