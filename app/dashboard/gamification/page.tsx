"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { gamificationService, StudentBadge, StudentAchievement } from "@/services/gamificationService";
import { 
  Trophy, Flame, Sparkles, Award, Star, Loader2, 
  TrendingUp, CheckCircle, Lock, Crown, CalendarCheck, ShieldAlert 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GamificationModulePage() {
  const { user, role } = useAuth();

  // Gamification Metrics
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<StudentBadge[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [celebrateXp, setCelebrateXp] = useState<string | null>(null);

  // Mock fallbacks for zero-setup sandbox testing
  const mockStats = {
    xp: 220,
    streak: 2,
    badges: [
      { id: "badge_xp_rookie", name: "Rookie Explorer", description: "Accumulate 100 total XP points", icon: "Award", unlocked_at: "5/18/2026", color: "text-cyan-400 border-cyan-500/25" }
    ],
    achievements: [
      { id: "xp_rookie", name: "Rookie Explorer", description: "Accumulate 100 total XP points", progress: 100, unlocked: true, reward_xp: 20 },
      { id: "xp_champion", name: "Academic Champion", description: "Accumulate 500 total XP points", progress: 44, unlocked: false, reward_xp: 100 },
      { id: "streak_3", name: "Consistent Scholar", description: "Reach a 3-day active study streak", progress: 66, unlocked: false, reward_xp: 30 }
    ]
  };

  const mockLeaderboard = [
    { xp: 620, streak: 5, profile: { full_name: "Marcus Vance", email: "marcus@readers.school" } },
    { xp: 410, streak: 3, profile: { full_name: "Sarah Chen", email: "sarah@readers.school" } },
    { xp: 220, streak: 2, profile: { full_name: user?.email ? (user?.user_metadata?.full_name || "Academic Cadet") : "Elena Petrova", email: user?.email || "elena@readers.school" } },
    { xp: 140, streak: 1, profile: { full_name: "Liam O'Connor", email: "liam@readers.school" } }
  ];

  useEffect(() => {
    loadGamifiedData();
  }, [user]);

  const loadGamifiedData = async () => {
    setLoading(true);
    try {
      if (user) {
        try {
          const stats = await gamificationService.getStudentStats(user.id);
          if (stats) {
            setXp(Number(stats.xp));
            setStreak(Number(stats.streak));
            setBadges((stats.badges as any) || []);
            setAchievements((stats.achievements as any) || []);
          } else {
            loadMockStats();
          }
        } catch (e) {
          loadMockStats();
        }
      } else {
        loadMockStats();
      }

      // Load Leaderboard
      try {
        const lb = await gamificationService.getGlobalLeaderboard();
        setLeaderboard(lb && lb.length > 0 ? lb : mockLeaderboard);
      } catch (e) {
        setLeaderboard(mockLeaderboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMockStats = () => {
    setXp(mockStats.xp);
    setStreak(mockStats.streak);
    setBadges(mockStats.badges);
    setAchievements(mockStats.achievements);
  };

  // Calculate dynamic level progress
  const levelInfo = gamificationService.calculateLevelInfo(xp);

  // Claim Daily Activity check in booster
  const handleClaimDailyCheckIn = async () => {
    if (claimingDaily) return;
    setClaimingDaily(true);

    try {
      if (user) {
        try {
          await gamificationService.incrementStudentStreak(user.id);
          await gamificationService.awardStudentXP(user.id, 25);
          
          setCelebrateXp("Daily Claim Bonus: +25 XP & +1 Day Streak! 🔥");
          setTimeout(() => setCelebrateXp(null), 3500);
          
          loadGamifiedData();
        } catch (e) {
          simulateDailyClaim();
        }
      } else {
        simulateDailyClaim();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaimingDaily(false);
    }
  };

  const simulateDailyClaim = () => {
    const nextStreak = streak + 1;
    const nextXp = xp + 25;
    
    setStreak(nextStreak);
    setXp(nextXp);

    // Dynamic award simulation
    let nextAchievements = achievements.map((ach) => {
      if (ach.id === "streak_3" && !ach.unlocked) {
        const progress = Math.min(Math.round((nextStreak / 3) * 100), 100);
        const unlocked = nextStreak >= 3;
        if (unlocked) {
          setBadges(prev => [...prev, {
            id: "badge_streak_3",
            name: "Consistent Scholar",
            description: "Unlocked for achieving a 3-day active streak!",
            icon: "Sparkles",
            unlocked_at: new Date().toLocaleDateString(),
            color: "text-purple-400 border-purple-500/25"
          }]);
        }
        return { ...ach, progress, unlocked };
      }
      return ach;
    });

    setAchievements(nextAchievements);
    setCelebrateXp("Daily Claim Bonus: +25 XP & +1 Day Streak! (Sandbox 🔥)");
    setTimeout(() => setCelebrateXp(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Floating Sparkle Toast */}
      <AnimatePresence>
        {celebrateXp && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md shadow-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <span>{celebrateXp}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              Gamification Center
            </span>
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
            Academic Hall of Achievements
          </h1>
          <p className="text-xs text-foreground/60">
            Earn experience points (XP) from homework assignments and online timed assessments to unlock achievements and rare academic badges.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-xs text-foreground/50">Fetching student scoreboard parameters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-sans">
          
          {/* LEFT COLUMN: PROGRESSION AND MILESTONES */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Level circular progression card */}
            <div className="glass-panel rounded-2xl p-6 border border-purple-500/25 bg-purple-500/[0.01] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -top-20 -left-20 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 text-center sm:text-left shrink-0">
                <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider font-mono">Academic Standing</span>
                <h2 className="text-2xl font-extrabold font-outfit text-foreground">Level {levelInfo.level} Scholar</h2>
                <div className="text-xs text-foreground/60 space-y-1">
                  <p>XP Collected: <span className="text-purple-400 font-bold font-mono">{levelInfo.currentXp} XP</span></p>
                  <p>Next level threshold: <span className="font-semibold font-mono">{levelInfo.xpNeededForNextLevel} XP</span></p>
                </div>
              </div>

              {/* Dynamic circular SVG progress gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-foreground/5 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-purple-500 fill-none"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 54}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - levelInfo.percentage / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-purple-400 font-mono">{levelInfo.percentage}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-foreground/45 font-bold">Progress</span>
                </div>
              </div>
            </div>

            {/* Streak & claim station */}
            <div className="glass-panel rounded-2xl p-5 border border-foreground/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/5 animate-pulse">
                  <Flame className="w-6 h-6 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-outfit">🔥 Daily Streak Study Booster</h3>
                  <p className="text-[11px] text-foreground/50">Keep learning to maintain your <span className="font-bold text-amber-400">{streak}-day streak</span> active!</p>
                </div>
              </div>

              <button
                onClick={handleClaimDailyCheckIn}
                disabled={claimingDaily}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/15 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {claimingDaily ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                Daily Check-In (+25 XP)
              </button>
            </div>

            {/* Achievements ledger */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm font-outfit flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Milestone achievements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((ach) => {
                  const isCompleted = ach.unlocked;

                  return (
                    <div 
                      key={ach.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        isCompleted 
                          ? "bg-purple-500/[0.02] border-purple-500/25" 
                          : "bg-white/[0.01] border-foreground/5"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-foreground/90">{ach.name}</h4>
                          <p className="text-[10px] text-foreground/55 leading-relaxed">{ach.description}</p>
                        </div>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-foreground/35 shrink-0" />
                        )}
                      </div>

                      {/* Custom progress slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-foreground/45">
                          <span>Progress: {ach.progress}%</span>
                          <span className="text-purple-400 font-bold">Reward: +{ach.reward_xp} XP</span>
                        </div>
                        <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-foreground/5 shadow-inner">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${ach.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: LEADERBOARD HALL AND PIN BOARD */}
          <div className="space-y-6">
            
            {/* Global XP Ranking Board */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-400" />
                Global Scholars Hall
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {leaderboard.map((row, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isTop1
                          ? "bg-amber-500/10 border-amber-500/25 shadow-md shadow-amber-500/5"
                          : isTop2 
                            ? "bg-slate-400/10 border-slate-400/25"
                            : isTop3 
                              ? "bg-amber-700/10 border-amber-700/25"
                              : "bg-white/[0.01] border-foreground/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                          isTop1 ? "bg-amber-500 text-black" : isTop2 ? "bg-slate-400 text-black" : isTop3 ? "bg-amber-700 text-white" : "bg-white/5 text-foreground/50"
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-[11px] font-bold text-foreground/90 leading-tight">{row.profile?.full_name}</h4>
                          <span className="text-[8px] text-foreground/35 font-mono">Streak: {row.streak} days 🔥</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-400 font-mono">{row.xp} XP</p>
                        <span className="text-[8px] text-foreground/35 font-mono">Level {Math.floor(row.xp / 150) + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Collectibles pins */}
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="font-bold font-outfit text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Rare unlocked badges
              </h3>

              {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-center text-sans text-[10px]">
                  {badges.map((badge, bIdx) => (
                    <motion.div 
                      key={badge.id || bIdx}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-xl border flex flex-col justify-center items-center gap-1.5 relative overflow-hidden bg-white/[0.01] ${badge.color}`}
                    >
                      <Award className="w-6 h-6 animate-pulse" />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground/95 truncate max-w-[90px]">{badge.name}</h4>
                        <p className="text-[8px] text-foreground/45 font-mono">Unlocked: {badge.unlocked_at}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 space-y-2 border border-dashed border-foreground/10 rounded-xl">
                  <Star className="w-6 h-6 text-foreground/20 mx-auto" />
                  <p className="text-[10px] text-foreground/45">No pins collected yet. Work on homework tasks to unlock rare pins!</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
