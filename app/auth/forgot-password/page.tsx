"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { Mail, ChevronLeft, AlertCircle, Loader2, CheckCircle2, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your academic email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setErrorMsg(err.message || "Could not issue a recovery email. Please check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative bg-cyber-grid">
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Back to Login link */}
      <Link
        href="/auth/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Sign In
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-xl"
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-outfit mb-2">Recovery Email Transmitted!</h3>
            <p className="text-sm text-foreground/75 leading-relaxed mb-6">
              A key reset link was transmitted to <strong className="text-indigo-400 font-medium">{email}</strong>.
              Verify your inbox to set a new security passphrase.
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
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4 animate-float">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold font-outfit">Reset Passphrase</h2>
              <p className="text-sm text-foreground/60 mt-1">
                Enter your academic email to request a reset link
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

            <form onSubmit={handleReset} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting Request...
                  </>
                ) : (
                  "Send Recovery Email"
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
