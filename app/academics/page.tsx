"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { ArrowRight, BookOpen, BrainCircuit, Globe, Code, Microscope, MonitorPlay } from "lucide-react";
import Link from "next/link";

export default function AcademicsPage() {
  const programs = [
    {
      title: "Early Years",
      age: "Ages 3 - 5",
      desc: "Laying the foundation for lifelong learning through play, exploration, and emotional intelligence development.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=60&w=1200&auto=format&fit=crop",
      features: ["Play-based learning", "Emotional literacy", "Creative arts"]
    },
    {
      title: "Primary School",
      age: "Ages 6 - 11",
      desc: "A rigorous core curriculum balanced with hands-on projects, fostering curiosity and critical thinking skills.",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=60&w=1200&auto=format&fit=crop",
      features: ["Core mathematics", "Language mastery", "Introductory coding"]
    },
    {
      title: "Middle School",
      age: "Ages 12 - 14",
      desc: "Guiding students through early adolescence with complex subjects, debate, and advanced technological integration.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=60&w=1200&auto=format&fit=crop",
      features: ["Advanced Sciences", "Robotics integration", "Global perspectives"]
    },
    {
      title: "High School & Prep",
      age: "Ages 15 - 18",
      desc: "Intensive university preparation, leadership training, and specialization in STEAM and Humanities.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=60&w=1200&auto=format&fit=crop",
      features: ["University placement", "AP / IB courses", "Leadership roles"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=60&w=1600&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-300 font-bold uppercase tracking-wider text-xs border border-blue-500/20">
            Curriculum & Programs
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit tracking-tight">
            Academic <span className="text-blue-400">Excellence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A world-class curriculum designed to nurture intellectual curiosity, critical thinking, and a lifelong passion for discovery.
          </p>
        </div>
      </section>

      {/* Philosophy Split Section */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=60&w=1200&auto=format&fit=crop" 
              alt="Science Lab" 
              className="w-full rounded-[40px] shadow-2xl object-cover h-[500px]"
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
              <Microscope className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2">Hands-on Learning</h3>
              <p className="text-sm text-slate-600">Theory meets practice in our state-of-the-art laboratories and creative studios.</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900 leading-tight">
              A modern approach to traditional rigor.
            </h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Our academic framework is built on the philosophy that every child learns differently. We combine internationally recognized standards with innovative teaching methodologies.
              </p>
              <p>
                From interactive digital whiteboards to personalized AI-assisted study paths, we ensure that students are not just memorizing facts, but deeply understanding concepts and learning how to apply them to real-world challenges.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900">Global Standards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900">Tech-Integrated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Academic Journey - Alternating Layouts */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900">The Learning Journey</h2>
            <p className="text-xl text-slate-600">Explore our structured pathways from early childhood to university preparation.</p>
          </div>

          <div className="space-y-24">
            {programs.map((program, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                <div className="w-full lg:w-1/2">
                  <div className="relative group overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200">
                    <img src={program.image} alt={program.title} loading="lazy" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold tracking-widest text-xs uppercase">
                    {program.age}
                  </span>
                  <h3 className="text-4xl font-extrabold font-outfit text-slate-900">{program.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{program.desc}</p>
                  <ul className="space-y-3 pt-4">
                    {program.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="font-bold text-slate-800">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech & Future Ready CTA */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold font-outfit tracking-tight">Ready to shape the future?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover how our innovative curriculum prepares students for the challenges and opportunities of tomorrow.
          </p>
          <div className="flex justify-center gap-4 pt-8">
            <Link href="/admissions" className="px-8 py-4 rounded-full bg-white text-blue-900 font-bold text-lg hover:scale-105 transition-transform shadow-xl">
              Apply Now
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg transition-colors border border-blue-500">
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
