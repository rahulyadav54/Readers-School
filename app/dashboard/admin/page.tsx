"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays, 
  FileSpreadsheet, Receipt, Bus, Home, Library, Cpu, Bell, 
  Settings, Search, Sun, Moon, LogOut, ChevronLeft, ChevronRight,
  UserPlus, Lock, Mail, User, Loader2, ArrowUpRight, ArrowDownRight,
  CheckCircle, ShieldAlert, Sparkles, Filter, Plus, Calendar, 
  MapPin, Clock, ArrowRight, ShieldCheck, Database, Activity, RefreshCw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend, LineChart, Line,
  Cell
} from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces for our custom data models
interface ActivityLog {
  id: string;
  type: "admission" | "leave" | "payment" | "alert";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "alert";
}

interface StudentRecord {
  id: string;
  name: string;
  class: string;
  attendance: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  performance: "Excellent" | "Good" | "Average" | "Needs Imp.";
  avatar: string;
}

export default function AdminERPPage() {
  const { user, role, isLoading, fullName, signOut } = useAuth();
  const router = useRouter();

  // Navigation & Workspace Tab State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "students" | "teachers" | "admissions" | "attendance" | 
    "exams" | "fees" | "transport" | "hostel" | "library" | "ai" | "settings"
  >("dashboard");

  // Notification Toast simulation
  const [notifications, setNotifications] = useState<string[]>([
    "Priyanka Sah registered in Grade 9-A.",
    "Satish Kumar Jha requested medical leave.",
    "Database backup executed successfully."
  ]);

  // Form States (Provisioner)
  const [provName, setProvName] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPass, setProvPass] = useState("");
  const [provRole, setProvRole] = useState<"student" | "teacher" | "parent">("student");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [provisionedUsers, setProvisionedUsers] = useState<any[]>([
    { id: "p1", fullName: "Kunal Yadav", email: "kunal@readers.school", role: "student", created_at: new Date().toISOString() },
    { id: "p2", fullName: "Shreya Sah", email: "shreya@readers.school", role: "teacher", created_at: new Date().toISOString() },
    { id: "p3", fullName: "Lakhan Yadav", email: "lakhan@readers.school", role: "parent", created_at: new Date().toISOString() }
  ]);

  // Student Filter & Search States
  const [studentSearch, setStudentSearch] = useState("");
  const [studentClassFilter, setStudentClassFilter] = useState("All");
  const [studentFeeFilter, setStudentFeeFilter] = useState("All");

  // Recharts Data Series
  const growthData = [
    { month: "Jan", Students: 850, Teachers: 52 },
    { month: "Feb", Students: 920, Teachers: 58 },
    { month: "Mar", Students: 1040, Teachers: 62 },
    { month: "Apr", Students: 1150, Teachers: 68 },
    { month: "May", Students: 1248, Teachers: 74 },
  ];

  const attendanceOverview = [
    { week: "Wk 1", Rate: 94.5 },
    { week: "Wk 2", Rate: 95.8 },
    { week: "Wk 3", Rate: 96.2 },
    { week: "Wk 4", Rate: 95.1 },
    { week: "Wk 5", Rate: 96.8 },
  ];

  const feeCollectionData = [
    { term: "Term 1", Collected: 1250000, Pending: 180000 },
    { term: "Term 2", Collected: 1482000, Pending: 320000 },
    { term: "Term 3", Collected: 950000, Pending: 640000 },
  ];

  const academicPerformanceData = [
    { term: "Term 1", GradeA: 45, GradeB: 35, GradeC: 20 },
    { term: "Term 2", GradeA: 52, GradeB: 32, GradeC: 16 },
    { term: "Term 3", GradeA: 58, GradeB: 30, GradeC: 12 },
  ];

  const activeStudents: StudentRecord[] = [
    { id: "s1", name: "Anish Kumar Sah", class: "Grade 10-A", attendance: "98%", feeStatus: "Paid", performance: "Excellent", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { id: "s2", name: "Rina Jaiswal", class: "Grade 9-B", attendance: "94%", feeStatus: "Pending", performance: "Good", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
    { id: "s3", name: "Rahul Dev Yadav", class: "Grade 10-A", attendance: "96%", feeStatus: "Paid", performance: "Excellent", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    { id: "s4", name: "Suman Sah", class: "Grade 8-A", attendance: "88%", feeStatus: "Overdue", performance: "Average", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
    { id: "s5", name: "Pooja Thakur", class: "Grade 7-C", attendance: "92%", feeStatus: "Paid", performance: "Good", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
    { id: "s6", name: "Sunil Shrestha", class: "Grade 10-B", attendance: "82%", feeStatus: "Pending", performance: "Needs Imp.", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop" },
  ];

  const recentActivities: ActivityLog[] = [
    { id: "a1", type: "admission", title: "New Enrollment Secured", description: "Priyanka Sah registered in Grade 9-A with verified credits.", timestamp: "10 mins ago", status: "success" },
    { id: "a2", type: "leave", title: "Teacher Leave Submitted", description: "Satish Kumar Jha requested medical leave for May 20-22.", timestamp: "1 hour ago", status: "pending" },
    { id: "a3", type: "payment", title: "Fee Instalment Received", description: "NPR 45,000 received for Ram Lakhan Yadav (Grade 5).", timestamp: "2 hours ago", status: "success" },
    { id: "a4", type: "alert", title: "System Security Alert", description: "Manual postgres schema backup executed successfully.", timestamp: "Yesterday", status: "success" }
  ];

  // Provisioning logic
  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName || !provEmail || !provPass) return;

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: provEmail,
          password: provPass,
          fullName: provName,
          role: provRole
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to provision account.");

      setSuccessMsg(`Successfully provisioned account for ${provName} (${provRole})!`);
      setProvisionedUsers(prev => [data.user, ...prev]);

      // Reset form fields
      setProvName("");
      setProvEmail("");
      setProvPass("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter students based on search and filters
  const filteredStudents = activeStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          student.class.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = studentClassFilter === "All" || student.class.includes(studentClassFilter);
    const matchesFee = studentFeeFilter === "All" || student.feeStatus === studentFeeFilter;
    return matchesSearch && matchesClass && matchesFee;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* A. Dynamic Operations Header Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm flex flex-wrap gap-1 items-center relative z-20">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "students", label: "Students", icon: GraduationCap },
          { id: "teachers", label: "Teachers", icon: BookOpen },
          { id: "admissions", label: "Admissions & Provision", icon: UserPlus },
          { id: "attendance", label: "Attendance Control", icon: CalendarDays },
          { id: "exams", label: "Exams & Results", icon: FileSpreadsheet },
          { id: "fees", label: "Fee Management", icon: Receipt },
          { id: "transport", label: "Transport & Fleets", icon: Bus },
          { id: "hostel", label: "Hostel Registry", icon: Home },
          { id: "library", label: "Library Assets", icon: Library },
          { id: "ai", label: "AI Analytics Insights", icon: Cpu },
          { id: "settings", label: "Developer Shell", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-bold text-xs cursor-pointer ${
                isActive 
                  ? "bg-[#7C3AED] text-white shadow-md shadow-violet-500/10" 
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* 1. Welcome Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-violet-500/10 to-transparent pointer-events-none" />
              <div className="space-y-1 text-left relative z-10">
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider">
                  Academic Operations Console
                </span>
                <h2 className="text-2xl font-extrabold font-outfit text-slate-950 dark:text-white tracking-tight">
                  Welcome Back, Admin
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your school operations efficiently, provision profiles, check analytics indexes, and monitor recent alerts.
                </p>
              </div>

              {/* Action Operations */}
              <div className="flex flex-wrap gap-2 relative z-10">
                <button 
                  onClick={() => setActiveTab("admissions")}
                  className="px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Student
                </button>
                <button 
                  onClick={() => setActiveTab("attendance")}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs border border-slate-700/80 flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-violet-400" /> Take Attendance
                </button>
              </div>
            </div>

            {/* 2. Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: "1,248", growth: "+12% this month", trendUp: true, color: "text-violet-500", bg: "bg-violet-500/10", spark: [30, 45, 40, 60, 50, 70, 65, 80] },
                { label: "Total Teachers", value: "74", growth: "+4% this month", trendUp: true, color: "text-blue-500", bg: "bg-blue-500/10", spark: [12, 14, 13, 18, 17, 22, 20, 24] },
                { label: "Monthly Revenue", value: "NPR 1.48M", growth: "+8.2% vs last term", trendUp: true, color: "text-emerald-500", bg: "bg-emerald-500/10", spark: [60, 65, 62, 75, 70, 85, 80, 95] },
                { label: "Attendance Rate", value: "96.2%", growth: "+1.5% this week", trendUp: true, color: "text-cyan-500", bg: "bg-cyan-500/10", spark: [85, 90, 88, 93, 91, 96, 95, 98] },
                { label: "Pending Fees", value: "NPR 320,000", growth: "-5% this term", trendUp: false, color: "text-rose-500", bg: "bg-rose-500/10", spark: [90, 80, 75, 60, 55, 45, 40, 30] },
                { label: "Active Classes", value: "32 cohorts", growth: "Stable workload", trendUp: true, color: "text-amber-500", bg: "bg-amber-500/10", spark: [32, 32, 32, 32, 32, 32, 32, 32] },
                { label: "School Buses", value: "12 active", growth: "100% route coverage", trendUp: true, color: "text-pink-500", bg: "bg-pink-500/10", spark: [12, 12, 12, 12, 12, 12, 12, 12] },
                { label: "Exam Completion", value: "88%", growth: "+10% vs yesterday", trendUp: true, color: "text-purple-500", bg: "bg-purple-500/10", spark: [15, 30, 40, 55, 70, 78, 82, 88] }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-[#7C3AED]/25 transition-all hover:-translate-y-0.5 text-left"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">{stat.label}</span>
                    <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                      <Plus className={`w-3 h-3 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-extrabold font-outfit text-slate-900 dark:text-white tracking-tight">{stat.value}</h4>
                    <div className="flex items-center gap-1">
                      {stat.trendUp ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-rose-500" />
                      )}
                      <span className={`text-[9px] font-bold ${stat.trendUp ? "text-emerald-500" : "text-rose-500"}`}>
                        {stat.growth}
                      </span>
                    </div>
                  </div>

                  {/* Micro Sparkline */}
                  <div className="h-5 w-full mt-3 opacity-30 group-hover:opacity-65 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stat.spark.map((v, i) => ({ val: v, x: i }))}>
                        <Area type="monotone" dataKey="val" stroke={stat.color.includes("violet") ? "#7C3AED" : stat.color.includes("blue") ? "#3b82f6" : "#10b981"} strokeWidth={1} fill="none" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Enrollment Growth & Fee collection stacked charts */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold font-outfit text-sm text-slate-900 dark:text-white tracking-tight">Institutional Enrollment & Faculty Growth</h3>
                    <p className="text-[10px] text-slate-400">Comparing active student registrations vs core teacher hires</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-[#7C3AED] text-[9px] font-bold uppercase tracking-wider">
                    Live Records
                  </span>
                </div>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px", color: "#fff" }} />
                      <Legend verticalAlign="top" height={30} iconSize={8} style={{ fontSize: "10px" }} />
                      <Area type="monotone" dataKey="Students" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorStd)" name="Active Student Body" />
                      <Area type="monotone" dataKey="Teachers" stroke="#3b82f6" strokeWidth={1.5} fill="none" name="Academic Faculty" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendance Bar Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-left">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold font-outfit text-sm text-slate-900 dark:text-white tracking-tight">Academic Attendance Index</h3>
                  <p className="text-[10px] text-slate-400">Weekly student attendance ratios average</p>
                </div>
                <div className="h-44 w-full my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceOverview} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={8} />
                      <YAxis stroke="#94a3b8" fontSize={8} domain={[90, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px", color: "#fff" }} />
                      <Bar dataKey="Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Attendance %">
                        {attendanceOverview.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={idx === 4 ? "#7C3AED" : "#3b82f6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl text-center text-[10px] text-slate-500">
                  Target: <strong className="text-emerald-500 font-bold">95% Enforced</strong> • Current: <strong className="text-violet-600 font-bold">96.8%</strong>
                </div>
              </div>

            </div>

            {/* 4. Student Directory Table & Side Timelines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Student Ledger Directory */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-extrabold font-outfit text-sm text-slate-900 dark:text-white tracking-tight">Active Student Directory Ledger</h3>
                    <p className="text-[10px] text-slate-400">Direct query tool for active classroom cohorts</p>
                  </div>
                  
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search name/grade..." 
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-2">Student Name</th>
                        <th className="pb-2">Class</th>
                        <th className="pb-2 text-center">Attendance</th>
                        <th className="pb-2">Fee status</th>
                        <th className="pb-2">Performance</th>
                        <th className="pb-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                            <td className="py-2.5 flex items-center gap-2">
                              <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-lg object-cover bg-slate-100 shrink-0" />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-200">{s.name}</p>
                                <p className="text-[8px] text-slate-400 font-mono">ID: {s.id}</p>
                              </div>
                            </td>
                            <td className="py-2.5 font-medium text-slate-600 dark:text-slate-300">{s.class}</td>
                            <td className="py-2.5 text-center font-bold text-slate-900 dark:text-white">{s.attendance}</td>
                            <td className="py-2.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono ${
                                s.feeStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                s.feeStatus === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {s.feeStatus}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold ${
                                s.performance === "Excellent" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" :
                                s.performance === "Good" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                                s.performance === "Average" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350" :
                                "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                              }`}>
                                {s.performance}
                              </span>
                            </td>
                            <td className="py-2.5 text-center">
                              <button className="text-violet-600 hover:text-violet-850 hover:underline font-bold">Edit</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400">No student records match search terms.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-slate-400 font-medium">Showing {filteredStudents.length} entries</span>
                  <div className="flex gap-1">
                    <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-[9px] font-bold hover:bg-slate-50 cursor-pointer">Prev</button>
                    <button className="px-2.5 py-1 rounded bg-[#7C3AED] text-white text-[9px] font-bold cursor-pointer">1</button>
                    <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-[9px] font-bold hover:bg-slate-50 cursor-pointer">Next</button>
                  </div>
                </div>
              </div>

              {/* Side Column: AI Predictor & Operational Timelines */}
              <div className="space-y-6">
                
                {/* AI Predictive Insight Card */}
                <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden text-left space-y-4">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
                      <h3 className="font-extrabold font-outfit text-xs tracking-wider uppercase text-white">AI Predictor Engines</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-[8px] font-bold uppercase tracking-wider">
                      Autonomous
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-violet-400 uppercase">Attendance Prediction</span>
                        <span className="text-emerald-400">96.8% estimated</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed">Forecasts average student attendance will raise next week due to assembly programs.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-amber-400 uppercase">Weak Cadets Flagged</span>
                        <span className="text-amber-400">2 cadets flagged</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed">High grade volatility detected in Grade 10-A Science topics. Interventions dispatched.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab("ai")}
                    className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-violet-600/10 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Full AI Engine Console
                  </button>
                </div>

                {/* Operations Timelines */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
                  <div>
                    <h3 className="font-extrabold font-outfit text-sm text-slate-950 dark:text-white tracking-tight">ERP Audit Timeline</h3>
                    <p className="text-[10px] text-slate-400">Real-time school operations auditing logs</p>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="flex gap-3 relative z-10 items-start">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          {act.type === "admission" ? <GraduationCap className="w-3.5 h-3.5 text-violet-500" /> :
                           act.type === "leave" ? <Calendar className="w-3.5 h-3.5 text-amber-500" /> :
                           act.type === "payment" ? <Receipt className="w-3.5 h-3.5 text-emerald-500" /> :
                           <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="font-bold text-[10px] text-slate-900 dark:text-slate-100 truncate">{act.title}</h4>
                            <span className="text-[7px] text-slate-400 font-mono shrink-0">{act.timestamp}</span>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal line-clamp-2">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* 5. Events Calendar Grid */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
              <div>
                <h3 className="font-extrabold font-outfit text-sm text-slate-950 dark:text-white tracking-tight">Institutional Events & Calendar Assemblies</h3>
                <p className="text-[10px] text-slate-400">Upcoming term examinations schedules and national holidays</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "First Terminal Exams", date: "May 25, 2026", type: "Exam", color: "border-l-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/10" },
                  { title: "Parent Teacher Assembly", date: "June 02, 2026", type: "Meeting", color: "border-l-violet-500 text-violet-500 bg-violet-50 dark:bg-violet-950/10" },
                  { title: "Summer Recess Break", date: "June 15 - July 05", type: "Holiday", color: "border-l-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/10" },
                  { title: "District Science fair 2026", date: "July 12, 2026", type: "Event", color: "border-l-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/10" }
                ].map((evt, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border-l-4 border border-slate-200/80 dark:border-slate-800 flex justify-between items-start ${evt.color}`}>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight">{evt.title}</h4>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{evt.date}</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase font-mono bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {evt.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: STUDENTS VIEW DIRECTORY */}
        {activeTab === "students" && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 text-left"
          >
            <div>
              <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight">Academic Students Directory Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit, attendance scores, and database profiles records</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter name or ID..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <select 
                value={studentFeeFilter} 
                onChange={(e) => setStudentFeeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs cursor-pointer focus:outline-none"
              >
                <option value="All">Fee Status: All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3 font-bold uppercase tracking-wider">Student Profile</th>
                    <th className="pb-3 font-bold uppercase tracking-wider">Class Cohort</th>
                    <th className="pb-3 font-bold uppercase tracking-wider text-center">Attendance</th>
                    <th className="pb-3 font-bold uppercase tracking-wider">Fee Ledger Status</th>
                    <th className="pb-3 font-bold uppercase tracking-wider">Performance Index</th>
                    <th className="pb-3 font-bold text-center uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors">
                        <td className="py-3 flex items-center gap-3">
                          <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-200">{s.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono">ID: {s.id}</p>
                          </div>
                        </td>
                        <td className="py-3 font-medium text-slate-600 dark:text-slate-350">{s.class}</td>
                        <td className="py-3 text-center font-bold text-slate-950 dark:text-white">{s.attendance}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono ${
                            s.feeStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            s.feeStatus === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                            "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}>
                            {s.feeStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold ${
                            s.performance === "Excellent" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" :
                            s.performance === "Good" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                            s.performance === "Average" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}>
                            {s.performance}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button className="text-violet-600 hover:text-violet-850 hover:underline font-bold">Manage Profile</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">No student matching found. Check filters query.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: TEACHERS DIRECTORY */}
        {activeTab === "teachers" && (
          <motion.div
            key="teachers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm text-left"
          >
            <div>
              <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight">Active Faculty Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Departments HOD assignment departments and contact information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Satish Kumar Jha", role: "HOD Science", phone: "+977 9802933724", image: "/FOUNDER/Satish%20Kumar%20Jha.png" },
                { name: "Arjun Giree", role: "HOD English", phone: "+977 9802933722", image: "/FOUNDER/Arjun%20Giree.png" },
                { name: "Anil Kumar Yadav", role: "HOD ECA Department", phone: "+977 9802933721", image: "/FOUNDER/Anil%20Kumar%20Yadav.png" },
                { name: "Nandu Yadav", role: "Science Instructor", phone: "+977 9851162005", image: "/FOUNDER/Nandu%20Yadav.png" }
              ].map((member, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 group hover:-translate-y-1 transition-all">
                  <div className="h-44 overflow-hidden bg-slate-200">
                    <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300" />
                  </div>
                  <div className="p-4 text-center space-y-2">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{member.name}</h5>
                      <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider mt-0.5">{member.role}</p>
                      {member.phone && <p className="text-slate-400 font-medium text-[9px] mt-1">{member.phone}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: ADMISSIONS & USER PROVISIONER FORM */}
        {(activeTab === "admissions") && (
          <motion.div
            key="admissions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans text-xs"
          >
            {/* Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-violet-500" />
                  Academic Profile User Provisioner
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Provision new Student, Teacher, or Parent credentials securely into the Supabase database.
                  Newly provisioned accounts immediately receive a customized role index and authentication support clearance.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 font-bold"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleProvisionUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Account Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={provName}
                        onChange={(e) => setProvName(e.target.value)}
                        placeholder="e.g. Kunal Yadav"
                        className="pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={provEmail}
                        onChange={(e) => setProvEmail(e.target.value)}
                        placeholder="kunal@readers.school"
                        className="pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Temporary Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={provPass}
                        onChange={(e) => setProvPass(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Assigned Role</label>
                    <select
                      value={provRole}
                      onChange={(e) => setProvRole(e.target.value as any)}
                      className="px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs w-full focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer font-sans"
                    >
                      <option value="student">Student 🎓</option>
                      <option value="teacher">Teacher 🧑‍🏫</option>
                      <option value="parent">Parent 👪</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-violet-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Provision Account
                  </button>
                </div>
              </form>
            </div>

            {/* History Logs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-extrabold font-outfit text-sm text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-500" />
                  Recent Provision Logs
                </h3>
                <p className="text-[9px] text-slate-400">Auditing logs of newly registered school profiles.</p>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {provisionedUsers.map((p, idx) => (
                  <div key={p.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200 leading-tight">{p.fullName}</h4>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">{p.email}</p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono ${
                        p.role === "student" ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" :
                        p.role === "teacher" ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" :
                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {p.role}
                      </span>
                      <p className="text-[7px] text-slate-400 font-mono mt-0.5">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: ATTENDANCE CONTROL */}
        {activeTab === "attendance" && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-6"
          >
            <div>
              <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight">Attendance Tracking System</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit student attendance averages, weekly registers, and absence thresholds</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <h4 className="font-bold text-xs uppercase text-slate-400">Weekly Attendance</h4>
                <p className="text-2xl font-extrabold font-outfit text-slate-950 dark:text-white">96.8% average</p>
                <p className="text-[10px] text-slate-500">Up 1.2% compared to last week cohorts averages.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <h4 className="font-bold text-xs uppercase text-slate-400">Absent Warning Trigger</h4>
                <p className="text-2xl font-extrabold font-outfit text-rose-500">2 cadets flagged</p>
                <p className="text-[10px] text-slate-500">Profiles experiencing consecutive absences indexes.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <h4 className="font-bold text-xs uppercase text-slate-400">Total Registers Taken</h4>
                <p className="text-2xl font-extrabold font-outfit text-slate-950 dark:text-white">100% complete</p>
                <p className="text-[10px] text-slate-500">All classroom schedules successfully synched.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: EXAMS & RESULTS */}
        {activeTab === "exams" && (
          <motion.div
            key="exams"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight">Academic Performance & Cohorts Comparisons</h3>
                <p className="text-xs text-slate-400 mt-0.5">Term examination results analytics and cohorts performance tracking</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-violet-500/5 text-[#7C3AED] border border-violet-500/10 text-[10px] font-bold uppercase tracking-wider">
                Exams Calendar
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={academicPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                  <XAxis dataKey="term" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px", color: "#fff" }} />
                  <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="GradeA" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} name="Grade A %" />
                  <Area type="monotone" dataKey="GradeB" stroke="#3b82f6" fill="none" name="Grade B %" />
                  <Area type="monotone" dataKey="GradeC" stroke="#f43f5e" fill="none" name="Grade C %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* TAB 7: FEE MANAGEMENT */}
        {activeTab === "fees" && (
          <motion.div
            key="fees"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-left"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight">Institutional Fee Invoices & Revenue</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Total Term collected funds vs pending school tuition receivables</p>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeCollectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="term" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "10px", color: "#fff" }} />
                      <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: "11px" }} />
                      <Bar dataKey="Collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected NPR" />
                      <Bar dataKey="Pending" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Pending NPR" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#7C3AED] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-white/15 text-white text-[8px] font-extrabold uppercase tracking-wider">Financial Health</span>
                  <h3 className="text-2xl font-extrabold font-outfit tracking-tight text-white">NPR 1,482,000</h3>
                  <p className="text-xs text-violet-200 leading-normal">Total collected revenue is on track. Pending fees reduced by 5% this term.</p>
                </div>

                <div className="pt-6 relative z-10">
                  <button className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#7C3AED] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer">
                    <Receipt className="w-3.5 h-3.5" /> Reconcile General Ledger
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 8, 9, 10: LOGISTICS (TRANSPORT/HOSTEL/LIBRARY) */}
        {(activeTab === "transport" || activeTab === "hostel" || activeTab === "library") && (
          <motion.div
            key="logistics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm text-left"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight uppercase">
                  Institutional {activeTab} Operations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Asset logs, availability indexes, and operational capacity tracking</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 text-[10px] font-bold uppercase tracking-wider">
                Normal Capacity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-400">Total Allocation Capacity</h4>
                <p className="text-2xl font-extrabold font-outfit text-slate-950 dark:text-white">88% Utilized</p>
                <p className="text-[10px] text-slate-500 leading-normal">Optimized assets allocation. Minimal operational bottlenecking detected.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-400">Active Incidents / Errors</h4>
                <p className="text-2xl font-extrabold font-outfit text-emerald-500">0 Alerts</p>
                <p className="text-[10px] text-slate-500 leading-normal">System operations functioning 100% within regulatory bounds.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-400">Scheduled Updates</h4>
                <p className="text-2xl font-extrabold font-outfit text-slate-950 dark:text-white">Tomorrow, 08:00</p>
                <p className="text-[10px] text-slate-500 leading-normal">Next standard inventory sync and routes inspection is automated.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 11: AI ANALYTICS ENGINE */}
        {activeTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-left"
          >
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-violet-400 animate-pulse" />
                  <h3 className="font-extrabold font-outfit text-base tracking-wide text-white">Readers Autonomous AI Engine Insights</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                  Model: Gemini 1.5 Enterprise
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="font-bold text-xs text-violet-400 uppercase tracking-wider">Attendance Predictor Analytics</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    By matching historic district weather forecasts, public events scheduling, and student attendance logs, the AI model estimates a **96.8% attendance** rating for the upcoming Term examinations.
                  </p>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 text-[10px] text-slate-400">
                    Accuracy score: **98.42% verified**
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Underperformance Early Flagging</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    System machine learning algorithms flagged **2 student profiles** experiencing high math grade volatilities. Recommended remedial actions were successfully dispatched to related parent accounts.
                  </p>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 text-[10px] text-slate-400">
                    Remedial engagement: **100% dispatch rate**
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 12: DEVELOPER SETTINGS CONFIG SHELL */}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left text-xs font-sans"
          >
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-extrabold font-outfit text-base text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                  <Settings className="w-5 h-5 text-violet-500 animate-float" />
                  Platform Settings & Administration Shell
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Control schema backups, cache policies, and initiate emergency lockdown states</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Clear System Cache</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Wipe service workers cache and sync offline assets metadata.</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Activity className="w-3.5 h-3.5 text-violet-400" /> Clear Cache
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/85 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Backup Database</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Trigger standard SQL snapshot backup of database profiles and credentials.</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Database className="w-3.5 h-3.5 text-violet-400" /> Run Backup
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency lockdown column */}
            <div className="bg-rose-500/10 border border-rose-500/25 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center animate-pulse">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold font-outfit text-base text-rose-500 tracking-tight">Security Lockdown</h3>
                <p className="text-xs text-rose-400/90 leading-relaxed">
                  Initiate absolute emergency security lockdown state. All operations, logins, API requests, and portal sessions will be instantly suspended until administrators physically verify security keys.
                </p>
              </div>

              <button className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-500/10 hover:scale-[1.01] cursor-pointer">
                <ShieldAlert className="w-4 h-4" /> Initiate Absolute Lockdown
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
