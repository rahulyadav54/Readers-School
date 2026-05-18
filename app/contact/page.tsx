"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <PublicHeader />

      <section className="pt-40 pb-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Contact Info (Left Side) */}
          <div className="w-full lg:w-5/12 space-y-10">
            <div className="space-y-4">
              <span className="inline-flex px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 font-bold uppercase tracking-wider text-xs">Get in Touch</span>
              <h1 className="text-5xl font-extrabold font-outfit text-slate-900 tracking-tight leading-tight">
                We'd love to <br/><span className="text-rose-600">hear from you.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you're a prospective parent, a community partner, or looking for career opportunities, our doors are always open.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Main Campus</h4>
                  <p className="text-slate-600">123 Academic Avenue, Knowledge City<br/>Rautahat District, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Phone Numbers</h4>
                  <p className="text-slate-600">Admissions: +977 123 456 7890<br/>General: +977 123 456 7891</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Email Addresses</h4>
                  <p className="text-slate-600">admissions@readersint.edu<br/>info@readersint.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Visiting Hours</h4>
                  <p className="text-slate-600">Monday - Friday: 08:00 AM - 04:00 PM<br/>Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-3xl font-bold font-outfit text-slate-900 mb-8">Send us a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Inquiry Type</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow text-slate-700">
                    <option>Admissions Inquiry</option>
                    <option>General Information</option>
                    <option>Career Opportunities</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-600/20">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
