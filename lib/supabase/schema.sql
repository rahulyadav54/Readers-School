-- ==========================================================
-- READERS SCHOOL - COMPLETE DATABASE SCHEMA & SECURITY SYSTEM
-- ==========================================================

-- Enable standard UUID generator extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. BASE SYSTEM TABLES
-- ==========================================

-- profiles: Public user profiles linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 2. ACADEMIC INFRASTRUCTURE TABLES
-- ==========================================

-- teachers: Extended profiles for teachers
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT,
  department TEXT,
  hire_date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- classes: School cohorts or classrooms (e.g., Grade 10-A)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  room TEXT,
  advisor_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- parents: Extended profiles for parents/guardians
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  relationship TEXT NOT NULL DEFAULT 'Guardian'
);

-- students: Extended profiles for students
CREATE TABLE IF NOT EXISTS public.students (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  grade_level TEXT,
  xp INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  badges JSONB DEFAULT '[]'::jsonb NOT NULL,
  achievements JSONB DEFAULT '[]'::jsonb NOT NULL,
  enrollment_status TEXT DEFAULT 'active' CHECK (enrollment_status IN ('active', 'suspended', 'graduated', 'transferred')) NOT NULL
);

-- subjects: Academic subjects (e.g., Physics, Calculus)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 3. INTERACTION & TRACKING TABLES
-- ==========================================

-- attendance: Student attendance registry
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'tardy', 'excused')),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (student_id, date)
);

-- assignments: Homework tasks published by instructors
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_score INTEGER DEFAULT 100 CHECK (max_score > 0) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- quizzes: Modular quizzes for testing
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB DEFAULT '[]'::jsonb NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  time_limit INTEGER, -- in minutes
  max_score INTEGER DEFAULT 100 CHECK (max_score > 0) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- quiz_results: Submitted grades for student quizzes
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0),
  feedback TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (quiz_id, student_id)
);

-- submissions: Homework solutions submitted by students
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  comments TEXT,
  score INTEGER CHECK (score >= 0),
  graded_by UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (assignment_id, student_id)
);

-- announcements: General board bulletins
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'teacher', 'parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- notifications: Stateful cybernetic inbox triggers
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  type TEXT DEFAULT 'announcement' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 4. PERFORMANCE & LOGISTICS INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_parent ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_subjects_class ON public.subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON public.subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON public.quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON public.quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);

-- ==========================================
-- 5. SUPABASE AUTH TRIGGER SETUP
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Sync public profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Academic Cadet'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  -- 2. Automatically link role profile table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (id, enrollment_status)
    VALUES (NEW.id, 'active');
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'teacher' THEN
    INSERT INTO public.teachers (id, department)
    VALUES (NEW.id, 'Core Science Faculty');
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'parent' THEN
    INSERT INTO public.parents (id, relationship)
    VALUES (NEW.id, 'Guardian');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Profile-Sync Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS across all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles read: anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles update: self" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Students Policies
CREATE POLICY "Students read: anyone" ON public.students FOR SELECT USING (true);
CREATE POLICY "Students update: self or admin" ON public.students FOR UPDATE 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Teachers Policies
CREATE POLICY "Teachers read: anyone" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Teachers update: self or admin" ON public.teachers FOR UPDATE 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Parents Policies
CREATE POLICY "Parents read: anyone" ON public.parents FOR SELECT USING (true);
CREATE POLICY "Parents update: self or admin" ON public.parents FOR UPDATE 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Classes Policies
CREATE POLICY "Classes read: anyone" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Classes write: admin only" ON public.classes FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subjects Policies
CREATE POLICY "Subjects read: anyone" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Subjects write: admin only" ON public.subjects FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Attendance Policies
CREATE POLICY "Attendance read: related users" ON public.attendance FOR SELECT
  USING (
    auth.uid() = student_id 
    OR EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );
CREATE POLICY "Attendance write: teachers and admins" ON public.attendance FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Assignments Policies
CREATE POLICY "Assignments read: anyone" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Assignments write: teachers and admins" ON public.assignments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Quizzes Policies
CREATE POLICY "Quizzes read: anyone" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Quizzes write: teachers and admins" ON public.quizzes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Quiz Results Policies
CREATE POLICY "Quiz results read: related users" ON public.quiz_results FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );
CREATE POLICY "Quiz results write: teachers and admins" ON public.quiz_results FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Announcements Policies
CREATE POLICY "Announcements read: target audience" ON public.announcements FOR SELECT
  USING (
    target_role = 'all' 
    OR target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Announcements write: teachers and admins" ON public.announcements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Notifications Policies
CREATE POLICY "Notifications read & write: self" ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

-- Submissions Policies
CREATE POLICY "Submissions read: related users" ON public.submissions FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND parent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );
CREATE POLICY "Submissions write: student self or teacher" ON public.submissions FOR ALL
  USING (
    auth.uid() = student_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );
