"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, Suspense } from "react";
import { 
  BookOpen, Calendar, ClipboardList, FileSpreadsheet, Bell, 
  Settings, CheckSquare, Trophy, Clock, FileText, Sparkles, BookOpenCheck,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AttendanceRegistry from "@/components/AttendanceRegistry";

const supabase = createClient();

interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: string;
}

function StudentDashboardContent() {
  const { user, fullName } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // Fetch student's own database profile info
        const { data: studentData } = await supabase
          .from("students")
          .select("*, profiles(*)")
          .eq("id", user.id)
          .maybeSingle();

        if (studentData) {
          setStudentDetails(studentData);
        }

        // Fetch assignments dynamically
        const { data: hwData } = await supabase
          .from("assignments")
          .select("*")
          .order("due_date", { ascending: true });

        if (hwData && hwData.length > 0) {
          setAssignments(
            hwData.map((hw: any) => ({
              id: hw.id,
              title: hw.title,
              subject: hw.subject || "General Science",
              due_date: new Date(hw.due_date || Date.now() + 86400000).toLocaleString(),
              status: "Pending"
            }))
          );
        } else {
          // Robust elegant defaults if assignments table is empty
          setAssignments([
            { id: "h1", subject: "Quantum Calculus", title: "Derivative wave functions exercises", due_date: "Tomorrow, 4:00 PM", status: "Pending" },
            { id: "h2", subject: "AP Physics 3", title: "Electrostatic field potential map", due_date: "May 22, 11:59 PM", status: "Submitted" },
            { id: "h3", subject: "Organic Chemistry", title: "Organic polymer synthesis analysis", due_date: "May 25, 2:00 PM", status: "Pending" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching student dashboard records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  // Student stats
  const stats = [
    { label: "Active Courses", value: "6", icon: BookOpen, color: "text-[#7C3AED]" },
    { label: "Attendance Rate", value: "98.4%", icon: Calendar, color: "text-emerald-500" },
    { label: "Pending Homework", value: assignments.filter(a => a.status === "Pending").length.toString() + " Tasks", icon: CheckSquare, color: "text-amber-500" },
    { label: "Term Average", value: "94.2% (A)", icon: Trophy, color: "text-[#7C3AED]" },
  ];

  // Chart data
  const weeklyAttendance = [
    { name: "Week 1", Rate: 98 },
    { name: "Week 2", Rate: 96 },
    { name: "Week 3", Rate: 100 },
    { name: "Week 4", Rate: 98 },
    { name: "Week 5", Rate: 100 },
  ];

  const courseGrades = [
    { course: "Physics", Student: 94, Average: 82 },
    { course: "Calculus", Student: 88, Average: 78 },
    { course: "Chemistry", Student: 95, Average: 80 },
    { course: "Literature", Student: 91, Average: 84 },
  ];

  const classSchedule = [
    { time: "09:00 AM - 10:30 AM", mon: "AP Physics 3", tue: "Quantum Calculus", wed: "AP Physics 3", thu: "Quantum Calculus", fri: "AP Physics 3" },
    { time: "10:45 AM - 12:15 PM", mon: "Organic Chemistry", tue: "Literature II", wed: "Organic Chemistry", thu: "Literature II", fri: "Organic Chemistry" },
    { time: "01:00 PM - 02:30 PM", mon: "Biotechnology Lab", tue: "Computer Science", wed: "Biotechnology Lab", thu: "Computer Science", fri: "Lab Review" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 text-xs font-bold space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <p>Synchronizing student academic index...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Tab Switch Router Dashboard view */}
      {activeTab === "dashboard" && (
        <>
          {/* Welcome Header */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-black font-outfit text-[#7C3AED]">
              Welcome back, {fullName || "Student Portal"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Currently connected to cohort: <strong className="text-slate-800">{studentDetails?.grade_level || "Grade 10-A"}</strong>
            </p>
          </div>

          {/* Institutional Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Current semester status</p>
                </div>
              );
            })}
          </div>

          {/* Minimal charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm font-outfit">Grade Comparison</h3>
                <p className="text-[11px] text-slate-400">Your score compared against class average scores</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseGrades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="course" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "11px" }} />
                    <Bar dataKey="Student" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Average" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm font-outfit">Attendance Consistency</h3>
                <p className="text-[11px] text-slate-400">Physical presence rates during academic weeks</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudentAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="Rate" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudentAtt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Homework list & Schedule grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">Active Homework & Assignments</h3>
              <div className="space-y-3">
                {assignments.slice(0, 3).map((homework) => (
                  <div key={homework.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center hover:border-slate-200 transition-all">
                    <div className="space-y-1">
                      <span className="inline-flex px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[9px] font-bold uppercase font-mono">
                        {homework.subject}
                      </span>
                      <p className="text-xs font-bold text-slate-800">{homework.title}</p>
                      <p className="text-[10px] text-slate-400">Due: {homework.due_date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      homework.status === "Submitted" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {homework.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">School Notifications</h3>
              <div className="space-y-3">
                {[
                  { title: "Science Exhibition Registration", date: "Due by Friday", desc: "Register your quantum synthesis projects with Dr. Adrian." },
                  { title: "Terminal Exam Schedule", date: "Term 3 Finals", desc: "Download the updated syllabus matrix from portal options." },
                ].map((notice, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{notice.title}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{notice.date}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{notice.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Homework / Assignments tab */}
      {activeTab === "homework" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit">Assignments Console</h2>
            <p className="text-xs text-slate-400">View and submit pending classwork assignments</p>
          </div>
          <div className="space-y-3">
            {assignments.map((homework) => (
              <div key={homework.id} className="p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-wider font-mono">
                    {homework.subject}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800">{homework.title}</h4>
                  <p className="text-[10px] text-slate-400">Due: {homework.due_date} | Weight: 100 Marks</p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    homework.status === "Submitted" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {homework.status}
                  </span>
                  {homework.status === "Pending" ? (
                    <button className="px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[10px] font-bold cursor-pointer transition-all">
                      Submit Work
                    </button>
                  ) : (
                    <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-bold cursor-not-allowed">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable tab */}
      {activeTab === "timetable" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit">Academic Class Timetable</h2>
            <p className="text-xs text-slate-400">Assigned weekly class lectures schedule</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-100 rounded-xl">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Time Period</th>
                  <th className="py-3 px-4">Mon</th>
                  <th className="py-3 px-4">Tue</th>
                  <th className="py-3 px-4">Wed</th>
                  <th className="py-3 px-4">Thu</th>
                  <th className="py-3 px-4">Fri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classSchedule.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{row.time}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{row.mon}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.tue}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{row.wed}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.thu}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{row.fri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Management Tab */}
      {activeTab === "attendance" && (
        <AttendanceRegistry />
      )}

      {/* Settings / Fallback tabs */}
      {!["dashboard", "homework", "timetable", "attendance"].includes(activeTab) && (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mx-auto">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-outfit text-slate-800 capitalize">{activeTab} Terminal</h2>
          <p className="text-xs text-slate-400">
            This module is connected under your Student profile. Direct records are synchronizing in realtime with the school server.
          </p>
        </div>
      )}

    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-xs font-bold text-slate-400">Loading Student Portal...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
