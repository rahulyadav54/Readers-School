"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { quizService, Quiz, QuizQuestion, QuizResult } from "@/services/quizService";
import { curriculumService } from "@/services/curriculumService";
import { 
  Trophy, HelpCircle, Calendar, Timer, AlertCircle, 
  Sparkles, CheckCircle2, XCircle, ArrowLeft, ArrowRight, 
  Plus, Trash2, Check, BarChart3, User, Award, ShieldAlert, BookOpen, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnlineQuizModulePage() {
  const { role, user } = useAuth();
  
  // Data States
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [studentResults, setStudentResults] = useState<QuizResult[]>([]);
  
  // Active Leaderboard/Analytics Drawer State
  const [selectedQuizForStats, setSelectedQuizForStats] = useState<any | null>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState<any[]>([]);
  const [activeAnalytics, setActiveAnalytics] = useState<any>({
    totalSubmissions: 0,
    averageScore: 0,
    passingRate: 0,
    highScore: 0,
  });

  // Quiz Taking States
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({}); // qId -> selectedOptionIdx
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const [quizScoreReport, setQuizScoreReport] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    pointsScored: number;
  } | null>(null);

  // Form States (Teacher)
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [newTimeLimit, setNewTimeLimit] = useState(15);
  const [newQuestions, setNewQuestions] = useState<QuizQuestion[]>([
    {
      id: "q_1",
      question_text: "What is the orbital period equation proportional value?",
      options: ["T^2 = a^3", "T^2 = a^2", "T = a^3", "T^3 = a^2"],
      correct_option_idx: 0,
      points: 20
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [publishingQuiz, setPublishingQuiz] = useState(false);
  const [realtimeNotify, setRealtimeNotify] = useState<string | null>(null);

  // Fallback Mock Data for sandbox zero-barrier testing
  const mockQuizzes = [
    {
      id: "q1",
      title: "Quantum Orbit Velocity Kepler Models",
      description: "Test Kepler harmonic orbital values and vector trajectory metrics.",
      subject_id: "sub-q",
      difficulty: "hard",
      time_limit: 10,
      max_score: 100,
      questions: [
        {
          id: "q1_1",
          question_text: "According to Kepler's Third Law, the square of orbital period is proportional to what?",
          options: ["Cube of semi-major axis", "Square of semi-major axis", "Reciprocal of gravity", "Velocity vectors"],
          correct_option_idx: 0,
          points: 50
        },
        {
          id: "q1_2",
          question_text: "What velocity is required to escape Earth's gravity wells?",
          options: ["9.8 km/s", "11.2 km/s", "42.1 km/s", "3.0 km/s"],
          correct_option_idx: 1,
          points: 50
        }
      ],
      subject: { name: "Quantum Calculus & Physics", code: "MAT-QP10" }
    },
    {
      id: "q2",
      title: "Active Grammar Coordinating Conjunctions",
      description: "Identify active coordinating conjunctions and compound syntax rules.",
      subject_id: "sub-g",
      difficulty: "easy",
      time_limit: 5,
      max_score: 50,
      questions: [
        {
          id: "q2_1",
          question_text: "Which of the following is NOT a coordinating conjunction?",
          options: ["For", "And", "Because", "But"],
          correct_option_idx: 2,
          points: 50
        }
      ],
      subject: { name: "Advanced Grammar", code: "ENG-G10" }
    }
  ];

  const mockLeaderboard = [
    { score: 100, student: { profile: { full_name: "Marcus Vance", email: "marcus@readers.school" } }, completed_at: "2026-05-18T10:00:00Z" },
    { score: 85, student: { profile: { full_name: "Sarah Chen", email: "sarah@readers.school" } }, completed_at: "2026-05-18T10:05:00Z" }
  ];

  useEffect(() => {
    loadQuizHubData();
  }, [role, user]);

  // Quiz taking active timer listener
  useEffect(() => {
    let interval: any = null;
    if (quizTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setQuizTimerActive(false);
            autoSubmitQuizAnswers();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizTimerActive, timeRemaining]);

  const loadQuizHubData = async () => {
    setLoading(true);
    try {
      // Load Quizzes
      try {
        const data = await quizService.getQuizzes();
        setQuizzes(data && data.length > 0 ? data : mockQuizzes);
      } catch (e) {
        setQuizzes(mockQuizzes);
      }

      // Load Subjects
      try {
        const subData = await curriculumService.getSubjects();
        setSubjects(subData && subData.length > 0 ? subData : [{ id: "sub-q", name: "Quantum Physics" }]);
        if (subData && subData.length > 0) setNewSubject(subData[0].id);
      } catch (e) {
        setSubjects([{ id: "sub-q", name: "Quantum Physics" }]);
        setNewSubject("sub-q");
      }

      // Load student results
      if (role === "student" && user) {
        try {
          const results = await quizService.getStudentQuizResults(user.id);
          setStudentResults(results || []);
        } catch (e) {
          setStudentResults([]);
        }
      }
    } catch (err) {
      console.error("Quiz load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatsAndLeaderboard = async (quiz: any) => {
    setSelectedQuizForStats(quiz);
    try {
      const lb = await quizService.getLeaderboard(quiz.id);
      setActiveLeaderboard(lb && lb.length > 0 ? lb : mockLeaderboard);

      const stats = await quizService.getQuizAnalytics(quiz.id);
      setActiveAnalytics(stats);
    } catch (e) {
      setActiveLeaderboard(mockLeaderboard);
      setActiveAnalytics({
        totalSubmissions: 2,
        averageScore: 92.5,
        passingRate: 100,
        highScore: 100,
      });
    }
  };

  // Student Quiz Attempt Initiation
  const startQuizAttempt = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setQuizScoreReport(null);
    setTimeRemaining((quiz.time_limit || 10) * 60);
    setQuizTimerActive(true);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const autoSubmitQuizAnswers = () => {
    setRealtimeNotify("Time expired! Submitting remaining answers automatically.");
    setTimeout(() => setRealtimeNotify(null), 3000);
    processQuizSubmission();
  };

  const manualSubmitQuiz = () => {
    processQuizSubmission();
  };

  const processQuizSubmission = async () => {
    if (!activeQuiz) return;
    setQuizTimerActive(false);
    setSubmittingQuiz(true);

    const questions: QuizQuestion[] = activeQuiz.questions || [];
    let correctCount = 0;
    let pointsScored = 0;

    questions.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen === q.correct_option_idx) {
        correctCount++;
        pointsScored += q.points;
      }
    });

    const percentage = Math.round((pointsScored / activeQuiz.max_score) * 100);

    // Save result to Supabase
    try {
      const payload: QuizResult = {
        quiz_id: activeQuiz.id || "",
        student_id: user?.id || "d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0a001",
        score: percentage,
        feedback: `Completed with ${correctCount}/${questions.length} correct options!`,
      };

      await quizService.submitQuizResult(payload);
      
      setQuizScoreReport({
        correctCount,
        totalCount: questions.length,
        percentage,
        pointsScored
      });

      // Reload background stats
      loadQuizHubData();
    } catch (err: any) {
      console.warn("Could not save score in backend. Showing local report:", err);
      setQuizScoreReport({
        correctCount,
        totalCount: questions.length,
        percentage,
        pointsScored
      });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Dynamic Teacher quiz form management
  const addFormQuestion = () => {
    const nextId = `q_${Date.now()}`;
    const nextQ: QuizQuestion = {
      id: nextId,
      question_text: "",
      options: ["", "", "", ""],
      correct_option_idx: 0,
      points: 10,
    };
    setNewQuestions(prev => [...prev, nextQ]);
  };

  const deleteFormQuestion = (index: number) => {
    if (newQuestions.length <= 1) return;
    setNewQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateFormQuestionText = (index: number, text: string) => {
    setNewQuestions(prev => prev.map((q, idx) => idx === index ? { ...q, question_text: text } : q));
  };

  const updateFormQuestionOption = (qIdx: number, oIdx: number, val: string) => {
    setNewQuestions(prev => prev.map((q, idx) => {
      if (idx === qIdx) {
        const nextOpts = [...q.options];
        nextOpts[oIdx] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const updateFormQuestionCorrectIdx = (qIdx: number, val: number) => {
    setNewQuestions(prev => prev.map((q, idx) => idx === qIdx ? { ...q, correct_option_idx: val } : q));
  };

  const updateFormQuestionPoints = (qIdx: number, val: number) => {
    setNewQuestions(prev => prev.map((q, idx) => idx === qIdx ? { ...q, points: val } : q));
  };

  const handlePublishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setPublishingQuiz(true);
    const totalMax = newQuestions.reduce((sum, q) => sum + q.points, 0);

    try {
      const payload: Quiz = {
        subject_id: newSubject,
        title: newTitle,
        description: newDesc,
        questions: newQuestions,
        difficulty: newDifficulty,
        time_limit: Number(newTimeLimit),
        max_score: totalMax,
      };

      await quizService.createQuiz(payload);
      setRealtimeNotify("Successfully publishedTimed MCQ assessment!");
      setTimeout(() => setRealtimeNotify(null), 3000);
      
      resetCreateForm();
      loadQuizHubData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to publish online assessment.");
    } finally {
      setPublishingQuiz(false);
    }
  };

  const resetCreateForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewQuestions([
      {
        id: `q_${Date.now()}`,
        question_text: "",
        options: ["", "", "", ""],
        correct_option_idx: 0,
        points: 25
      }
    ]);
    setNewDifficulty("medium");
    setNewTimeLimit(15);
    setShowCreateQuiz(false);
  };

  // Helper format seconds -> MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Realtime Action Toast */}
      <AnimatePresence>
        {realtimeNotify && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold flex items-center gap-2.5 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{realtimeNotify}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Assessment Overlay: TAKING ACTIVE TIMED MCQ */}
      <AnimatePresence>
        {activeQuiz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center p-4 overflow-y-auto"
          >
            <div className="max-w-2xl w-full space-y-6">
              
              {/* TIMED RESULTS SCREEN */}
              {quizScoreReport ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass-panel rounded-2xl p-6 text-center space-y-6 border border-cyan-500/30 bg-cyan-500/[0.01]"
                >
                  <Trophy className="w-14 h-14 text-cyan-400 mx-auto animate-bounce mt-4" />
                  
                  <div className="space-y-1.5">
                    <h2 className="font-extrabold text-xl font-outfit">Instant Score Analytics</h2>
                    <p className="text-xs text-foreground/50">Quiz: {activeQuiz.title}</p>
                  </div>

                  <div className="flex justify-center items-center gap-6 py-2">
                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-foreground/5 space-y-0.5 min-w-[100px]">
                      <span className="text-[9px] uppercase tracking-wider text-foreground/45 font-bold">Accuracy</span>
                      <p className="text-xl font-extrabold text-cyan-400 font-mono">{quizScoreReport.percentage}%</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-foreground/5 space-y-0.5 min-w-[100px]">
                      <span className="text-[9px] uppercase tracking-wider text-foreground/45 font-bold">Correct</span>
                      <p className="text-xl font-extrabold text-indigo-400 font-mono">{quizScoreReport.correctCount}/{quizScoreReport.totalCount}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.01] border border-foreground/5 space-y-0.5 min-w-[100px]">
                      <span className="text-[9px] uppercase tracking-wider text-foreground/45 font-bold">XP Gained</span>
                      <p className="text-xl font-extrabold text-emerald-400 font-mono">+{quizScoreReport.pointsScored} XP</p>
                    </div>
                  </div>

                  {/* Question Answers Review */}
                  <div className="space-y-3 text-left max-h-60 overflow-y-auto pr-1">
                    {activeQuiz.questions.map((q, idx) => {
                      const selected = answers[q.id];
                      const isCorrect = selected === q.correct_option_idx;

                      return (
                        <div key={q.id} className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-1.5 text-xs">
                          <p className="font-semibold text-foreground/90">Q{idx + 1}: {q.question_text}</p>
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-foreground/50">Your choice: {q.options[selected] || "Unanswered"}</span>
                            <span className="inline-flex items-center gap-0.5 font-bold uppercase">
                              {isCorrect ? (
                                <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> Correct</span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-0.5"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                              )}
                            </span>
                          </div>
                          {!isCorrect && (
                            <p className="text-[9px] text-emerald-400/70 font-mono">Correct choice: {q.options[q.correct_option_idx]}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setActiveQuiz(null);
                      setQuizScoreReport(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md cursor-pointer font-sans"
                  >
                    Finish Session
                  </button>

                </motion.div>
              ) : (
                /* timed mcq display */
                <div className="space-y-4">
                  {/* Floating Header */}
                  <div className="glass-panel rounded-2xl p-4 flex justify-between items-center border border-cyan-500/20 bg-cyan-500/[0.02]">
                    <div className="space-y-0.5">
                      <span className="inline-flex px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-mono uppercase font-bold">
                        Question {currentQuestionIdx + 1} of {activeQuiz.questions?.length}
                      </span>
                      <h3 className="text-xs font-bold text-foreground/80">{activeQuiz.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-foreground/10 text-cyan-400 font-mono text-sm font-extrabold animate-pulse">
                      <Timer className="w-4 h-4" />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                  </div>

                  {/* Question Panel */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestionIdx}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      className="glass-panel rounded-2xl p-6 space-y-6 border border-foreground/5 bg-white/[0.01]"
                    >
                      <h4 className="font-extrabold text-sm sm:text-base font-outfit text-foreground/95 leading-relaxed">
                        {activeQuiz.questions?.[currentQuestionIdx]?.question_text}
                      </h4>

                      <div className="space-y-3 font-sans text-xs">
                        {activeQuiz.questions?.[currentQuestionIdx]?.options.map((option: string, oIdx: number) => {
                          const qId = activeQuiz.questions[currentQuestionIdx].id;
                          const isSelected = answers[qId] === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(qId, oIdx)}
                              className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-500/10 border-cyan-500/35 text-cyan-400 font-bold shadow-md shadow-cyan-500/5"
                                  : "bg-transparent border-foreground/5 text-foreground/75 hover:bg-white/[0.01] hover:text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${
                                  isSelected ? "bg-cyan-500 text-white" : "bg-white/5 text-foreground/50 border border-foreground/5"
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Footer Dock */}
                  <div className="flex justify-between items-center">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-30"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Previous
                    </button>

                    {currentQuestionIdx < (activeQuiz.questions?.length - 1) ? (
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={manualSubmitQuiz}
                        disabled={submittingQuiz}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        {submittingQuiz ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              Timed MCQs
            </span>
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Online Timed Assessments
          </h1>
          <p className="text-xs text-foreground/60">
            Publish quizzes, answer MCQs under countdown constraints, check immediate score feedback, and challenge colleagues on rankings.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs text-foreground/50">Synchronizing database online assessments...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main ledger list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              
              <div className="flex justify-between items-center">
                <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Available Assessments
                </h3>

                {(role === "teacher" || role === "admin") && (
                  <button
                    onClick={() => setShowCreateQuiz(!showCreateQuiz)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish Timed Quiz
                  </button>
                )}
              </div>

              {/* Publish Form (Teacher) */}
              <AnimatePresence>
                {showCreateQuiz && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handlePublishQuiz}
                    className="glass-panel rounded-2xl p-5 space-y-4 overflow-hidden border border-cyan-500/25 bg-cyan-500/5 text-xs text-sans"
                  >
                    <h4 className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">Timed Quiz Specifications</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-foreground/50 font-bold">Quiz Title</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Astro-trajectory Kepler models"
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-foreground/50 font-bold">Academic Subject</label>
                        <select
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full cursor-pointer"
                        >
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-foreground/50 font-bold">Difficulty Level</label>
                        <select
                          value={newDifficulty}
                          onChange={(e) => setNewDifficulty(e.target.value as any)}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full cursor-pointer"
                        >
                          <option value="easy">Easy 🟢</option>
                          <option value="medium">Medium 🟡</option>
                          <option value="hard">Hard 🔴</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-foreground/50 font-bold">Timer Constraint (Minutes)</label>
                        <input
                          type="number"
                          required
                          value={newTimeLimit}
                          onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                          className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-foreground/50 font-bold">Quick Description</label>
                      <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="e.g. Answer Kepler orbital velocity ratio equations..."
                        className="glass-input text-xs px-3 py-2 rounded-lg w-full"
                      />
                    </div>

                    {/* DYNAMIC QUESTIONS BUILDER */}
                    <div className="space-y-4 pt-2 border-t border-foreground/5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-wider text-cyan-400 font-extrabold">MCQ Questions ({newQuestions.length})</label>
                        <button
                          type="button"
                          onClick={addFormQuestion}
                          className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Question
                        </button>
                      </div>

                      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                        {newQuestions.map((q, qIdx) => (
                          <div key={q.id} className="p-4 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-3 relative">
                            {newQuestions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteFormQuestion(qIdx)}
                                className="absolute top-2 right-2 p-1 text-foreground/45 hover:text-rose-400 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div className="md:col-span-3 space-y-1">
                                <label className="text-[9px] text-foreground/45 font-bold">Question {qIdx + 1} Text</label>
                                <input
                                  type="text"
                                  required
                                  value={q.question_text}
                                  onChange={(e) => updateFormQuestionText(qIdx, e.target.value)}
                                  placeholder="e.g. What is the value of gravitational velocity?"
                                  className="glass-input text-[11px] px-2.5 py-1.5 rounded-lg w-full"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] text-foreground/45 font-bold">XP Value</label>
                                <input
                                  type="number"
                                  value={q.points}
                                  onChange={(e) => updateFormQuestionPoints(qIdx, Number(e.target.value))}
                                  className="glass-input text-[11px] px-2.5 py-1.5 rounded-lg w-full"
                                />
                              </div>
                            </div>

                            {/* Options grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct_${q.id}`}
                                    checked={q.correct_option_idx === oIdx}
                                    onChange={() => updateFormQuestionCorrectIdx(qIdx, oIdx)}
                                    className="cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    required
                                    value={opt}
                                    onChange={(e) => updateFormQuestionOption(qIdx, oIdx, e.target.value)}
                                    placeholder={`Choice ${String.fromCharCode(65 + oIdx)}`}
                                    className="glass-input text-[11px] px-2 py-1 rounded-lg w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-foreground/5">
                      <button
                        type="button"
                        onClick={resetCreateForm}
                        className="px-4 py-2 rounded-xl bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={publishingQuiz}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        {publishingQuiz ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Publish Quiz"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* List of quiz cards */}
              <div className="space-y-4">
                {quizzes.map((quiz, idx) => {
                  const studentSub = studentResults.find(r => r.quiz_id === quiz.id);
                  const isHard = quiz.difficulty === "hard";
                  const isEasy = quiz.difficulty === "easy";

                  return (
                    <div 
                      key={quiz.id || idx}
                      className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.01]"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-bold font-mono uppercase">
                            {quiz.subject?.name || "Physics Core"}
                          </span>
                          
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                            isHard 
                              ? "bg-rose-500/10 text-rose-400" 
                              : isEasy 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {quiz.difficulty}
                          </span>

                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[8px] font-mono font-bold">
                            <Timer className="w-2.5 h-2.5" /> {quiz.time_limit} MIN
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-foreground/90 font-outfit">{quiz.title}</h4>
                        <p className="text-[11px] text-foreground/50 leading-relaxed max-w-xl">{quiz.description}</p>
                      </div>

                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-4 shrink-0">
                        {role === "student" ? (
                          studentSub ? (
                            <div className="text-left sm:text-right">
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase font-mono">
                                COMPLETED
                              </span>
                              <p className="text-[10px] text-cyan-400 font-bold mt-1 font-mono">Score: {studentSub.score}% accuracy</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => startQuizAttempt(quiz)}
                              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-[11px] font-bold shadow-md shadow-cyan-500/15 cursor-pointer font-sans"
                            >
                              Attend Quiz
                            </button>
                          )
                        ) : (
                          /* Teacher statistics controls */
                          <button
                            onClick={() => loadStatsAndLeaderboard(quiz)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold cursor-pointer font-mono"
                          >
                            Stats & Podium
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Sidebar drawer: Leaderboard and Stats details */}
          <div className="space-y-6">
            
            {selectedQuizForStats ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-5 space-y-4 border border-cyan-500/25 bg-cyan-500/[0.02]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold font-outfit text-sm">Podium & Metrics</h3>
                    <p className="text-[9px] text-foreground/45 max-w-[180px] truncate">{selectedQuizForStats.title}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedQuizForStats(null)}
                    className="p-1 text-foreground/40 hover:text-foreground hover:bg-white/5 rounded text-xs font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Performance Analytics Grid */}
                <div className="grid grid-cols-2 gap-2 text-center text-sans">
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-0.5">
                    <span className="text-[8px] text-foreground/45 uppercase tracking-wider font-bold">Class Average</span>
                    <p className="text-sm font-extrabold text-cyan-400 font-mono">{activeAnalytics.averageScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-0.5">
                    <span className="text-[8px] text-foreground/45 uppercase tracking-wider font-bold">Passing Rate</span>
                    <p className="text-sm font-extrabold text-emerald-400 font-mono">{activeAnalytics.passingRate}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-0.5">
                    <span className="text-[8px] text-foreground/45 uppercase tracking-wider font-bold">Submissions</span>
                    <p className="text-sm font-extrabold text-indigo-400 font-mono">{activeAnalytics.totalSubmissions}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.01] border border-foreground/5 space-y-0.5">
                    <span className="text-[8px] text-foreground/45 uppercase tracking-wider font-bold">Record High</span>
                    <p className="text-sm font-extrabold text-purple-400 font-mono">{activeAnalytics.highScore}%</p>
                  </div>
                </div>

                {/* Leaderboard Table List */}
                <div className="space-y-3 font-sans">
                  <h4 className="text-[9px] uppercase tracking-wider text-cyan-400 font-extrabold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Timed Leaderboard
                  </h4>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {activeLeaderboard.map((row, rIdx) => {
                      const isGold = rIdx === 0;
                      const isSilver = rIdx === 1;

                      return (
                        <div 
                          key={rIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isGold 
                              ? "bg-amber-500/10 border-amber-500/25" 
                              : isSilver 
                                ? "bg-slate-400/10 border-slate-400/25" 
                                : "bg-white/[0.01] border-foreground/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                              isGold ? "bg-amber-500 text-black" : isSilver ? "bg-slate-400 text-black" : "bg-white/5 text-foreground/50"
                            }`}>
                              #{rIdx + 1}
                            </span>
                            <div>
                              <h5 className="text-[11px] font-bold text-foreground/90">{row.student?.profile?.full_name || "Cadet"}</h5>
                              <p className="text-[8px] text-foreground/40 font-mono">{row.student?.profile?.email}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold text-cyan-400 font-mono">{row.score}%</p>
                            <span className="text-[8px] text-foreground/35 font-mono">{new Date(row.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="glass-panel rounded-2xl p-5 space-y-4 text-center">
                <Trophy className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Timed Leaderboards</h3>
                <p className="text-[10px] text-foreground/60 leading-relaxed font-sans">
                  {role === "student"
                    ? "Complete live timed MCQ assessments on the left to see instant scores and gain academic standings on the leaderboard!"
                    : "Select a published online assessment on the left to view stats and student podium rankings."}
                </p>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
