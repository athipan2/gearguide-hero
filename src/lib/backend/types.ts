import type { User, Session } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface BackendInterface {
  // Auth
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  getUser: () => Promise<User | null>;
  checkRoles: (userId: string) => Promise<{ isAdmin: boolean; isEditor: boolean }>;

  // Database - Reviews
  getReviews: () => Promise<any[]>;
  getReviewById: (id: string) => Promise<any>;
  saveReview: (review: any) => Promise<{ data: any; error: Error | null }>;
  deleteReview: (id: string) => Promise<{ error: Error | null }>;

  // Database - Media
  getMedia: () => Promise<any[]>;
  uploadMedia: (file: File, bucket: string) => Promise<{ data: any; error: Error | null }>;
  deleteMedia: (id: string, path: string, bucket: string) => Promise<{ error: Error | null }>;
  getMediaUrl: (path: string, bucket: string) => string;
}
