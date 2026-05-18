"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { FileText, ShieldAlert, Award, User, HelpCircle, CheckCircle } from "lucide-react";

export default function TermsOfUsePage() {
  const terms = [
    {
      title: "1. Portal Account Security",
      icon: User,
      content: "All authorized users (students, parents, and teachers) are responsible for maintaining the confidentiality of their portal passwords. You must immediately notify school administration of any unauthorized account access."
    },
    {
      title: "2. Academic Guidelines & Ethics",
      icon: Award,
      content: "The online homework submissions, online assignments, quizzes, and digital grades portal must represent authentic student work. Cheating, plagiarism, or unauthorized sharing of academic files is strictly prohibited under our honor code."
    },
    {
      title: "3. Acceptable Use Policy",
      icon: ShieldAlert,
      content: "Users may not use our networks or student-teacher communication channels to transmit harmful, discriminatory, or unlawful content. Harassment of school staff or peers will lead to immediate account suspension."
    },
    {
      title: "4. Intellectual Property Rights",
      icon: FileText,
      content: "All educational worksheets, course syllabi, campus videos, school logos, and software code on this website belong exclusively to The Readers School. Materials may only be downloaded for personal educational purposes."
    },
    {
      title: "5. Digital Service Availability",
      icon: CheckCircle,
      content: "We strive to maintain 99.9% uptime for online class dashboards and resources. However, access may be temporarily limited due to server updates. The school is not liable for data delivery delays outside our server controls."
    },
    {
      title: "6. Agreement and Governing Law",
      icon: HelpCircle,
      content: "These terms of use are governed by the education acts and digital laws of Nepal. If you have any inquiries about user rules, contact us directly at Garuda-4, Rautahat, or via thereadersschool2073@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <PublicHeader />

      {/* Header Banner */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-br from-indigo-950 to-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold uppercase tracking-wider text-xs">User Guidelines</span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit tracking-tight">Terms of Use</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Please read the legal terms, user conditions, and portal access policies for The Readers School website.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-grow">
        <div className="space-y-12">
          <div className="prose prose-slate max-w-none text-center mb-16">
            <h2 className="text-2xl font-bold font-outfit text-slate-900">Portal Usage Agreement</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              By accessing any section of The Readers School website or signing into our parent, teacher, or student dashboard services, you agree to comply with the following ethical and legal guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {terms.map((term, idx) => {
              const Icon = term.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl transition-shadow duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-outfit text-slate-900">{term.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{term.content}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-100 rounded-3xl p-8 md:p-10 border border-slate-200 text-center space-y-6 mt-16">
            <h4 className="text-xl font-bold font-outfit text-slate-900">Questions About Our Terms?</h4>
            <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
              If you have any questions or seek administrative permissions to reuse any media, please call us directly or drop us an email.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-2">
              <a href="mailto:thereadersschool2073@gmail.com" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md">
                Email Administration
              </a>
              <a href="tel:+9779802933719" className="px-6 py-2.5 bg-white text-slate-800 rounded-full text-sm font-semibold hover:bg-slate-50 border border-slate-300 transition-colors">
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
