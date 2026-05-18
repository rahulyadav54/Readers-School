"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/lib/store/authStore";
import { 
  Lock, Mail, ChevronLeft, AlertCircle, Eye, EyeOff, Loader2,
  ShieldCheck, GraduationCap, BookOpen, Users, Compass, CheckCircle2,
  Sparkles, ShieldAlert, Award, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PortalType = "student" | "teacher" | "parent" | "admin";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  const queryPortal = searchParams.get("portal") as PortalType;
  const [activePortal, setActivePortal] = useState<PortalType>(
    queryPortal && ["admin", "teacher", "student", "parent"].includes(queryPortal) 
      ? queryPortal 
      : "student"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.push(`/${activePortal}-dashboard`);
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

  // Portal text helper
  const getButtonText = () => {
    switch (activePortal) {
      case "student": return "Login as Student";
      case "teacher": return "Login as Teacher";
      case "parent": return "Login as Parent";
      case "admin": return "Login as Admin";
    }
  };

  return (
    <div className="min-h-screen lg:h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC] font-sans antialiased text-slate-800 relative lg:overflow-hidden">
      
      {/* Dynamic blurred shape background for entire screen */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#4F46E5]/5 blur-[120px] pointer-events-none" />

      {/* ========================================================== */}
      {/* LEFT SIDE (DESKTOP): Modern Branding & Premium Graphics    */}
      {/* ========================================================== */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4F46E5] text-white p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        
        {/* Abstract vector backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/10 blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Top school branding seal */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight font-outfit uppercase">
              Readers School
            </h1>
            <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mt-0.5">
              Knowledge Hub
            </p>
          </div>
        </div>

        {/* Center graphics and Taglines */}
        <div className="relative z-10 my-auto space-y-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-purple-200"
            >
              <Sparkles className="w-3.5 h-3.5" /> Institutional Smart ERP Platform
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl font-extrabold tracking-tight leading-[1.15]"
            >
              Inspiring Minds.<br />Building Futures.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-purple-100 max-w-sm font-medium leading-relaxed"
            >
              A premium, secure environment delivering high-caliber educational resources and tracking analytics for tomorrow's pioneers.
            </motion.p>
          </div>

          {/* Premium Glassmorphism Stats Cards */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "Students", value: "2000+" },
              { label: "Teachers", value: "150+" },
              { label: "Efficiency", value: "99.9%" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all text-center"
              >
                <p className="text-xl font-black">{stat.value}</p>
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info & SSL status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-purple-200/80 border-t border-white/10 pt-6">
          <p>© 2026 Readers School ERP.</p>
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px] bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Compass className="w-3.5 h-3.5" /> SECURE SSL ACTIVE
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/* RIGHT SIDE: Authentication Card Portal                    */}
      {/* ========================================================== */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:left-12 flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" /> Home Page
        </Link>

        {/* Auth form card wrapper */}
        <div className="w-full max-w-[460px] space-y-8">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#7C3AED] border border-slate-200/60 mb-4 transition-transform hover:scale-105 duration-300">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 font-outfit uppercase">
              Readers School
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">
              Enterprise ERP Gateway
            </p>
          </div>

          {/* Segmented Pill Selector for Roles */}
          <div className="bg-slate-100/80 border border-slate-200/50 p-1.5 rounded-2xl flex gap-1 relative">
            {(["student", "teacher", "parent", "admin"] as const).map((role) => {
              const isActive = activePortal === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setActivePortal(role);
                    setErrorMsg("");
                  }}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer relative ${
                    isActive 
                      ? "text-[#7C3AED] bg-white shadow-md border-b-2 border-[#7C3AED]" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {role === "student" && <BookOpen className="w-4 h-4" />}
                  {role === "teacher" && <GraduationCap className="w-4 h-4" />}
                  {role === "parent" && <Users className="w-4 h-4" />}
                  {role === "admin" && <ShieldCheck className="w-4 h-4" />}
                  <span>{role}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Message Layout */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 text-xs items-start leading-relaxed shadow-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Authentication Failure</p>
                    <p className="text-rose-500/95 font-medium">{errorMsg}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            
            {/* Soft border accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]" />

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Address */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 font-mono">
                  Academic Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={`e.g. ${activePortal}@readers.school`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Password */}
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
                    className="text-[10px] font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
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
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-medium text-slate-800"
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

              {/* Remember Me & Secure Badge */}
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 font-medium select-none">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-[#7C3AED] border-slate-200 rounded focus:ring-[#7C3AED]"
                  />
                  Remember me
                </label>
                
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Secure Login
                </div>
              </div>

              {/* Form submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-[10px] uppercase tracking-widest cursor-pointer shadow-md hover:shadow-lg mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating Profile...
                  </>
                ) : (
                  <>
                    <span>{getButtonText()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <div className="text-center mt-6 text-xs text-slate-400 font-medium">
              First time here?{" "}
              <Link
                href="/auth/signup"
                className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors font-bold ml-1"
              >
                Create an academic profile
              </Link>
            </div>

          </div>

          {/* Secure SSL badges and footer */}
          <div className="flex flex-col items-center justify-center space-y-2 text-slate-400 text-[10px] font-medium border-t border-slate-100 pt-6">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200/50 px-3 py-1.5 rounded-xl">
              🛡️ SSL 256-BIT ENCRYPTION VERIFIED
            </div>
            <p>Readers School Enterprise Portal Gateway v3.14</p>
          </div>

        </div>

      </div>

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
