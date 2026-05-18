"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Globe, BookOpen, Star, Sparkles, Mail } from "lucide-react";

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
              src="/gallary/award.jpg" 
              alt="Awards Ceremony at TRIS" 
              fetchPriority="high"
              className="w-full rounded-[32px] shadow-2xl object-cover h-[400px]"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* Mission & Vision Section */}
        <section className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Mission Text */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-sm border border-blue-100">
                <Star className="w-5 h-5" /> Our Mission
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900 leading-tight">
                Nurturing Hidden Talents to Fruition
              </h3>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  TRIS is a unique and noble academic institution dedicated to providing a healthy environment with a students' friendly atmosphere. Our mission is to provide the best academic environment with all the modern teaching and learning facilities which is required to nurture students' hidden talents and bring them to fruition through constant guidance and supervision. Discipline, constructivism, and studiousness with integrated personality development is what we nurture in our students.
                </p>
                <p>
                  We have a motive to establish TRIS as a multidisciplinary educational network and develop it as a center for excellence. For Readerians, the sky is not the limit; we would love to see this institution turning out to be a university in the decades to come.
                </p>
                <p>
                  With the exponential expenses in the field of private schools of Nepal, TRIS will always advocate the slogan of best education for all. We are also working hard to ensure the possibility of best education at this place and trying hard to reduce the migration of people to the capital city in the pursuit of best academic facilities.
                </p>
                <p>
                  Thus, intellectually and morally equipped students graduating out of TRIS will be in an enviable position to take any challenges, be it the pursuit of higher studies abroad or the career goals that life might throw up.
                </p>
              </div>
            </div>

            {/* Vision Image & Card */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="relative">
                <img 
                  src="/gallary/red%20house.jpg" 
                  alt="Students at TRIS Assembly" 
                  loading="lazy"
                  className="w-full rounded-[32px] shadow-2xl object-cover h-[500px]"
                />
                
                {/* Desktop Vision Card */}
                <div className="absolute bottom-8 -left-8 xl:-left-16 premium-card p-8 bg-white max-w-sm rounded-3xl shadow-2xl border border-slate-100 hidden sm:block">
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-bold uppercase tracking-wider text-xs border border-amber-100 mb-4">
                    <Sparkles className="w-4 h-4" /> Our Vision
                  </div>
                  <h4 className="font-bold text-slate-900 text-xl font-outfit mb-3">Empowering Leaders</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    The vision of The Readers International School is to foster a nurturing and dynamic learning environment where students are empowered to become critical thinkers, compassionate leaders, and lifelong learners. Through innovative teaching methods and a commitment to holistic development, the school aims to inspire each student to achieve academic excellence while embracing global citizenship and ethical responsibility.
                  </p>
                </div>
              </div>

              {/* Mobile Vision Card (shows only on very small screens where absolute positioning breaks) */}
              <div className="block sm:hidden bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-lg">
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white text-amber-700 font-bold uppercase tracking-wider text-xs border border-amber-200 mb-4">
                    <Sparkles className="w-4 h-4" /> Our Vision
                  </div>
                  <h4 className="font-bold text-amber-900 text-xl font-outfit mb-3">Empowering Leaders</h4>
                  <p className="text-sm text-amber-800 leading-relaxed font-medium">
                    The vision of The Readers International School is to foster a nurturing and dynamic learning environment where students are empowered to become critical thinkers, compassionate leaders, and lifelong learners. Through innovative teaching methods and a commitment to holistic development, the school aims to inspire each student to achieve academic excellence while embracing global citizenship and ethical responsibility.
                  </p>
              </div>
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

        {/* Leadership & Team */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold font-outfit text-slate-900">Our Leadership & Team</h3>
            <p className="text-slate-600 text-lg">
              Meet the dedicated professionals who guide our vision and support our students every day.
            </p>
          </div>

          {/* Principal */}
          <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row mb-12">
            <div className="w-full md:w-2/5">
              <img 
                src="/FOUNDER/Digamber%20Yadav.png" 
                alt="Digamber Yadav" 
                loading="lazy"
                className="w-full h-full object-cover min-h-[300px]"
              />
            </div>
            <div className="w-full md:w-3/5 p-10 lg:p-16 flex flex-col justify-center space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Principal & Head of School</span>
              <h4 className="text-3xl font-extrabold font-outfit text-slate-900">Digamber Yadav</h4>
              <p className="text-slate-600 leading-relaxed text-lg">
                With over two decades of global educational leadership, Mr. Digamber Yadav believes in cultivating an environment where academic rigor meets profound emotional intelligence. His vision drives the innovative curriculum and student-centric programs at The Readers International School.
              </p>
              <div className="flex items-center gap-3 pt-4">
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"><Globe className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Team of 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Satish Kumar Jha", role: "HOD Science", phone: "+977 9802933724", image: "/FOUNDER/Satish%20Kumar%20Jha.png" },
              { name: "Arjun Giree", role: "HOD English", phone: "+977 9802933722", image: "/FOUNDER/Arjun%20Giree.png" },
              { name: "Anil Kumar Yadav", role: "HOD ECA Department", phone: "+977 9802933721", image: "/FOUNDER/Anil%20Kumar%20Yadav.png" },
              { name: "Nandu Yadav", role: "Founder", phone: "+977 9851162005", image: "/FOUNDER/Nandu%20Yadav.png" }
            ].map((member, idx) => (
              <div key={idx} className="bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center space-y-4">
                  <div>
                    <h5 className="font-bold text-lg font-outfit text-slate-900">{member.name}</h5>
                    <p className="text-blue-600 font-medium text-sm mt-1 uppercase tracking-wider">{member.role}</p>
                    {member.phone && <p className="text-slate-600 font-medium mt-1 text-sm">{member.phone}</p>}
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><Mail className="w-3 h-3" /></button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><Globe className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Administration & Management Team */}
        <section className="space-y-12 pt-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold font-outfit text-slate-900">Administration & Management Team</h3>
            <p className="text-slate-600 text-lg">
              The operational backbone of The Readers School, ensuring smooth everyday coordination, support, and professional standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: "Sudeep Shrestha", 
                role: "Co-ordinator", 
                phone: "+977 9845856547", 
                image: "/management/Sudeep%20Shrestha.png" 
              },
              { 
                name: "Shambhu Yadav", 
                role: "Accountant", 
                phone: "+977 9802933728", 
                image: "/management/Shambhu%20Yadav.png" 
              },
              { 
                name: "Amrita Thakur", 
                role: "Receptionist", 
                phone: "", 
                image: "/management/Amrita%20Thakur.png" 
              }
            ].map((member, idx) => (
              <div key={idx} className="bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center space-y-4">
                  <div>
                    <h5 className="font-bold text-lg font-outfit text-slate-900">{member.name}</h5>
                    <p className="text-blue-600 font-medium text-sm mt-1 uppercase tracking-wider">{member.role}</p>
                    {member.phone && <p className="text-slate-600 font-medium mt-1 text-sm">{member.phone}</p>}
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><Mail className="w-3 h-3" /></button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"><Globe className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Statements */}
        <section className="bg-blue-900 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2938&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <span className="text-xs uppercase tracking-widest text-blue-300 font-bold">Message from the Principal</span>
            <p className="text-xl md:text-3xl font-light leading-relaxed italic text-blue-50">
              "Education is the most powerful catalyst for change. At The Readers International School, we work tirelessly to create personalized learning journeys, ensuring that each student feels supported, challenged, and inspired to reach their full potential."
            </p>
            <div className="pt-4">
              <h5 className="font-bold text-2xl text-white font-outfit">Digamber Yadav</h5>
              <p className="text-sm text-blue-300 mt-1">Principal & Head of School</p>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
