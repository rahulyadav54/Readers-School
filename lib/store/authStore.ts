import { create } from "zustand";
import { type User, type Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { type UserProfile } from "@/types/auth";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  initialize: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      set({ session, user: session?.user ?? null });

      if (session?.user) {
        // Fetch database profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          set({
            profile: {
              id: profileData.id,
              email: profileData.email,
              fullName: profileData.full_name,
              role: profileData.role as any,
              createdAt: profileData.created_at,
              updatedAt: profileData.updated_at,
            },
          });
        } else {
          // Fallback to metadata
          set({
            profile: {
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || "Academic Cadet",
              role: (session.user.user_metadata?.role as any) || "student",
              createdAt: session.user.created_at || "",
            },
          });
        }
      } else {
        set({ profile: null });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null, isLoading: false });
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            set({
              profile: {
                id: profileData.id,
                email: profileData.email,
                fullName: profileData.full_name,
                role: profileData.role as any,
                createdAt: profileData.created_at,
                updatedAt: profileData.updated_at,
              },
            });
          } else {
            set({
              profile: {
                id: session.user.id,
                email: session.user.email || "",
                fullName: session.user.user_metadata?.full_name || "Academic Cadet",
                role: (session.user.user_metadata?.role as any) || "student",
                createdAt: session.user.created_at || "",
              },
            });
          }
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error("Failed to initialize auth store:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      set({ user: null, session: null, profile: null });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
