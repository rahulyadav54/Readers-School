"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { 
  ShieldCheck, Server, ShieldAlert, Users, Settings, 
  Database, Activity, RefreshCw, Terminal, ChevronRight,
  UserPlus, Lock, CheckCircle, HelpCircle, Mail, User, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const { fullName } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "provisioner">("analytics");

  // Form States (Provisioner)
  const [provName, setProvName] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPass, setProvPass] = useState("");
  const [provRole, setProvRole] = useState<"student" | "teacher" | "parent">("student");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recently provisioned list
  const [provisionedUsers, setProvisionedUsers] = useState<any[]>([
    { id: "p1", fullName: "Marcus Vance", email: "marcus@readers.school", role: "student", created_at: "2026-05-18T10:00:00Z" },
    { id: "p2", fullName: "Dr. Clara Mercer", email: "clara@readers.school", role: "teacher", created_at: "2026-05-18T09:30:00Z" }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  // Mock charts data
  const systemLoad = [
    { hour: "00:00", Queries: 120, Memory: 42 },
    { hour: "04:00", Queries: 80, Memory: 40 },
    { hour: "08:00", Queries: 450, Memory: 58 },
    { hour: "12:00", Queries: 640, Memory: 72 },
    { hour: "16:00", Queries: 590, Memory: 68 },
    { hour: "20:00", Queries: 320, Memory: 50 },
  ];

  const serverBandwidth = [
    { day: "Mon", Sent: 4.2, Recv: 3.1 },
    { day: "Tue", Sent: 5.8, Recv: 4.2 },
    { day: "Wed", Sent: 6.9, Recv: 5.0 },
    { day: "Thu", Sent: 6.1, Recv: 4.8 },
    { day: "Fri", Sent: 8.2, Recv: 6.3 },
  ];

  const stats = [
    { label: "Active Users", value: "842 Users", icon: Users, color: "text-indigo-400" },
    { label: "Supabase DB Status", value: "Online", icon: Database, color: "text-emerald-400" },
    { label: "Active Nodes", value: "3 Nodes", icon: Server, color: "text-cyan-400" },
    { label: "Security Policies", value: "12 Enforced", icon: ShieldCheck, color: "text-purple-400" },
  ];

  const systemLogs = [
    { event: "New Student Account Provisioned", service: "admin-shell", timestamp: "Just now", status: "success" },
    { event: "RLS Policies Refreshed", service: "postgres-db", timestamp: "Today, 12:00:00", status: "success" },
    { event: "Offline Manifest Synced", service: "pwa-worker", timestamp: "Yesterday, 18:42:01", status: "success" },
  ];

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

      setSuccessMsg(`Successfully provisioned account for ${provName} (${provRole})!`);
      setProvisionedUsers(prev => [data.user, ...prev]);

      // Reset form
      setProvName("");
      setProvEmail("");
      setProvPass("");

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Dynamic Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              System Admin Shell
            </span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Welcome, {fullName || "SysAdmin"}
          </h1>
          <p className="text-xs text-foreground/60">
            Maintain schema migrations, provision student/teacher roles, and monitor platform logs.
          </p>
        </div>

        {/* Tab Selection buttons */}
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === "analytics"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-white/5 hover:bg-white/10 border-foreground/5 text-foreground/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Operations
          </button>

          <button 
            onClick={() => setActiveTab("provisioner")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === "provisioner"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-white/5 hover:bg-white/10 border-foreground/5 text-foreground/60"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> User Provisioner
          </button>
        </div>
      </motion.div>

      {/* Main Tab Renderings */}
      <AnimatePresence mode="wait">
        {activeTab === "analytics" ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.01] rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
                        {stat.label}
                      </span>
                      <div className="p-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold font-outfit tracking-tight">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold font-outfit text-sm">Real-time Platform Load</h3>
                    <p className="text-[10px] text-foreground/50">Queries per hour vs server RAM usage allocation %</p>
                  </div>
                  <button className="p-1.5 rounded-lg bg-white/5 border border-foreground/5 text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemLoad} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend verticalAlign="top" height={36} iconSize={10} style={{ fontSize: "11px" }} />
                      <Bar dataKey="Queries" fill="#10b981" radius={[4, 4, 0, 0]} name="Queries/min" />
                      <Bar dataKey="Memory" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="RAM Util %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold font-outfit text-sm">Cybernetic Network Traffic</h3>
                  <p className="text-[10px] text-foreground/50">Average bandwidth throughput in Gbps</p>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={serverBandwidth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={9} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgba(10,10,12,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "11px" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Area type="monotone" dataKey="Sent" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBandwidth)" name="Sent (Gbps)" />
                      <Area type="monotone" dataKey="Recv" stroke="#3b82f6" strokeWidth={1.5} fill="none" name="Recv (Gbps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center bg-white/[0.01] border border-foreground/5 p-2 rounded-xl text-[10px] text-foreground/60">
                  Node Status: <strong className="text-emerald-400">99.99% Uptime Enforced</strong>
                </div>
              </div>
            </div>

            {/* Second Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold font-outfit text-sm">System Logs & Auditing</h3>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5">
                    More Logs <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {systemLogs.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-foreground/90">{log.event}</h4>
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold uppercase">
                            {log.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground/50">Service: {log.service} • {log.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-foreground/40 uppercase">SysLog-#{482 - idx}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  Terminal Settings
                </h3>

                <div className="space-y-3 font-sans">
                  <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold transition-all border border-foreground/5 flex items-center justify-center gap-2 cursor-pointer">
                    <Database className="w-3.5 h-3.5" /> Backup Postgres Database
                  </button>
                  <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold transition-all border border-foreground/5 flex items-center justify-center gap-2 cursor-pointer">
                    <Activity className="w-3.5 h-3.5" /> Clear Service Worker Cache
                  </button>
                  <button className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all border border-rose-500/25 flex items-center justify-center gap-2 cursor-pointer">
                    <ShieldAlert className="w-3.5 h-3.5" /> Initiate Security Lockdown
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Tab 2: User Provisioner panel */
          <motion.div
            key="provisioner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs"
          >
            {/* Provisioner Form */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-bold font-outfit text-base flex items-center gap-1.5">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Academic Profile Provisioner
                </h3>
                <p className="text-[10px] text-foreground/50 leading-relaxed mt-0.5">
                  Directly register student or teacher credentials into Supabase. Newly provisioned accounts instantly receive a customized database profile and dashboard role mapping.
                </p>
              </div>

              {/* Success/Error Toasts */}
              <AnimatePresence mode="wait">
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2.5"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleProvisionUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Account Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type="text"
                        required
                        value={provName}
                        onChange={(e) => setProvName(e.target.value)}
                        placeholder="e.g. Sarah Chen"
                        className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type="email"
                        required
                        value={provEmail}
                        onChange={(e) => setProvEmail(e.target.value)}
                        placeholder="sarah@readers.school"
                        className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Temporary Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type="password"
                        required
                        value={provPass}
                        onChange={(e) => setProvPass(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Assigned Role</label>
                    <select
                      value={provRole}
                      onChange={(e) => setProvRole(e.target.value as any)}
                      className="glass-input px-3 py-2.5 rounded-lg w-full text-xs cursor-pointer font-sans"
                    >
                      <option value="student">Student 🎓</option>
                      <option value="teacher">Teacher 🧑‍🏫</option>
                      <option value="parent">Parent 👪</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Provision Account
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Ledger showing recently created */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Recent Provision Logs
                </h3>
                <p className="text-[9px] text-foreground/45">Review records of newly registered school profiles.</p>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {provisionedUsers.map((p, idx) => (
                  <div key={p.id || idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-1 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[11px] text-foreground/95">{p.fullName}</h4>
                      <p className="text-[9px] text-foreground/45 font-mono">{p.email}</p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono ${
                        p.role === "student" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"
                      }`}>
                        {p.role}
                      </span>
                      <p className="text-[7px] text-foreground/35 font-mono mt-0.5">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
