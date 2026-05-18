"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useState } from "react";
import { Briefcase, Send, Mail, User, ShieldCheck, Loader2 } from "lucide-react";

export default function CareersPage() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const jobs = [
    { title: "Senior Calculus Coach", dept: "Mathematics Wing", status: "Full-Time", location: "Stellar campus" },
    { title: "AI Prompting & TS Instructor", dept: "Computer Science Dept", status: "Full-Time", location: "Bangalore Node" },
    { title: "Quantum Physics Lab Mentor", dept: "Science Exploratorium", status: "Full-Time", location: "Stellar Campus" }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">JOIN THE STAFF</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Academic Career Opportunities</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            We are always seeking doctorate researchers, computer specialists, and passionate tutors to join our elite roster.
          </p>
        </div>

        {/* Jobs List & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Active Jobs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Current Open Positions</h3>
            <div className="space-y-3 font-sans">
              {jobs.map((job, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-foreground/5 bg-white/[0.01] flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-foreground">{job.title}</h4>
                    <p className="text-[9px] text-foreground/45 font-mono">{job.dept} • {job.location}</p>
                  </div>
                  <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-bold uppercase">{job.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Apply Form */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/25 bg-indigo-500/[0.01] space-y-6">
            <div>
              <h3 className="font-bold font-outfit text-sm">Direct Roster Application</h3>
              <p className="text-[10px] text-foreground/50 mt-0.5">Submit curriculum vitae parameters directly to HR.</p>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 space-y-2 text-center font-sans">
                <h4 className="font-bold">Application Received!</h4>
                <p className="text-[10px] leading-relaxed">Our HR department will review your credentials and get back to you shortly.</p>
                <button onClick={() => setSuccess(false)} className="text-[9px] underline font-bold mt-2 cursor-pointer">Submit Another Application</button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Candidate Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Brief Cover Note / Bio</label>
                  <textarea
                    required
                    placeholder="Describe your research background and teaching pedagogy..."
                    className="glass-input p-3 rounded-lg w-full text-xs font-sans text-foreground h-20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit Candidate File
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
