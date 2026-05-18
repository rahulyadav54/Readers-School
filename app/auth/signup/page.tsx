"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { GraduationCap, Mail, Lock, User, ChevronLeft, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2, BookOpen, Heart, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "teacher" | "parent" | "admin">("parent");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleCards = [
    { value: "student", label: "Student 🔒", desc: "Provisioned by Admin Only", icon: GraduationCap, restricted: true },
    { value: "teacher", label: "Teacher 🔒", desc: "Provisioned by Admin Only", icon: BookOpen, restricted: true },
    { value: "parent", label: "Parent", desc: "Monitor your cadet's progress", icon: Heart, restricted: false },
    { value: "admin", label: "Admin", desc: "Configure stellar platform gateway", icon: ShieldCheck, restricted: false },
  ] as const;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("All credentials must be provided.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Security keys do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Security key must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await authService.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role, // custom role selected from the interactive cards grid!
          },
        },
      });
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Signup failed:", err);
      setErrorMsg(err.message || "Registration failed. Try a different email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative bg-cyber-grid">
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Portal
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel w-full max-w-lg rounded-2xl p-8 shadow-xl"
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-outfit mb-2">Registration Initiated!</h3>
            <p className="text-sm text-foreground/75 leading-relaxed mb-6">
              A verification link was dispatched to <strong className="text-indigo-400 font-medium">{email}</strong>.
              Please check your academic inbox to validate your profile.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex w-full justify-center py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md transition-all hover:scale-[1.01]"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4 animate-float">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-outfit">Join Readers School</h2>
              <p className="text-sm text-foreground/60 mt-1">
                Construct your modular academic interface
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
                  <div className="flex gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs items-start leading-normal">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Interactive Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
                  Select Academic Role
                </label>
                <div className="grid grid-cols-2 gap-3 mb-1">
                  {roleCards.map((card) => {
                    const CardIcon = card.icon;
                    const isSelected = role === card.value;
                    const isRestricted = card.restricted;

                    return (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => {
                          if (isRestricted) {
                            setErrorMsg("Student and Teacher credentials are provisioned exclusively by Academy Administrators in their system dashboards.");
                            return;
                          }
                          setErrorMsg("");
                          setRole(card.value);
                        }}
                        className={cn(
                          "p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col items-start gap-2",
                          isRestricted 
                            ? "opacity-45 bg-white/[0.01] border-foreground/5 text-foreground/40 cursor-not-allowed"
                            : isSelected
                              ? "bg-indigo-500/10 border-indigo-500/80 shadow-md shadow-indigo-500/5 text-indigo-400 cursor-pointer"
                              : "bg-white/5 border-foreground/5 text-foreground/65 hover:text-foreground hover:bg-white/10 cursor-pointer"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg border shrink-0 transition-all",
                          isRestricted
                            ? "bg-foreground/5 border-foreground/5 text-foreground/20"
                            : isSelected 
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
                              : "bg-foreground/5 border-foreground/5"
                        )}>
                          <CardIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold leading-none">{card.label}</h4>
                          <p className="text-[9px] text-foreground/45 leading-tight mt-1 line-clamp-2">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5">
                  Academic Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                  <input
                    type="email"
                    required
                    placeholder="you@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5">
                  Security Passphrase
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground/75 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5">
                  Verify Passphrase
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Profile...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-foreground/60">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium ml-1"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
