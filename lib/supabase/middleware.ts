import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // IMPORTANT: Avoid writing session logic or calling getUser() on static resources.
  // This refreshes the session cookie for the user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Auth Protection: Redirect unauthenticated users trying to access dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      // Keep target path to redirect back after successful login
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    const role = user.user_metadata?.role || "student";

    // 2. Base Dashboard Redirect: Redirect /dashboard to specific role dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const url = request.nextUrl.clone();
      url.pathname = `/dashboard/${role}`;
      return NextResponse.redirect(url);
    }

    // 3. Strict Role Guard: Redirect non-admins if they try to access another role's portal
    const targetRoles = ["student", "teacher", "parent", "admin"];
    const matchedTarget = targetRoles.find((r) => pathname.startsWith(`/dashboard/${r}`));

    if (matchedTarget && role !== "admin" && role !== matchedTarget) {
      const url = request.nextUrl.clone();
      url.pathname = `/dashboard/${role}`; // Force back to their own dashboard
      return NextResponse.redirect(url);
    }
  }

  // 4. Guest Redirect: Redirect authenticated users away from auth pages (login/signup/forgot-password)
  if (pathname.startsWith("/auth") && user) {
    const role = user.user_metadata?.role || "student";
    const url = request.nextUrl.clone();
    url.pathname = `/dashboard/${role}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
