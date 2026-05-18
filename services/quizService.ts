import { createClient } from "@/lib/supabase/client";

export interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option_idx: number;
  points: number;
}

export interface Quiz {
  id?: string;
  subject_id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  difficulty: "easy" | "medium" | "hard";
  time_limit?: number; // in minutes
  max_score: number;
  due_date?: string;
  created_at?: string;
}

export interface QuizResult {
  id?: string;
  quiz_id: string;
  student_id: string;
  score: number;
  feedback?: string;
  completed_at?: string;
}

export const quizService = {
  /**
   * Fetch all quizzes
   */
  async getQuizzes() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quizzes")
      .select("*, subject:subjects(name, code)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Create a new online MCQ quiz
   */
  async createQuiz(quiz: Quiz) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quizzes")
      .insert([quiz])
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Submit quiz result (when student finishes quiz)
   */
  async submitQuizResult(result: QuizResult) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .upsert([result], { onConflict: "quiz_id, student_id" })
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch leaderboard rankings for a specific quiz (Ranks students by high score first, then completion time!)
   */
  async getLeaderboard(quizId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*, student:students(id, profile:profiles(full_name, email))")
      .eq("quiz_id", quizId)
      .order("score", { ascending: false })
      .order("completed_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch quiz results for a specific student
   */
  async getStudentQuizResults(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*, quiz:quizzes(title, max_score, difficulty)")
      .eq("student_id", studentId);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch quiz statistics & analytics for teachers
   */
  async getQuizAnalytics(quizId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("score")
      .eq("quiz_id", quizId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        passingRate: 0,
        highScore: 0,
      };
    }

    const scores = data.map((d) => Number(d.score));
    const totalSubmissions = scores.length;
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round((totalScore / totalSubmissions) * 10) / 10;
    const highScore = Math.max(...scores);
    
    // Passing score set at 50%
    const passingScores = scores.filter((score) => score >= 50);
    const passingRate = Math.round((passingScores.length / totalSubmissions) * 100);

    return {
      totalSubmissions,
      averageScore,
      passingRate,
      highScore,
    };
  },
};
