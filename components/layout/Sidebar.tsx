"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUIStore } from "@/lib/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, 
  FileSpreadsheet, Receipt, Bus, Home, Library, Bell, 
  Settings, X, LogOut, ClipboardList, FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Suspense } from "react";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { signOut, role } = useAuth();

  // Determine standard base dashboard path based on role
  const getDashboardPath = () => {
    switch (role) {
      case "admin": return "/admin-dashboard";
      case "student": return "/student-dashboard";
      case "teacher": return "/teacher-dashboard";
      case "parent": return "/parent-dashboard";
      default: return "/dashboard";
    }
  };

  const dashboardPath = getDashboardPath();

  // Dynamic Navigation items based on role
  const getMenuItems = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", path: "/admin-dashboard", tab: "dashboard", icon: LayoutDashboard },
          { name: "Students", path: "/admin-dashboard?tab=students", tab: "students", icon: GraduationCap },
          { name: "Teachers", path: "/admin-dashboard?tab=teachers", tab: "teachers", icon: BookOpen },
          { name: "Parents", path: "/admin-dashboard?tab=parents", tab: "parents", icon: Users },
          { name: "Admissions", path: "/admin-dashboard?tab=admissions", tab: "admissions", icon: ClipboardList },
          { name: "Attendance", path: "/admin-dashboard?tab=attendance", tab: "attendance", icon: Calendar },
          { name: "Exams & Results", path: "/admin-dashboard?tab=exams", tab: "exams", icon: FileSpreadsheet },
          { name: "Fee Management", path: "/admin-dashboard?tab=fees", tab: "fees", icon: Receipt },
          { name: "Transport", path: "/admin-dashboard?tab=transport", tab: "transport", icon: Bus },
          { name: "Library", path: "/admin-dashboard?tab=library", tab: "library", icon: Library },
          { name: "Notifications", path: "/admin-dashboard?tab=notifications", tab: "notifications", icon: Bell },
          { name: "Reports", path: "/admin-dashboard?tab=reports", tab: "reports", icon: FileText },
          { name: "Settings", path: "/admin-dashboard?tab=settings", tab: "settings", icon: Settings },
        ];
      case "student":
        return [
          { name: "Dashboard", path: "/student-dashboard", tab: "dashboard", icon: LayoutDashboard },
          { name: "Homework", path: "/student-dashboard?tab=homework", tab: "homework", icon: BookOpen },
          { name: "Assignments", path: "/student-dashboard?tab=assignments", tab: "assignments", icon: ClipboardList },
          { name: "Attendance", path: "/student-dashboard?tab=attendance", tab: "attendance", icon: Calendar },
          { name: "Exam Results", path: "/student-dashboard?tab=exams", tab: "exams", icon: FileSpreadsheet },
          { name: "Notices", path: "/student-dashboard?tab=notices", tab: "notices", icon: Bell },
          { name: "Timetable", path: "/student-dashboard?tab=timetable", tab: "timetable", icon: ClipboardList },
          { name: "Settings", path: "/student-dashboard?tab=settings", tab: "settings", icon: Settings },
        ];
      case "teacher":
        return [
          { name: "Dashboard", path: "/teacher-dashboard", tab: "dashboard", icon: LayoutDashboard },
          { name: "Attendance Management", path: "/teacher-dashboard?tab=attendance", tab: "attendance", icon: Calendar },
          { name: "Assignment Uploads", path: "/teacher-dashboard?tab=assignments", tab: "assignments", icon: ClipboardList },
          { name: "Student Grading", path: "/teacher-dashboard?tab=grading", tab: "grading", icon: GraduationCap },
          { name: "Exam Management", path: "/teacher-dashboard?tab=exams", tab: "exams", icon: FileSpreadsheet },
          { name: "Notices", path: "/teacher-dashboard?tab=notices", tab: "notices", icon: Bell },
          { name: "Settings", path: "/teacher-dashboard?tab=settings", tab: "settings", icon: Settings },
        ];
      case "parent":
        return [
          { name: "Dashboard", path: "/parent-dashboard", tab: "dashboard", icon: LayoutDashboard },
          { name: "Child Attendance", path: "/parent-dashboard?tab=attendance", tab: "attendance", icon: Calendar },
          { name: "Fee Status", path: "/parent-dashboard?tab=fees", tab: "fees", icon: Receipt },
          { name: "Performance Reports", path: "/parent-dashboard?tab=performance", tab: "performance", icon: FileText },
          { name: "School Notices", path: "/parent-dashboard?tab=notices", tab: "notices", icon: Bell },
          { name: "Settings", path: "/parent-dashboard?tab=settings", tab: "settings", icon: Settings },
        ];
      default:
        return [
          { name: "Dashboard", path: "/dashboard", tab: "dashboard", icon: LayoutDashboard },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{
          x: 0,
          width: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "fixed bottom-0 top-0 left-0 z-40 flex flex-col bg-[#111827] text-slate-300 transition-all border-r border-slate-800 shadow-xl",
          "md:sticky",
          !sidebarOpen && "hidden md:flex"
        )}
        style={{
          width: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
        }}
      >
        {/* Header Branding Container */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href={dashboardPath} className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-xl bg-[#7C3AED] text-white shadow-lg shadow-purple-900/30 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-extrabold text-sm tracking-wider font-outfit uppercase text-white truncate"
              >
                Readers School
              </motion.span>
            )}
          </Link>

          {/* Close button for mobile screen drawers */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto custom-scrollbar shrink-0">
          {menuItems.map((item) => {
            const isTabActive = activeTab === item.tab;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all relative overflow-hidden group cursor-pointer",
                  isTabActive
                    ? "text-white bg-[#7C3AED] font-semibold shadow-md shadow-purple-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105", isTabActive ? "text-white" : "text-slate-400 group-hover:text-white")} />

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
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 shrink-0">
          <button
            onClick={() => signOut()}
            className={cn(
              "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-xs font-semibold cursor-pointer"
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

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-[#111827] border-r border-slate-800 shrink-0" />}>
      <SidebarContent />
    </Suspense>
  );
}
