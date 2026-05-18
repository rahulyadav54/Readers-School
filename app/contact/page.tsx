"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMsg("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-grid font-sans text-xs relative overflow-hidden">
      <PublicHeader />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 relative">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-bold uppercase tracking-wider text-[8px]">CONTACT GATE</span>
          <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">Establish Communication Channels</h2>
          <p className="text-xs text-foreground/60 max-w-xl mx-auto">
            Directly communicate with academic registrars, administrative trustees, or developers from ZAYA CODE HUB.
          </p>
        </div>

        {/* Contact info and Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Roster & Info details */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-foreground/5 bg-white/[0.01] space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">School coordinates</h3>
              <ul className="space-y-4 text-foreground/60 leading-relaxed font-light text-[11px] font-sans">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-foreground">Stellar Campus Address</h5>
                    <p className="mt-0.5">Plot 22, Cyberpark Avenue, Sector 5, Bangalore - 560001</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-foreground">Institution Registrar Telephones</h5>
                    <p className="mt-0.5">+91 98765 43210 • Monday to Friday (08:00 - 15:30)</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-foreground">Electronic Mail Boxes</h5>
                    <p className="mt-0.5">support@readers.school • registrar@readers.school</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Map Mockup */}
            <div className="glass-panel rounded-2xl h-44 border border-foreground/5 bg-white/[0.01] flex items-center justify-center text-foreground/40 font-mono font-bold tracking-widest relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/[0.02]" />
              🗺️ MAP POSITION: BANGALORE NODE [22.84, 77.29]
            </div>
          </div>

          {/* Form */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/25 bg-indigo-500/[0.01] space-y-6">
            <div>
              <h3 className="font-bold font-outfit text-sm">Secure Message Dispatcher</h3>
              <p className="text-[10px] text-foreground/50 mt-0.5">Your transmissions are cryptographically verified.</p>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 space-y-2 text-center font-sans">
                <h4 className="font-bold">Transmission Dispatched!</h4>
                <p className="text-[10px] leading-relaxed">Your secure packet was successfully logged. Our support coordinators will follow up shortly.</p>
                <button onClick={() => setSuccess(false)} className="text-[9px] underline font-bold mt-2 cursor-pointer">Transmit Another Packet</button>
              </div>
            ) : (
              <form onSubmit={handleMessageSend} className="space-y-4 font-sans">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="glass-input px-3 py-2.5 rounded-lg w-full text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="glass-input px-3 py-2.5 rounded-lg w-full text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-foreground/50 tracking-wider">Message Content</label>
                  <textarea
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Write your academic query details here..."
                    className="glass-input p-3 rounded-lg w-full text-xs text-foreground h-24 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Dispatch Message Packet
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <PublicFooter />
    </div>
  );
}
