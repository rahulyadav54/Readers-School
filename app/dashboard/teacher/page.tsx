"use client";

import { useAuth } from "@/hooks/useAuth";
import { 
  Users, GraduationCap, ClipboardList, CheckCircle2, 
  ChevronRight, MessageSquare, Plus, Activity, Filter, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

export default function TeacherDashboard() {
  const { fullName } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  // Mock charts data
  const classAttendance = [
    { name: "Grade 10-A", Attendance: 98, Submissions: 92 },
    { name: "Grade 10-B", Attendance: 95, Submissions: 88 },
    { name: "Grade 11-A", Attendance: 97, Submissions: 94 },
    { name: "Grade 11-C", Attendance: 92, Submissions: 85 },
  ];

  const gradingSpeedHistory = [
    { week: "Wk 1", TurnaroundTime: 4.2, Target: 5.0 },
    { week: "Wk 2", TurnaroundTime: 3.8, Target: 5.0 },
    { week: "Wk 3", TurnaroundTime: 2.9, Target: 5.0 },
    { week: "Wk 4", TurnaroundTime: 3.5, Target: 5.0 },
    { week: "Wk 5", TurnaroundTime: 2.1, Target: 5.0 },
  ];

  const stats = [
    { label: "My Students", value: "142 Active", icon: Users, color: "text-indigo-400" },
    { label: "Active Classes", value: "4 Cohorts", icon: GraduationCap, color: "text-purple-400" },
    { label: "Grading Queue", value: "18 Projects", icon: ClipboardList, color: "text-rose-400" },
    { label: "Attendance Status", value: "100% Done", icon: CheckCircle2, color: "text-emerald-400" },
  ];

  const reviewQueue = [
    { student: "Marcus Vance", assignment: "Quantum Wave Modeling Lab", date: "Today, 10:45 AM", severity: "urgent" },
    { student: "Leah Vance", assignment: "Synthetic Molecule Design Project", date: "Yesterday, 3:30 PM", severity: "normal" },
    { student: "Elena Petrova", assignment: "AP Astrodynamics Homework 4", date: "May 16, 2:15 PM", severity: "normal" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Dynamic Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              Instructor Console
            </span>
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Welcome, {fullName || "Instructor"}
          </h1>
          <p className="text-xs text-foreground/60">
            Evaluate cadet exercises, customize curricula, and view active grade queues.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Publish Task
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/20 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
                  {stat.label}
                </span>
                <div className="p-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-outfit tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Metrics Bar Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold font-outfit text-sm">Class Performance Overview</h3>
              <p className="text-[10px] text-foreground/50">Comparative metric: Attendance rate vs task submission rate</p>
            </div>
            <button className="p-1.5 rounded-lg bg-white/5 border border-foreground/5 text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: "11px" }} />
                <Bar dataKey="Attendance" fill="#818cf8" radius={[4, 4, 0, 0]} name="Attendance %" />
                <Bar dataKey="Submissions" fill="#c084fc" radius={[4, 4, 0, 0]} name="Task Submissions %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Turnaround Time Line Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold font-outfit text-sm">Grading Turnaround Rate</h3>
            <p className="text-[10px] text-foreground/50">Average feedback delivery delay in days</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradingSpeedHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="TurnaroundTime" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 6 }} name="Speed (Days)" />
                <Line type="monotone" dataKey="Target" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" name="Target Boundary" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center bg-white/[0.01] border border-foreground/5 p-2 rounded-xl text-[10px] text-foreground/60">
            Efficiency Level: <strong className="text-emerald-400">Optimal (2.1 Days Avg)</strong>
          </div>
        </motion.div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grading/Review Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-outfit text-sm">Grading & Feedback Queue</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5">
              Full Queue <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reviewQueue.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-foreground/90">{item.student}</h4>
                    {item.severity === "urgent" && (
                      <span className="inline-flex px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[8px] font-extrabold uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-foreground/60">{item.assignment}</p>
                  <p className="text-[9px] text-foreground/40 font-mono mt-0.5">{item.date}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold transition-colors">
                    Grade
                  </button>
                  <button className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Classes Scheduled Today */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Classes Scheduled Today
            </h3>
            <button className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 font-sans">
            <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500" />
              <p className="text-[10px] text-indigo-400 font-semibold font-mono">09:00 AM - 10:30 AM</p>
              <h4 className="text-xs font-semibold mt-1">Calculus & Quantum Modeling</h4>
              <p className="text-[10px] text-foreground/50 mt-0.5">38 Students Registered • Room 402</p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 h-full bg-purple-500" />
              <p className="text-[10px] text-purple-400 font-semibold font-mono">11:00 AM - 12:30 PM</p>
              <h4 className="text-xs font-semibold mt-1">AP Physics 3 Lab</h4>
              <p className="text-[10px] text-foreground/50 mt-0.5">42 Students Registered • Science Deck B</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
