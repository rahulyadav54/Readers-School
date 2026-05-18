"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { CheckCircle2, ChevronRight, FileText, Users, CalendarCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
  const steps = [
    { title: "Campus Tour & Inquiry", desc: "Visit our beautiful campus and speak with our admissions counselors.", icon: Users },
    { title: "Application Submission", desc: "Complete the online application form with required academic documents.", icon: FileText },
    { title: "Assessment & Interview", desc: "A brief, friendly assessment to understand your child's learning needs.", icon: HelpCircle },
    { title: "Enrollment & Welcome", desc: "Receive your offer letter and join The Readers community!", icon: CalendarCheck }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 px-6 bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="inline-flex px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider text-xs">Admissions 2026-27</span>
            <h1 className="text-5xl md:text-7xl font-extrabold font-outfit text-slate-900 tracking-tight leading-[1.1]">
              Join a community of <span className="text-emerald-600">Excellence.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              We are seeking curious, motivated, and kind students who are ready to embrace world-class education. Start your journey with us today.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <Link href="/auth/signup" className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1">
                Start Application
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <img
              src="/gallary/batch.jpg"
              alt="The Readers International School Students Batch"
              className="w-full rounded-[40px] shadow-2xl object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900">A Seamless Admission Process</h2>
            <p className="text-xl text-slate-600">We ensure a smooth, transparent, and supportive enrollment journey for every family.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative z-10 bg-white border border-slate-100 p-8 rounded-[32px] shadow-lg shadow-slate-200/50 hover:-translate-y-2 transition-transform text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step 0{idx + 1}</span>
                  <h3 className="text-xl font-bold font-outfit text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Criteria & FAQ block */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[40px] mx-6 lg:mx-12 my-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2938&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold font-outfit">Who are we looking for?</h2>
            <p className="text-lg text-slate-300">
              We value diversity, creativity, and a positive attitude. Our admissions committee looks for students who will actively contribute to our vibrant community.
            </p>
            <ul className="space-y-4">
              {["Passion for learning and discovery", "Strong ethical values and kindness", "Willingness to participate in sports and arts", "Collaborative team players"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span className="text-lg text-white font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 p-10 rounded-[32px] backdrop-blur-md border border-white/10">
            <h3 className="text-2xl font-bold font-outfit mb-6">Have questions?</h3>
            <p className="text-slate-300 mb-8">Our admissions team is here to help you every step of the way. Schedule a call or drop us an email.</p>
            <Link href="/contact" className="w-full flex items-center justify-between p-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Contact Admissions Team <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
