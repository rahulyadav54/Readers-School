"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { useAuthStore } from "@/lib/store/authStore";
import { usePWA } from "@/hooks/usePWA";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const { isOnline } = usePWA();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ThemeProvider>
      {/* Universal decorative cyber grid */}
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none z-[-1]" />

      {/* Dynamic PWA offline warning banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-rose-600/90 text-white backdrop-blur-md text-center py-2 text-xs font-semibold tracking-wide border-b border-rose-500/20 shadow-md">
          ⚠️ Offline Mode: Showing cached pages. Database changes will sync once reconnected.
        </div>
      )}

      {children}
    </ThemeProvider>
  );
}
