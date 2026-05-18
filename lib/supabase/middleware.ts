import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // List of primary dashboard paths
  const dashboardRoutes = [
    "/admin-dashboard",
    "/student-dashboard",
    "/teacher-dashboard",
    "/parent-dashboard",
    "/dashboard"
  ];

  const isAccessingDashboard = dashboardRoutes.some(route => pathname.startsWith(route));

  // 1. Auth Protection: Redirect unauthenticated users trying to access dashboards
  if (isAccessingDashboard) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Fetch the role directly from the public.profiles table so it's always 100% accurate
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role || "student";

    // 2. Base Redirect: Redirect old '/dashboard' to new dynamic role-dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}-dashboard`;
      return NextResponse.redirect(url);
    }

    // 3. Strict Role-Based Route Guards:
    if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}-dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/teacher-dashboard") && !["teacher", "admin"].includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}-dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/parent-dashboard") && !["parent", "admin"].includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}-dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/student-dashboard") && !["student", "admin"].includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}-dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // 4. Guest Redirect: Redirect authenticated users away from auth pages (login/signup)
  if (pathname.startsWith("/auth") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role || "student";
    const url = request.nextUrl.clone();
    url.pathname = `/${role}-dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
