import { createClient } from "@/lib/supabase/client";
import { type SignInWithPasswordCredentials, type SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const authService = {
  /**
   * Sign in user with email and password
   */
  async signIn(credentials: SignInWithPasswordCredentials) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  },

  /**
   * Sign up a new user with email and password
   */
  async signUp(credentials: SignUpWithPasswordCredentials) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      ...credentials,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
        ...credentials.options,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send a password reset email
   */
  async resetPassword(email: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Get the current active user session
   */
  async getSession() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get the current active user profile details
   */
  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};
