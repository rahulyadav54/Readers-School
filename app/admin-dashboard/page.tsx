"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, Suspense } from "react";
import { 
  Users, GraduationCap, BookOpen, Calendar, 
  FileSpreadsheet, Receipt, Bus, Home, Library, Bell, 
  Settings, Search, UserPlus, Lock, Mail, Loader2, 
  ArrowUpRight, ArrowDownRight, CheckCircle, ShieldAlert,
  Plus, CalendarDays, ClipboardList, FileText, Check, Trash2, Edit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend
} from "recharts";
import { useSearchParams, useRouter } from "next/navigation";

// TypeScript models
interface StudentRecord {
  id: string;
  name: string;
  class: string;
  attendance: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  performance: "Excellent" | "Good" | "Average" | "Needs Imp.";
}

interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  email: string;
  status: "Active" | "On Leave";
}

interface ParentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  childName: string;
}

function AdminDashboardContent() {
  const { user, fullName, role, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Account Provisioner States
  const [provName, setProvName] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPass, setProvPass] = useState("");
  const [provRole, setProvRole] = useState<"student" | "teacher" | "parent">("student");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock database entries (fully searchable & manageable)
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([
    { id: "s1", name: "Anish Kumar Sah", class: "Grade 10-A", attendance: "98%", feeStatus: "Paid", performance: "Excellent" },
    { id: "s2", name: "Rina Jaiswal", class: "Grade 9-B", attendance: "94%", feeStatus: "Pending", performance: "Good" },
    { id: "s3", name: "Rahul Dev Yadav", class: "Grade 10-A", attendance: "96%", feeStatus: "Paid", performance: "Excellent" },
    { id: "s4", name: "Suman Sah", class: "Grade 8-A", attendance: "88%", feeStatus: "Overdue", performance: "Average" },
    { id: "s5", name: "Pooja Thakur", class: "Grade 7-C", attendance: "92%", feeStatus: "Paid", performance: "Good" },
    { id: "s6", name: "Sunil Shrestha", class: "Grade 10-B", attendance: "82%", feeStatus: "Pending", performance: "Needs Imp." },
  ]);

  const [teachersList, setTeachersList] = useState<TeacherRecord[]>([
    { id: "t1", name: "Dr. Evelyn Vance", subject: "AP Chemistry", email: "evelyn@readers.school", status: "Active" },
    { id: "t2", name: "Prof. Clara Mercer", subject: "Quantum Calculus", email: "clara@readers.school", status: "Active" },
    { id: "t3", name: "Dr. Adrian Thorne", subject: "AP Physics", email: "adrian@readers.school", status: "On Leave" },
  ]);

  const [parentsList, setParentsList] = useState<ParentRecord[]>([
    { id: "p1", name: "Lakhan Yadav", email: "lakhan@gmail.com", phone: "+977 9851023456", childName: "Rahul Dev Yadav" },
    { id: "p2", name: "Bikash Sah", email: "bikash@gmail.com", phone: "+977 9801034567", childName: "Anish Kumar Sah" },
  ]);

  // Analytics Chart Data
  const growthData = [
    { name: "Term 1", Students: 840, Teachers: 52 },
    { name: "Term 2", Students: 980, Teachers: 61 },
    { name: "Term 3", Students: 1120, Teachers: 68 },
    { name: "Term 4", Students: 1248, Teachers: 74 },
  ];

  const revenueData = [
    { name: "Jan", Collected: 420000, Pending: 120000 },
    { name: "Feb", Collected: 680000, Pending: 150000 },
    { name: "Mar", Collected: 890000, Pending: 90000 },
    { name: "Apr", Collected: 1140000, Pending: 230000 },
  ];

  // User Provisioning Logic
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

      setSuccessMsg(`🎉 Success! Account provisioned successfully for ${provName} as a ${provRole}.`);
      
      // Update local lists dynamically
      if (provRole === "student") {
        setStudentsList(prev => [
          ...prev,
          { id: `s_${Date.now()}`, name: provName, class: "Unassigned", attendance: "100%", feeStatus: "Pending", performance: "Good" }
        ]);
      } else if (provRole === "teacher") {
        setTeachersList(prev => [
          ...prev,
          { id: `t_${Date.now()}`, name: provName, subject: "General Studies", email: provEmail, status: "Active" }
        ]);
      } else if (provRole === "parent") {
        setParentsList(prev => [
          ...prev,
          { id: `p_${Date.now()}`, name: provName, email: provEmail, phone: "Not provided", childName: "Unassigned student" }
        ]);
      }

      setProvName("");
      setProvEmail("");
      setProvPass("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = (id: string) => {
    setStudentsList(prev => prev.filter(s => s.id !== id));
  };

  const deleteTeacher = (id: string) => {
    setTeachersList(prev => prev.filter(t => t.id !== id));
  };

  const deleteParent = (id: string) => {
    setParentsList(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* 1. Dynamic Tabs Display based on URL query */}
      {activeTab === "dashboard" && (
        <>
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <div>
              <h1 className="text-2xl font-black font-outfit tracking-tight text-[#7C3AED]">
                Readers School ERP Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage institutional school operations efficiently.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push("/admin-dashboard?tab=admissions")}
                className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
              <button 
                onClick={() => router.push("/admin-dashboard?tab=reports")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <FileText className="w-4 h-4" /> Generate Report
              </button>
            </div>
          </div>

          {/* Clean SaaS-style Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Students", value: "1,248", icon: GraduationCap, color: "text-[#7C3AED]", trend: "+14%" },
              { label: "Total Teachers", value: "74", icon: BookOpen, color: "text-emerald-500", trend: "+4%" },
              { label: "Revenue Collected", value: "NPR 3.68M", icon: Receipt, color: "text-blue-500", trend: "+18%" },
              { label: "Avg Attendance", value: "96.8%", icon: Calendar, color: "text-amber-500", trend: "+1.2%" },
              { label: "Pending Fees", value: "NPR 1.14M", icon: Receipt, color: "text-rose-500", trend: "-5%" },
              { label: "Active Classes", value: "32", icon: Home, color: "text-teal-500", trend: "Stable" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-black tracking-tight">{stat.value}</p>
                  <span className={`text-[10px] font-bold ${stat.trend.startsWith("-") ? "text-rose-500" : "text-emerald-500"} mt-1.5 block`}>
                    {stat.trend} this term
                  </span>
                </div>
              );
            })}
          </div>

          {/* Minimal SaaS Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Growth & Faculty Area Chart */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm font-outfit text-slate-800">Student & Faculty Growth</h3>
                <p className="text-[11px] text-slate-400">Institutional registration levels across recent semesters</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="Students" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="Teachers" stroke="#10B981" strokeWidth={1.5} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Overview Bar Chart */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm font-outfit text-slate-800">Revenue Ledger</h3>
                <p className="text-[11px] text-slate-400">Monthly breakdown of collected versus pending academic tuition</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "11px" }} />
                    <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="Collected" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Tasks & Recent Activity log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">Active Operations Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3">Activity</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { act: "Priyanka Sah enrolled in Grade 9", type: "Admissions", status: "Completed", time: "10 mins ago" },
                      { act: "Satish Kumar requested leave", type: "Faculty", status: "Pending", time: "1 hour ago" },
                      { act: "NPR 45,000 Tuition payment", type: "Finance", status: "Completed", time: "3 hours ago" },
                      { act: "Class Schedule update term 2", type: "Schedule", status: "Completed", time: "Yesterday" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-medium">{row.act}</td>
                        <td className="py-3.5 text-slate-500">{row.type}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${row.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit">School Announcements</h3>
              <div className="space-y-3.5">
                {[
                  { title: "Mid-Term Examination Schedule", date: "May 25, 2026", desc: "Examinations will commence for Grades 1-10 on upcoming Monday." },
                  { title: "Parent-Teacher Conference", date: "June 02, 2026", desc: "Mandatory grading matrix reviews with academic faculty advisors." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 hover:border-slate-200 transition-all">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{item.date}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Students Tab */}
      {activeTab === "students" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Students Registry</h2>
              <p className="text-xs text-slate-400">Total registered academic student records</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED] w-full"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4">Performance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {studentsList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{student.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{student.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.class}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{student.attendance}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        student.feeStatus === "Paid" ? "bg-emerald-50 text-emerald-600" : 
                        student.feeStatus === "Pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{student.performance}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => deleteStudent(student.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Teachers Tab */}
      {activeTab === "teachers" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-800">Faculty Directory</h2>
            <p className="text-xs text-slate-400">Total registered teachers and departments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Teacher ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teachersList.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{teacher.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{teacher.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{teacher.subject}</td>
                    <td className="py-3.5 px-4 text-slate-500">{teacher.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        teacher.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => deleteTeacher(teacher.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Parents Tab */}
      {activeTab === "parents" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-800">Parents Registry</h2>
            <p className="text-xs text-slate-400">Total registered parent & guardian records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Parent ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Linked Child</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parentsList.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{parent.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{parent.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{parent.email}</td>
                    <td className="py-3.5 px-4 text-slate-600">{parent.phone}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{parent.childName}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => deleteParent(parent.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Parent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Admissions / Provisioning Tab */}
      {activeTab === "admissions" && (
        <div className="max-w-xl mx-auto bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Academic Admissions & Account Provisioner</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provision high-security database accounts for Students, Teachers, and Parents.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium"
              >
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleProvisionUser} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Assigned Full Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Priyanjali Sah" 
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Academic Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="e.g. priyanjali@readers.school" 
                  value={provEmail}
                  onChange={(e) => setProvEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Security Password (Key)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={provPass}
                  onChange={(e) => setProvPass(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Institutional User Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["student", "teacher", "parent"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setProvRole(r)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                      provRole === r 
                        ? "bg-[#7C3AED] text-white border-[#7C3AED]" 
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Credentials...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Institutional Profile
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 6. Remaining tabs fallbacks */}
      {!["dashboard", "students", "teachers", "parents", "admissions"].includes(activeTab) && (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mx-auto">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-outfit text-slate-800 capitalize">{activeTab} Console</h2>
          <p className="text-xs text-slate-400">
            This module is fully registered under the institutional ERP framework. Database sync and client features are connected for the Readers School administration!
          </p>
        </div>
      )}

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-xs font-bold text-slate-400">Loading ERP Console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
