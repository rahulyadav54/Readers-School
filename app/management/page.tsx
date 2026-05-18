"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { ShieldCheck, Award, Heart, Briefcase } from "lucide-react";

export default function ManagementPage() {
  const leaders = [
    { name: "Dr. Zaya Hasan", role: "Founding Chairperson", desc: "Overseeing cosmic system integrations and school campus expansion initiatives.", icon: ShieldCheck, color: "text-emerald-400" },
    { name: "Prof. Elena Rostova", role: "Executive Board Director", desc: "Advising curricular decoupling tracks and elite mathematical assessments.", icon: Award, color: "text-amber-400" },
    { name: "Prof. Marcus Sterling", role: "Vice President & Trustee", desc: "Managing global financial allocations and physical laboratory logistics.", icon: Briefcase, color: "text-indigo-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">TRUSTEE COUNCIL</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Our Leadership Board</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Meet the visionaries directing structural growth, investment programs, and learning models.
          </p>
        </div>

        {/* Board Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {leaders.map((l, idx) => {
            const Icon = l.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white border border-indigo-400/20 font-bold text-sm">
                    {l.name[4]}
                  </div>
                  <div className="p-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5 shrink-0">
                    <Icon className={`w-4 h-4 ${l.color}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-foreground">{l.name}</h3>
                  <p className="text-[10px] text-foreground/50 font-mono">{l.role}</p>
                </div>

                <p className="text-[11px] text-foreground/60 leading-relaxed font-light border-t border-foreground/5 pt-3">
                  {l.desc}
                </p>
              </div>
            );
          })}
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
