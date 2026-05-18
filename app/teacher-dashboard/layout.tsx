"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Primary Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Controls */}
        <Navbar />

        {/* Dynamic Page Wrapper */}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto relative z-10"
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
