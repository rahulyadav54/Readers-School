"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Mail, Linkedin } from "lucide-react";

export default function StaffPage() {
  const leadership = [
    {
      name: "Dr. Eleanor Vance",
      role: "Principal & Head of School",
      bio: "With over 20 years of experience in international education, Dr. Vance leads the school with a vision of academic excellence and emotional intelligence.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=60&w=600&auto=format&fit=crop"
    },
    {
      name: "Marcus Chen",
      role: "Vice Principal, Academics",
      bio: "A former university professor, Marcus ensures our curriculum remains at the cutting edge of technological and global standards.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=60&w=600&auto=format&fit=crop"
    }
  ];

  const teachers = [
    { name: "Sarah Jenkins", role: "Head of Sciences", subject: "Physics & Chemistry", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=60&w=400&auto=format&fit=crop" },
    { name: "David Alaba", role: "Head of Humanities", subject: "History & Geography", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=60&w=400&auto=format&fit=crop" },
    { name: "Elena Rodriguez", role: "Early Years Coordinator", subject: "Primary Education", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=60&w=400&auto=format&fit=crop" },
    { name: "James Wilson", role: "Director of Athletics", subject: "Physical Education", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=60&w=400&auto=format&fit=crop" },
    { name: "Amira Hassan", role: "Technology Integrationist", subject: "Computer Science", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=60&w=400&auto=format&fit=crop" },
    { name: "Michael Chang", role: "Head of Arts", subject: "Fine Arts & Music", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=400&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider text-xs">Our Faculty</span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit text-slate-900 tracking-tight">
            Meet our <span className="text-indigo-600">Educators.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our faculty consists of globally trained, passionate experts dedicated to shaping the next generation of leaders and innovators.
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold font-outfit text-slate-900 border-b border-slate-200 pb-4">School Leadership</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leadership.map((leader, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                <img src={leader.image} loading="lazy" alt={leader.name} className="w-32 h-32 rounded-full object-cover shrink-0 shadow-lg" />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold font-outfit text-slate-900">{leader.name}</h3>
                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mt-1">{leader.role}</p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{leader.bio}</p>
                  <div className="flex justify-center sm:justify-start gap-3 pt-2">
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Faculty Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold font-outfit text-slate-900 border-b border-slate-200 pb-4">Teaching Faculty</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, idx) => (
              <div key={idx} className="group bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center pb-8">
                <div className="w-full h-64 overflow-hidden mb-6 relative">
                  <img src={teacher.image} loading="lazy" alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"><Mail className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"><Linkedin className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
                <div className="px-6 space-y-1">
                  <h3 className="text-xl font-bold font-outfit text-slate-900">{teacher.name}</h3>
                  <p className="text-indigo-600 font-bold text-sm">{teacher.role}</p>
                  <p className="text-slate-500 text-sm pt-2">{teacher.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
