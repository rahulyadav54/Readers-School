"use client";

import { useAuth } from "@/hooks/useAuth";
import { 
  Heart, Calendar, AlertCircle, Award, ChevronRight, 
  MessageSquare, UserCheck, TrendingUp, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function ParentDashboard() {
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
  const childPerformance = [
    { month: "Jan", Marcus: 82, Average: 78 },
    { month: "Feb", Marcus: 88, Average: 80 },
    { month: "Mar", Marcus: 85, Average: 79 },
    { month: "Apr", Marcus: 91, Average: 82 },
    { month: "May", Marcus: 94, Average: 83 },
  ];

  const subjectGrades = [
    { subject: "Quantum Calc", Score: 94 },
    { subject: "AP Physics 3", Score: 88 },
    { subject: "Chemistry", Score: 98 },
  ];

  const stats = [
    { label: "Child Connected", value: "Marcus Vance", icon: Heart, color: "text-rose-400" },
    { label: "Attendance Record", value: "98.2% Rate", icon: Calendar, color: "text-cyan-400" },
    { label: "Critical Alerts", value: "1 Warning", icon: AlertCircle, color: "text-amber-400" },
    { label: "Performance GPA", value: "3.84 GPA", icon: Award, color: "text-indigo-400" },
  ];

  const recentGrades = [
    { subject: "Quantum Calculus", score: "A (94%)", type: "Mid-Term Project", date: "May 15" },
    { subject: "Advanced Astro-dynamics", score: "B+ (88%)", type: "Lab Exercise 5", date: "May 12" },
    { subject: "Synthetic Chemistry", score: "A+ (98%)", type: "Safety Exam", date: "May 10" },
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
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-rose-500/10 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
              Parent Guardian Deck
            </span>
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Welcome, {fullName || "Guardian"}
          </h1>
          <p className="text-xs text-foreground/60">
            Review academic milestones, examine class calendars, and monitor child grades.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/25 transition-all flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Child Profile
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-rose-500/20 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono truncate max-w-[130px]">
                  {stat.label}
                </span>
                <div className="p-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5 shrink-0">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-extrabold font-outfit tracking-tight truncate mt-1">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Progression Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold font-outfit text-sm">Marcus's Academic Trajectory</h3>
              <p className="text-[10px] text-foreground/50">Overall monthly score compared to active class benchmark averages</p>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14% Progress
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={childPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChild" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="Marcus" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorChild)" name="Marcus's Score %" />
                <Area type="monotone" dataKey="Average" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeDasharray="3 3" fill="none" name="Class Average Benchmark" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Grades Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold font-outfit text-sm">Grading Distribution</h3>
            <p className="text-[10px] text-foreground/50">Current scores by academic topic</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectGrades} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="Score" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center bg-white/[0.01] border border-foreground/5 p-2 rounded-xl text-[10px] text-foreground/60 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Rank: <strong className="text-amber-400">Top 5% of Class</strong>
          </div>
        </motion.div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Grades Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-outfit text-sm">Marcus's Academic Records</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5">
              All Records <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentGrades.map((grade, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-foreground/90">{grade.subject}</h4>
                  <p className="text-[10px] text-foreground/50">{grade.type} • {grade.date}</p>
                </div>

                <div className="text-right">
                  <span className="inline-flex px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-extrabold font-mono">
                    {grade.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Parent Bulletins & Alerts */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Stellar Alerts & Announcements
          </h3>

          <div className="space-y-3 font-sans">
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 relative">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Upcoming Event</h5>
                  <p className="text-[10px] text-foreground/75 mt-1 leading-normal">
                    Student-Instructor feedback conference is set for next Tuesday. Please register a slot.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-foreground/5 relative flex justify-between items-center gap-2">
              <div>
                <h5 className="text-xs font-bold text-foreground/90">Contact Dr. Adrian Thorne</h5>
                <p className="text-[9px] text-foreground/50 mt-0.5">Physics Department Instructor</p>
              </div>
              <button className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
