"use client";

import { useAuth } from "@/hooks/useAuth";
import { 
  GraduationCap, BookOpen, Clock, Calendar, CheckSquare, 
  Trophy, ChevronRight, Activity, ArrowUpRight, Star, Bell 
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
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function StudentDashboard() {
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
  const xpHistory = [
    { name: "Week 1", XP: 120, Avg: 100 },
    { name: "Week 2", XP: 280, Avg: 150 },
    { name: "Week 3", XP: 450, Avg: 220 },
    { name: "Week 4", XP: 610, Avg: 310 },
    { name: "Week 5", XP: 800, Avg: 430 },
    { name: "Week 6", XP: 940, Avg: 550 },
  ];

  const subjectGrades = [
    { subject: "Quantum Calc", Grade: 94, ClassAvg: 82 },
    { subject: "AP Physics 3", Grade: 84, ClassAvg: 78 },
    { subject: "Chemistry", Grade: 91, ClassAvg: 80 },
    { subject: "Biotech", Grade: 95, ClassAvg: 85 },
  ];

  const attendanceData = [
    { name: "Attended", value: 98 },
    { name: "Absent", value: 2 },
  ];

  const COLORS = ["#6366f1", "#f43f5e"];

  const stats = [
    { label: "Active Courses", value: "6", icon: BookOpen, color: "text-indigo-400" },
    { label: "Attendance Rate", value: "98.4%", icon: Calendar, color: "text-cyan-400" },
    { label: "Pending Tasks", value: "4 Tasks", icon: CheckSquare, color: "text-rose-400" },
    { label: "Academy Score", value: "940 XP", icon: Trophy, color: "text-amber-400" },
  ];

  const courses = [
    { name: "AP Physics 3: Astro-dynamics", teacher: "Dr. Adrian Thorne", progress: 84, grade: "A-" },
    { name: "Calculus & Quantum Modeling", teacher: "Prof. Clara Mercer", progress: 72, grade: "B+" },
    { name: "Advanced Synthetic Chemistry", teacher: "Dr. Evelyn Vance", progress: 91, grade: "A" },
  ];

  const notifications = [
    { id: 1, title: "Lab Exercise Due Tomorrow", desc: "Physics 3: Wave integrals submission window closes.", time: "2 hours ago" },
    { id: 2, title: "Quiz Graded: Quantum Calculus", desc: "Earned 94% on escape velocity math.", time: "1 day ago" },
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
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              Student Terminal
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Welcome, {fullName || "Academic Cadet"}
          </h1>
          <p className="text-xs text-foreground/60">
            Access your courses, schedule, and grade terminal dashboard.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Study Hub
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-indigo-500/20 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-bl-full pointer-events-none" />
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
                  {stat.label}
                </span>
                <div className="p-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-extrabold font-outfit tracking-tight">{stat.value}</p>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> +12%
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Progression Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold font-outfit text-sm">Academia XP Progression</h3>
              <p className="text-[10px] text-foreground/50">Weekly skill point accumulation overview</p>
            </div>
            <span className="inline-flex px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold">
              Level 14 Cadet
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="XP" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorXp)" />
                <Area type="monotone" dataKey="Avg" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attendance Donut Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold font-outfit text-sm">Attendance Allocation</h3>
            <p className="text-[10px] text-foreground/50">Overall physical & virtual presence rate</p>
          </div>
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold font-outfit tracking-tight">98%</span>
              <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider">Present</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-[11px] font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
              <span className="text-foreground/75">Attended (98%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" />
              <span className="text-foreground/75">Absent (2%)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades Bar Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold font-outfit text-sm">Subject Scores</h3>
            <p className="text-[10px] text-foreground/50">Subject score vs group class averages</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectGrades} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="Grade" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ClassAvg" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Progress Table */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-outfit text-sm">Course Progress</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5">
              All Courses <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-2 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground/90">{course.name}</h4>
                    <p className="text-[10px] text-foreground/50">{course.teacher}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">{course.grade}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-foreground/60">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications and Alerts Panel */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400 animate-bounce" />
            <h3 className="font-bold font-outfit text-sm">Bulletins & Notices</h3>
          </div>

          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-foreground/90">{item.title}</h4>
                  <span className="text-[9px] text-foreground/40 font-mono">{item.time}</span>
                </div>
                <p className="text-[10px] text-foreground/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex items-center justify-between">
              <span className="text-xs text-foreground/75 font-medium">Daily Class Agenda</span>
              <button className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-xs font-bold">
                View Schedule
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
