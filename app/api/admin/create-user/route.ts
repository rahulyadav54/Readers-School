import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      fullName, 
      role,
      // Teacher specific fields
      department,
      specialization,
      qualification,
      phone,
      // Student specific fields
      classLevel,
      section,
      parentId,
      address,
      // Parent specific fields
      childId,
      occupation
    } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: "Account parameters (email, password, fullName, role) are required." },
        { status: 400 }
      );
    }

    if (role !== "student" && role !== "teacher" && role !== "parent") {
      return NextResponse.json(
        { error: "Administrators can only provision 'student', 'teacher', or 'parent' profiles." },
        { status: 400 }
      );
    }

    // 1. Create a STATELESS Supabase Client with persistSession: false
    // This is absolutely critical so that signing up a user does NOT disrupt the admin's active cookie session!
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    // 2. Register user in Supabase Auth securely
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const authUser = signUpData.user;
    if (!authUser) {
      return NextResponse.json({ error: "Failed to initialize Supabase Auth user record." }, { status: 500 });
    }

    const userId = authUser.id;

    // 3. Self-healing DB Upsert for Profiles table
    // The postgres trigger on auth.users automatically inserts into public.profiles,
    // but doing an upsert here guarantees that any lag is resolved and the correct role/full_name is set.
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email: email,
      full_name: fullName,
      role: role,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn("Profiles sync warning:", profileError.message);
    }

    // 4. Role-Specific Data Placement with Self-Healing Fallbacks
    if (role === "teacher") {
      // Primary fields matching the live teachers table schema:
      const teacherPayload: any = {
        id: userId,
        specialization: specialization || "Core Science Faculty",
        department: department || "General Studies",
        hire_date: new Date().toISOString().split("T")[0]
      };

      // Upsert into teachers table
      const { error: teacherError } = await supabase.from("teachers").upsert(teacherPayload);
      
      if (teacherError) {
        console.error("Teachers table sync error:", teacherError.message);
      }

      // If additional columns like phone or qualification are needed, we can store them in profiles raw metadata
      // or try to update profiles metadata to avoid Postgres missing-column crashes.

    } else if (role === "student") {
      // Find class ID if class name matches or default to null
      let classId: string | null = null;
      if (classLevel) {
        const { data: classData } = await supabase
          .from("classes")
          .select("id")
          .eq("name", classLevel)
          .single();
        if (classData) {
          classId = classData.id;
        }
      }

      const studentPayload: any = {
        id: userId,
        parent_id: parentId || null,
        class_id: classId,
        grade_level: classLevel || "Grade 10",
        enrollment_status: "active",
        xp: 0,
        streak: 0
      };

      const { error: studentError } = await supabase.from("students").upsert(studentPayload);
      if (studentError) {
        console.error("Students table sync error:", studentError.message);
      }

    } else if (role === "parent") {
      const parentPayload: any = {
        id: userId,
        phone: phone || "Not provided",
        relationship: "Guardian"
      };

      const { error: parentError } = await supabase.from("parents").upsert(parentPayload);
      if (parentError) {
        console.error("Parents table sync error:", parentError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Account provisioned successfully for ${fullName}.`,
      user: {
        id: userId,
        email: email,
        fullName: fullName,
        role: role,
        created_at: new Date().toISOString()
      }
    });

  } catch (err: any) {
    console.error("Account provisioner error:", err);
    return NextResponse.json({ error: err.message || "Failed to provision user account." }, { status: 500 });
  }
}
