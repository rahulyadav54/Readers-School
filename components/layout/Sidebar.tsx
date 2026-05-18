"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, GraduationCap, BarChart3, Settings, ShieldCheck, X, LogOut, BookOpen, Calendar, FileSpreadsheet, Sparkles, Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { signOut, role } = useAuth();

  const dashboardPath = role ? `/dashboard/${role}` : "/dashboard";

  const menuItems = [
    {
      name: "Dashboard Hub",
      path: dashboardPath,
      icon: LayoutDashboard,
    },
    {
      name: "Admin ERP Dashboard",
      path: "/dashboard/admin",
      icon: ShieldCheck,
    },
    {
      name: "Attendance Terminal",
      path: "/dashboard/attendance",
      icon: Calendar,
    },
    {
      name: "Assignments & Homework",
      path: "/dashboard/assignments",
      icon: FileSpreadsheet,
    },
    {
      name: "AI Homework Helper",
      path: "/dashboard/ai-helper",
      icon: Sparkles,
    },
    {
      name: "Online Quizzes",
      path: "/dashboard/quizzes",
      icon: Trophy,
    },
    {
      name: "Hall of Badges",
      path: "/dashboard/gamification",
      icon: Flame,
    },
    {
      name: "Curriculum",
      path: "/dashboard/curriculum",
      icon: BookOpen,
    },
    {
      name: "Security Gateway",
      path: "/dashboard/security",
      icon: ShieldCheck,
    },
    {
      name: "Core Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{
          x: 0,
          width: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "glass-panel fixed bottom-0 top-0 left-0 z-40 flex flex-col border-r border-foreground/5 bg-background/40 backdrop-blur-md transition-all",
          "md:sticky",
          !sidebarOpen && "hidden md:flex"
        )}
        style={{
          width: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
        }}
      >
        {/* Header Branding Container */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-foreground/5">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-sm tracking-wider font-outfit uppercase bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent truncate"
              >
                Readers School
              </motion.span>
            )}
          </Link>

          {/* Close button for mobile screen drawers */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-foreground md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all relative overflow-hidden group",
                  isActive
                    ? "text-indigo-400 bg-indigo-500/5 border-l-2 border-indigo-500 font-semibold"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {/* Active Glowing Indicator overlay */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon className={cn("w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105", isActive && "text-indigo-400")} />

                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs tracking-wide truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-foreground/5 bg-foreground/[0.01]">
          <button
            onClick={() => signOut()}
            className={cn(
              "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-xs font-semibold cursor-pointer"
            )}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="tracking-wide"
              >
                Secure Log Out
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
