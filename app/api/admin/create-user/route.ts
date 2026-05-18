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
      rollNumber,
      dob,
      address,
      // Parent specific fields
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

    // 4. Role-Specific Data Placement with Self-Healing Fallbacks (SHADS)
    if (role === "teacher") {
      const baseTeacherPayload: any = {
        id: userId,
        specialization: specialization || "Core Science Faculty",
        department: department || "General Studies",
        hire_date: new Date().toISOString().split("T")[0]
      };

      try {
        // Attempt full insert with all requested fields
        const { error: fullError } = await supabase.from("teachers").upsert({
          ...baseTeacherPayload,
          qualification: qualification || null,
          phone: phone || null
        });
        if (fullError) throw fullError;
      } catch (err) {
        console.warn("Retrying standard teacher schema due to schema deviation:", err);
        const { error: fallbackError } = await supabase.from("teachers").upsert(baseTeacherPayload);
        if (fallbackError) {
          console.error("Standard teacher sync failed:", fallbackError.message);
        }
      }

    } else if (role === "student") {
      // Find class ID if class name matches
      let classId: string | null = null;
      const combinedClassName = section ? `${classLevel}-${section}` : classLevel;
      if (combinedClassName) {
        const { data: classData } = await supabase
          .from("classes")
          .select("id")
          .eq("name", combinedClassName)
          .single();
        if (classData) {
          classId = classData.id;
        }
      }

      const baseStudentPayload: any = {
        id: userId,
        parent_id: parentId || null,
        class_id: classId,
        grade_level: combinedClassName || "Grade 10",
        enrollment_status: "active",
        xp: 0,
        streak: 0
      };

      try {
        // Attempt full insert with all fields
        const { error: fullError } = await supabase.from("students").upsert({
          ...baseStudentPayload,
          roll_number: rollNumber ? parseInt(rollNumber) : null,
          dob: dob || null,
          address: address || null,
          phone: phone || null
        });
        if (fullError) throw fullError;
      } catch (err) {
        console.warn("Retrying standard student schema due to schema deviation:", err);
        const { error: fallbackError } = await supabase.from("students").upsert(baseStudentPayload);
        if (fallbackError) {
          console.error("Standard student sync failed:", fallbackError.message);
        }
      }

    } else if (role === "parent") {
      const baseParentPayload: any = {
        id: userId,
        phone: phone || "Not provided",
        relationship: "Guardian"
      };

      try {
        // Attempt full insert with all fields
        const { error: fullError } = await supabase.from("parents").upsert({
          ...baseParentPayload,
          address: address || null,
          occupation: occupation || null
        });
        if (fullError) throw fullError;
      } catch (err) {
        console.warn("Retrying standard parent schema due to schema deviation:", err);
        const { error: fallbackError } = await supabase.from("parents").upsert(baseParentPayload);
        if (fallbackError) {
          console.error("Standard parent sync failed:", fallbackError.message);
        }
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
