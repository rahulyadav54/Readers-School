"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { BookOpen, GraduationCap, Code, Compass, Sparkles, Award } from "lucide-react";

export default function AcademicsPage() {
  const divisions = [
    {
      title: "Primary Foundation (Grades 1-5)",
      desc: "Instilling critical numeracy, inquiry methods, and language basics with gamified daily math quizzes.",
      icon: GraduationCap,
      subjects: ["English Literature", "Numerical Science", "Basic Logic & Scratch Coding", "Creative Arts"]
    },
    {
      title: "Middle School (Grades 6-8)",
      desc: "Expanding conceptual analysis, laboratory science, grammar patterns, and real-time database logic.",
      icon: Compass,
      subjects: ["Advanced Algebra", "Physics & Chemistry Labs", "Coding with Python", "Civic Studies"]
    },
    {
      title: "Senior Secondary (Grades 9-12)",
      desc: "Specialized streams preparation for competitive global university credentials and advanced prompt systems.",
      icon: Code,
      subjects: ["Data Structures & TS", "Calculus & Vector Geometry", "Organic Chemistry", "Global Economics"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">ACADEMIC WING</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Our Curricular Architecture</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            A comprehensive, interdisciplinary curriculum combining international standards with modern computational technologies.
          </p>
        </div>

        {/* Divisions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {divisions.map((d, idx) => {
            const Icon = d.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit animate-float group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm font-outfit text-foreground">{d.title}</h3>
                  <p className="text-[11px] text-foreground/50 leading-relaxed">{d.desc}</p>
                </div>

                <div className="space-y-2 border-t border-foreground/5 pt-4">
                  <h4 className="font-bold text-[9px] uppercase tracking-wider text-foreground/40">Core Syllabus Subjects</h4>
                  <ul className="grid grid-cols-2 gap-2 text-[10px] text-foreground/60 font-mono">
                    {d.subjects.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Innovation Framework Section */}
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/20 bg-indigo-500/[0.01] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-400 font-bold uppercase">
              <Sparkles className="w-2.5 h-2.5 animate-spin" /> Next-Gen Syllabus Integration
            </div>
            <h3 className="text-xl font-extrabold font-outfit text-foreground">Cybernetic Innovation Program</h3>
            <p className="text-[11px] sm:text-xs text-foreground/60 leading-relaxed font-light">
              We believe coding and AI are the new literacy standard. Every student at The Readers International School participates in our custom-engineered **Cybernetic Innovation Program** starting Grade 3, where they learn to formulate questions using the Gemini API, create simple React interfaces, and analyze datasets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.01] border border-foreground/5 space-y-3 shrink-0 w-full lg:w-80">
            <h4 className="font-bold text-xs flex items-center gap-1.5"><Award className="w-4 text-amber-400" /> Academic Credentials</h4>
            <ul className="space-y-2 text-[10px] text-foreground/60 font-mono">
              <li className="flex items-center gap-1.5">✓ Affiliate CBSE Board Code: 994820</li>
              <li className="flex items-center gap-1.5">✓ International IB Diploma Track</li>
              <li className="flex items-center gap-1.5">✓ Zaya Tech Innovation Badge</li>
            </ul>
          </div>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
