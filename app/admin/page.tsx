"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminRedirectPage() {
  const router = useRouter();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // If not logged in, go to login page
      router.push("/auth/login");
    } else if (role === "admin") {
      // If logged in as admin, go to admin dashboard
      router.push("/dashboard/admin");
    } else {
      // If logged in as another role, go to general dashboard
      router.push("/dashboard");
    }
  }, [user, role, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* Premium Cyber/Academic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 relative z-10 p-8 rounded-[32px] border border-blue-500/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-blue-500/5"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-outfit tracking-tight">Admin Gateway</h2>
          <p className="text-sm text-slate-400">Verifying session and security clearances...</p>
        </div>

        <div className="flex justify-center pt-2">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </motion.div>
    </div>
  );
}
