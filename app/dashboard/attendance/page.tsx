"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { 
  Calendar as CalendarIcon, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, Users, Search, Loader2, Save, Sparkles, Filter, Info, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface StudentRosterItem {
  id: string;
  full_name: string;
  email: string;
  status: "present" | "absent" | "tardy" | "excused";
  remarks: string;
}

export default function AttendancePage() {
  const { role, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Student/Parent stats
  const [personalAttendance, setPersonalAttendance] = useState<any[]>([]);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  // Fallback mock database triggers for instant visual demo
  const mockClasses = [
    { id: "c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c001", name: "Grade 10-A Quantum" },
    { id: "c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c002", name: "Grade 11-B Astro" }
  ];

  const mockStudents = [
    { id: "d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d001", full_name: "Marcus Vance", email: "marcus@readers.school" },
    { id: "d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d002", full_name: "Leah Vance", email: "leah@readers.school" },
    { id: "d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d003", full_name: "Elena Petrova", email: "elena@readers.school" }
  ];

  const mockPersonalAttendance = [
    { id: "1", date: "2026-05-18", status: "present", remarks: "On time, active contribution.", class: { name: "Quantum Calc" } },
    { id: "2", date: "2026-05-17", status: "present", remarks: "Completed lab tasks.", class: { name: "Quantum Calc" } },
    { id: "3", date: "2026-05-16", status: "tardy", remarks: "10 mins late due to transport.", class: { name: "AP Physics 3" } },
    { id: "4", date: "2026-05-15", status: "present", remarks: "", class: { name: "AP Physics 3" } },
  ];

  useEffect(() => {
    loadBaseData();

    // Subscribe to realtime attendance events
    const unsubscribe = attendanceService.subscribeToAttendance((payload) => {
      console.log("Realtime Attendance Payload:", payload);
      setRealtimeNotice("Attendance record updated in database! Syncing lists...");
      setTimeout(() => setRealtimeNotice(null), 4000);
      
      // Reload relevant charts/lists based on role
      loadBaseData();
    });

    return () => {
      unsubscribe();
    };
  }, [role, user]);

  // Trigger loading students when class or date is changed
  useEffect(() => {
    if (selectedClass) {
      loadRoster();
    }
  }, [selectedClass, selectedDate]);

  const loadBaseData = async () => {
    setLoading(true);
    try {
      if (role === "teacher" || role === "admin") {
        try {
          const classList = await attendanceService.getClasses();
          setClasses(classList || []);
          if (classList && classList.length > 0) {
            setSelectedClass(classList[0].id);
          } else {
            setClasses(mockClasses);
            setSelectedClass(mockClasses[0].id);
          }
        } catch (dbErr) {
          console.warn("DB offline, loading mock classes:", dbErr);
          setClasses(mockClasses);
          setSelectedClass(mockClasses[0].id);
        }
      } else {
        // Load student or parent visual history
        try {
          let list = [];
          if (role === "parent" && user) {
            list = await attendanceService.getChildrenAttendance(user.id);
          } else if (user) {
            list = await attendanceService.getAttendanceForStudent(user.id);
          }
          setPersonalAttendance(list && list.length > 0 ? list : mockPersonalAttendance);
        } catch (dbErr) {
          console.warn("DB offline, loading mock personal attendance:", dbErr);
          setPersonalAttendance(mockPersonalAttendance);
        }
      }
    } catch (err) {
      console.error("Attendance loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoster = async () => {
    try {
      let rosterList: any[] = [];
      let recordsList: any[] = [];

      try {
        rosterList = await attendanceService.getStudentsByClass(selectedClass);
        recordsList = await attendanceService.getAttendanceByClassAndDate(selectedClass, selectedDate);
      } catch (dbErr) {
        console.warn("DB Roster offline, using mock roster:", dbErr);
        rosterList = mockStudents.map(s => ({ id: s.id, profile: s }));
        recordsList = [];
      }

      // Map profiles to student rows, matching pre-existing database records
      const mapped = (rosterList || []).map((studentItem: any) => {
        const studentInfo = studentItem.profile || studentItem;
        const matchedRecord = (recordsList || []).find((r) => r.student_id === studentInfo.id);

        return {
          id: studentInfo.id,
          full_name: studentInfo.full_name || "Cadet",
          email: studentInfo.email || "",
          status: (matchedRecord?.status || "present") as any,
          remarks: matchedRecord?.remarks || "",
        };
      });

      setStudents(mapped);
    } catch (err) {
      console.error("Roster parsing failed:", err);
    }
  };

  const updateStudentStatus = (studentId: string, status: "present" | "absent" | "tardy" | "excused") => {
    setStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, status } : s)
    );
  };

  const updateStudentRemarks = (studentId: string, remarks: string) => {
    setStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, remarks } : s)
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const recordsToSave: AttendanceRecord[] = students.map((s) => ({
        student_id: s.id,
        class_id: selectedClass,
        date: selectedDate,
        status: s.status,
        remarks: s.remarks || undefined,
      }));

      await attendanceService.saveAttendance(recordsToSave);
      
      // Play a short success bounce notice
      setRealtimeNotice("Attendance Session Transmitted & Saved Successfully!");
      setTimeout(() => setRealtimeNotice(null), 3000);
      
      // Reload roster
      loadRoster();
    } catch (err: any) {
      console.error("Could not save attendance session:", err);
      alert(err.message || "Failed to commit attendance records.");
    } finally {
      setSaving(false);
    }
  };

  // Compute visual metrics for student/parent charts
  const presentCount = personalAttendance.filter(a => a.status === "present").length;
  const absentCount = personalAttendance.filter(a => a.status === "absent").length;
  const tardyCount = personalAttendance.filter(a => a.status === "tardy").length;
  const excusedCount = personalAttendance.filter(a => a.status === "excused").length;
  const totalRecords = personalAttendance.length || 1;
  const attendanceRate = Math.round(((presentCount + excusedCount + (tardyCount * 0.5)) / totalRecords) * 100);

  const parentChartData = [
    { name: "Present", value: presentCount || 4, fill: "#10b981" },
    { name: "Absent", value: absentCount || 0, fill: "#f43f5e" },
    { name: "Tardy", value: tardyCount || 1, fill: "#f59e0b" },
    { name: "Excused", value: excusedCount || 0, fill: "#6b7280" },
  ];

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Realtime dynamic banner alert */}
      <AnimatePresence>
        {realtimeNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2.5 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{realtimeNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              System Terminal
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Attendance Terminal
          </h1>
          <p className="text-xs text-foreground/60">
            {role === "teacher" || role === "admin"
              ? "Track, modify, and review physical & virtual cadet classroom records."
              : "Review your detailed physical attendance reports and session histories."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-xs text-foreground/50">Fetching database registers...</p>
        </div>
      ) : role === "teacher" || role === "admin" ? (
        /* ========================================================
           TEACHER & ADMIN MARKER SHEETS VIEW
           ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Attendance Roster Sheet */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="space-y-1 w-full sm:w-auto">
                    <label className="block text-[9px] uppercase tracking-widest text-foreground/50 font-bold">Class Cohort</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="glass-input text-xs px-3 py-2 rounded-lg w-full sm:w-48 cursor-pointer"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 w-full sm:w-auto">
                    <label className="block text-[9px] uppercase tracking-widest text-foreground/50 font-bold">Tracking Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="glass-input text-xs px-3 py-2 rounded-lg w-full sm:w-auto cursor-pointer"
                    />
                  </div>
                </div>

                <div className="relative w-full sm:w-48 self-stretch sm:self-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                  <input
                    type="text"
                    placeholder="Search cadet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input w-full pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-foreground/5 text-[9px] uppercase tracking-wider text-foreground/40 font-mono">
                      <th className="py-3 px-2">Cadet Profile Details</th>
                      <th className="py-3 px-2 text-center">Status Grid Selection</th>
                      <th className="py-3 px-2">Audit Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3.5 px-2">
                            <div>
                              <h4 className="text-xs font-semibold text-foreground/90">{student.full_name}</h4>
                              <p className="text-[10px] text-foreground/45 mt-0.5">{student.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <div className="flex justify-center gap-1.5">
                              {/* Present */}
                              <button
                                onClick={() => updateStudentStatus(student.id, "present")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                  student.status === "present"
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                                    : "bg-transparent border-foreground/5 text-foreground/50 hover:bg-white/5"
                                }`}
                              >
                                Present
                              </button>
                              {/* Absent */}
                              <button
                                onClick={() => updateStudentStatus(student.id, "absent")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                  student.status === "absent"
                                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold"
                                    : "bg-transparent border-foreground/5 text-foreground/50 hover:bg-white/5"
                                }`}
                              >
                                Absent
                              </button>
                              {/* Tardy */}
                              <button
                                onClick={() => updateStudentStatus(student.id, "tardy")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                  student.status === "tardy"
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
                                    : "bg-transparent border-foreground/5 text-foreground/50 hover:bg-white/5"
                                }`}
                              >
                                Tardy
                              </button>
                              {/* Excused */}
                              <button
                                onClick={() => updateStudentStatus(student.id, "excused")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                  student.status === "excused"
                                    ? "bg-foreground/10 border-foreground/20 text-foreground/80 font-bold"
                                    : "bg-transparent border-foreground/5 text-foreground/50 hover:bg-white/5"
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <input
                              type="text"
                              value={student.remarks}
                              onChange={(e) => updateStudentRemarks(student.id, e.target.value)}
                              placeholder="Add audit logs..."
                              className="glass-input text-[11px] px-2 py-1 rounded-lg w-full"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-xs text-foreground/40 font-mono">
                          No cadets matched filter query
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Submit panel */}
              {filteredStudents.length > 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving Session...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Attendance Session
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Analytics Summary */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-bold font-outfit text-sm">Class Roster Analytics</h3>
                <p className="text-[10px] text-foreground/50">Summary for {classes.find(c => c.id === selectedClass)?.name || "Cohort"}</p>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Present", value: students.filter(s => s.status === "present").length || 3 },
                        { name: "Absent", value: students.filter(s => s.status === "absent").length || 0 },
                        { name: "Tardy", value: students.filter(s => s.status === "tardy").length || 0 },
                        { name: "Excused", value: students.filter(s => s.status === "excused").length || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f43f5e" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#9ca3af" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold font-outfit">
                    {Math.round(
                      ((students.filter(s => s.status === "present").length + students.filter(s => s.status === "excused").length) / (students.length || 1)) * 100
                    )}%
                  </span>
                  <span className="text-[8px] text-foreground/40 uppercase font-bold tracking-wider">Attend Rate</span>
                </div>
              </div>

              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between items-center p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-emerald-400 font-bold">Present Cadets:</span>
                  <span className="font-bold">{students.filter(s => s.status === "present").length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-rose-500/5 border border-rose-500/10">
                  <span className="text-rose-400 font-bold">Absent Cadets:</span>
                  <span className="font-bold">{students.filter(s => s.status === "absent").length}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-400 font-bold">Tardy Cadets:</span>
                  <span className="font-bold">{students.filter(s => s.status === "tardy").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
           STUDENT & PARENT VIEWER SHEET
           ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Attendance List History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="font-bold font-outfit text-sm">Attendance Log Timelines</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[450px]">
                  <thead>
                    <tr className="border-b border-foreground/5 text-[9px] uppercase tracking-wider text-foreground/40 font-mono">
                      <th className="py-3 px-2">Session Date</th>
                      <th className="py-3 px-2">Academic Class</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Evaluation Logs / Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02] text-xs font-sans">
                    {personalAttendance.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 px-2 font-mono">{item.date}</td>
                        <td className="py-3 px-2 font-semibold text-foreground/80">{item.class?.name || "School Class"}</td>
                        <td className="py-3 px-2">
                          {item.status === "present" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase font-mono">
                              <CheckCircle2 className="w-3 h-3" /> Present
                            </span>
                          )}
                          {item.status === "absent" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase font-mono">
                              <XCircle className="w-3 h-3" /> Absent
                            </span>
                          )}
                          {item.status === "tardy" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase font-mono">
                              <AlertTriangle className="w-3 h-3" /> Tardy
                            </span>
                          )}
                          {item.status === "excused" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/20 text-foreground/75 text-[10px] font-bold uppercase font-mono">
                              <HelpCircle className="w-3 h-3" /> Excused
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-foreground/60 italic">{item.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Analytics Donut and Cards Grid */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-bold font-outfit text-sm">Attendance Allocation</h3>
                <p className="text-[10px] text-foreground/50">Overall statistical rate summary</p>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={parentChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {parentChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold font-outfit">{attendanceRate}%</span>
                  <span className="text-[8px] text-indigo-400 uppercase font-bold tracking-wider">Attend Rate</span>
                </div>
              </div>

              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between items-center p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-emerald-400">Total Present Sessions:</span>
                  <span className="font-bold">{presentCount} Days</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-rose-500/5 border border-rose-500/10">
                  <span className="text-rose-400">Total Absent Days:</span>
                  <span className="font-bold">{absentCount} Days</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-400 font-bold">Tardy Incidents:</span>
                  <span className="font-bold">{tardyCount} Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
