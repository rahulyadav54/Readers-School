"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/lib/store/authStore";
import { Lock, Mail, ChevronLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

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
        router.push(redirectTo);
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative">
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
        className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4 animate-float">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Welcome Back</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Access your secure Readers School environment
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
              <div className="flex gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs items-start leading-normal">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
              Academic Email
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Security Key
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Supplied inside the architectural demo. Email recovery flow simulated!");
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-foreground/60">
          First time here?{" "}
          <Link
            href="/auth/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium ml-1"
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
