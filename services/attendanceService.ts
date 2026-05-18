import { createClient } from "@/lib/supabase/client";

export interface AttendanceRecord {
  id?: string;
  student_id: string;
  class_id: string;
  date: string;
  status: "present" | "absent" | "tardy" | "excused";
  remarks?: string;
}

export const attendanceService = {
  /**
   * Fetch all active school classes
   */
  async getClasses() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("classes")
      .select("*, advisor:teachers(id, profiles(full_name))")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch students belonging to a specific class cohort
   */
  async getStudentsByClass(classId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("students")
      .select("*, profile:profiles(id, full_name, email)")
      .eq("class_id", classId)
      .eq("enrollment_status", "active");

    if (error) throw error;
    return data;
  },

  /**
   * Fetch attendance records for a class on a specific date
   */
  async getAttendanceByClassAndDate(classId: string, date: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("class_id", classId)
      .eq("date", date);

    if (error) throw error;
    return data;
  },

  /**
   * Bulk upsert attendance records
   */
  async saveAttendance(records: AttendanceRecord[]) {
    const supabase = createClient();
    
    // Perform bulk upsert matching on unique constraint (student_id, date)
    const { data, error } = await supabase
      .from("attendance")
      .upsert(records, { onConflict: "student_id, date" })
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch attendance records for a specific student (used by students and parents)
   */
  async getAttendanceForStudent(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("attendance")
      .select("*, class:classes(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch attendance records for a parent's children
   */
  async getChildrenAttendance(parentId: string) {
    const supabase = createClient();
    
    // First find parent's children
    const { data: children, error: childError } = await supabase
      .from("students")
      .select("id, profile:profiles(full_name)")
      .eq("parent_id", parentId);

    if (childError) throw childError;
    if (!children || children.length === 0) return [];

    const childrenIds = children.map((c) => c.id);

    // Fetch attendance for all children
    const { data, error } = await supabase
      .from("attendance")
      .select("*, student:students(id, profile:profiles(full_name)), class:classes(name)")
      .in("student_id", childrenIds)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to realtime attendance updates
   */
  subscribeToAttendance(callback: (payload: any) => void) {
    const supabase = createClient();
    
    const channel = supabase
      .channel("realtime-attendance-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
