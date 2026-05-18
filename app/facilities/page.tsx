"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Server, Compass, BookOpen, Film, Layers, Shield } from "lucide-react";

export default function FacilitiesPage() {
  const items = [
    {
      title: "Interactive AI Sandbox Lab",
      desc: "Equipped with localized development nodes and GPU clusters where students test prompts and train neural algorithms.",
      icon: Server,
      color: "text-cyan-400"
    },
    {
      title: "Automated Digital Library",
      desc: "Providing secure catalog access to over 45,000 international research journals and modular homework notes downloads.",
      icon: BookOpen,
      color: "text-indigo-400"
    },
    {
      title: "Cosmic Science Exploratorium",
      desc: "Advanced laboratories dedicated to physics models, biological taxonomy, organic chemical reactions, and vector mechanics.",
      icon: Compass,
      color: "text-purple-400"
    },
    {
      title: "Audiovisual Media Studio",
      desc: "A production environment equipped with cameras, sound cards, green screens, and vector editing rigs for digital cadets.",
      icon: Film,
      color: "text-rose-400"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">SMART CAMPUS</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Stellar Infrastructure & Facilities</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            A premium school designed to inspire innovation. Experience spaces crafted for global exploration.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] flex items-start gap-4 hover:border-indigo-500/20 transition-all group">
                <div className={`p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm font-outfit text-foreground">{item.title}</h3>
                  <p className="text-[11px] text-foreground/50 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Health Assurance banner */}
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/20 bg-indigo-500/[0.01] flex flex-col lg:flex-row items-center gap-6 justify-between">
          <div className="space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-1.5"><Shield className="w-4 text-emerald-400" /> Physical & Cybernetic Security Guard</h4>
            <p className="text-[11px] text-foreground/60 leading-relaxed max-w-xl">
              Our campus enforces military-grade access controls, continuous biometric identity checkpoints, and dynamic content-filtering firewalls on all student-facing networks.
            </p>
          </div>
          <span className="inline-flex px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[8px] font-bold tracking-wider shrink-0">100% SECURE PROTOCOL</span>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
