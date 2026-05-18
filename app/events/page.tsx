"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Calendar, ChevronRight, MessageSquare, Flame } from "lucide-react";

export default function EventsPage() {
  const blogs = [
    { id: 1, date: "May 18, 2026", title: "National Robotics Tournament Triumph", desc: "Our computational prompt alliance captured gold medal standings in this year's autonomous AI challenger segment.", author: "Administrator" },
    { id: 2, date: "May 12, 2026", title: "Stellar Calculus Summer Boot Camp", desc: "Prof. Elena Rostova is hosting specialized mathematical seminars covering vector derivatives and neural geometry.", author: "Elena Rostova" },
    { id: 3, date: "May 08, 2026", title: "Supabase Realtime Schema Upgrade v1.5", desc: "Our database trigger matrices and RLS structures have been fully migrated to support gamified streak progress parameters.", author: "Tech Desk" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">ACADEMY BLOGS</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Announcements & Event Feeds</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Stay synchronised with academic calendars, student tournament announcements, and service migrations.
          </p>
        </div>

        {/* Blog Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {blogs.map((b) => (
            <div key={b.id} className="glass-panel p-5 rounded-2xl border border-foreground/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-mono text-foreground/45">
                  <span className="flex items-center gap-1"><Calendar className="w-3 text-indigo-400" /> {b.date}</span>
                  <span>By: {b.author}</span>
                </div>
                <h4 className="font-bold text-xs text-foreground group-hover:text-indigo-400 transition-colors leading-snug">{b.title}</h4>
                <p className="text-[11px] text-foreground/50 leading-relaxed font-light">{b.desc}</p>
              </div>

              <div className="border-t border-foreground/5 pt-3 flex justify-between items-center text-[9px] font-mono font-bold text-indigo-400">
                <span className="flex items-center gap-1 uppercase"><Flame className="w-3 text-indigo-400" /> Platform Active</span>
                <span className="flex items-center gap-0.5 cursor-pointer hover:underline">Read Article <ChevronRight className="w-3" /></span>
              </div>
            </div>
          ))}
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
