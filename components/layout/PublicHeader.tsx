"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Admissions", href: "/admissions" },
    { name: "Campus Life", href: "/student-life" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-slate-200/50 shadow-sm py-4" 
          : "bg-white border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-900/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-outfit text-slate-900 tracking-tight">
              The Readers <span className="text-blue-700">International</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-0.5">
              Inspiring Global Minds
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative text-sm font-bold tracking-wide transition-colors hover:text-blue-700 group py-2 ${
                  isActive ? "text-blue-700" : "text-slate-600"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-700 transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link 
            href="/auth/login" 
            className="text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors"
          >
            Portal Login
          </Link>
          <Link 
            href="/admissions" 
            className="px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xl shadow-blue-700/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl lg:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-blue-700 py-2 border-b border-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-4">
                <Link 
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Portal Login
                </Link>
                <Link 
                  href="/admissions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-lg shadow-blue-700/20 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
