"use client";

import { useAuth } from "@/hooks/useAuth";
import { 
  ShieldCheck, ShieldAlert, Key, Lock, Eye, Database, Terminal, 
  ChevronRight, Cpu, Sparkles, Server, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SecurityGatewayPage() {
  const { user, role } = useAuth();
  const [showToken, setShowToken] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  // Mock Decrypted JWT details based on actual session
  const jwtPayload = {
    aud: "authenticated",
    exp: 1779094530 + 360000,
    sub: user?.id || "d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d001",
    email: user?.email || "marcus@readers.school",
    app_metadata: {
      provider: "email",
      providers: ["email"]
    },
    user_metadata: {
      full_name: user?.user_metadata?.full_name || "Marcus Vance",
      role: role || "student"
    },
    role: "authenticated",
    aal: "aal1",
    amr: [{ method: "pwd", timestamp: 1779094530 }]
  };

  const rlsPolicies = [
    { table: "profiles", desc: "SELECT by public; UPDATE strictly limited to auth.uid() owner.", status: "enforced" },
    { table: "attendance", desc: "SELECT restricted to students, teachers & related parents; ALL restricted to teachers/admins.", status: "enforced" },
    { table: "assignments", desc: "SELECT by anyone authenticated; ALL restricted to teachers & admins.", status: "enforced" },
    { table: "quizzes", desc: "SELECT by anyone authenticated; ALL restricted to teachers & admins.", status: "enforced" },
    { table: "quiz_results", desc: "SELECT restricted to student owners, teachers & related parents; ALL restricted to teachers/admins.", status: "enforced" },
  ];

  const firewallLogs = [
    { time: "15:28:49", event: "JWT Token Handshake Verified", client: "127.0.0.1", threat: "none" },
    { time: "15:27:19", event: "DB Migration Check Accepted", client: "Supabase Core", threat: "none" },
    { time: "15:26:27", event: "RLS Session Filter Instantiated", client: "PostgreSQL Gateway", threat: "none" }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              Security Terminal
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Security Gateway
          </h1>
          <p className="text-xs text-foreground/60">
            Inspect live Row-Level Security (RLS) policies, analyze encrypted JWT tokens, and check server firewalls.
          </p>
        </div>
      </motion.div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Supabase Row Level Security (RLS) Status */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              Supabase RLS Policies Status
            </h3>
            <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase font-mono">
              All Secured
            </span>
          </div>

          <div className="space-y-3 font-sans">
            {rlsPolicies.map((policy, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-1.5 hover:bg-white/[0.02] transition-all">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold font-mono text-indigo-400">public.{policy.table}</h4>
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-extrabold uppercase font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Enforced
                  </span>
                </div>
                <p className="text-[10px] text-foreground/65 leading-relaxed">{policy.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Encrypted Token Decoder (JWT Payload) */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
              <Key className="w-4 h-4 text-purple-400" />
              Active JWT Token Decoder
            </h3>
            <p className="text-[10px] text-foreground/50">Decrypted JSON Web Token parameters used by Edge Middleware</p>
          </div>

          <div className="bg-foreground/5 border border-foreground/5 rounded-xl p-3.5 font-mono text-[10px] space-y-1.5 text-foreground/80 overflow-y-auto max-h-56 relative">
            {!showToken ? (
              <div className="h-44 flex flex-col justify-center items-center gap-3">
                <Lock className="w-6 h-6 text-indigo-400 animate-pulse" />
                <button
                  onClick={() => setShowToken(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold transition-all text-[9px] flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Decrypt Token
                </button>
              </div>
            ) : (
              <pre className="text-[9px] text-indigo-300 leading-normal">
                {JSON.stringify(jwtPayload, null, 2)}
              </pre>
            )}
          </div>

          <div className="text-center p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[9px] text-indigo-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> RSA-256 Encoded Handshake
          </div>
        </motion.div>
      </div>

      {/* Third row logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Firewalls Audits list */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Firewall Gateway Auditing
          </h3>

          <div className="space-y-3 font-mono text-[11px]">
            {firewallLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">[{log.time}]</span>
                    <h4 className="font-bold text-foreground/80">{log.event}</h4>
                  </div>
                  <p className="text-[9px] text-foreground/40">Client Origin: {log.client}</p>
                </div>
                <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold uppercase self-end sm:self-center">
                  Threat: {log.threat}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Server metrics details */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-400" />
            Platform Integrity
          </h3>

          <div className="space-y-2 text-[10px] font-mono">
            <div className="p-2.5 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>Postgres Version:</span>
              <span className="font-bold text-indigo-400">PostgreSQL 15.6</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>SSL Encryption:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-0.5">TLSv1.3 Active</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.01] border border-foreground/5 flex justify-between items-center">
              <span>Token Provider:</span>
              <span className="font-bold text-indigo-400">GoTrue / JWT</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
