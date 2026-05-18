"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Camera, Music, Trophy, Palette, Heart, Globe } from "lucide-react";
import Link from "next/link";

export default function StudentLifePage() {
  const activities = [
    { title: "Athletics & Sports", desc: "State-of-the-art facilities for football, basketball, swimming, and more.", icon: Trophy, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=60&w=800&auto=format&fit=crop" },
    { title: "Arts & Creativity", desc: "Dedicated studios for painting, sculpture, and digital arts.", icon: Palette, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=60&w=800&auto=format&fit=crop" },
    { title: "Music & Drama", desc: "A vibrant performing arts program culminating in seasonal theatrical productions.", icon: Music, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=60&w=800&auto=format&fit=crop" },
    { title: "Community Service", desc: "Instilling a sense of responsibility through local outreach and charity events.", icon: Heart, image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=60&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=60&w=1600&auto=format&fit=crop" 
            alt="Campus Life" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6 pt-12">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-white font-bold uppercase tracking-wider text-xs backdrop-blur-md">
            Life at Readers Int.
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit tracking-tight text-white">
            Vibrant <span className="text-amber-400">Campus Life.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Education goes beyond the four walls of a classroom. Discover a thriving community where students explore their passions and build lifelong friendships.
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-slate-900">A place to grow, connect, and thrive.</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We believe that a well-rounded education requires a balance of academic rigor and rich extracurricular experiences. Our sprawling campus offers countless opportunities for students to engage in sports, arts, leadership, and community service.
          </p>
        </div>
      </section>

      {/* Activity Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="group relative rounded-[40px] overflow-hidden shadow-xl aspect-video md:aspect-square lg:aspect-video cursor-pointer">
                  <img src={act.image} alt={act.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/30">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold font-outfit mb-3">{act.title}</h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[40px] mx-6 lg:mx-12 my-12 text-center space-y-8">
        <Camera className="w-16 h-16 mx-auto text-amber-400 mb-6 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-extrabold font-outfit">See the campus in action.</h2>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">Browse our visual gallery to experience the joy, creativity, and energy of The Readers International School.</p>
        <div className="pt-8">
          <Link href="/gallery" className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg transition-colors">
            View Full Gallery
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
