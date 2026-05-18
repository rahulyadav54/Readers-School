"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      title: "Annual Science & Innovation Fair",
      date: "October 15, 2026",
      time: "09:00 AM - 04:00 PM",
      location: "Main Campus Exhibition Hall",
      image: "/gallary/award2.jpg",
      desc: "Join us as our students present groundbreaking robotics, AI, and environmental science projects.",
      featured: true
    },
    {
      title: "Global Cultural Fest",
      date: "November 02, 2026",
      time: "10:00 AM - 06:00 PM",
      location: "Open Amphitheater",
      image: "/gallary/sarswatipuja.jpg",
      desc: "A vibrant celebration of cultural harmony represented at our school through food, music, and art.",
      featured: false
    },
    {
      title: "Tech & Robotics Expo",
      date: "December 10, 2026",
      time: "11:00 AM - 03:00 PM",
      location: "Innovation Lab",
      image: "/gallary/student1.jpg",
      desc: "Interactive demonstrations of student-built autonomous robots and coding projects.",
      featured: false
    },
    {
      title: "Winter Concert Series",
      date: "December 18, 2026",
      time: "06:00 PM - 08:30 PM",
      location: "Grand Auditorium",
      image: "/gallary/bidai%202082.jpg",
      desc: "An enchanting evening of classical and contemporary music performed by the student orchestra.",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-xs">Calendar & Events</span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit text-slate-900 tracking-tight">
            Campus <span className="text-blue-600">Happenings.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay engaged with our dynamic school community. From academic exhibitions to cultural celebrations, there is always something exciting happening.
          </p>
        </div>
      </section>

      {/* Featured Event */}
      {events.filter(e => e.featured).map((evt, idx) => (
        <section key={idx} className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-8">Featured Event</h2>
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
              <div className="w-full lg:w-1/2">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover min-h-[400px]" />
              </div>
              <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-6">
                <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-slate-900">{evt.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{evt.desc}</p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><CalendarDays className="w-5 h-5" /></div>
                    {evt.date}
                  </div>
                  <div className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Clock className="w-5 h-5" /></div>
                    {evt.time}
                  </div>
                  <div className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><MapPin className="w-5 h-5" /></div>
                    {evt.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Upcoming Events Grid */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold font-outfit text-slate-900">Upcoming Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.filter(e => !e.featured).map((evt, idx) => (
              <div key={idx} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-56 overflow-hidden relative">
                  <img src={evt.image} alt={evt.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold text-slate-900 shadow-lg">
                    {evt.date.split(',')[0]}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit leading-tight">{evt.title}</h3>
                  <p className="text-slate-600 text-base">{evt.desc}</p>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <Clock className="w-4 h-4 text-blue-600" /> {evt.time}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <MapPin className="w-4 h-4 text-rose-600" /> {evt.location}
                    </div>
                  </div>
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
