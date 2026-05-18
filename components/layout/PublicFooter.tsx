"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Globe, MessageSquare, BookOpen, Send } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-outfit text-white tracking-tight">The Readers Int.</h2>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Inspiring global minds through an unparalleled blend of academic rigor, emotional intelligence, and technological innovation.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1"><Globe className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1"><MessageSquare className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-outfit">Explore Campus</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Our Heritage</Link></li>
              <li><Link href="/academics" className="hover:text-blue-400 transition-colors">Academic Excellence</Link></li>
              <li><Link href="/student-life" className="hover:text-blue-400 transition-colors">Vibrant Student Life</Link></li>
              <li><Link href="/admissions" className="hover:text-blue-400 transition-colors">Admissions Portal</Link></li>
              <li><Link href="/events" className="hover:text-blue-400 transition-colors">Events & Calendar</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-outfit">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>123 Academic Avenue,<br />Rautahat District, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+977 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>admissions@readersint.edu</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Map Placeholder */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg mb-2 font-outfit">Stay Updated</h3>
            <p className="text-sm text-slate-400">Subscribe to our monthly newsletter for campus updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-r-xl transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="w-full h-24 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative group cursor-pointer mt-4">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1.5 rounded-full backdrop-blur-sm">View on Map</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} The Readers International School. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
