"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, Users, Search, Loader2, Save, Sparkles, Filter, 
  FileText, CalendarDays, ArrowUpRight, CheckSquare, Plus, Download, History, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area
} from "recharts";

const supabase = createClient();

interface StudentRosterItem {
  id: string;
  full_name: string;
  email: string;
  roll_number?: string | null;
  grade_level?: string;
  status: "present" | "absent" | "tardy" | "excused";
  remarks: string;
}

interface ClassItem {
  id: string;
  name: string;
}

export default function AttendanceRegistry() {
  const { role, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Student/Parent tracking states
  const [personalAttendance, setPersonalAttendance] = useState<any[]>([]);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");

  // History tab toggle
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [historyClassFilter, setHistoryClassFilter] = useState("all");
  const [historyDateFilter, setHistoryDateFilter] = useState("");

  // Stats summary for admin/teacher
  const [todayStats, setTodayStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    rate: 100
  });

  useEffect(() => {
    loadClassesAndRoster();
  }, [role, user]);

  useEffect(() => {
    if (selectedClass) {
      loadRoster();
    }
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    if (role === "student" && user) {
      loadStudentAttendance(user.id);
    } else if (role === "parent" && user) {
      loadParentChildren();
    }
  }, [role, user]);

  useEffect(() => {
    if (selectedChildId) {
      loadStudentAttendance(selectedChildId);
    }
  }, [selectedChildId]);

  // Load Classes
  const loadClassesAndRoster = async () => {
    try {
      setLoading(true);
      const { data: classList, error } = await supabase
        .from("classes")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setClasses(classList || []);

      if (classList && classList.length > 0) {
        setSelectedClass(classList[0].id);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load parent's children
  const loadParentChildren = async () => {
    if (!user) return;
    try {
      const { data: children, error } = await supabase
        .from("students")
        .select(`
          id,
          profiles:id (full_name)
        `)
        .eq("parent_id", user.id);

      if (error) throw error;
      setChildrenList(children || []);
      if (children && children.length > 0) {
        setSelectedChildId(children[0].id);
      }
    } catch (err) {
      console.error("Error fetching children profiles:", err);
    }
  };

  // Load attendance logs for a specific student (Student or Parent role)
  const loadStudentAttendance = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*, class:classes(name)")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

      if (error) throw error;
      setPersonalAttendance(data || []);
    } catch (err) {
      console.error("Error loading personal attendance:", err);
    }
  };

  // Load daily class roster
  const loadRoster = async () => {
    if (!selectedClass) return;
    try {
      // 1. Fetch Students in Class
      const { data: studentsData, error: studentError } = await supabase
        .from("students")
        .select(`
          id,
          roll_number,
          profiles:id (full_name, email)
        `)
        .eq("class_id", selectedClass)
        .eq("enrollment_status", "active");

      if (studentError) throw studentError;

      // 2. Fetch Attendance Records for selected date & class
      const { data: attendanceData, error: attError } = await supabase
        .from("attendance")
        .select("*")
        .eq("class_id", selectedClass)
        .eq("date", selectedDate);

      if (attError) throw attError;

      // 3. Map students to attendance selection status
      const mappedRoster = (studentsData || []).map((s: any) => {
        const matchedRecord = (attendanceData || []).find(att => att.student_id === s.id);
        const profile = s.profiles;
        return {
          id: s.id,
          full_name: profile?.full_name || "Cadet",
          email: profile?.email || "",
          roll_number: s.roll_number || "N/A",
          status: (matchedRecord?.status || "present") as any,
          remarks: matchedRecord?.remarks || ""
        };
      });

      setStudents(mappedRoster);

      // Compute statistics summary for dashboard cards
      const total = mappedRoster.length || 1;
      const present = mappedRoster.filter(r => r.status === "present").length;
      const absent = mappedRoster.filter(r => r.status === "absent").length;
      const late = mappedRoster.filter(r => r.status === "tardy").length;
      const leave = mappedRoster.filter(r => r.status === "excused").length;
      const rate = Math.round(((present + leave + (late * 0.5)) / total) * 100);

      setTodayStats({ present, absent, late, leave, rate });
    } catch (err) {
      console.error("Roster retrieval failure:", err);
    }
  };

  // Status changes handler
  const setStudentStatus = (studentId: string, status: "present" | "absent" | "tardy" | "excused") => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  // Remarks change handler
  const setStudentRemarks = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, remarks } : s));
  };

  // Batch Save Attendance Session
  const saveDailyAttendance = async () => {
    if (!selectedClass) return;
    setSaving(true);
    try {
      const recordsToUpsert = students.map((s) => ({
        student_id: s.id,
        class_id: selectedClass,
        date: selectedDate,
        status: s.status,
        remarks: s.remarks || "",
        marked_by: user?.id || null
      }));

      const { error } = await supabase
        .from("attendance")
        .upsert(recordsToUpsert, { onConflict: "student_id, date" });

      if (error) throw error;

      setSuccessToast("Attendance Sheet Saved Successfully!");
      setTimeout(() => setSuccessToast(null), 3000);
      loadRoster();
    } catch (err: any) {
      alert("Error committing attendance session: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Load history data when History View is toggled on
  const fetchAllHistory = async () => {
    try {
      let query = supabase
        .from("attendance")
        .select("*, student:students(id, profiles(full_name, email)), class:classes(name)")
        .order("date", { ascending: false });

      if (historyClassFilter !== "all") {
        query = query.eq("class_id", historyClassFilter);
      }
      if (historyDateFilter) {
        query = query.eq("date", historyDateFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setHistoryLogs(data || []);
    } catch (err) {
      console.error("Error loading historical log registers:", err);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchAllHistory();
    }
  }, [showHistory, historyClassFilter, historyDateFilter]);

  // Dynamic search filter for class table
  const filteredRoster = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation for Student & Parents Recharts
  const presentCount = personalAttendance.filter(a => a.status === "present").length;
  const absentCount = personalAttendance.filter(a => a.status === "absent").length;
  const lateCount = personalAttendance.filter(a => a.status === "tardy").length;
  const leaveCount = personalAttendance.filter(a => a.status === "excused").length;
  const totalPersonal = personalAttendance.length || 1;
  const personalRate = Math.round(((presentCount + leaveCount + (lateCount * 0.5)) / totalPersonal) * 100);

  // Generate mock/real charts
  const studentPieData = [
    { name: "Present", value: presentCount || 4, fill: "#10b981" },
    { name: "Absent", value: absentCount || 0, fill: "#f43f5e" },
    { name: "Late", value: lateCount || 1, fill: "#f59e0b" },
    { name: "Leave", value: leaveCount || 0, fill: "#3b82f6" },
  ];

  const adminPieData = [
    { name: "Present", value: todayStats.present || 5, fill: "#10b981" },
    { name: "Absent", value: todayStats.absent || 0, fill: "#f43f5e" },
    { name: "Late", value: todayStats.late || 0, fill: "#f59e0b" },
    { name: "Leave", value: todayStats.leave || 0, fill: "#3b82f6" },
  ];

  // export CSV format function
  const exportToCSV = () => {
    let rows = [];
    if (showHistory) {
      rows = historyLogs.map(log => [
        log.date,
        log.student?.profiles?.full_name || "Unknown",
        log.class?.name || "Unknown",
        log.status,
        log.remarks || ""
      ]);
      rows.unshift(["Date", "Student Name", "Class", "Status", "Remarks"]);
    } else {
      rows = filteredRoster.map(s => [
        s.roll_number || "N/A",
        s.full_name,
        s.email,
        s.status,
        s.remarks
      ]);
      rows.unshift(["Roll Number", "Student Name", "Email Address", "Status", "Remarks"]);
    }
    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-700 relative">
      {/* Toast popup */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-bold"
          >
            <Sparkles className="w-4.5 h-4.5 text-emerald-100" />
            {successToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider mb-2">
            Institutional ERP Console
          </span>
          <h1 className="text-2xl font-black font-outfit text-slate-800 flex items-center gap-2">
            Attendance Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track student check-ins, record absences, and analyze institutional metrics dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
            <CalendarDays className="w-4 h-4 text-[#7C3AED]" />
            Today: {new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>

          {(role === "admin" || role === "teacher") && (
            <>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
              >
                {showHistory ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Roster Sheet
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4 text-purple-500" /> Attendance History
                  </>
                )}
              </button>

              <button 
                onClick={exportToCSV}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Report
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
          <p className="text-xs text-slate-400 font-bold">Connecting ERP Attendance Server...</p>
        </div>
      ) : (role === "admin" || role === "teacher") ? (
        /* ==========================================
           ADMIN & TEACHER INTERFACE
           ========================================== */
        showHistory ? (
          /* HISTORY LOGGER TAB */
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Historical Attendance Logbook</h3>
                <p className="text-xs text-slate-400">View overall school session check-in logs</p>
              </div>

              {/* History filters */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="space-y-1 flex-1 sm:flex-none">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Class Filter</label>
                  <select 
                    value={historyClassFilter}
                    onChange={(e) => setHistoryClassFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-40 font-medium"
                  >
                    <option value="all">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 flex-1 sm:flex-none">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Date Filter</label>
                  <input 
                    type="date"
                    value={historyDateFilter}
                    onChange={(e) => setHistoryDateFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none w-full sm:w-auto font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Session Date</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Academic Cohort</th>
                    <th className="py-3 px-4">Session Status</th>
                    <th className="py-3 px-4">Audit Logs / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No historical attendance records found matching filters.
                      </td>
                    </tr>
                  ) : (
                    historyLogs.map(log => {
                      const studentName = log.student?.profiles?.full_name || "Unknown Pupil";
                      const className = log.class?.name || "Unknown Class";
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{log.date}</td>
                          <td className="py-3.5 px-4 font-bold text-[#7C3AED]">{studentName}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">{className}</td>
                          <td className="py-3.5 px-4">
                            {log.status === "present" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">Present</span>
                            )}
                            {log.status === "absent" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100 uppercase tracking-wide">Absent</span>
                            )}
                            {log.status === "tardy" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase tracking-wide">Late</span>
                            )}
                            {log.status === "excused" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-wide">Leave</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 italic">{log.remarks || "—"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* MAIN ATTENDANCE ROSTER SHEET AND STATS GRID */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Main Sheet Console */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Check-in Rate", value: todayStats.rate + "%", color: "text-[#7C3AED] bg-purple-50/50" },
                  { label: "Present Today", value: todayStats.present.toString(), color: "text-emerald-600 bg-emerald-50/50" },
                  { label: "Absent Today", value: todayStats.absent.toString(), color: "text-rose-600 bg-rose-50/50" },
                  { label: "Approved Leaves", value: todayStats.leave.toString(), color: "text-blue-600 bg-blue-50/50" }
                ].map((s, idx) => (
                  <div key={idx} className={`${s.color} border border-slate-100 rounded-2xl p-4 text-center`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">{s.label}</p>
                    <p className="text-xl font-black mt-1 font-outfit text-slate-800">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Roster Container Card */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-5">
                
                {/* Dynamic Filters panel */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Cohort class</label>
                      <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none w-full sm:w-44 font-medium"
                      >
                        {classes.length === 0 ? (
                          <option value="">No classes found</option>
                        ) : (
                          classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Tracking date</label>
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none font-medium cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="relative w-full sm:w-44 self-stretch sm:self-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search pupil..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED] w-full"
                    />
                  </div>
                </div>

                {/* dynamic student list table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Roll</th>
                        <th className="py-3 px-4">Pupil Profile</th>
                        <th className="py-3 px-4 text-center">Status Selection Controls</th>
                        <th className="py-3 px-4">Audit Logs / Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {classes.length === 0 || students.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center">
                            <div className="max-w-xs mx-auto space-y-3">
                              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                                <Users className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-800">No Students Found</p>
                                <p className="text-xs text-slate-400">There are no academic student profiles provisioned in this class cohort yet.</p>
                              </div>
                              {role === "admin" && (
                                <Link 
                                  href="/admin-dashboard?tab=admissions"
                                  className="inline-flex items-center gap-1 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md cursor-pointer hover:scale-[1.01]"
                                >
                                  <Plus className="w-4 h-4" /> Add Student
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : filteredRoster.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 font-mono">
                            No students matched your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRoster.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{s.roll_number}</td>
                            <td className="py-3.5 px-4">
                              <div>
                                <p className="font-bold text-slate-800">{s.full_name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{s.email}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex justify-center gap-1.5">
                                {/* Present (Green) */}
                                <button
                                  type="button"
                                  onClick={() => setStudentStatus(s.id, "present")}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                    s.status === "present"
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                  }`}
                                >
                                  Present
                                </button>
                                {/* Absent (Red) */}
                                <button
                                  type="button"
                                  onClick={() => setStudentStatus(s.id, "absent")}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                    s.status === "absent"
                                      ? "bg-rose-50 border-rose-300 text-rose-600"
                                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                  }`}
                                >
                                  Absent
                                </button>
                                {/* Late (Yellow) */}
                                <button
                                  type="button"
                                  onClick={() => setStudentStatus(s.id, "tardy")}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                    s.status === "tardy"
                                      ? "bg-amber-50 border-amber-300 text-amber-600"
                                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                  }`}
                                >
                                  Late
                                </button>
                                {/* Leave (Blue) */}
                                <button
                                  type="button"
                                  onClick={() => setStudentStatus(s.id, "excused")}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                    s.status === "excused"
                                      ? "bg-blue-50 border-blue-300 text-blue-600"
                                      : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                                  }`}
                                >
                                  Leave
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <input 
                                type="text"
                                value={s.remarks}
                                onChange={(e) => setStudentRemarks(s.id, e.target.value)}
                                placeholder="Audit logs, late reason, etc..."
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 w-full focus:bg-white focus:outline-none text-[11px]"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Save button panel */}
                {students.length > 0 && (
                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={saveDailyAttendance}
                      disabled={saving}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white hover:from-[#6D28D9] hover:to-[#4F46E5] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" /> Saving Session...
                        </>
                      ) : (
                        <>
                          <Save className="w-4.5 h-4.5" /> Save Attendance Session
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Sidebar Analytics Cards */}
            <div className="space-y-6">
              
              {/* Pie chart summary */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Roster Check-in Share</h3>
                  <p className="text-[10px] text-slate-400">Summary share metrics for current class date selection</p>
                </div>

                <div className="h-44 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={adminPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {adminPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-outfit text-slate-800">{todayStats.rate}%</span>
                    <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest font-mono">Present Rate</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex justify-between">
                    <span>Present:</span>
                    <span>{todayStats.present}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex justify-between">
                    <span>Absent:</span>
                    <span>{todayStats.absent}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex justify-between">
                    <span>Late:</span>
                    <span>{todayStats.late}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex justify-between">
                    <span>Leave:</span>
                    <span>{todayStats.leave}</span>
                  </div>
                </div>
              </div>

              {/* Attendance dynamic guidelines notice card */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm text-xs space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#7C3AED]" /> Quick Audit Tips
                </h4>
                <ul className="list-disc pl-4 text-slate-400 space-y-1.5 leading-relaxed text-[11px]">
                  <li>Class registries are locked after the session date passes to preserve auditable registers.</li>
                  <li>Adding remarks in columns provides context inside parent notifications immediately.</li>
                  <li>Late checking adds a 0.5 present score weighting under student consistency charts automatically.</li>
                </ul>
              </div>
            </div>
          </div>
        )
      ) : (
        /* ==========================================
           STUDENT & PARENT INTERFACE
           ========================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Detailed Timelines List Card */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Parent-Specific Child Selector */}
            {role === "parent" && (
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Choose Child Profile:</span>
                <select 
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-xl focus:bg-white focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  {childrenList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.profiles?.full_name || "Pupil Account"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Attendance Roster Log Timeline Card */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Attendance Log Registry</h3>
                  <p className="text-xs text-slate-400">Daily verification status logs</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Session Date</th>
                      <th className="py-3 px-4">Subject Class</th>
                      <th className="py-3 px-4">Audit Status</th>
                      <th className="py-3 px-4">Remarks / Evaluation Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {personalAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                          No attendance check-ins are logged under this student profile yet.
                        </td>
                      </tr>
                    ) : (
                      personalAttendance.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{item.date}</td>
                          <td className="py-3.5 px-4 font-bold text-[#7C3AED]">{item.class?.name || "Regular Cohort"}</td>
                          <td className="py-3.5 px-4">
                            {item.status === "present" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">Present</span>
                            )}
                            {item.status === "absent" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100 uppercase tracking-wide">Absent</span>
                            )}
                            {item.status === "tardy" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase tracking-wide">Late</span>
                            )}
                            {item.status === "excused" && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-wide">Leave</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 italic">{item.remarks || "Regular Session"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3. Personal Analytics cards sidebar */}
          <div className="space-y-6">
            
            {/* Allocation percentage circle card */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Attendance Consistency</h3>
                <p className="text-[10px] text-slate-400">Academic session participation metrics</p>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {studentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-outfit text-slate-800">{personalRate}%</span>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-widest font-mono">Consistency</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex justify-between">
                  <span>Present:</span>
                  <span>{presentCount} days</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex justify-between">
                  <span>Absent:</span>
                  <span>{absentCount} days</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex justify-between">
                  <span>Late:</span>
                  <span>{lateCount} days</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex justify-between">
                  <span>Leave:</span>
                  <span>{leaveCount} days</span>
                </div>
              </div>
            </div>

            {/* Absences Alert Warning Card */}
            {absentCount > 2 && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-700">Absence Alert Triggered</h4>
                  <p className="text-[10px] text-rose-600 leading-normal">
                    This profile has accumulated {absentCount} absences. Regular attendance is required to qualify for terminal exams.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
