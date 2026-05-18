"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Camera } from "lucide-react";

export default function GalleryPage() {
  const images = [
    { url: "/gallary/award.jpg", span: "col-span-1 row-span-2", alt: "Award Ceremony Celebration" },
    { url: "/gallary/cycle%20race%20game.jpg", span: "col-span-2 row-span-1", alt: "Exciting Student Cycle Race Game" },
    { url: "/gallary/batch.jpg", span: "col-span-1 row-span-1", alt: "TRIS Students Batch Photo" },
    { url: "/gallary/bidai%202082.jpg", span: "col-span-1 row-span-2", alt: "Farewell / Bidai Ceremony 2082 B.S." },
    { url: "/gallary/award2.jpg", span: "col-span-2 row-span-2", alt: "Premium Academic Awards Distribution" },
    { url: "/gallary/game%20head.jpg", span: "col-span-1 row-span-1", alt: "Sports & Game Ceremony Head" },
    { url: "/gallary/game%20team.jpg", span: "col-span-2 row-span-1", alt: "TRIS Winning Sports Team" },
    { url: "/gallary/mam.jpg", span: "col-span-1 row-span-2", alt: "Interactive Faculty & Teacher Session" },
    { url: "/gallary/red%20house.jpg", span: "col-span-1 row-span-1", alt: "Red House Sports Assembly" },
    { url: "/gallary/sarswatipuja.jpg", span: "col-span-2 row-span-1", alt: "Sarswati Puja Celebration" },
    { url: "/gallary/student1.jpg", span: "col-span-1 row-span-1", alt: "Students Creative Activity" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-900 text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <Camera className="w-12 h-12 mx-auto text-blue-500 mb-4 opacity-80" />
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit tracking-tight">
            Visual <span className="text-blue-400">Journey.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A glimpse into the daily life, celebrations, and academic triumphs at The Readers International School.
          </p>
        </div>
      </section>

      {/* Masonry Gallery Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
            {images.map((img, idx) => (
              <div key={idx} className={`relative group overflow-hidden rounded-3xl bg-slate-800 ${img.span}`}>
                <img 
                  src={img.url} 
                  loading="lazy" 
                  alt={img.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
