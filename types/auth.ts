export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "student" | "teacher" | "parent" | "admin";
  createdAt: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  accessToken: string | null;
  expiresAt?: number;
}
