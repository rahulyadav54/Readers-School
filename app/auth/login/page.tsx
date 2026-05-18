"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/lib/store/authStore";
import { Lock, Mail, ChevronLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ShieldCheck, GraduationCap, BookOpen, Users, HelpCircle } from "lucide-react";

type PortalType = "admin" | "teacher" | "student" | "parent";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  // Initialize selected portal based on query parameter or default to student
  const queryPortal = searchParams.get("portal") as PortalType;
  const [activePortal, setActivePortal] = useState<PortalType>(
    queryPortal && ["admin", "teacher", "student", "parent"].includes(queryPortal) 
      ? queryPortal 
      : "student"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Portal Styling Configurations
  const portalConfig = {
    admin: {
      title: "Administrator Gateway",
      desc: "Readers School Enterprise Control Panel",
      color: "from-violet-500 to-purple-600",
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      glow: "bg-purple-500/10",
      btnText: "Authenticate Admin console",
      emailPlaceholder: "admin@readersschool.com",
    },
    teacher: {
      title: "Faculty Terminal",
      desc: "Academic Curriculum & Grade Control Center",
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      glow: "bg-emerald-500/10",
      btnText: "Log In to Faculty Console",
      emailPlaceholder: "teacher@readersschool.com",
    },
    student: {
      title: "Student Terminal",
      desc: "Access your coursework, grades, and study hub",
      color: "from-indigo-500 to-blue-600",
      accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
      glow: "bg-indigo-500/10",
      btnText: "Access Student Study Hub",
      emailPlaceholder: "student@readersschool.com",
    },
    parent: {
      title: "Guardian Portal",
      desc: "Readers School Family Connection Center",
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      glow: "bg-amber-500/10",
      btnText: "Enter Parent Dashboard",
      emailPlaceholder: "parent@readersschool.com",
    },
  };

  const currentPortal = portalConfig[activePortal];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const data = await authService.signIn({ email, password });
      if (data.session) {
        setSession(data.session);
        router.refresh();

        // Redirect to the appropriate portal dashboard automatically
        const targetPath = `/dashboard/${activePortal}`;
        router.push(targetPath);
      } else {
        throw new Error("Could not initialize session. Check your credentials.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMsg(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Moving glass dynamic ambient backdrops */}
      <div className={`absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${currentPortal.glow} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Portal Selection Tabs */}
      <div className="w-full max-w-md mb-6 glass-panel rounded-2xl p-1.5 flex gap-1 relative z-10 border border-foreground/5 shadow-lg">
        {(["student", "teacher", "parent", "admin"] as PortalType[]).map((role) => {
          const isActive = activePortal === role;
          return (
            <button
              key={role}
              onClick={() => {
                setActivePortal(role);
                setErrorMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                isActive 
                  ? "text-foreground bg-foreground/[0.04] border-b border-indigo-500/50 shadow-sm" 
                  : "text-foreground/55 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                {role === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
                {role === "teacher" && <GraduationCap className="w-3.5 h-3.5" />}
                {role === "student" && <BookOpen className="w-3.5 h-3.5" />}
                {role === "parent" && <Users className="w-3.5 h-3.5" />}
                <span>{role}</span>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={activePortal}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-xl border border-foreground/5 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${currentPortal.accent} mb-4`}>
            {activePortal === "admin" && <ShieldCheck className="w-6 h-6 animate-pulse" />}
            {activePortal === "teacher" && <GraduationCap className="w-6 h-6 animate-bounce" />}
            {activePortal === "student" && <BookOpen className="w-6 h-6 animate-pulse" />}
            {activePortal === "parent" && <Users className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black font-outfit tracking-tight text-foreground transition-all duration-300">
            {currentPortal.title}
          </h2>
          <p className="text-xs text-foreground/50 mt-1.5 transition-all duration-300">
            {currentPortal.desc}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs items-start leading-normal">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{errorMsg}</span>
                  {activePortal === "admin" && (
                    <div className="text-[10px] text-rose-400 font-mono mt-1 border-t border-rose-500/10 pt-1">
                      💡 Tip: Run SQL update in Supabase editor to set role='admin' for your email!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/60 mb-2 font-mono">
              Academic Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
              <input
                type="email"
                required
                placeholder={currentPortal.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-11 pr-4 py-3 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/60 font-mono">
                Security Key
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the Readers School IT Administration Desk for password assistance.");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-11 pr-11 py-3 rounded-2xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground/75 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${currentPortal.color} text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Security Clearances...
              </>
            ) : (
              currentPortal.btnText
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-foreground/60">
          First time here?{" "}
          <Link
            href="/auth/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold ml-1"
          >
            Create an academic profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background relative">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
