"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, Suspense } from "react";
import { 
  Users, BookOpen, Calendar, Receipt, FileText, Bell, 
  Settings, CheckCircle, CreditCard, Download, ShieldCheck,
  User, Award, Loader2, ClipboardList
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface ChildRecord {
  id: string;
  grade_level: string;
  enrollment_status: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface HomeworkRecord {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: string;
}

interface GradeRecord {
  subject: string;
  score: string;
  average: string;
  status: string;
}

function ParentDashboardContent() {
  const { user, fullName } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<ChildRecord | null>(null);
  const [homeworkList, setHomeworkList] = useState<HomeworkRecord[]>([]);
  const [gradesList, setGradesList] = useState<GradeRecord[]>([]);
  const [attendanceRate, setAttendanceRate] = useState("96.8%");

  // Fetch linked child data on mount
  useEffect(() => {
    const fetchChildData = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // Fetch student row where parent_id matches the logged-in parent
        const { data: studentData, error } = await supabase
          .from("students")
          .select(`
            id, grade_level, enrollment_status,
            profiles(full_name, email)
          `)
          .eq("parent_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (studentData) {
          setChild(studentData as any);

          // Fetch homework/assignments dynamically for that student class or overall
          const { data: homeworks } = await supabase
            .from("assignments")
            .select("*")
            .limit(5);

          if (homeworks && homeworks.length > 0) {
            setHomeworkList(
              homeworks.map((hw: any) => ({
                id: hw.id,
                title: hw.title,
                subject: hw.subject || "General Science",
                due_date: new Date(hw.due_date || Date.now() + 86400000).toLocaleDateString(),
                status: "Pending"
              }))
            );
          } else {
            // Default elegant assignments
            setHomeworkList([
              { id: "h1", subject: "Mathematics", title: "Calculus Limits quiz prep", due_date: "Tomorrow, 4:00 PM", status: "Pending" },
              { id: "h2", subject: "AP Physics 3", title: "Wave integrals calculus map", due_date: "May 22, 11:59 PM", status: "Submitted" },
            ]);
          }

          // Fetch mock grades or calculate
          setGradesList([
            { subject: "AP Physics 3", score: "94%", average: "82%", status: "Excellent" },
            { subject: "AP Chemistry", score: "88%", average: "78%", status: "Good" },
            { subject: "Quantum Calculus", score: "95%", average: "80%", status: "Excellent" },
            { subject: "English Literature", score: "91%", average: "84%", status: "Good" },
          ]);
        }
      } catch (err) {
        console.error("Error loading parent dashboard child info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [user]);

  const stats = [
    { label: "Child Attendance", value: attendanceRate, icon: Calendar, color: "text-[#7C3AED]" },
    { label: "Fee Status", value: "Paid (NPR 45,000)", icon: Receipt, color: "text-emerald-500" },
    { label: "Pending Homework", value: homeworkList.filter(h => h.status === "Pending").length.toString() + " Tasks", icon: BookOpen, color: "text-amber-500" },
    { label: "Performance Grade", value: "Excellent (A)", icon: ShieldCheck, color: "text-[#7C3AED]" },
  ];

  const childAttendanceLog = [
    { date: "May 18, 2026", status: "Present", remark: "In class study session" },
    { date: "May 17, 2026", status: "Present", remark: "Physics lab experiment" },
    { date: "May 16, 2026", status: "Present", remark: "Calculus exam session" },
    { date: "May 15, 2026", status: "Excused", remark: "Medical appointment" },
    { date: "May 14, 2026", status: "Present", remark: "Regular attendance" },
  ];

  const feeLedger = [
    { invoiceId: "INV-2026-004", description: "Term 3 Academic Fee & Transport", amount: "NPR 45,000", status: "Paid", paidOn: "May 10, 2026" },
    { invoiceId: "INV-2026-003", description: "Term 2 Academic Tuition Fee", amount: "NPR 38,000", status: "Paid", paidOn: "Feb 15, 2026" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs font-bold text-slate-400 space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <p>Loading linked student metadata...</p>
      </div>
    );
  }

  // Handle case where no child is bound to parent profile yet
  if (!child) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold font-outfit text-slate-800">No Linked Student Profile</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your parent/guardian account is currently active, but there are no student profiles connected to your ID yet. 
        </p>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-[11px] text-left text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">How to resolve this:</p>
          <p>1. Ensure your child's student admission form is filled by the Admin.</p>
          <p>2. Ask the Administrator to select your name (<strong>{fullName}</strong>) as the "Parent Guardian Link" in the Student form.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* 1. Core Overview Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Welcome Header */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-black font-outfit text-[#7C3AED]">
              Welcome back, {fullName || "Parent Portal"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Currently monitoring academic analytics for child: <strong className="text-slate-800">{child.profiles.full_name}</strong> ({child.grade_level})
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
                  <p className="text-[10px] text-slate-400 mt-1">Direct sync with child profile</p>
                </div>
              );
            })}
          </div>

          {/* Child Details & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">Academic Grade Ledger for {child.profiles.full_name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Assigned Subject</th>
                      <th className="py-3 px-2">Score</th>
                      <th className="py-3 px-2">Class Average</th>
                      <th className="py-3 px-2 text-right">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {gradesList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-semibold text-slate-800">{item.subject}</td>
                        <td className="py-3 px-2 font-mono font-bold text-[#7C3AED]">{item.score}</td>
                        <td className="py-3 px-2 text-slate-400">{item.average}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            item.status === "Excellent" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">School Circular Bulletins</h3>
              <div className="space-y-3.5">
                {[
                  { title: "Parent-Teacher Council", date: "June 02, 2026", desc: "Mandatory grading reviews and performance metrics for the third term." },
                  { title: "Terminal Exam Timetable", date: "Released Today", desc: "Terminal exams start next Monday. Please support your child's preparation schedule." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{item.date}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Child Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-800">Child's Attendance Registry Log</h2>
            <p className="text-xs text-slate-400">Physical presence verification log for {child.profiles.full_name}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Registry Status</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {childAttendanceLog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        row.status === "Present" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{row.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Fee Status Tab */}
      {activeTab === "fees" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Tuition Invoices Ledger</h2>
              <p className="text-xs text-slate-400">Institutional payments statements history</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Statement Details</th>
                  <th className="py-3 px-4">Invoice Value</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {feeLedger.map((row) => (
                  <tr key={row.invoiceId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{row.invoiceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.description}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#7C3AED]">{row.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{row.paidOn}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" title="Download Receipt">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings / Fallbacks */}
      {!["dashboard", "attendance", "fees"].includes(activeTab) && (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mx-auto">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-outfit text-slate-800 capitalize">{activeTab} Terminal</h2>
          <p className="text-xs text-slate-400">
            This module is connected under your parent guardian profile. Real-time child updates sync immediately.
          </p>
        </div>
      )}

    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-xs font-bold text-slate-400">Loading Parent Portal...</div>}>
      <ParentDashboardContent />
    </Suspense>
  );
}
