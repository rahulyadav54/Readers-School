"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sparkles, Send, Trash2, BookOpen, Calculator, Globe, 
  Code, MessageSquare, Plus, ArrowRight, Loader2, Play 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatConversation {
  id: string;
  title: string;
  subject: "math" | "science" | "grammar" | "coding";
  messages: ChatMessage[];
  timestamp: string;
}

export default function AIHomeworkHelperPage() {
  const { user } = useAuth();
  
  // Chat States
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [subject, setSubject] = useState<"math" | "science" | "grammar" | "coding">("math");
  const [inputPrompt, setInputPrompt] = useState("");
  const [thinking, setThinking] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load chat conversations from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readers_school_chat_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConversations(parsed);
          if (parsed.length > 0) {
            setActiveConvId(parsed[0].id);
          }
        } catch (e) {
          console.error("Could not parse saved chat history:", e);
        }
      }
    }
  }, []);

  // Save chat conversations to localStorage on change
  const saveToLocalStorage = (updated: ChatConversation[]) => {
    setConversations(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("readers_school_chat_history", JSON.stringify(updated));
    }
  };

  // Scroll to bottom when messages change or thinking state updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId, thinking]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const startNewConversation = (selectedSubject = subject) => {
    const newId = `conv_${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      title: `Study Session: ${selectedSubject.toUpperCase()}`,
      subject: selectedSubject,
      messages: [],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const next = [newConv, ...conversations];
    saveToLocalStorage(next);
    setActiveConvId(newId);
  };

  const handleClearHistory = () => {
    saveToLocalStorage([]);
    setActiveConvId(null);
  };

  const handleSendPrompt = async (forcedPrompt?: string) => {
    const promptToSend = forcedPrompt || inputPrompt;
    if (!promptToSend.trim() || thinking) return;

    setInputPrompt("");
    setThinking(true);

    let currentConvId = activeConvId;
    let nextConversations = [...conversations];

    // Auto-create conversation if none is active
    if (!currentConvId || nextConversations.length === 0) {
      currentConvId = `conv_${Date.now()}`;
      const newConv: ChatConversation = {
        id: currentConvId,
        title: promptToSend.substring(0, 25) + "...",
        subject: subject,
        messages: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      nextConversations = [newConv, ...nextConversations];
      setActiveConvId(currentConvId);
    }

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update conversation with user message
    nextConversations = nextConversations.map((c) => {
      if (c.id === currentConvId) {
        return {
          ...c,
          title: c.messages.length === 0 ? promptToSend.substring(0, 25) + "..." : c.title,
          messages: [...c.messages, userMessage],
        };
      }
      return c;
    });

    saveToLocalStorage(nextConversations);

    // Call Gemini API Route
    try {
      const activeMessages = nextConversations.find(c => c.id === currentConvId)?.messages || [];
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: activeMessages.map(m => ({ role: m.role, content: m.content })),
          subject,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const assistantMessage: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: data.content || "Sorry, I could not generate an answer.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Append AI response
      const updated = nextConversations.map((c) => {
        if (c.id === currentConvId) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage],
          };
        }
        return c;
      });

      saveToLocalStorage(updated);

    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "### ⚠️ Handshake Failure\n\nCould not fetch response from the Gemini gateway. Please verify your internet connection or check your Gemini API key inside your `.env.local` variables.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updated = nextConversations.map((c) => {
        if (c.id === currentConvId) {
          return {
            ...c,
            messages: [...c.messages, errorMessage],
          };
        }
        return c;
      });
      saveToLocalStorage(updated);
    } finally {
      setThinking(false);
    }
  };

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    const selected = conversations.find(c => c.id === id);
    if (selected) {
      setSubject(selected.subject);
    }
  };

  // Custom client-side markdown formatter
  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      // Code block detection
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const code = codeContent.join("\n");
          codeContent = [];
          return (
            <pre key={idx} className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 font-mono text-[10px] text-indigo-300 overflow-x-auto my-3 relative shadow-inner">
              <code>{code}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider mt-4 mb-2 font-mono">{line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-sm font-extrabold text-foreground mt-4 mb-2 font-outfit">{line.substring(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-base font-extrabold text-foreground mt-4 mb-2 font-outfit">{line.substring(2)}</h2>;
      }

      // Blockquote note
      if (line.trim().startsWith("> [!NOTE]")) {
        return null; // Consume the prefix
      }
      if (line.trim().startsWith(">")) {
        return (
          <blockquote key={idx} className="border-l-2 border-indigo-500 bg-indigo-500/5 px-3 py-2 rounded-r-lg my-2 text-[11px] italic text-foreground/80">
            {line.trim().substring(1).trim()}
          </blockquote>
        );
      }

      // Bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <ul key={idx} className="list-disc pl-5 my-1 text-xs text-foreground/85 leading-relaxed">
            <li>{line.trim().substring(2)}</li>
          </ul>
        );
      }

      // Numbered items
      if (/^\d+\./.test(line.trim())) {
        return (
          <ol key={idx} className="list-decimal pl-5 my-1 text-xs text-foreground/85 leading-relaxed">
            <li>{line.trim().replace(/^\d+\./, "").trim()}</li>
          </ol>
        );
      }

      // Render line normally, with simple inline code / bold regex formatting
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-300">$1</strong>')
        .replace(/\$(.*?)\$/g, '<span class="px-1 py-0.5 bg-indigo-500/10 rounded font-mono">$1</span>')
        .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-foreground/5 rounded font-mono text-[10px]">$1</code>');

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p 
          key={idx} 
          className="text-xs text-foreground/80 leading-relaxed my-1.5 font-sans"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  const subjectPills = [
    { id: "math", label: "Mathematics 📐", icon: Calculator, color: "border-cyan-500/20 text-cyan-400" },
    { id: "science", label: "Astro-Science 🧪", icon: BookOpen, color: "border-rose-500/20 text-rose-400" },
    { id: "grammar", label: "Grammar & Writing 📝", icon: Globe, color: "border-amber-500/20 text-amber-400" },
    { id: "coding", label: "Cyber Coding 💻", icon: Code, color: "border-emerald-500/20 text-emerald-400" },
  ];

  const quickPrompts: Record<string, string[]> = {
    math: [
      "Explain standard quadratic formula integrals simply.",
      "How do Kepler's elliptical orbit calculations function?",
      "Solve a wave vector coordinates equations."
    ],
    science: [
      "Why is escape velocity proportional to gravitational forces?",
      "What is the simple structure of a molecular chemical covalent bond?",
      "Explain gravity wells in astrophysics simple terms."
    ],
    grammar: [
      "Write an active voice vs passive voice summary.",
      "Provide common rules for coordinating conjunctions.",
      "Analyze relative clauses in scientific reporting."
    ],
    coding: [
      "Write a filter array function in TypeScript.",
      "Explain bubble sort vs merge sort algorithms.",
      "Setup a basic Supabase SQL schema select query."
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      
      {/* LEFT COLUMN: CONVERSATION HISTORY DRAWER */}
      <div className="hidden lg:flex flex-col glass-panel rounded-2xl p-4 space-y-4 h-full border border-foreground/5">
        <div className="flex justify-between items-center">
          <h3 className="font-bold font-outfit text-xs uppercase tracking-wider text-foreground/45 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Previous Chats
          </h3>

          {conversations.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="p-1 rounded hover:bg-white/5 text-foreground/40 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => startNewConversation(subject)}
          className="w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Study Session
        </button>

        {/* Scroll list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {conversations.length > 0 ? (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all block relative group ${
                  activeConvId === c.id 
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold"
                    : "bg-transparent border-foreground/5 text-foreground/60 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <div className="truncate font-sans font-semibold max-w-[190px]">{c.title}</div>
                <div className="flex justify-between items-center mt-1 text-[8px] text-foreground/40 font-mono">
                  <span>Subject: {c.subject.toUpperCase()}</span>
                  <span>{c.timestamp}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-4">
              <MessageSquare className="w-6 h-6 text-foreground/20 animate-bounce mb-2" />
              <p className="text-[10px] text-foreground/40 font-mono">Your past session logs will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN CHAT PANEL TERMINAL */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-4 flex flex-col justify-between h-full border border-foreground/5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header subject switches */}
        <div className="flex flex-wrap items-center gap-2 border-b border-foreground/5 pb-3">
          {subjectPills.map((pill) => {
            const Icon = pill.icon;
            const isActive = subject === pill.id;

            return (
              <button
                key={pill.id}
                onClick={() => {
                  setSubject(pill.id as any);
                  if (activeConv && activeConv.messages.length === 0) {
                    // Update current empty conversation's subject
                    const updated = conversations.map(c => c.id === activeConvId ? { ...c, subject: pill.id as any, title: `Study Session: ${pill.id.toUpperCase()}` } : c);
                    saveToLocalStorage(updated);
                  } else {
                    // Start new conversation for the chosen subject
                    startNewConversation(pill.id as any);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? "bg-indigo-500 text-white border-indigo-400 font-extrabold shadow-md shadow-indigo-500/20"
                    : `bg-transparent border-foreground/5 text-foreground/60 hover:bg-white/5`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat display box */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 font-sans">
          {activeConv && activeConv.messages.length > 0 ? (
            activeConv.messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div 
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
                >
                  <div className={`p-4 rounded-2xl max-w-xl text-xs space-y-1 ${
                    isUser
                      ? "bg-indigo-500/10 border border-indigo-500/35 text-indigo-200 font-medium rounded-tr-none shadow-md shadow-indigo-500/5"
                      : "glass-panel bg-white/[0.01] border border-foreground/5 text-foreground/90 rounded-tl-none relative overflow-hidden"
                  }`}>
                    {/* Gemini sparkles overlay */}
                    {!isUser && (
                      <div className="absolute top-2 right-2 p-0.5 text-indigo-400/20">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      {isUser ? msg.content : renderFormattedMarkdown(msg.content)}
                    </div>
                    
                    <span className="block text-[8px] text-foreground/35 text-right mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })
          ) : (
            /* EMPTY INITIAL WELCOME INTERFACE */
            <div className="h-full flex flex-col justify-center items-center max-w-lg mx-auto text-center space-y-6 py-6">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/5">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-outfit">Readers School AI Homework Helper</h3>
                <p className="text-xs text-foreground/50 leading-relaxed font-sans">
                  Ask me anything about Math 📐, Science 🧪, Grammar 📝, or Coding 💻. I will explain complex ideas using clear bullet points and simple logic!
                </p>
              </div>

              {/* Quick Prompt Grid */}
              <div className="grid grid-cols-1 gap-2.5 w-full font-sans text-xs">
                {quickPrompts[subject]?.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendPrompt(prompt)}
                    className="p-3.5 text-left rounded-xl bg-white/[0.01] border border-foreground/5 hover:border-indigo-500/20 text-foreground/75 hover:text-foreground text-[11px] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <span>"{prompt}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typing Loading indicator */}
          {thinking && (
            <div className="flex justify-start w-full">
              <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-foreground/5 rounded-tl-none flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="text-[10px] text-foreground/55 font-mono">Gemini thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Floating Chat Input Dock */}
        <div className="flex gap-2 border-t border-foreground/5 pt-3">
          <input
            type="text"
            placeholder={`Ask a question in ${subject.toUpperCase()}...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
            className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs font-sans"
          />

          <button
            onClick={() => handleSendPrompt()}
            disabled={thinking || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
