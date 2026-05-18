"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Gamepad2, Brain, Compass, HelpCircle, Trophy, Sparkles } from "lucide-react";

export default function StudentLifePage() {
  const activities = [
    { title: "Zaya Robotics & Coding Club", desc: "Building modular Arduino circuits and formulating generative prompts using TypeScript models.", icon: Brain, color: "text-cyan-400" },
    { title: "Stellar Mathematics Guild", desc: "Solving advanced multi-dimensional geometry calculations and preparing for global Olympiads.", icon: Compass, color: "text-indigo-400" },
    { title: "Cosmic eSports & Chess Club", desc: "Training cognitive tactical moves, algorithmic pathways, and spatial organization logic.", icon: Gamepad2, color: "text-rose-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">EXTRACURRICULAR</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Active Student Life & Clubs</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Education extends beyond textbooks. Discover coding alliances, stellar chess groups, and innovative workshops.
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-foreground/[0.02] border border-foreground/5 w-fit">
                    <Icon className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <h3 className="font-extrabold text-sm font-outfit text-foreground">{a.title}</h3>
                  <p className="text-[11px] text-foreground/50 leading-relaxed font-light">{a.desc}</p>
                </div>
                <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Weekly Assembly Meetings</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Achievements spotlight */}
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/20 bg-indigo-500/[0.01] flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="space-y-3 max-w-xl">
            <h4 className="font-bold text-sm flex items-center gap-1.5"><Trophy className="w-4 text-amber-400" /> National Innovation Tournament 2026</h4>
            <p className="text-[11px] text-foreground/60 leading-relaxed">
              Our school's **AI Prompting Alliance** secured 1st prize in the National Student Innovation Challenge, designing a local offline-enabled study planner utilizing LLM frameworks!
            </p>
          </div>
          <span className="inline-flex px-2 py-1 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-[8px] font-bold tracking-wider shrink-0">🏆 GOLD MEDALLISTS</span>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
