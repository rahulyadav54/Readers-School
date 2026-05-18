import { createClient } from "@/lib/supabase/client";

export interface Assignment {
  id?: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
}

export interface Quiz {
  id?: string;
  subject_id: string;
  title: string;
  description: string;
  time_limit: number;
  max_score: number;
  due_date?: string;
}

export interface QuizResult {
  id?: string;
  quiz_id: string;
  student_id: string;
  score: number;
  feedback?: string;
}

export const curriculumService = {
  /**
   * Fetch all subjects with class names and teachers details
   */
  async getSubjects() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("subjects")
      .select("*, class:classes(name), teacher:teachers(profiles(full_name))")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch assignments
   */
  async getAssignments() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("assignments")
      .select("*, subject:subjects(name, code), teacher:teachers(profiles(full_name))")
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Save a new assignment
   */
  async createAssignment(assignment: Assignment) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("assignments")
      .insert([assignment])
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch quizzes
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
   * Save a new quiz
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
   * Save student quiz test results
   */
  async saveQuizResult(result: QuizResult) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .upsert([result], { onConflict: "quiz_id, student_id" })
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch quiz scores for a student
   */
  async getQuizResultsForStudent(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*, quiz:quizzes(title, max_score, subject:subjects(name))")
      .eq("student_id", studentId);

    if (error) throw error;
    return data;
  },
};
