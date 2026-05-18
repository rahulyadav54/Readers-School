"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/lib/store/authStore";
import { Lock, Mail, ChevronLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ShieldCheck, GraduationCap, BookOpen, Users, GraduationCap as SchoolLogo } from "lucide-react";

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

  // Portal Styling Configurations - Premium institutional colors
  const portalConfig = {
    admin: {
      title: "Administrator Gateway",
      desc: "Readers School Enterprise Control Panel",
      color: "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
      accent: "text-purple-600 bg-purple-50 border-purple-200/60",
      glow: "bg-purple-500/5",
      btnText: "Authenticate Admin console",
      emailPlaceholder: "admin@readersschool.com",
    },
    teacher: {
      title: "Faculty Terminal",
      desc: "Academic Curriculum & Grade Control Center",
      color: "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
      glow: "bg-emerald-500/5",
      btnText: "Log In to Faculty Console",
      emailPlaceholder: "teacher@readersschool.com",
    },
    student: {
      title: "Student Terminal",
      desc: "Access your coursework, grades, and study hub",
      color: "from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200/60",
      glow: "bg-indigo-500/5",
      btnText: "Access Student Study Hub",
      emailPlaceholder: "student@readersschool.com",
    },
    parent: {
      title: "Guardian Portal",
      desc: "Readers School Family Connection Center",
      color: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      accent: "text-amber-600 bg-amber-50 border-amber-200/60",
      glow: "bg-amber-500/5",
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
        const targetPath = `/${activePortal}-dashboard`;
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-[#F8FAFC]">
      {/* Sleek dynamic background decorations */}
      <div className={`absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${currentPortal.glow} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Main Logo & Portal Heading */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#7C3AED] border border-slate-200/60 mb-2">
          <SchoolLogo className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-black tracking-tight text-slate-800 font-outfit uppercase">
          Readers School
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
          Enterprise Portal Gateway
        </p>
      </div>

      {/* Portal Selection Slider Tabs */}
      <div className="w-full max-w-md mb-5 bg-white border border-slate-200/80 rounded-2xl p-1.5 flex gap-1 relative z-10 shadow-sm">
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
                  ? "text-slate-800 bg-slate-50 border-b border-indigo-500 shadow-xs" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/60"
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

      {/* Login Card Form */}
      <motion.div
        key={activePortal}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-md border border-slate-200/80 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${currentPortal.accent} mb-3`}>
            {activePortal === "admin" && <ShieldCheck className="w-5.5 h-5.5" />}
            {activePortal === "teacher" && <GraduationCap className="w-5.5 h-5.5" />}
            {activePortal === "student" && <BookOpen className="w-5.5 h-5.5" />}
            {activePortal === "parent" && <Users className="w-5.5 h-5.5" />}
          </div>
          <h2 className="text-xl font-bold font-outfit tracking-tight text-slate-800 transition-all duration-300">
            {currentPortal.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 transition-all duration-300">
            {currentPortal.desc}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="flex gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs items-start leading-normal">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{errorMsg}</span>
                  {activePortal === "admin" && (
                    <div className="text-[10px] text-rose-500 font-mono mt-1 border-t border-rose-200 pt-1">
                      💡 Tip: Click "Elevate to Admin ERP" in navbar menu to instantly update roles!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 font-mono">
              Academic Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder={currentPortal.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#7C3AED] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                Security Key
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the Readers School IT Administration Desk for password assistance.");
                }}
                className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#7C3AED] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${currentPortal.color} text-white font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-[10px] uppercase tracking-wider cursor-pointer shadow-md`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              currentPortal.btnText
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          First time here?{" "}
          <Link
            href="/auth/signup"
            className="text-indigo-500 hover:text-indigo-600 transition-colors font-semibold ml-1"
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
