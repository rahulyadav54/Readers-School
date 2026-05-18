"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, Suspense } from "react";
import { 
  Users, BookOpen, Calendar, ClipboardList, FileSpreadsheet, Bell, 
  Settings, CheckSquare, Plus, Loader2, Award, ClipboardCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

function TeacherDashboardContent() {
  const { fullName } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Mock list of students in the teacher's class
  const [students, setStudents] = useState([
    { id: "s1", name: "Anish Kumar Sah", class: "Grade 10-A", status: "present" },
    { id: "s2", name: "Rina Jaiswal", class: "Grade 10-A", status: "present" },
    { id: "s3", name: "Rahul Dev Yadav", class: "Grade 10-A", status: "present" },
    { id: "s4", name: "Suman Sah", class: "Grade 10-A", status: "absent" },
  ]);

  // Mock coursework submissions to grade
  const [submissions, setSubmissions] = useState([
    { id: "sub1", studentName: "Anish Kumar Sah", assignment: "Wave integrals calculus", submittedAt: "10 mins ago", score: "" },
    { id: "sub2", studentName: "Rahul Dev Yadav", assignment: "Wave integrals calculus", submittedAt: "1 hour ago", score: "94" },
    { id: "sub3", studentName: "Rina Jaiswal", assignment: "Wave integrals calculus", submittedAt: "3 hours ago", score: "" },
  ]);

  const [hwTitle, setHwTitle] = useState("");
  const [hwDue, setHwDue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const stats = [
    { label: "Assigned Cohorts", value: "4 Classes", icon: Users, color: "text-[#7C3AED]" },
    { label: "Total Students", value: "112 Pupils", icon: BookOpen, color: "text-emerald-500" },
    { label: "Grading Queues", value: "2 Pending", icon: ClipboardCheck, color: "text-amber-500" },
    { label: "Published Notices", value: "5 Notices", icon: Bell, color: "text-[#7C3AED]" },
  ];

  const handlePublishAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDue) return;

    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setHwTitle("");
      setHwDue("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const handleMarkAttendance = (id: string, status: "present" | "absent") => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleGradeSubmission = (id: string, score: string) => {
    setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, score } : sub));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* 1. Core Overview Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Welcome Header */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-black font-outfit text-[#7C3AED]">
              Welcome back, {fullName || "Faculty Portal"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage student grading, attendance registries, published course assignments, and schedules.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Faculty console sync active</p>
                </div>
              );
            })}
          </div>

          {/* Grading list & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">Awaiting Grading</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Student</th>
                      <th className="py-3 px-2">Coursework</th>
                      <th className="py-3 px-2">Submitted</th>
                      <th className="py-3 px-2 text-right">Assign Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-3 px-2 font-semibold text-slate-800">{sub.studentName}</td>
                        <td className="py-3 px-2 text-slate-500 font-medium">{sub.assignment}</td>
                        <td className="py-3 px-2 text-slate-400">{sub.submittedAt}</td>
                        <td className="py-3 px-2 text-right">
                          <input 
                            type="number" 
                            placeholder="Grade" 
                            value={sub.score}
                            onChange={(e) => handleGradeSubmission(sub.id, e.target.value)}
                            className="w-16 text-center border border-slate-200 rounded-lg py-1 px-1.5 text-xs focus:outline-none focus:border-[#7C3AED]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">Today's Class Schedule</h3>
              <div className="space-y-3.5">
                {[
                  { subject: "Quantum Calculus", room: "Room 102", time: "09:00 AM - 10:30 AM", grade: "Grade 10-A" },
                  { subject: "AP Physics 3", room: "Lab Block B", time: "01:00 PM - 02:30 PM", grade: "Grade 10-A" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">{item.subject}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                      <p className="text-[9px] text-[#7C3AED] font-bold uppercase font-mono">{item.grade} • {item.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Attendance Management Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Attendance Registry Console</h2>
              <p className="text-xs text-slate-400">Class Grade 10-A Daily Attendance Checklist</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              Date: {new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4 text-right">Attendance Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{student.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{student.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.class}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <button 
                          onClick={() => handleMarkAttendance(student.id, "present")}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            student.status === "present" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(student.id, "absent")}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            student.status === "absent" 
                              ? "bg-rose-50 text-rose-600 border border-rose-200" 
                              : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Assignment Uploads Tab */}
      {activeTab === "assignments" && (
        <div className="max-w-md mx-auto bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Publish New Coursework</h2>
            <p className="text-xs text-slate-400 mt-1">
              Add new assignments and homework metrics directly to your cohort student portals.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold"
              >
                🎉 Success! Coursework published successfully to Grade 10-A portal.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handlePublishAssignment} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Coursework Title
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Wave Function Integrals Calculus" 
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Syllabus Deadline (Due Date)
              </label>
              <input 
                type="datetime-local" 
                required
                value={hwDue}
                onChange={(e) => setHwDue(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Publish to Student Portals
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Settings / Fallbacks */}
      {!["dashboard", "attendance", "assignments"].includes(activeTab) && (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mx-auto">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-outfit text-slate-800 capitalize">{activeTab} Panel</h2>
          <p className="text-xs text-slate-400">
            This module is connected under your Faculty profile. Database parameters and grade averages sync in real-time.
          </p>
        </div>
      )}

    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-xs font-bold text-slate-400">Loading Faculty Portal...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}
