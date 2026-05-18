"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Sleek, dynamic floating background lights specific to dashboard */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Primary Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Controls */}
        <Navbar />

        {/* Dynamic Dashboard Page Wrapper with entrance animations */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
