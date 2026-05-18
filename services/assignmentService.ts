import { createClient } from "@/lib/supabase/client";

export interface Assignment {
  id?: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  pdf_url?: string;
  due_date: string;
  max_score: number;
  created_at?: string;
}

export interface Submission {
  id?: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  comments?: string;
  score?: number;
  graded_by?: string;
  created_at?: string;
}

export const assignmentService = {
  /**
   * Fetch assignments along with their subject name and advisor profiles
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
   * Create and publish a new assignment
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
   * Fetch submissions for a specific assignment (for teachers/grading)
   */
  async getSubmissionsForAssignment(assignmentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*, student:students(id, profile:profiles(full_name, email))")
      .eq("assignment_id", assignmentId);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch student's own submissions
   */
  async getSubmissionsForStudent(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("student_id", studentId);

    if (error) throw error;
    return data;
  },

  /**
   * Submit homework solution file
   */
  async submitHomework(submission: Submission) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .upsert([submission], { onConflict: "assignment_id, student_id" })
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Grade a student's submission
   */
  async gradeSubmission(submissionId: string, score: number, remarks: string, gradedBy: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .update({ score, comments: remarks, graded_by: gradedBy })
      .eq("id", submissionId)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Upload an assignment PDF worksheet to Supabase Storage
   */
  async uploadAssignmentPDF(file: File) {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `worksheets/${fileName}`;

    // Upload to 'assignments' bucket
    const { error: uploadError } = await supabase.storage
      .from("assignments")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("assignments")
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Upload a student submission file to Supabase Storage
   */
  async uploadSubmissionFile(file: File) {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    // Upload to 'submissions' bucket
    const { error: uploadError } = await supabase.storage
      .from("submissions")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("submissions")
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Subscribe to realtime assignments updates
   */
  subscribeToAssignments(callback: (payload: any) => void) {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-assignments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignments" },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to realtime submissions updates (for live grading indicators!)
   */
  subscribeToSubmissions(callback: (payload: any) => void) {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
