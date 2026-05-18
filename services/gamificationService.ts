import { createClient } from "@/lib/supabase/client";

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon identifier
  unlocked_at: string;
  color: string;
}

export interface StudentAchievement {
  id: string;
  name: string;
  description: string;
  progress: number; // 0 to 100
  unlocked: boolean;
  reward_xp: number;
}

export const gamificationService = {
  /**
   * Fetch current gamified statistics of a student
   */
  async getStudentStats(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("students")
      .select("xp, streak, badges, achievements, profile:profiles(full_name)")
      .eq("id", studentId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Helper function to calculate level from absolute XP
   * Dynamic progression math formula: Level = Math.floor(XP / 150) + 1
   * Next level threshold calculation: Level * 150
   */
  calculateLevelInfo(xp: number) {
    const level = Math.floor(xp / 150) + 1;
    const currentLevelMinXp = (level - 1) * 150;
    const nextLevelMinXp = level * 150;
    const progressInCurrentLevel = xp - currentLevelMinXp;
    const levelXpRequired = nextLevelMinXp - currentLevelMinXp;
    const percentage = Math.min(Math.round((progressInCurrentLevel / levelXpRequired) * 100), 100);

    return {
      level,
      currentXp: xp,
      progressInCurrentLevel,
      xpNeededForNextLevel: nextLevelMinXp,
      percentage,
    };
  },

  /**
   * Award XP points and check for unlocked achievements
   */
  async awardStudentXP(studentId: string, amount: number) {
    const supabase = createClient();

    // 1. Fetch current stats
    const stats = await this.getStudentStats(studentId);
    if (!stats) throw new Error("Student stats not found.");

    const currentXp = Number(stats.xp) + amount;
    let badgesArray: StudentBadge[] = Array.isArray(stats.badges) ? stats.badges as any : [];
    let achievementsArray: StudentAchievement[] = Array.isArray(stats.achievements) ? stats.achievements as any : [];

    // Initialize base achievements if empty
    if (achievementsArray.length === 0) {
      achievementsArray = [
        { id: "xp_rookie", name: "Rookie Explorer", description: "Accumulate 100 total XP points", progress: 0, unlocked: false, reward_xp: 20 },
        { id: "xp_champion", name: "Academic Champion", description: "Accumulate 500 total XP points", progress: 0, unlocked: false, reward_xp: 100 },
        { id: "streak_3", name: "Consistent Scholar", description: "Reach a 3-day active study streak", progress: 0, unlocked: false, reward_xp: 30 }
      ];
    }

    // 2. Evaluate achievements progression
    achievementsArray = achievementsArray.map((ach) => {
      if (ach.unlocked) return ach;

      let nextProgress = ach.progress;
      let nextUnlocked = false;

      if (ach.id === "xp_rookie") {
        nextProgress = Math.min(Math.round((currentXp / 100) * 100), 100);
        if (currentXp >= 100) nextUnlocked = true;
      } else if (ach.id === "xp_champion") {
        nextProgress = Math.min(Math.round((currentXp / 500) * 100), 100);
        if (currentXp >= 500) nextUnlocked = true;
      }

      if (nextUnlocked && !ach.unlocked) {
        // Unlock associated badge
        const badgeColor = ach.id === "xp_rookie" ? "text-cyan-400 border-cyan-500/25" : "text-amber-400 border-amber-500/25";
        const newBadge: StudentBadge = {
          id: `badge_${ach.id}`,
          name: ach.name,
          description: ach.description,
          icon: ach.id === "xp_rookie" ? "Award" : "Trophy",
          unlocked_at: new Date().toLocaleDateString(),
          color: badgeColor
        };
        badgesArray.push(newBadge);
      }

      return {
        ...ach,
        progress: nextProgress,
        unlocked: nextUnlocked
      };
    });

    // 3. Update Database
    const { data, error } = await supabase
      .from("students")
      .update({
        xp: currentXp,
        badges: badgesArray,
        achievements: achievementsArray
      })
      .eq("id", studentId)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Increment daily login streak counter
   */
  async incrementStudentStreak(studentId: string) {
    const supabase = createClient();
    const stats = await this.getStudentStats(studentId);
    if (!stats) throw new Error("Student stats not found.");

    const nextStreak = Number(stats.streak) + 1;
    let achievementsArray: StudentAchievement[] = Array.isArray(stats.achievements) ? stats.achievements as any : [];
    let badgesArray: StudentBadge[] = Array.isArray(stats.badges) ? stats.badges as any : [];

    // Evaluate streak achievement
    achievementsArray = achievementsArray.map((ach) => {
      if (ach.id === "streak_3" && !ach.unlocked) {
        const nextProgress = Math.min(Math.round((nextStreak / 3) * 100), 100);
        const unlocked = nextStreak >= 3;
        
        if (unlocked) {
          badgesArray.push({
            id: "badge_streak_3",
            name: "Consistent Scholar",
            description: "Unlocked for achieving a 3-day active streak!",
            icon: "Sparkles",
            unlocked_at: new Date().toLocaleDateString(),
            color: "text-purple-400 border-purple-500/25"
          });
        }
        
        return { ...ach, progress: nextProgress, unlocked };
      }
      return ach;
    });

    const { data, error } = await supabase
      .from("students")
      .update({
        streak: nextStreak,
        badges: badgesArray,
        achievements: achievementsArray
      })
      .eq("id", studentId)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Global Student XP Leaderboard rankings
   */
  async getGlobalLeaderboard() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("students")
      .select("xp, streak, profile:profiles(full_name, email)")
      .order("xp", { ascending: false });

    if (error) throw error;
    return data;
  }
};
