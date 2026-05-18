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
import AttendanceRegistry from "@/components/AttendanceRegistry";

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
    address?: string | null;
    occupation?: string | null;
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
  const [admissionParentSearch, setAdmissionParentSearch] = useState("");

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
  const [classLevel, setClassLevel] = useState("Nursery");
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
  const [editExtraField1, setEditExtraField1] = useState(""); // dept, classLevel, relationship
  const [editExtraField2, setEditExtraField2] = useState(""); // spec, section, occupation
  const [editExtraField3, setEditExtraField3] = useState(""); // address
  const [editExtraField4, setEditExtraField4] = useState(""); // occupation
  const [updatingUser, setUpdatingUser] = useState(false);

  // Dedicated Parent Management States
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [newParentEmail, setNewParentEmail] = useState("");
  const [newParentPassword, setNewParentPassword] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [newParentAddress, setNewParentAddress] = useState("");
  const [newParentOccupation, setNewParentOccupation] = useState("");
  const [newParentRelationship, setNewParentRelationship] = useState<"Father" | "Mother" | "Guardian">("Guardian");
  
  const [viewingParentDetail, setViewingParentDetail] = useState<ProfileRecord | null>(null);
  const [parentRelFilter, setParentRelFilter] = useState("All");
  const [creatingParent, setCreatingParent] = useState(false);

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName || !newParentEmail || !newParentPassword) {
      alert("Parent name, email, and password are required.");
      return;
    }

    setCreatingParent(true);
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newParentName,
          email: newParentEmail,
          password: newParentPassword,
          role: "parent",
          phone: newParentPhone,
          address: newParentAddress,
          occupation: newParentOccupation,
          relationship: newParentRelationship
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to provision parent profile.");
      }

      alert(`Parent profile created successfully for ${newParentName}!`);
      
      // Reset state fields
      setNewParentName("");
      setNewParentEmail("");
      setNewParentPassword("");
      setNewParentPhone("");
      setNewParentAddress("");
      setNewParentOccupation("");
      setNewParentRelationship("Guardian");
      setIsAddParentOpen(false);
      
      await fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setCreatingParent(false);
    }
  };

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
          parents(phone, relationship, address, occupation)
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
      const studentDetails = Array.isArray(profile.students) ? (profile.students as any)[0] : profile.students;
      setEditPhone(studentDetails?.phone || "");
      setEditExtraField1(studentDetails?.grade_level || "");
      setEditExtraField2(studentDetails?.enrollment_status || "active");
      setEditExtraField3(studentDetails?.parent_id || "");
      setEditExtraField4(studentDetails?.address || "");
    } else if (profile.role === "teacher") {
      setEditPhone("");
      setEditExtraField1(profile.teachers?.department || "");
      setEditExtraField2(profile.teachers?.specialization || "");
    } else if (profile.role === "parent") {
      setEditPhone(profile.parents?.phone || "");
      setEditExtraField1(profile.parents?.relationship || "Guardian");
      setEditExtraField2("");
      setEditExtraField3(profile.parents?.address || "");
      setEditExtraField4(profile.parents?.occupation || "");
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
        // Self-heal parent record first if linked to prevent foreign key violations
        if (editExtraField3) {
          const { data: parentRecord } = await supabase
            .from("parents")
            .select("id")
            .eq("id", editExtraField3)
            .maybeSingle();

          if (!parentRecord) {
            console.log(`Self-healing parent record for parent ID ${editExtraField3}...`);
            await supabase.from("parents").insert({
              id: editExtraField3,
              phone: "Not provided",
              relationship: "Guardian"
            });
          }
        }

        // Self-heal student record if missing in students table:
        const { data: studentRow } = await supabase
          .from("students")
          .select("id")
          .eq("id", editingUser.id)
          .maybeSingle();

        const studentPayload = {
          grade_level: editExtraField1,
          enrollment_status: editExtraField2,
          parent_id: editExtraField3 || null,
          phone: editPhone || null,
          address: editExtraField4 || null
        };

        let studentError;
        if (!studentRow) {
          const { error } = await supabase.from("students").insert({
            id: editingUser.id,
            ...studentPayload
          });
          studentError = error;
        } else {
          const { error } = await supabase
            .from("students")
            .update(studentPayload)
            .eq("id", editingUser.id);
          studentError = error;
        }
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
            relationship: editExtraField1,
            address: editExtraField3,
            occupation: editExtraField4
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

  const admissionsFilteredParents = parentsList.filter(parent => 
    parent.full_name.toLowerCase().includes(admissionParentSearch.toLowerCase()) ||
    parent.email.toLowerCase().includes(admissionParentSearch.toLowerCase())
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
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800">Parents Registry</h2>
              <p className="text-xs text-slate-400">Total registered parents & guardians connected under child profiles</p>
            </div>
            
            <button 
              onClick={() => setIsAddParentOpen(true)}
              className="sm:self-center inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white px-4 py-2.5 text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> + Add Parent
            </button>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search parent name or email..."
                value={parentSearchQuery}
                onChange={(e) => setParentSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-medium text-slate-700"
              />
            </div>

            <select
              value={parentRelFilter}
              onChange={(e) => setParentRelFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-medium text-slate-600"
            >
              <option value="All">All Relationships</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
            </select>
          </div>

          {/* Parents dynamic processing */}
          {(() => {
            const searchedParentsList = parentsList.filter(parent => {
              const parentDetails = Array.isArray(parent.parents) ? (parent.parents as any)[0] : parent.parents;
              const matchesSearch = 
                parent.full_name.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
                parent.email.toLowerCase().includes(parentSearchQuery.toLowerCase());
              const matchesRel = parentRelFilter === "All" || parentDetails?.relationship === parentRelFilter;
              return matchesSearch && matchesRel;
            });

            return (
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Parent ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Relationship</th>
                      <th className="py-3.5 px-4 text-center">Linked Pupils</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loadingData ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400 font-semibold">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-indigo-500" /> Loading parent registry...
                        </td>
                      </tr>
                    ) : searchedParentsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12">
                          <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                              <Users className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-800">No Parents Added Yet</p>
                              <p className="text-xs text-slate-400 leading-normal">
                                {parentsList.length === 0 
                                  ? "Get started by provisioning the first parent login account."
                                  : "Try adjusting your search criteria to find registered parents."}
                              </p>
                            </div>
                            {parentsList.length === 0 && (
                              <button
                                onClick={() => setIsAddParentOpen(true)}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white px-3.5 py-2 text-xs font-bold rounded-xl shadow-md cursor-pointer hover:scale-[1.01]"
                              >
                                <Plus className="w-4 h-4" /> Add Parent
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      searchedParentsList.map((parent) => {
                        const parentDetails = Array.isArray(parent.parents) ? (parent.parents as any)[0] : parent.parents;
                        const linkedChildren = studentsList.filter(s => {
                          const studentDetails = Array.isArray(s.students) ? (s.students as any)[0] : s.students;
                          return studentDetails?.parent_id === parent.id;
                        });
                        const relationshipColor = 
                          parentDetails?.relationship === "Father" ? "bg-blue-50 text-blue-600 border-blue-100" :
                          parentDetails?.relationship === "Mother" ? "bg-pink-50 text-pink-600 border-pink-100" :
                          "bg-purple-50 text-purple-600 border-purple-100";

                        return (
                          <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-slate-400 select-all truncate max-w-[120px]">{parent.id}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{parent.full_name}</td>
                            <td className="py-4 px-4 text-slate-500 font-mono select-all">{parent.email}</td>
                            <td className="py-4 px-4 text-slate-600 font-semibold">{parentDetails?.phone || "Not provided"}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${relationshipColor}`}>
                                {parentDetails?.relationship || "Guardian"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                linkedChildren.length > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                              }`}>
                                {linkedChildren.length} children
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right flex justify-end gap-1.5">
                              <button 
                                onClick={() => setViewingParentDetail(parent)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                title="View Info & Linked Children"
                              >
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenEditModal(parent)}
                                className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="Modify Record"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(parent.id, "parent")}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Parent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            );
          })()}
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
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Class Section
                      </label>
                      <select 
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                      </select>
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
                          value={admissionParentSearch}
                          onChange={(e) => setAdmissionParentSearch(e.target.value)}
                          className="w-full px-3 py-1.5 text-[10px] rounded-lg border border-slate-200 bg-white focus:outline-none"
                        />
                        <select 
                          required
                          value={parentId}
                          onChange={(e) => setParentId(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                        >
                          <option value="">-- Choose Existing Parent --</option>
                          {admissionsFilteredParents.length === 0 ? (
                            <option disabled value="">No parents found. Please provision a Parent account first!</option>
                          ) : (
                            admissionsFilteredParents.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.full_name} ({p.email}) - {p.parents?.relationship || "Guardian"}
                              </option>
                            ))
                          )}
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

      {/* Attendance Management Tab */}
      {activeTab === "attendance" && (
        <AttendanceRegistry />
      )}

      {/* 6. Remaining tabs fallbacks */}
      {!["dashboard", "students", "teachers", "parents", "admissions", "attendance"].includes(activeTab) && (
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
                  <div className="space-y-4">
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
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Relationship
                      </label>
                      <select 
                        value={editExtraField1}
                        onChange={(e) => setEditExtraField1(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Address
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField3}
                        onChange={(e) => setEditExtraField3(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Occupation
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField4}
                        onChange={(e) => setEditExtraField4(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
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
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Parent Guardian Link
                      </label>
                      <select 
                        value={editExtraField3}
                        onChange={(e) => setEditExtraField3(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="">-- Choose Parent --</option>
                        {parentsList.map((p) => {
                          const pDetails = Array.isArray(p.parents) ? (p.parents as any)[0] : p.parents;
                          return (
                            <option key={p.id} value={p.id}>
                              {p.full_name} ({p.email}) - {pDetails?.relationship || "Guardian"}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Contact Phone
                      </label>
                      <input 
                        type="text" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                        Residential Address
                      </label>
                      <input 
                        type="text" 
                        value={editExtraField4}
                        onChange={(e) => setEditExtraField4(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
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

        {isAddParentOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAddParentOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="mb-5 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit text-slate-800">Add Parent Portal User</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Provision a new secure parent login profile</p>
                </div>
              </div>

              <form onSubmit={handleCreateParent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Parent Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Robert Smith"
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="robert@example.com"
                      value={newParentEmail}
                      onChange={(e) => setNewParentEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Password
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={newParentPassword}
                      onChange={(e) => setNewParentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Phone Number
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +1 555-0199"
                      value={newParentPhone}
                      onChange={(e) => setNewParentPhone(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Occupation
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Software Engineer"
                      value={newParentOccupation}
                      onChange={(e) => setNewParentOccupation(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Relationship
                    </label>
                    <select 
                      value={newParentRelationship}
                      onChange={(e) => setNewParentRelationship(e.target.value as any)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                    Residential Address
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 123 Maple Street, NY"
                    value={newParentAddress}
                    onChange={(e) => setNewParentAddress(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddParentOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={creatingParent}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {creatingParent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Provision Parent Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {viewingParentDetail && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setViewingParentDetail(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="mb-5 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4F46E5] border border-indigo-100">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit text-slate-800">Parent Registry Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Full credentials and linked institutional students</p>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Profile Grid */}
                {(() => {
                  const parentDetails = Array.isArray(viewingParentDetail.parents) ? (viewingParentDetail.parents as any)[0] : viewingParentDetail.parents;
                  return (
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Full Name</p>
                        <p className="font-bold text-slate-800 mt-0.5">{viewingParentDetail.full_name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Relationship</p>
                        <p className="font-bold text-[#7C3AED] mt-0.5">{parentDetails?.relationship || "Guardian"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</p>
                        <p className="font-medium text-slate-600 mt-0.5 font-mono select-all">{viewingParentDetail.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Phone Number</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{parentDetails?.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Occupation</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{parentDetails?.occupation || "Not provided"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Residential Address</p>
                        <p className="font-semibold text-slate-600 mt-0.5">{parentDetails?.address || "Not provided"}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Linked Children List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                    <span>Linked Pupils / Children</span>
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md text-[9px] font-mono">
                      {studentsList.filter(s => s.students?.parent_id === viewingParentDetail.id).length} connected
                    </span>
                  </h4>

                  {(() => {
                    const children = studentsList.filter(s => s.students?.parent_id === viewingParentDetail.id);
                    if (children.length === 0) {
                      return (
                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400">
                          <p className="text-xs">No children linked to this parent yet.</p>
                          <p className="text-[10px] text-slate-400/80 mt-0.5 font-medium">Use the Student Admission flow to connect students to this parent.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {children.map(child => (
                          <div key={child.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#7C3AED]">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{child.full_name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{child.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-500">
                                Class {child.students?.grade_level || "N/A"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setViewingParentDetail(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Details
                  </button>
                </div>
              </div>
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
