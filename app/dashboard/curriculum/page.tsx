"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { curriculumService, Assignment, Quiz, QuizResult } from "@/services/curriculumService";
import { 
  BookOpen, ClipboardList, Award, Plus, Calendar, Clock, 
  CheckCircle2, AlertCircle, FileText, ArrowRight, Loader2, Sparkles, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurriculumPage() {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"courses" | "assignments" | "quizzes">("courses");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  
  // Data States
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  
  // Forms States
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "", description: "", max_score: 100, due_date: ""
  });
  
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: "", description: "", max_score: 100, time_limit: 15
  });

  // Quiz Attempt Overlay States
  const [activeQuizToTake, setActiveQuizToTake] = useState<any | null>(null);
  const [quizTimer, setQuizTimer] = useState(60);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([-1, -1, -1]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingQuizScore, setSavingQuizScore] = useState(false);

  // Mock fallbacks for visual excellence when database rows are not present yet
  const mockSubjects = [
    { id: "s1", name: "Quantum Calculus & Modeling", code: "MAT-Q10", class: { name: "Grade 10-A Quantum" }, teacher: { profiles: { full_name: "Prof. Clara Mercer" } } },
    { id: "s2", name: "AP Physics 3: Astro-dynamics", code: "PHY-A10", class: { name: "Grade 10-A Quantum" }, teacher: { profiles: { full_name: "Dr. Adrian Thorne" } } },
  ];

  const mockAssignments = [
    { id: "a1", title: "Astro-trajectory integrals", description: "Solve Chapter 4 double-integral coordinates.", due_date: "2026-05-24T18:00:00Z", max_score: 100, subject: { name: "AP Physics 3" }, teacher: { profiles: { full_name: "Dr. Adrian Thorne" } } },
    { id: "a2", title: "Quantum Calculus Midterm", description: "Synthesize wave coordinate models.", due_date: "2026-05-29T23:59:59Z", max_score: 100, subject: { name: "Quantum Calculus" }, teacher: { profiles: { full_name: "Prof. Clara Mercer" } } }
  ];

  const mockQuizzes = [
    { id: "q1", title: "Gravity Well Velocity Vectors", description: "AP Physics basics quiz concerning vector coordinates.", time_limit: 3, max_score: 30, subject: { name: "AP Physics 3" } }
  ];

  const quizQuestions = [
    { q: "What is the escape velocity form of an object on a celestial body?", options: ["v = sqrt(2GR)", "v = sqrt(2GM/R)", "v = GM/R^2", "v = sqrt(GM/R)"], ans: 1 },
    { q: "Which orbit has an eccentricity value exactly equal to 1?", options: ["Circular Orbit", "Elliptical Orbit", "Parabolic Trajectory", "Hyperbolic Trajectory"], ans: 2 },
    { q: "A Keplerian orbit's period is proportional to which value of its semi-major axis?", options: ["a^3/2", "a^2", "a^1/2", "a^3"], ans: 0 },
  ];

  useEffect(() => {
    loadData();
  }, [role]);

  // Quiz active timer countdown
  useEffect(() => {
    let interval: any;
    if (activeQuizToTake && !quizFinished) {
      interval = setInterval(() => {
        setQuizTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishQuizAttempt();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuizToTake, quizFinished]);

  const loadData = async () => {
    setLoading(true);
    try {
      try {
        const subData = await curriculumService.getSubjects();
        setSubjects(subData && subData.length > 0 ? subData : mockSubjects);
      } catch (e) {
        setSubjects(mockSubjects);
      }

      try {
        const assignData = await curriculumService.getAssignments();
        setAssignments(assignData && assignData.length > 0 ? assignData : mockAssignments);
      } catch (e) {
        setAssignments(mockAssignments);
      }

      try {
        const quizData = await curriculumService.getQuizzes();
        setQuizzes(quizData && quizData.length > 0 ? quizData : mockQuizzes);
      } catch (e) {
        setQuizzes(mockQuizzes);
      }
    } catch (err) {
      console.error("Failed to load curriculum terminal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.due_date || subjects.length === 0) return;
    
    setPublishing(true);
    try {
      const payload: Assignment = {
        subject_id: newAssignment.subject_id || subjects[0].id,
        teacher_id: user?.id || "",
        title: newAssignment.title,
        description: newAssignment.description || "",
        due_date: new Date(newAssignment.due_date).toISOString(),
        max_score: Number(newAssignment.max_score) || 100,
      };

      await curriculumService.createAssignment(payload);
      setShowAssignForm(false);
      setNewAssignment({ title: "", description: "", max_score: 100, due_date: "" });
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to publish assignment.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.title || subjects.length === 0) return;
    
    setPublishing(true);
    try {
      const payload: Quiz = {
        subject_id: newQuiz.subject_id || subjects[0].id,
        title: newQuiz.title,
        description: newQuiz.description || "",
        time_limit: Number(newQuiz.time_limit) || 15,
        max_score: Number(newQuiz.max_score) || 100,
      };

      await curriculumService.createQuiz(payload);
      setShowQuizForm(false);
      setNewQuiz({ title: "", description: "", max_score: 100, time_limit: 15 });
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to publish quiz.");
    } finally {
      setPublishing(false);
    }
  };

  const startQuizAttempt = (quiz: any) => {
    setActiveQuizToTake(quiz);
    setQuizTimer(quiz.time_limit * 60);
    setQuizStep(0);
    setQuizAnswers([-1, -1, -1]);
    setQuizFinished(false);
  };

  const selectAnswer = (ansIdx: number) => {
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[quizStep] = ansIdx;
      return next;
    });
  };

  const finishQuizAttempt = async () => {
    setQuizFinished(true);
    setSavingQuizScore(true);
    try {
      // Evaluate score (each correct answer is 10 points out of 30)
      let score = 0;
      quizAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].ans) score += 10;
      });

      if (user) {
        const payload: QuizResult = {
          quiz_id: activeQuizToTake.id || "q1",
          student_id: user.id,
          score: score,
          feedback: `Score achieved during live testing terminal: ${score}/30.`,
        };
        await curriculumService.saveQuizResult(payload);
      }
    } catch (err) {
      console.error("Could not write quiz scores:", err);
    } finally {
      setSavingQuizScore(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              Academic Terminal
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Curriculum Terminal
          </h1>
          <p className="text-xs text-foreground/60">
            Access active syllabus registers, evaluate pending homework, and participate in test simulations.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-foreground/5 gap-6">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "courses"
              ? "border-indigo-500 text-indigo-400 font-extrabold"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Courses & Syllabus
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "assignments"
              ? "border-indigo-500 text-indigo-400 font-extrabold"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Assignments Ledger
        </button>

        <button
          onClick={() => setActiveTab("quizzes")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "quizzes"
              ? "border-indigo-500 text-indigo-400 font-extrabold"
              : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          <Award className="w-4 h-4" /> Quizzes Engine
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-xs text-foreground/50">Accessing academic databases...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB 1: COURSES */}
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {subjects.map((sub, idx) => (
                <div key={sub.id || idx} className="glass-panel rounded-2xl p-5 space-y-4 hover:border-indigo-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                  <div>
                    <span className="inline-flex px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-bold font-mono uppercase">
                      {sub.code}
                    </span>
                    <h3 className="font-bold font-outfit text-base mt-2">{sub.name}</h3>
                    <p className="text-xs text-foreground/50 mt-0.5">Advisor: {sub.teacher?.profiles?.full_name || "School Instructor"}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-foreground/65 border-t border-foreground/5 pt-3">
                    <span>Registered Class: <strong className="text-foreground/90">{sub.class?.name || "Grade 10"}</strong></span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-0.5">Syllabus Grid <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Teacher Form Toggle */}
              {(role === "teacher" || role === "admin") && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAssignForm(!showAssignForm)}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish New Homework
                  </button>
                </div>
              )}

              {/* Assignment Form */}
              <AnimatePresence>
                {showAssignForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateAssignment}
                    className="glass-panel rounded-2xl p-5 space-y-4 overflow-hidden border border-indigo-500/25 bg-indigo-500/5"
                  >
                    <h3 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Publish Homework Specifications</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(p => ({ ...p, title: e.target.value }))}
                          placeholder="e.g. Astro coordinates"
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Academic Topic / Class</label>
                        <select
                          value={newAssignment.subject_id}
                          onChange={(e) => setNewAssignment(p => ({ ...p, subject_id: e.target.value }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full cursor-pointer"
                        >
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Max Possible Score</label>
                        <input
                          type="number"
                          value={newAssignment.max_score}
                          onChange={(e) => setNewAssignment(p => ({ ...p, max_score: Number(e.target.value) }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Due Date & Time Limit</label>
                        <input
                          type="datetime-local"
                          required
                          value={newAssignment.due_date}
                          onChange={(e) => setNewAssignment(p => ({ ...p, due_date: e.target.value }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Assignment Description / Task instructions</label>
                      <textarea
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment(p => ({ ...p, description: e.target.value }))}
                        placeholder="Write assignment instructions..."
                        className="glass-input text-xs px-3 py-2 rounded-lg w-full h-20 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAssignForm(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={publishing}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {publishing ? <Loader2 className="w-3 animate-spin" /> : "Commit & Publish"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Assignment List */}
              <div className="space-y-4">
                {assignments.map((item, idx) => (
                  <div key={item.id || idx} className="glass-panel rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-bold uppercase">
                        {item.subject?.name || "AP Science"}
                      </span>
                      <h4 className="font-bold text-sm text-foreground/90">{item.title}</h4>
                      <p className="text-[11px] text-foreground/50 leading-relaxed max-w-xl">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                      <div className="text-left md:text-right space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-foreground/40 font-mono flex items-center gap-0.5 md:justify-end">
                          <Calendar className="w-3 h-3" /> Due Date
                        </span>
                        <p className="text-[11px] font-mono text-foreground/75 font-semibold">
                          {new Date(item.due_date).toLocaleString()}
                        </p>
                      </div>

                      {role === "student" && (
                        <button
                          onClick={() => alert("Simulation: Hand-in solution committed successfully!")}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Submit Hand-in
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: QUIZZES */}
          {activeTab === "quizzes" && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Teacher Form Toggle */}
              {(role === "teacher" || role === "admin") && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowQuizForm(!showQuizForm)}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish Testing Quiz
                  </button>
                </div>
              )}

              {/* Quiz Form */}
              <AnimatePresence>
                {showQuizForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateQuiz}
                    className="glass-panel rounded-2xl p-5 space-y-4 overflow-hidden border border-indigo-500/25 bg-indigo-500/5"
                  >
                    <h3 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Publish Cybernetic Quiz</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Quiz Title</label>
                        <input
                          type="text"
                          required
                          value={newQuiz.title}
                          onChange={(e) => setNewQuiz(p => ({ ...p, title: e.target.value }))}
                          placeholder="e.g. Gravity basics"
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Subject Topic</label>
                        <select
                          value={newQuiz.subject_id}
                          onChange={(e) => setNewQuiz(p => ({ ...p, subject_id: e.target.value }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full cursor-pointer"
                        >
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Time Limit (Minutes)</label>
                        <input
                          type="number"
                          value={newQuiz.time_limit}
                          onChange={(e) => setNewQuiz(p => ({ ...p, time_limit: Number(e.target.value) }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60 uppercase">Max Score</label>
                        <input
                          type="number"
                          value={newQuiz.max_score}
                          onChange={(e) => setNewQuiz(p => ({ ...p, max_score: Number(e.target.value) }))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase">Description</label>
                      <textarea
                        value={newQuiz.description}
                        onChange={(e) => setNewQuiz(p => ({ ...p, description: e.target.value }))}
                        placeholder="Write quiz summary..."
                        className="glass-input text-xs px-3 py-2 rounded-lg w-full h-20 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowQuizForm(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={publishing}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {publishing ? <Loader2 className="w-3 animate-spin" /> : "Commit Quiz"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Quiz List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((item, idx) => (
                  <div key={item.id || idx} className="glass-panel rounded-2xl p-5 space-y-4 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-bold uppercase">
                          {item.subject?.name || "Physics"}
                        </span>
                        <span className="text-[10px] text-foreground/45 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.time_limit} Mins
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground/90 font-outfit">{item.title}</h4>
                      <p className="text-[11px] text-foreground/50 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="border-t border-foreground/5 pt-3 mt-3 flex justify-between items-center text-[11px]">
                      <span className="font-mono text-foreground/50">Max points: <strong className="text-foreground/80">{item.max_score} XP</strong></span>
                      
                      {role === "student" && (
                        <button
                          onClick={() => startQuizAttempt(item)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 text-[10px] font-bold shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                        >
                          Start Test
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* QUIZ INTERACTIVE SIMULATION OVERLAY */}
      <AnimatePresence>
        {activeQuizToTake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-xl rounded-2xl p-6 shadow-2xl relative border border-indigo-500/20 overflow-hidden space-y-6"
            >
              {/* Decorative glows */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {!quizFinished ? (
                <>
                  {/* Header Attempt details */}
                  <div className="flex justify-between items-center border-b border-foreground/5 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground/90 font-outfit">{activeQuizToTake.title}</h4>
                      <span className="text-[9px] text-indigo-400 font-mono">Simulated Examination System</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>{Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Question spec */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-foreground/50 uppercase font-mono">
                      <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                      <span className="text-indigo-400 font-bold">10 XP Each</span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground/90 leading-relaxed font-outfit">
                      {quizQuestions[quizStep].q}
                    </h3>

                    {/* Radio Selectors */}
                    <div className="space-y-2">
                      {quizQuestions[quizStep].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                            quizAnswers[quizStep] === idx
                              ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-bold shadow-md shadow-indigo-500/5"
                              : "bg-white/[0.01] border-foreground/5 text-foreground/75 hover:bg-white/[0.02] hover:text-foreground"
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            quizAnswers[quizStep] === idx ? "border-indigo-400 bg-indigo-500" : "border-foreground/20 bg-transparent"
                          }`}>
                            {quizAnswers[quizStep] === idx && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation keys */}
                  <div className="flex justify-between items-center border-t border-foreground/5 pt-4">
                    <button
                      disabled={quizStep === 0}
                      onClick={() => setQuizStep(p => p - 1)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold disabled:opacity-30 transition-all cursor-pointer"
                    >
                      Back
                    </button>

                    {quizStep < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setQuizStep(p => p + 1)}
                        className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={finishQuizAttempt}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* QUIZ SCORECARD SUCCESS CONTAINER */
                <div className="text-center py-6 space-y-5">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-foreground/90 font-outfit">Attempt Evaluated!</h3>
                    <p className="text-xs text-foreground/50">Your testing session score has been automatically processed.</p>
                  </div>

                  {/* Visual points display */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl max-w-xs mx-auto space-y-1">
                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Total Earned Score</span>
                    <h2 className="text-3xl font-extrabold font-outfit text-foreground tracking-tight">
                      {quizAnswers.reduce((acc, ans, idx) => ans === quizQuestions[idx].ans ? acc + 10 : acc, 0)} / 30 XP
                    </h2>
                    <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                      Grade: {
                        quizAnswers.reduce((acc, ans, idx) => ans === quizQuestions[idx].ans ? acc + 10 : acc, 0) >= 20 ? "Pass (A)" : "Try Again"
                      }
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveQuizToTake(null)}
                      className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer mx-auto block"
                    >
                      Return to Curriculum
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
