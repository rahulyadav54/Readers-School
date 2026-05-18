"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useState } from "react";
import { BookOpen, User, Mail, GraduationCap, Award, Compass } from "lucide-react";

export default function StaffPage() {
  const [selectedDept, setSelectedDept] = useState("All");

  const departments = ["All", "Science", "Mathematics", "Computer Science", "Languages"];

  const teachers = [
    { name: "Dr. Clara Mercer", dept: "Science", role: "Science Department Head", qual: "Ph.D. in Physics (Stanford)", subjects: ["Quantum Theory", "Applied Thermodynamics"] },
    { name: "Prof. Elena Rostova", dept: "Mathematics", role: "Senior Calculus Coach", qual: "M.Sc. in Mathematics (Moscow State)", subjects: ["Calculus", "Linear Vector Algebra"] },
    { name: "Mr. Sarah Jenkins", dept: "Computer Science", role: "AI & TS Architect", qual: "B.Tech in Computer Science (IIT Madras)", subjects: ["Zustand State Models", "Gemini Node APIs"] },
    { name: "Mrs. Linda Adams", dept: "Languages", role: "Senior Literature Mentor", qual: "M.A. in English Lit (Oxford)", subjects: ["Classical Poetry", "Phonetics"] }
  ];

  const filteredTeachers = selectedDept === "All" 
    ? teachers 
    : teachers.filter(t => t.dept === selectedDept);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">FACULTY MATRIX</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Our Academic Mentors</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Meet the researchers, doctorate heads, and senior computer specialists who guide our scholars daily.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-foreground/5 font-semibold text-[10px]">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg border shrink-0 transition-all cursor-pointer ${
                selectedDept === dept
                  ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400"
                  : "bg-white/5 border-foreground/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {filteredTeachers.map((t, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] flex items-start gap-4 hover:border-indigo-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white border border-indigo-400/20 font-bold text-lg shrink-0">
                {t.name[4]}
              </div>

              <div className="space-y-3 w-full">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-foreground">{t.name}</h3>
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-bold uppercase">{t.dept}</span>
                  </div>
                  <p className="text-[10px] text-foreground/50 font-mono mt-0.5">{t.role}</p>
                </div>

                <div className="space-y-1.5 border-t border-foreground/5 pt-3 text-[10px] text-foreground/60 leading-relaxed font-light">
                  <p className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {t.qual}</p>
                  <p className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Focus: {t.subjects.join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
