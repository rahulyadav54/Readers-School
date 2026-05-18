// ==========================================
// READERS SCHOOL - TYPESCRIPT DATABASE SCHEMA MODEL
// ==========================================

export type UserRole = "student" | "teacher" | "parent" | "admin";
export type EnrollmentStatus = "active" | "suspended" | "graduated" | "transferred";
export type AttendanceStatus = "present" | "absent" | "tardy" | "excused";

export interface DatabaseProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseTeacher {
  id: string;
  specialization?: string;
  department?: string;
  hire_date: string;
}

export interface DatabaseClass {
  id: string;
  name: string;
  room?: string;
  advisor_id?: string;
  created_at: string;
}

export interface DatabaseParent {
  id: string;
  phone?: string;
  relationship: string;
}

export interface DatabaseStudent {
  id: string;
  parent_id?: string;
  class_id?: string;
  grade_level?: string;
  enrollment_status: EnrollmentStatus;
}

export interface DatabaseSubject {
  id: string;
  name: string;
  code: string;
  class_id: string;
  teacher_id: string;
  created_at: string;
}

export interface DatabaseAttendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
}

export interface DatabaseAssignment {
  id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  pdf_url?: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface DatabaseSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  comments?: string;
  score?: number;
  graded_by?: string;
  created_at: string;
}

export interface DatabaseQuiz {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  questions: any;
  difficulty: "easy" | "medium" | "hard";
  time_limit?: number; // in minutes
  max_score: number;
  due_date?: string;
  created_at: string;
}

export interface DatabaseQuizResult {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  feedback?: string;
  completed_at: string;
}

export interface DatabaseAnnouncement {
  id: string;
  author_id: string;
  title: string;
  content: string;
  target_role: "all" | UserRole;
  created_at: string;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  created_at: string;
}

// Complete Database Schema Mapping
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DatabaseProfile;
        Insert: Omit<DatabaseProfile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update: Partial<DatabaseProfile>;
      };
      teachers: {
        Row: DatabaseTeacher;
        Insert: Omit<DatabaseTeacher, "hire_date"> & { hire_date?: string };
        Update: Partial<DatabaseTeacher>;
      };
      classes: {
        Row: DatabaseClass;
        Insert: Omit<DatabaseClass, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<DatabaseClass>;
      };
      parents: {
        Row: DatabaseParent;
        Insert: DatabaseParent;
        Update: Partial<DatabaseParent>;
      };
      students: {
        Row: DatabaseStudent;
        Insert: Omit<DatabaseStudent, "enrollment_status"> & { enrollment_status?: EnrollmentStatus };
        Update: Partial<DatabaseStudent>;
      };
      subjects: {
        Row: DatabaseSubject;
        Insert: Omit<DatabaseSubject, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<DatabaseSubject>;
      };
      attendance: {
        Row: DatabaseAttendance;
        Insert: Omit<DatabaseAttendance, "id" | "date" | "created_at"> & { id?: string; date?: string; created_at?: string };
        Update: Partial<DatabaseAttendance>;
      };
      assignments: {
        Row: DatabaseAssignment;
        Insert: Omit<DatabaseAssignment, "id" | "max_score" | "created_at"> & { id?: string; max_score?: number; created_at?: string };
        Update: Partial<DatabaseAssignment>;
      };
      quizzes: {
        Row: DatabaseQuiz;
        Insert: Omit<DatabaseQuiz, "id" | "max_score" | "created_at"> & { id?: string; max_score?: number; created_at?: string };
        Update: Partial<DatabaseQuiz>;
      };
      quiz_results: {
        Row: DatabaseQuizResult;
        Insert: Omit<DatabaseQuizResult, "id" | "completed_at"> & { id?: string; completed_at?: string };
        Update: Partial<DatabaseQuizResult>;
      };
      announcements: {
        Row: DatabaseAnnouncement;
        Insert: Omit<DatabaseAnnouncement, "id" | "target_role" | "created_at"> & { id?: string; target_role?: "all" | UserRole; created_at?: string };
        Update: Partial<DatabaseAnnouncement>;
      };
      notifications: {
        Row: DatabaseNotification;
        Insert: Omit<DatabaseNotification, "id" | "read" | "type" | "created_at"> & { id?: string; read?: boolean; type?: string; created_at?: string };
        Update: Partial<DatabaseNotification>;
      };
      submissions: {
        Row: DatabaseSubmission;
        Insert: Omit<DatabaseSubmission, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<DatabaseSubmission>;
      };
    };
  };
}
