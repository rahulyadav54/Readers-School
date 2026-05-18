"use client";

import Link from "next/link";
import { ShieldAlert, ChevronLeft, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative bg-cyber-grid text-white font-sans">
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Portal
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel w-full max-w-lg rounded-3xl p-8 md:p-10 border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl text-center space-y-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold font-outfit text-white tracking-tight">Self-Registration Closed</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            In accordance with The Readers International School security protocols, self-registration is closed. Student, teacher, and parent portal access profiles can only be provisioned by System Administrators.
          </p>
        </div>

        {/* Contact details for support */}
        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/80 text-left space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Need Your Credentials?</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            If you do not have your designated login credentials yet, please contact the administration team to receive your authenticated specific login details:
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Garuda-4, Rautahat, Nepal</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <a href="tel:+9779802933719" className="hover:underline hover:text-white">+977 9802933719</a>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <a href="mailto:thereadersschool2073@gmail.com" className="hover:underline hover:text-white">thereadersschool2073@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/auth/login"
            className="inline-flex w-full items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md transition-all hover:scale-[1.01]"
          >
            <span>Go to Login Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
