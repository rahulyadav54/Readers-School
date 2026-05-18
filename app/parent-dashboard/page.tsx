"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, Suspense } from "react";
import { 
  Users, BookOpen, Calendar, Receipt, FileText, Bell, 
  Settings, CheckCircle, CreditCard, Download, ShieldCheck
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function ParentDashboardContent() {
  const { fullName } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Mock child metadata
  const child = {
    name: "Rahul Dev Yadav",
    grade: "Grade 10-A",
    rollNo: "Roll #14",
    attendanceRate: "96.8%",
    performance: "Excellent (A)",
    unsubmittedHomework: "1 Assignment",
  };

  const stats = [
    { label: "Child Attendance", value: child.attendanceRate, icon: Calendar, color: "text-[#7C3AED]" },
    { label: "Fee Status", value: "Paid (NPR 45,000)", icon: Receipt, color: "text-emerald-500" },
    { label: "Pending Homework", value: child.unsubmittedHomework, icon: BookOpen, color: "text-amber-500" },
    { label: "Performance Grade", value: child.performance, icon: ShieldCheck, color: "text-[#7C3AED]" },
  ];

  const classAssessments = [
    { name: "AP Physics 3: Terminal Exam", score: "96%", average: "82%", status: "Excellent" },
    { name: "Calculus Limits quiz", score: "88%", average: "78%", status: "Good" },
    { name: "Advanced Organic Chemistry", score: "95%", average: "80%", status: "Excellent" },
    { name: "English Literature mid-term", score: "91%", average: "84%", status: "Good" },
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
              Monitor your child's academic journey, attendance rate, grading metrics, and pending tuition invoices.
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
              <h3 className="font-bold text-sm font-outfit">Academic Grade Ledger for {child.name}</h3>
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
                    {classAssessments.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-semibold text-slate-800">{item.name}</td>
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
            <p className="text-xs text-slate-400">Physical presence verification log for {child.name}</p>
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
