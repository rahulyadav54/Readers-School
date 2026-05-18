"use client";

import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star, Quote, CheckCircle2, Trophy, BrainCircuit, Globe, Code, CalendarDays, MapPin } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Students Worldwide", value: "2000+", icon: Globe },
    { label: "Expert Teachers", value: "50+", icon: Star },
    { label: "Rautahat District", value: "No.1", icon: Trophy },
    { label: "AI-Powered", value: "Smart Learning", icon: BrainCircuit }
  ];

  const features = [
    { title: "Smart Classrooms", desc: "Interactive digital boards and ergonomic spaces designed for focus and creativity.", icon: BrainCircuit, color: "text-blue-600 bg-blue-50" },
    { title: "Expert Teachers", desc: "Globally trained educators dedicated to personalized mentorship.", icon: Star, color: "text-amber-600 bg-amber-50" },
    { title: "AI Learning", desc: "Advanced curriculums integrated with AI tools to prepare students for the future.", icon: Code, color: "text-purple-600 bg-purple-50" },
    { title: "Sports & Activities", desc: "World-class athletic facilities fostering teamwork and physical excellence.", icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
    { title: "Innovation Labs", desc: "State-of-the-art robotics and science labs for hands-on experimentation.", icon: BrainCircuit, color: "text-rose-600 bg-rose-50" },
    { title: "Student Development", desc: "Holistic programs focusing on leadership, ethics, and emotional intelligence.", icon: CheckCircle2, color: "text-cyan-600 bg-cyan-50" }
  ];

  const campusLifeImages = [
    "/gallary/red%20house.jpg",
    "/gallary/game%20team.jpg",
    "/gallary/batch.jpg",
    "/gallary/cycle%20race%20game.jpg"
  ];

  const events = [
    { title: "Annual Science Fair", date: "Oct 15, 2026", location: "Main Campus Hall", image: "/gallary/award2.jpg" },
    { title: "Global Cultural Fest", date: "Nov 02, 2026", location: "Open Amphitheater", image: "/gallary/sarswatipuja.jpg" },
    { title: "Tech & Robotics Expo", date: "Dec 10, 2026", location: "Innovation Lab", image: "/gallary/student1.jpg" }
  ];

  const testimonials = [
    {
      text: "The Readers International School completely transformed our daughter's confidence. The teachers truly care about her emotional and academic growth.",
      author: "Rubi Jaiswal",
      role: "Parent of Grade 8 Student",
      avatar: "https://i.pravatar.cc/150?u=rubi"
    },
    {
      text: "I've never seen a school so dedicated to holistic development. The campus facilities are world-class, and the community is incredibly welcoming.",
      author: "Ram Lakhan Yadav",
      role: "Parent of Grade 5 Student",
      avatar: "https://i.pravatar.cc/150?u=ram"
    },
    {
      text: "The diverse international community here prepares students for the real world. My son is thriving and excited to go to school every day.",
      author: "Pratima Sah",
      role: "Parent of Grade 10 Student",
      avatar: "https://i.pravatar.cc/150?u=pratima"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white selection:bg-blue-200">
      <PublicHeader />

      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[55%] space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-sm font-bold text-blue-800 tracking-wide uppercase">Admissions Open 2026-27</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-outfit">
              Inspiring Future <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Innovators</span> & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400">Global Leaders.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 font-medium max-w-xl leading-relaxed">
              A modern international school empowering students through academics, creativity, AI, leadership, and innovation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/admissions" className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg shadow-xl shadow-blue-700/20 transition-all hover:-translate-y-1 text-center">
                Apply Now
              </Link>
              <Link href="/about" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-lg transition-all flex items-center justify-center gap-2 group">
                <PlayCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" /> Explore Campus
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Visual & Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-[45%] relative"
          >
            <div className="relative rounded-full overflow-hidden shadow-2xl shadow-blue-900/10 aspect-square w-full max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-blue-900/5 z-10 mix-blend-overlay"></div>
              <img 
                src="/logo.jpeg" 
                alt="TRIS Logo" 
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>

            {/* Floating Card 1: Excellence */}
            <div className="absolute top-10 -left-8 md:-left-16 lg:-left-12 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 animate-float hidden sm:flex">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Academic Excellence</p>
                <p className="text-xs text-slate-500">Best education for all</p>
              </div>
            </div>

            {/* Floating Card 2: Holistic */}
            <div className="absolute bottom-24 -right-4 md:-right-12 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 animate-float hidden sm:flex" style={{ animationDelay: '1.5s' }}>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Holistic Growth</p>
                <p className="text-xs text-slate-500">Mind, body & personality</p>
              </div>
            </div>

            {/* Floating Card 3: Global */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 lg:-right-12 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 animate-float hidden lg:flex" style={{ animationDelay: '0.7s' }}>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Global Citizens</p>
                <p className="text-xs text-slate-500">Empowering leaders</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-10 lg:-mt-16 mb-24">
        <div className="bg-white p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100 rounded-[32px] shadow-2xl shadow-slate-900/5 border border-slate-100">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center px-2 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-outfit mb-1">{stat.value}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* 2.5 HERITAGE SECTION */}
      <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-slate-900 leading-tight">
              The Readers International School
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-medium">
              Since its establishment in <span className="font-bold text-blue-700">2073 B.S. (2016 A.D)</span>, TRIS has secured a formidable place among scholars and guardians with its dedication to the highest educational standards. TRIS is fully engaged in the communities in which it is located through unique academic approaches and various social responsibilities.
            </p>
          </div>
          
          <div className="relative rounded-[24px] overflow-hidden shadow-xl border border-slate-100 bg-white p-2 max-w-4xl mx-auto w-full">
             <img 
               src="/COVER/School.jpg" 
               alt="TRIS Students Group Photo" 
               className="w-full h-auto block rounded-[16px]"
             />
          </div>
        </div>
      </section>


      {/* 3. WHY CHOOSE US */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-blue-700 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-outfit">A World-Class Education Ecosystem</h2>
            <p className="text-lg text-slate-600">
              We provide an unparalleled environment where tradition meets innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-lg shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SMART LEARNING (Unique Identity) */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold tracking-wider text-xs uppercase border border-blue-400/20">
              <BrainCircuit className="w-4 h-4" /> The Readers Advantage
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-outfit leading-tight">
              Pioneering <span className="text-blue-400">AI-Powered</span> Smart Learning.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              We are not just a school; we are an innovation hub. Our campus is fully integrated with digital classrooms, AI-assisted personalized learning paths, and hands-on robotics education starting from primary years.
            </p>
            <ul className="space-y-4">
              {["Interactive Digital Classrooms", "Personalized Smart Exams", "Robotics & Coding Curriculum"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/academics" className="inline-flex items-center gap-2 text-white font-bold bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full transition-colors group">
                Explore Curriculum <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <img 
              src="/gallary/mam.jpg" 
              alt="Smart Learning Session at TRIS" 
              loading="lazy"
              className="w-full rounded-[32px] shadow-2xl shadow-black/50"
            />
          </div>
        </div>
      </section>

      {/* 5. CAMPUS LIFE (Masonry style layout) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-outfit">Vibrant Campus Life</h2>
              <p className="text-lg text-slate-600">
                Beyond academics, students discover their passions in sports, arts, and innovation labs.
              </p>
            </div>
            <Link href="/student-life" className="shrink-0 font-bold text-blue-700 hover:text-blue-800 flex items-center gap-2">
              View All Activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="lg:col-span-2 lg:row-span-2 rounded-[32px] overflow-hidden group relative">
              <img src={campusLifeImages[0]} alt="Activity" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold text-white font-outfit">Science & Innovation</h3>
              </div>
            </div>
            <div className="rounded-[32px] overflow-hidden group relative">
              <img src={campusLifeImages[1]} alt="Activity" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white font-outfit">Sports & Athletics</h3>
              </div>
            </div>
            <div className="rounded-[32px] overflow-hidden group relative">
              <img src={campusLifeImages[2]} alt="Activity" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white font-outfit">Arts & Culture</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EVENTS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-outfit">Upcoming Events</h2>
            <p className="text-lg text-slate-600">
              Be a part of our dynamic community. Mark your calendars for these exciting events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt, idx) => (
              <div key={idx} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-48 overflow-hidden">
                  <img src={evt.image} alt={evt.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 font-outfit">{evt.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" /> {evt.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600" /> {evt.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIAL SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-outfit">Trusted by Families</h2>
            <p className="text-lg text-slate-600">
              The true measure of our success is the happiness and growth of our students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-50" />
                <p className="text-slate-700 leading-relaxed italic relative z-10 mb-8 font-medium">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <img src={t.avatar} alt={t.author} loading="lazy" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.author}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ADMISSION CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-800 to-indigo-900 rounded-[40px] overflow-hidden relative shadow-2xl shadow-blue-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="space-y-4 max-w-xl">
              <span className="text-blue-300 font-bold uppercase tracking-wider text-sm">Join Our Community</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white font-outfit leading-tight">Begin your child's journey to excellence.</h2>
              <p className="text-blue-100 text-lg">
                Admissions for the upcoming academic year are now open. Secure your child's future at the region's finest international school.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link href="/admissions" className="px-8 py-4 rounded-full bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                Apply Today <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
