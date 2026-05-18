"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Trophy, Star, Sparkles, Target, Award } from "lucide-react";

export default function AchievementsPage() {
  const items = [
    { title: "National Robotics Championship 2026", desc: "First prize in AI Autonomous navigation models category, utilizing custom TypeScript models.", icon: Trophy, color: "text-amber-400" },
    { title: "Stellar Mathematics Olympiad", desc: "Two senior secondary scholars secured perfect scores in multi-dimensional calculus vectors.", icon: Award, color: "text-indigo-400" },
    { title: "Young Scientist Innovation Award", desc: "Awarded by ZAYA CODE HUB for writing a local educational notes indexing sandbox.", icon: Sparkles, color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">ACADEMY LAURELS</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Our Stellar Milestones</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Review the historical championships, academic trophies, and innovation laurels awarded to our cadets.
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all space-y-4">
                <div className="p-2.5 rounded-xl bg-foreground/[0.02] border border-foreground/5 w-fit">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-foreground">{item.title}</h3>
                  <p className="text-[11px] text-foreground/50 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
