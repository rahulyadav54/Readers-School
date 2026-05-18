"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Shield, Eye, Lock, FileText, UserCheck, HelpCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Eye,
      content: "We collect personal information necessary to deliver our academic services. This includes student names, guardian details, contact numbers (including our primary records for +977 9802933719), academic history, attendance data, and portal authentication details."
    },
    {
      title: "2. How We Use Your Data",
      icon: UserCheck,
      content: "Your information is used solely to manage school enrollment, track academic progress, process admissions applications, facilitate teacher-parent communication, and secure dashboard access for parents, students, and educators."
    },
    {
      title: "3. Data Protection and Security",
      icon: Lock,
      content: "We implement advanced server-side encryption and access controls. Student profiles and academic grades are strictly confidential and only visible to authorized faculty and verified guardians through secure login credentials."
    },
    {
      title: "4. Cookies and Web Analytics",
      icon: Shield,
      content: "Our website uses essential session cookies to keep you logged into the digital portal and track performance stats to ensure responsive page loads across small and large screens alike."
    },
    {
      title: "5. Information Sharing Policies",
      icon: FileText,
      content: "The Readers School does not sell, lease, or distribute student or parent personal data to third-party marketing companies. Data is only shared under compliance with Nepal's national education regulatory frameworks."
    },
    {
      title: "6. Contact Our Compliance Office",
      icon: HelpCircle,
      content: "If you have any questions regarding data access, corrections, or general system security, please reach out to our administration team at Garuda-4, Rautahat, Nepal, or email us at thereadersschool2073@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Header Banner */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-br from-blue-900 to-indigo-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold uppercase tracking-wider text-xs">Security & Trust</span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit tracking-tight">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Learn how we handle, safeguard, and secure student and guardian information at The Readers School.
          </p>
        </div>
      </section>

      {/* Policy Details */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-grow">
        <div className="space-y-12">
          <div className="prose prose-slate max-w-none text-center mb-16">
            <h2 className="text-2xl font-bold font-outfit text-slate-900">Our Commitment to Student Privacy</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              At The Readers School, the privacy of our academic family is paramount. This policy outlines the direct guidelines governing data storage, security protocols, and usage across our online portal and administrative databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl transition-shadow duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-outfit text-slate-900">{sec.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{sec.content}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100 text-center space-y-6 mt-16">
            <h4 className="text-xl font-bold font-outfit text-blue-900">Need Immediate Privacy Support?</h4>
            <p className="text-blue-700 max-w-xl mx-auto text-sm leading-relaxed">
              Our system administrators are always ready to help you manage student profile access or answer digital portal queries.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-2">
              <a href="mailto:thereadersschool2073@gmail.com" className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                Email Administration
              </a>
              <a href="tel:+9779802933719" className="px-6 py-2.5 bg-white text-blue-800 rounded-full text-sm font-semibold hover:bg-slate-100 border border-blue-200 transition-colors">
                Call +977 9802933719
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
