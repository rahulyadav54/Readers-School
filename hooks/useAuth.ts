"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    setUser,
    setSession,
    setProfile,
    setLoading,
    initialize,
    signOut,
  } = useAuthStore();

  useEffect(() => {
    // Proactively initialize auth state on hook load if not loaded yet
    if (isLoading && !session) {
      initialize();
    }
  }, [initialize, isLoading, session]);

  return {
    user,
    session,
    profile,
    role: profile?.role || null,
    fullName: profile?.fullName || "",
    isLoading,
    isAuthenticated: !!user,
    setUser,
    setSession,
    setProfile,
    setLoading,
    signOut,
  };
}
