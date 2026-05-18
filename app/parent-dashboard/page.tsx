"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, Suspense } from "react";
import { 
  Users, BookOpen, Calendar, Receipt, FileText, Bell, 
  Settings, CheckCircle, CreditCard, Download, ShieldCheck,
  User, Award, Loader2, ClipboardList, GraduationCap, X, Printer,
  Sparkles, Heart, Activity, CheckSquare, Search, TrendingUp, DownloadCloud
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AttendanceRegistry from "@/components/AttendanceRegistry";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar
} from "recharts";

const supabase = createClient();

interface ChildRecord {
  id: string;
  grade_level: string;
  enrollment_status: string;
  parent_id: string;
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
  status: "Pending" | "Submitted";
}

interface GradeRecord {
  subject: string;
  score: string;
  numericScore: number;
  average: string;
  numericAverage: number;
  status: "Excellent" | "Good" | "Needs Imp.";
}

function ParentDashboardContent() {
  const { user, fullName } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [loading, setLoading] = useState(true);
  const [childrenList, setChildrenList] = useState<ChildRecord[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [homeworkList, setHomeworkList] = useState<HomeworkRecord[]>([]);
  const [gradesList, setGradesList] = useState<GradeRecord[]>([]);
  const [attendanceRate, setAttendanceRate] = useState("96.8%");
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [feesList, setFeesList] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<ChildRecord | null>(null);

  // 1. Fetch children/students linked to this parent ID
  useEffect(() => {
    const fetchParentChildren = async () => {
      if (!user) return;
      try {
        setLoading(true);

        const { data: studentsData, error } = await supabase
          .from("students")
          .select(`
            id, grade_level, enrollment_status, parent_id,
            profiles(full_name, email)
          `)
          .eq("parent_id", user.id);

        if (error) throw error;

        if (studentsData && studentsData.length > 0) {
          const formattedChildren = studentsData as unknown as ChildRecord[];
          setChildrenList(formattedChildren);
          setSelectedChildId(formattedChildren[0].id);
          setActiveChild(formattedChildren[0]);
        }
      } catch (err) {
        console.error("Error loading parent dashboard child info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParentChildren();
  }, [user]);

  // 2. Fetch specific progress, grades, homework, fees when selected child changes
  useEffect(() => {
    if (!selectedChildId || childrenList.length === 0) return;
    const currentChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];
    setActiveChild(currentChild);

    // Mock progress data specific to child's academic grade level
    const isHigherGrade = !["Nursery", "LKG", "UKG"].includes(currentChild.grade_level);

    // Set dynamic subjects & grades
    if (isHigherGrade) {
      setGradesList([
        { subject: "AP Physics 3", score: "94%", numericScore: 94, average: "82%", numericAverage: 82, status: "Excellent" },
        { subject: "AP Chemistry", score: "88%", numericScore: 88, average: "78%", numericAverage: 78, status: "Good" },
        { subject: "Quantum Calculus", score: "95%", numericScore: 95, average: "80%", numericAverage: 80, status: "Excellent" },
        { subject: "English Literature", score: "91%", numericScore: 91, average: "84%", numericAverage: 84, status: "Good" },
        { subject: "Modern History", score: "85%", numericScore: 85, average: "79%", numericAverage: 79, status: "Good" },
      ]);

      setHomeworkList([
        { id: "h1", subject: "Mathematics", title: "Calculus Limits quiz prep", due_date: "Tomorrow, 4:00 PM", status: "Pending" },
        { id: "h2", subject: "AP Physics 3", title: "Wave integrals calculus map", due_date: "May 22, 11:59 PM", status: "Submitted" },
        { id: "h3", subject: "AP Chemistry", title: "Organic compound bonds assignment", due_date: "May 25, 3:00 PM", status: "Pending" },
        { id: "h4", subject: "English Literature", title: "Macbeth Act III theme analysis", due_date: "Completed", status: "Submitted" },
      ]);

      setAttendanceRate("98.4%");
      setAttendanceLogs([
        { date: "May 18, 2026", status: "Present", remark: "In class study session" },
        { date: "May 17, 2026", status: "Present", remark: "Physics lab experiment" },
        { date: "May 16, 2026", status: "Present", remark: "Calculus exam session" },
        { date: "May 15, 2026", status: "Excused", remark: "Medical appointment" },
        { date: "May 14, 2026", status: "Present", remark: "Regular attendance" },
      ]);

      setFeesList([
        { invoiceId: "INV-2026-004", description: "Term 3 Higher Secondary Fee & Transport", amount: "NPR 48,000", status: "Paid", paidOn: "May 10, 2026" },
        { invoiceId: "INV-2026-003", description: "Term 2 Higher Secondary Tuition", amount: "NPR 42,000", status: "Paid", paidOn: "Feb 15, 2026" },
      ]);
    } else {
      // Nursery/Primary Kids progress list
      setGradesList([
        { subject: "Reading & Phonics", score: "96%", numericScore: 96, average: "85%", numericAverage: 85, status: "Excellent" },
        { subject: "Colors & Shapes", score: "92%", numericScore: 92, average: "88%", numericAverage: 88, status: "Excellent" },
        { subject: "Basic Numbers", score: "89%", numericScore: 89, average: "80%", numericAverage: 80, status: "Good" },
        { subject: "Creative Arts", score: "98%", numericScore: 98, average: "90%", numericAverage: 90, status: "Excellent" },
        { subject: "Rhymes & Music", score: "82%", numericScore: 82, average: "85%", numericAverage: 85, status: "Good" },
      ]);

      setHomeworkList([
        { id: "hp1", subject: "Reading & Phonics", title: "Trace alphabet worksheets (A-J)", due_date: "Tomorrow, 2:00 PM", status: "Pending" },
        { id: "hp2", subject: "Colors & Shapes", title: "Color the circles and triangles workbook", due_date: "May 22, 10:00 AM", status: "Submitted" },
        { id: "hp3", subject: "Creative Arts", title: "Finger painting canvas submission", due_date: "Completed", status: "Submitted" },
      ]);

      setAttendanceRate("95.2%");
      setAttendanceLogs([
        { date: "May 18, 2026", status: "Present", remark: "Morning assembly & alphabet trace" },
        { date: "May 17, 2026", status: "Present", remark: "Indoor puzzle play" },
        { date: "May 16, 2026", status: "Absent", remark: "Minor cold / fever" },
        { date: "May 15, 2026", status: "Present", remark: "Rhymes rehearsal" },
        { date: "May 14, 2026", status: "Present", remark: "Regular primary study" },
      ]);

      setFeesList([
        { invoiceId: "INV-2026-N04", description: "Term 3 Primary Tuition & Care Fee", amount: "NPR 35,000", status: "Paid", paidOn: "May 08, 2026" },
        { invoiceId: "INV-2026-N03", description: "Term 2 Primary Tuition Fee", amount: "NPR 30,000", status: "Paid", paidOn: "Feb 12, 2026" },
      ]);
    }
  }, [selectedChildId, childrenList]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs font-bold text-slate-400 space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <p>Loading linked student profiles...</p>
      </div>
    );
  }

  // Handle case where no child is bound to parent profile yet
  if (childrenList.length === 0 || !activeChild) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 mx-auto">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold font-outfit text-slate-800">No Linked Student Profile</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your parent/guardian account is active, but there are no student profiles connected to your ID.
        </p>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-[11px] text-left text-slate-500 space-y-2">
          <p className="font-bold text-slate-700">How to link your child:</p>
          <p>1. Make sure your child's student profile has been admitted by the Admin.</p>
          <p>2. Ask the Administrator to edit the student details and choose your profile (<strong>{fullName}</strong>) from the parent dropdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Dynamic Multi-Child Selector Banner */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] p-6 rounded-2xl shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-white tracking-widest">
            Parent Guardian Console
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-outfit">
            Welcome back, {fullName || "Parent"}
          </h1>
          <p className="text-xs text-purple-100/90 font-medium">
            Manage academic trackers, dynamic grading indexes, and attendance calendars
          </p>
        </div>

        {/* Child Selector Box */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 w-full md:max-w-xs space-y-1.5 self-stretch sm:self-auto flex flex-col justify-center">
          <label className="block text-[9px] font-bold uppercase tracking-wider text-purple-200 font-mono">
            Active Pupil Profile
          </label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          >
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.profiles.full_name} ({c.grade_level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Overview ID Card */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-0.5 text-center sm:text-left flex-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
            <span>{activeChild.profiles.full_name}</span>
            <span className="px-2 py-0.5 bg-purple-50 text-[#7C3AED] border border-purple-100 text-[10px] font-bold rounded-md">
              {activeChild.grade_level}
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">Student ID: {activeChild.id}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Enrollment Verified: {activeChild.enrollment_status}
          </span>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "dashboard" && (
        <>
          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Attendance Consistency", value: attendanceRate, icon: Calendar, color: "text-[#7C3AED]" },
              { label: "Tuition Invoice Status", value: "Paid (All clear)", icon: Receipt, color: "text-emerald-500" },
              { label: "Homework Submissions", value: homeworkList.filter(h => h.status === "Submitted").length + "/" + homeworkList.length, icon: BookOpen, color: "text-amber-500" },
              { label: "Overall Progress Index", value: "Excellent (A)", icon: ShieldCheck, color: "text-[#7C3AED]" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">{stat.label}</span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Synced with profile metrics</p>
                </div>
              );
            })}
          </div>

          {/* Core Analytics: Progress Chart & Grade Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dynamic Recharts Bar Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm font-outfit text-slate-800">Academic Score Index Tracker</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Comparing {activeChild.profiles.full_name} marks against class averages</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" /> Live Sync
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradesList} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="numericScore" name="Child Score (%)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="numericAverage" name="Class Average (%)" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bulletins Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit text-slate-800">Recent School Announcements</h3>
              <div className="space-y-3.5">
                {[
                  { title: "Parent-Teacher Council Meet", date: "June 02, 2026", desc: "Mandatory grading reviews and performance metrics for the third term." },
                  { title: "Terminal Exam Schedule", date: "Released Today", desc: "Terminal exams start next Monday. Please support your child's preparation schedule." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 hover:bg-slate-50/80 transition-colors">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{item.date}</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Academic Grade Ledger & Homework Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Grade Ledger Table */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm font-outfit text-slate-800">Term 3 Subject Progress Cards</h3>
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report Card
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Assigned Subject</th>
                      <th className="py-3 px-2">Final Score</th>
                      <th className="py-3 px-2">Class Average</th>
                      <th className="py-3 px-2 text-right">Remark Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {gradesList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-slate-800">{item.subject}</td>
                        <td className="py-3.5 px-2 font-mono font-bold text-[#7C3AED]">{item.score}</td>
                        <td className="py-3.5 px-2 text-slate-400 font-semibold">{item.average}</td>
                        <td className="py-3.5 px-2 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            item.status === "Excellent" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
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

            {/* Assignments List */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm font-outfit text-slate-800">Homework & Active Tasks</h3>
              <div className="space-y-3">
                {homeworkList.map((hw) => (
                  <div key={hw.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-200 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{hw.title}</p>
                      <p className="text-[9px] text-[#7C3AED] font-semibold">{hw.subject}</p>
                      <p className="text-[9px] text-slate-400">Due: {hw.due_date}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        hw.status === "Submitted" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {hw.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Attendance Log Tab */}
      {activeTab === "attendance" && (
        <AttendanceRegistry />
      )}

      {/* Fee Invoices Tab */}
      {activeTab === "fees" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Tuition Invoices Ledger</h2>
              <p className="text-xs text-slate-400">Institutional payments statements history for {activeChild.profiles.full_name}</p>
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
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {feesList.map((row) => (
                  <tr key={row.invoiceId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{row.invoiceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.description}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#7C3AED]">{row.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{row.paidOn}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => alert(`Downloading fee receipt for ${row.invoiceId}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1 font-bold text-[10px]"
                      >
                        <DownloadCloud className="w-4 h-4" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Reports Tab */}
      {activeTab === "performance" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Comprehensive Progress Report</h2>
              <p className="text-xs text-slate-400">Detailed transcript metrics for child {activeChild.profiles.full_name}</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Full Transcript
            </button>
          </div>

          {/* Transcript Grade Grid */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Exam Score</th>
                  <th className="py-3 px-4">Class Average</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">GPA Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {gradesList.map((item, idx) => {
                  const gpaWeight = 
                    item.numericScore >= 90 ? "4.0 (A)" :
                    item.numericScore >= 80 ? "3.0 (B)" : "2.0 (C)";

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{item.subject}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#7C3AED]">{item.score}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-semibold">{item.average}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.status === "Excellent" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-600">{gpaWeight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Teacher review feedback */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-purple-700 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Institutional Review & Teacher Feedback
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              "{activeChild.profiles.full_name} is showing excellent conceptual understanding and analytical depth this term. Participation in core labs and team presentations has been stellar. Maintaining this focus will lead to outstanding final honors."
            </p>
          </div>
        </div>
      )}

      {/* School Notices Tab */}
      {activeTab === "notices" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-800">School Circular Bulletins</h2>
            <p className="text-xs text-slate-400">Official circular announcements from Readers School administration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Parent-Teacher Council Meet", date: "June 02, 2026", desc: "Mandatory grading reviews and performance metrics for the third term.", category: "Academic", doc: "PTC-Invite.pdf" },
              { title: "Terminal Exam Schedule", date: "Released Today", desc: "Terminal exams start next Monday. Please support your child's preparation schedule.", category: "Exams", doc: "Exam-Schedule.pdf" },
              { title: "Annual Science Exhibition 2026", date: "May 25, 2026", desc: "Showcasing student-built physics and coding project installations. Parents are warmly invited.", category: "Events", doc: "Exhibition-Brief.pdf" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] font-bold uppercase font-mono">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading circular document: ${item.doc}`)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <DownloadCloud className="w-3.5 h-3.5" /> Download {item.doc}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings / Verification Profile Tab */}
      {activeTab === "settings" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-800">Parent Profile & Security</h2>
            <p className="text-xs text-slate-400">Institutional validation details connected under your dashboard account</p>
          </div>

          <div className="max-w-md bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Verified Parent Guardian Profile</p>
                <p className="text-[10px] text-slate-400">Direct sync with Readers School DB</p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Full Name</p>
                  <p className="font-bold text-slate-800 mt-0.5">{fullName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assigned Role</p>
                  <p className="font-bold text-[#7C3AED] mt-0.5 capitalize">{user?.user_metadata?.role || "Parent"}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</p>
                <p className="font-medium text-slate-600 mt-0.5 font-mono select-all">{user?.email}</p>
              </div>

              <div className="p-3 bg-white border border-slate-200/60 rounded-lg text-[10px] text-slate-500 leading-relaxed font-semibold">
                To update your contact numbers, registered address, or link new child admissions, please contact the institutional administrator desk directly at +977 9802933719 or general support.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback settings tab */}
      {!["dashboard", "attendance", "fees", "performance", "notices", "settings"].includes(activeTab) && (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mx-auto">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-outfit text-slate-800 capitalize">{activeTab} Console</h2>
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
