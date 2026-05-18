"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useState } from "react";
import { Film, Image as ImageIcon, Camera, Grid, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All", "Annual Day", "Sports Day", "Classroom Activities", 
    "Science Expo", "Cultural Events", "Competitions", "Innovation Programs"
  ];

  const galleryItems = [
    { id: 1, category: "Annual Day", title: "Global Cultural Dance Celebration", type: "image", color: "from-purple-500/10 to-indigo-500/10 border-indigo-500/10" },
    { id: 2, category: "Sports Day", title: "100m Track Relay Sprint Finish", type: "image", color: "from-amber-500/10 to-orange-500/10 border-amber-500/10" },
    { id: 3, category: "Classroom Activities", title: "Cadets Collaborative Coding Session", type: "image", color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/10" },
    { id: 4, category: "Science Expo", title: "Volcanic Chemical Reaction Demo", type: "image", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/10" },
    { id: 5, category: "Cultural Events", title: "Orchestra Musical Symposium", type: "image", color: "from-pink-500/10 to-rose-500/10 border-pink-500/10" },
    { id: 6, category: "Competitions", title: "State Algorithmic Chess Finals", type: "image", color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/10" },
    { id: 7, category: "Innovation Programs", title: "Stellar Gemini API Sandbox Launch", type: "video", color: "from-cyan-500/10 to-emerald-500/10 border-cyan-500/10" }
  ];

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">ACADEMY IMAGES</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Stellar Media Album Gallery</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Browse high-fidelity logs of classrooms, tournament relays, cultural events, and coding sandbox projects.
          </p>
        </div>

        {/* Categories selector horizontal scrolling list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-foreground/5 font-semibold text-[10px]">
          <span className="flex items-center gap-1 text-foreground/45 uppercase mr-2"><Filter className="w-3" /> Filters:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400"
                  : "bg-white/5 border-foreground/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`glass-panel p-5 rounded-2xl border bg-gradient-to-tr ${item.color} h-48 flex flex-col justify-between group hover:shadow-lg transition-all relative overflow-hidden`}
              >
                {/* Visual Grid Backdrop Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.01] rounded-bl-full pointer-events-none" />

                <div className="flex justify-between items-start">
                  <span className="inline-flex px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/50 font-mono text-[7px] uppercase font-bold tracking-wider">
                    {item.category}
                  </span>
                  <div className="p-1 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                    {item.type === "video" ? <Film className="w-3.5 h-3.5 text-cyan-400" /> : <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs font-outfit text-foreground leading-snug group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[8px] text-foreground/40 font-mono">ID: ALB-#00{item.id} • Verified Album</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
