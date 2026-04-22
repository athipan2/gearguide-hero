import { BackendInterface, AuthResult } from "./types";
import type { User, Session } from "@supabase/supabase-js";

// Note: You will need to install pocketbase: npm install pocketbase
// import PocketBase from 'pocketbase';

export class PocketBaseBackend implements BackendInterface {
  // private pb: PocketBase;

  constructor() {
    // this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    console.warn("PocketBase Backend not fully implemented. Please provide URL.");
    return { user: null, session: null, error: new Error("PocketBase Backend not implemented") };
  }

  async signOut(): Promise<void> { }

  async getUser(): Promise<User | null> { return null; }

  async checkRoles(userId: string): Promise<{ isAdmin: boolean; isEditor: boolean }> {
    return { isAdmin: false, isEditor: false };
  }

  async getReviews(): Promise<any[]> { return []; }
  async getReviewById(id: string): Promise<any> { return null; }
  async saveReview(review: any): Promise<{ data: any; error: Error | null }> {
    return { data: null, error: new Error("Not implemented") };
  }
  async deleteReview(id: string): Promise<{ error: Error | null }> {
    return { error: new Error("Not implemented") };
  }
  async getMedia(): Promise<any[]> { return []; }
  async uploadMedia(file: File, bucket: string): Promise<{ data: any; error: Error | null }> {
    return { data: null, error: new Error("Not implemented") };
  }
  async deleteMedia(id: string, path: string, bucket: string): Promise<{ error: Error | null }> {
    return { error: new Error("Not implemented") };
  }
  getMediaUrl(path: string, bucket: string): string { return ""; }
}
