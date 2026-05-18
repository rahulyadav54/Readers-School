"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useState } from "react";
import { HelpCircle, ChevronRight, User, Mail, Phone, Book, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdmissionsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Inquiry form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("Grade 6");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [
    { title: "Step 1: Submission", desc: "Submit an online admission inquiry form using our secure portal gateway." },
    { title: "Step 2: Assessment", desc: "Our academic team schedules an immersive assessment of the candidate's logic skills." },
    { title: "Step 3: Verification", desc: "Admin reviews credentials, verifies documents, and provisions credentials." }
  ];

  const faqs = [
    { q: "What is the minimum age eligibility?", a: "For Grade 1, the candidate must be at least 5 years and 6 months of age as of June 1st of the academic year." },
    { q: "What documents are required?", a: "Original birth certificate, previous school academic report records, transfer certificate, passport-sized photos, and immunization records." },
    { q: "How long does the selection take?", a: "The administrative assessment and profile provisioning is typically completed within 5-7 business days." }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">ADMISSION DOOR</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Join Our Global Scholars</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Our admission process is transparent, secure, and fully guided. Review eligibility steps or submit a direct inquiry.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-foreground/5 bg-white/[0.01] space-y-3">
              <span className="inline-flex px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[8px] font-bold">STAGE - 0{idx + 1}</span>
              <h3 className="font-bold text-xs">{s.title}</h3>
              <p className="text-[11px] text-foreground/50 leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Form and Eligibility Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Inquiry form */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/25 bg-indigo-500/[0.01] space-y-6">
            <div>
              <h3 className="font-bold font-outfit text-sm">Admissions Inquiry Station</h3>
              <p className="text-[10px] text-foreground/50 mt-0.5">Submit parent inquiry to register interest.</p>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 space-y-2 text-center">
                <h4 className="font-bold">Inquiry Registered!</h4>
                <p className="text-[10px] leading-relaxed">Our Admissions Counselor will contact you on your registered credentials shortly.</p>
                <button onClick={() => setSuccess(false)} className="text-[9px] underline font-bold mt-2 cursor-pointer">Register Another Inquiry</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Parent Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Richard Chen"
                      className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765..."
                        className="glass-input pl-9 pr-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Grade Applied</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="glass-input px-3 py-2.5 rounded-lg w-full text-xs font-sans text-foreground cursor-pointer"
                    >
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 11">Grade 11</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Register Admission Inquiry
                </button>
              </form>
            )}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Frequently Answered Queries</h3>
            <div className="space-y-3 font-semibold">
              {faqs.map((f, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="glass-panel rounded-xl border border-foreground/5 bg-white/[0.01] overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-xs font-bold text-foreground/90 font-outfit flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        {f.q}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-foreground/45 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="p-4 pt-0 border-t border-foreground/5 text-[11px] text-foreground/50 leading-relaxed bg-white/[0.005]">
                            {f.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
