"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Globe, BookOpen, Star, Sparkles } from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "Academic Excellence", desc: "We nurture intellectual curiosity through a rigorous, globally recognized curriculum that prepares students for the world's top universities.", icon: ShieldCheck, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { title: "Future-Ready Skills", desc: "Equipping our students with critical thinking, creativity, and digital literacy to lead with confidence in a rapidly evolving world.", icon: Sparkles, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { title: "Inclusive Community", desc: "Fostering a warm, diverse, and supportive ecosystem where every child feels valued, respected, and deeply cared for.", icon: Heart, color: "text-rose-600 bg-rose-50 border-rose-100" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative w-full py-24 px-6 bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-xs">Our Heritage</span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-outfit text-slate-900 tracking-tight leading-[1.1]">
              A Tradition of <span className="text-blue-700">Excellence</span> & Innovation.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              The Readers International School is more than an educational institution; it is a vibrant community where young minds are inspired to discover their passions, embrace their potential, and shape a better tomorrow.
            </p>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=60&w=1200&auto=format&fit=crop" 
              alt="Students walking on campus" 
              priority="true"
              className="w-full rounded-[32px] shadow-2xl object-cover h-[400px]"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=60&w=1200&auto=format&fit=crop" 
              alt="Happy students collaborating" 
              loading="lazy"
              className="w-full rounded-[32px] shadow-xl object-cover h-[500px]"
            />
            <div className="absolute -bottom-8 -right-8 premium-card p-6 bg-white w-64 hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <h4 className="font-bold text-slate-900">Our Mission</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                To ignite a lifelong love of learning and empower students to become compassionate global citizens.
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2 space-y-8">
            <h3 className="text-3xl font-extrabold font-outfit text-slate-900">
              Our Journey
            </h3>
            <div className="space-y-6 text-base text-slate-600 leading-relaxed">
              <p>
                Founded on the belief that education should be holistic and deeply engaging, **The Readers International School** was established to provide a nurturing environment where children can truly thrive.
              </p>
              <p>
                Over the years, we have evolved into a premier international institution, seamlessly blending time-honored educational values with modern teaching methodologies. Our beautifully designed campus and dedicated faculty ensure that every student receives personalized attention and the space to grow academically, socially, and emotionally.
              </p>
              <p>
                We believe that learning is a joyful adventure. Whether in our vibrant classrooms, on the sports field, or through our extensive arts programs, we are committed to helping every child discover their unique brilliance.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold font-outfit text-slate-900">Our Core Pillars</h3>
            <p className="text-slate-600 text-lg">
              The foundational values that guide our educational approach and community culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-6">
                  <div className={`p-4 rounded-2xl w-fit ${v.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 font-outfit">{v.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Leadership Statements */}
        <section className="bg-blue-900 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2938&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {/* Chairman message */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-blue-300 font-bold">Message from the Chairman</span>
              <p className="text-xl md:text-2xl font-light leading-relaxed italic text-blue-50">
                "Education is the most powerful catalyst for change. Our goal is to provide a nurturing sanctuary where young minds are empowered to think critically, dream boundlessly, and lead with empathy."
              </p>
              <div>
                <h5 className="font-bold text-lg text-white">Dr. Zaya Hasan</h5>
                <p className="text-sm text-blue-300">Chairman, The Readers International</p>
              </div>
            </div>

            {/* Principal message */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-blue-300 font-bold">Academic Direction</span>
              <p className="text-xl md:text-2xl font-light leading-relaxed italic text-blue-50">
                "Every child is unique. Our dedicated educators work tirelessly to create personalized learning journeys, ensuring that each student feels supported, challenged, and inspired to reach their full potential."
              </p>
              <div>
                <h5 className="font-bold text-lg text-white">Prof. Elena Rostova</h5>
                <p className="text-sm text-blue-300">Executive Principal</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
