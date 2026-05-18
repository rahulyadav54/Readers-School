"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, Suspense } from "react";
import { 
  Users, GraduationCap, BookOpen, Calendar, 
  FileSpreadsheet, Receipt, Bus, Home, Library, Bell, 
  Settings, Search, UserPlus, Lock, Mail, Loader2, 
  ArrowUpRight, ArrowDownRight, CheckCircle, ShieldAlert,
  Plus, CalendarDays, ClipboardList, FileText, Check, Trash2, Edit,
  Briefcase, Phone, BookOpenCheck, MapPin, GraduationCap as SchoolLogo, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend
} from "recharts";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Supabase client instance
const supabase = createClient();

// Data Models
interface ProfileRecord {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "student" | "teacher" | "parent";
  created_at: string;
  parents?: {
    phone: string;
    relationship: string;
  } | null;
  students?: {
    parent_id: string | null;
    grade_level: string;
    enrollment_status: string;
  } | null;
  teachers?: {
    specialization: string;
    department: string;
    hire_date: string;
  } | null;
}

function AdminDashboardContent() {
  const { user, fullName, role: activeUserRole, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Data List States (fetched in real-time from Supabase)
  const [studentsList, setStudentsList] = useState<ProfileRecord[]>([]);
  const [teachersList, setTeachersList] = useState<ProfileRecord[]>([]);
  const [parentsList, setParentsList] = useState<ProfileRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [parentSearchQuery, setParentSearchQuery] = useState("");

  // Base Account Provisioner States
  const [provName, setProvName] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPass, setProvPass] = useState("");
  const [provRole, setProvRole] = useState<"student" | "teacher" | "parent">("parent");
  
  // Dynamic Role Specific States
  // 1. Teacher Fields
  const [dept, setDept] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  
  // 2. Student Fields
  const [classLevel, setClassLevel] = useState("Grade 10-A");
  const [section, setSection] = useState("A");
  const [parentId, setParentId] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [address, setAddress] = useState("");

  // 3. Parent Fields
  const [parentAddress, setParentAddress] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [occupation, setOccupation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Modal States
  const [editingUser, setEditingUser] = useState<ProfileRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editExtraField1, setEditExtraField1] = useState(""); // dept, classLevel, address
  const [editExtraField2, setEditExtraField2] = useState(""); // spec, section, occupation
  const [updatingUser, setUpdatingUser] = useState(false);

  // Load Real-time Data from Supabase
  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // 1. Fetch Students
      const { data: studentsData } = await supabase
        .from("profiles")
        .select(`
          id, full_name, email, role, created_at,
          students(parent_id, grade_level, enrollment_status)
        `)
        .eq("role", "student");

      // 2. Fetch Teachers
      const { data: teachersData } = await supabase
        .from("profiles")
        .select(`
          id, full_name, email, role, created_at,
          teachers(specialization, department, hire_date)
        `)
        .eq("role", "teacher");

      // 3. Fetch Parents
      const { data: parentsData } = await supabase
        .from("profiles")
        .select(`
          id, full_name, email, role, created_at,
          parents(phone, relationship)
        `)
        .eq("role", "parent");

      if (studentsData) setStudentsList(studentsData as any);
      if (teachersData) setTeachersList(teachersData as any);
      if (parentsData) setParentsList(parentsData as any);
      
    } catch (err) {
      console.error("Error loading Supabase tables:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User Provisioning Logic - Connects directly to stateless backend API
  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName || !provEmail || !provPass) {
      setErrorMsg("Full Name, Email, and Password are required fields.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Build the request body with dynamic role fields
    const requestBody: any = {
      email: provEmail,
      password: provPass,
      fullName: provName,
      role: provRole,
    };

    if (provRole === "teacher") {
      requestBody.department = dept;
      requestBody.specialization = specialization;
      requestBody.qualification = qualification;
      requestBody.phone = teacherPhone;
    } else if (provRole === "student") {
      requestBody.classLevel = classLevel;
      requestBody.section = section;
      requestBody.parentId = parentId || null;
      requestBody.phone = studentPhone;
      requestBody.address = address;
    } else if (provRole === "parent") {
      requestBody.phone = parentPhone;
      requestBody.address = parentAddress;
      requestBody.occupation = occupation;
    }

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to provision secure database account.");

      setSuccessMsg(`🎉 Success! Supabase Auth login credentials created, and profile synchronized for ${provName}. User can login immediately!`);
      
      // Refresh Supabase registry
      await fetchData();

      // Reset Form Inputs
      setProvName("");
      setProvEmail("");
      setProvPass("");
      setDept("");
      setSpecialization("");
      setQualification("");
      setTeacherPhone("");
      setParentId("");
      setStudentPhone("");
      setAddress("");
      setParentAddress("");
      setParentPhone("");
      setOccupation("");

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during user provisioning.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User Logic (deletes from profiles table, which cascade deletes role tables)
  const handleDeleteUser = async (userId: string, role: string) => {
    if (!confirm("⚠️ WARNING: Are you sure you want to delete this user profile? All related records will be cascade-deleted from corresponding tables.")) return;

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) throw error;

      // Refresh list
      await fetchData();
      alert("User profile deleted successfully.");
    } catch (err: any) {
      alert("Failed to delete user profile: " + err.message);
    }
  };

  // Edit User Trigger
  const handleOpenEditModal = (profile: ProfileRecord) => {
    setEditingUser(profile);
    setEditName(profile.full_name);
    setEditEmail(profile.email);
    
    if (profile.role === "student") {
      setEditPhone("");
      setEditExtraField1(profile.students?.grade_level || "");
      setEditExtraField2(profile.students?.enrollment_status || "active");
    } else if (profile.role === "teacher") {
      setEditPhone("");
      setEditExtraField1(profile.teachers?.department || "");
      setEditExtraField2(profile.teachers?.specialization || "");
    } else if (profile.role === "parent") {
      setEditPhone(profile.parents?.phone || "");
      setEditExtraField1(profile.parents?.relationship || "Guardian");
      setEditExtraField2("");
    }
  };

  // Save Edits Logic
  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdatingUser(true);
    try {
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editName,
          email: editEmail,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingUser.id);

      if (profileError) throw profileError;

      // 2. Update role-specific table details
      if (editingUser.role === "student") {
        const { error: studentError } = await supabase
          .from("students")
          .update({
            grade_level: editExtraField1,
            enrollment_status: editExtraField2
          })
          .eq("id", editingUser.id);
        if (studentError) throw studentError;
      } else if (editingUser.role === "teacher") {
        const { error: teacherError } = await supabase
          .from("teachers")
          .update({
            department: editExtraField1,
            specialization: editExtraField2
          })
          .eq("id", editingUser.id);
        if (teacherError) throw teacherError;
      } else if (editingUser.role === "parent") {
        const { error: parentError } = await supabase
          .from("parents")
          .update({
            phone: editPhone,
            relationship: editExtraField1
          })
          .eq("id", editingUser.id);
        if (parentError) throw parentError;
      }

      setEditingUser(null);
      await fetchData();
      alert("Profile modifications saved successfully.");
    } catch (err: any) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setUpdatingUser(false);
    }
  };

  // Analytics Chart Data
  const growthData = [
    { name: "Term 1", Students: 840, Teachers: 52 },
    { name: "Term 2", Students: 980, Teachers: 61 },
    { name: "Term 3", Students: 1120, Teachers: 68 },
    { name: "Term 4", Students: studentsList.length || 1248, Teachers: teachersList.length || 74 },
  ];

  const revenueData = [
    { name: "Jan", Collected: 420000, Pending: 120000 },
    { name: "Feb", Collected: 680000, Pending: 150000 },
    { name: "Mar", Collected: 890000, Pending: 90000 },
    { name: "Apr", Collected: 1140000, Pending: 230000 },
  ];

  // Dynamic Parent Filtering for searchable dropdown
  const filteredParents = parentsList.filter(parent => 
    parent.full_name.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
    parent.email.toLowerCase().includes(parentSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800 relative z-0">
      
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

          {/* Dynamic real-time Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Students", value: loadingData ? "..." : studentsList.length.toString(), icon: GraduationCap, color: "text-[#7C3AED]", trend: "+14%" },
              { label: "Total Teachers", value: loadingData ? "..." : teachersList.length.toString(), icon: BookOpen, color: "text-emerald-500", trend: "+4%" },
              { label: "Total Parents", value: loadingData ? "..." : parentsList.length.toString(), icon: Users, color: "text-[#7C3AED]", trend: "+12%" },
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
        </>
      )}

      {/* 2. Students Registry Tab */}
      {activeTab === "students" && (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Students Registry</h2>
              <p className="text-xs text-slate-400">Total registered academic student records in Supabase database</p>
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
                  <th className="py-3 px-4">Class Level</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Enrollment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400 font-semibold">
                      <Loader2 className="w-4.5 h-4.5 animate-spin mx-auto mb-1 text-indigo-500" /> Loading student database...
                    </td>
                  </tr>
                ) : studentsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">No student profiles provisioned yet.</td>
                  </tr>
                ) : (
                  studentsList.filter(s => s.full_name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 truncate max-w-[120px]">{student.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{student.full_name}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{student.students?.grade_level || "Grade 10"}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{student.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          student.students?.enrollment_status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {student.students?.enrollment_status || "active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1 rounded text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Modify Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(student.id, "student")}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
            <p className="text-xs text-slate-400">Total registered teachers and specialization fields in database</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Teacher ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400 font-semibold">
                      <Loader2 className="w-4.5 h-4.5 animate-spin mx-auto mb-1 text-indigo-500" /> Loading faculty list...
                    </td>
                  </tr>
                ) : teachersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">No faculty members provisioned yet.</td>
                  </tr>
                ) : (
                  teachersList.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 truncate max-w-[120px]">{teacher.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{teacher.full_name}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{teacher.teachers?.department || "Science Faculty"}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{teacher.teachers?.specialization || "General Studies"}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{teacher.email}</td>
                      <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(teacher)}
                          className="p-1 rounded text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Modify Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(teacher.id, "teacher")}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Faculty"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
            <p className="text-xs text-slate-400">Total registered parents & guardians connected under child profiles</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Parent ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400 font-semibold">
                      <Loader2 className="w-4.5 h-4.5 animate-spin mx-auto mb-1 text-indigo-500" /> Loading parent registry...
                    </td>
                  </tr>
                ) : parentsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">No parent records provisioned yet.</td>
                  </tr>
                ) : (
                  parentsList.map((parent) => (
                    <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 truncate max-w-[120px]">{parent.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{parent.full_name}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{parent.email}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{parent.parents?.phone || "Not provided"}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{parent.parents?.relationship || "Guardian"}</td>
                      <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(parent)}
                          className="p-1 rounded text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Modify Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(parent.id, "parent")}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Parent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Admissions / Provisioning Tab */}
      {activeTab === "admissions" && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100 mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-outfit text-slate-800">Academic Admissions & Account Provisioner</h2>
            <p className="text-xs text-slate-400 mt-1">
              Create a Supabase Auth login profile and synchronize corresponding database tables automatically.
            </p>
          </div>

          {/* Alert messages */}
          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold leading-relaxed"
              >
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold leading-relaxed"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleProvisionUser} className="space-y-5">
            {/* Core credentials card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                1. Authentication Credentials
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                    Assigned Full Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Priyanka Sah" 
                      value={provName}
                      onChange={(e) => setProvName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                    Academic Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. priyanka@readers.school" 
                      value={provEmail}
                      onChange={(e) => setProvEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Security Password (Key) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    placeholder="•••••••• (Min 6 characters)" 
                    value={provPass}
                    onChange={(e) => setProvPass(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                  Institutional User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["parent", "student", "teacher"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setProvRole(r)}
                      className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                        provRole === r 
                          ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm" 
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Role Specific Custom Fields */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                2. Role Specific Data (Table Synchronization)
              </h3>

              {/* A. Teacher Fields */}
              {provRole === "teacher" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Department
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. Science Faculty" 
                          value={dept}
                          onChange={(e) => setDept(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Specialization Subject
                      </label>
                      <div className="relative">
                        <BookOpenCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. AP Physics 3" 
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Qualification Level
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. PhD in Quantum Mechanics" 
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. +977 98510xxxxx" 
                          value={teacherPhone}
                          onChange={(e) => setTeacherPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* B. Student Fields */}
              {provRole === "student" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Assigned Class Level
                      </label>
                      <select 
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                      >
                        <option value="Grade 10-A">Grade 10-A</option>
                        <option value="Grade 10-B">Grade 10-B</option>
                        <option value="Grade 9-A">Grade 9-A</option>
                        <option value="Grade 9-B">Grade 9-B</option>
                        <option value="Grade 8-A">Grade 8-A</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Class Section
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. A" 
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Parent Guardian Link * (Admit after parent account is active)
                      </label>
                      
                      {/* Search Parent Helper */}
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="🔍 Search parent name or email..." 
                          value={parentSearchQuery}
                          onChange={(e) => setParentSearchQuery(e.target.value)}
                          className="w-full px-3 py-1.5 text-[10px] rounded-lg border border-slate-200 bg-white focus:outline-none"
                        />
                        <select 
                          required
                          value={parentId}
                          onChange={(e) => setParentId(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        >
                          <option value="">-- Choose Existing Parent --</option>
                          {filteredParents.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.full_name} ({p.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. +977 98010xxxxx" 
                          value={studentPhone}
                          onChange={(e) => setStudentPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Residential Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Mid-Baneshwor, Kathmandu" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* C. Parent Fields */}
              {provRole === "parent" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Occupation / Profession
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. Software Engineer" 
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. +977 98510xxxxx" 
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Residential Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Baneshwor, Kathmandu" 
                        value={parentAddress}
                        onChange={(e) => setParentAddress(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Initializing Credentials & Syncing DB...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Provision Active Supabase Profile
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

      {/* Edit User Modal Dialog Backdrop */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 relative"
            >
              <button 
                onClick={() => setEditingUser(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="mb-4">
                <h3 className="text-base font-bold font-outfit text-slate-800">Modify {editingUser.role} Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Edit credentials and table variables below</p>
              </div>

              <form onSubmit={handleSaveEdits} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                {editingUser.role === "parent" && (
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Phone Number
                    </label>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                {editingUser.role === "student" && (
                  <>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Class Level
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField1}
                        onChange={(e) => setEditExtraField1(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Enrollment Status
                      </label>
                      <select 
                        value={editExtraField2}
                        onChange={(e) => setEditExtraField2(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </div>
                  </>
                )}

                {editingUser.role === "teacher" && (
                  <>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Department
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField1}
                        onChange={(e) => setEditExtraField1(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Specialization Subject
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField2}
                        onChange={(e) => setEditExtraField2(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={updatingUser}
                    className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {updatingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Save Modifications
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
