import { BackendInterface, AuthResult } from "./types";
import type { User, Session } from "@supabase/supabase-js";

const STORAGE_KEY_REVIEWS = "geartrail_local_reviews";
const STORAGE_KEY_MEDIA = "geartrail_local_media";
const STORAGE_KEY_AUTH = "geartrail_local_auth";

// Default credentials provided by user
const ADMIN_EMAIL = "terdoomcom1@gmail.com";
const ADMIN_PASSWORD = "Got0896177698";

export class LocalBackend implements BackendInterface {
  private getStorageData(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setStorageData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const mockUser: User = {
        id: "local-admin-id",
        email: ADMIN_EMAIL,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: { name: "Admin" },
        created_at: new Date().toISOString(),
      } as any;

      const mockSession: Session = {
        access_token: "local-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "local-refresh",
        user: mockUser,
      } as any;

      this.setStorageData(STORAGE_KEY_AUTH, { user: mockUser, session: mockSession });
      return { user: mockUser, session: mockSession, error: null };
    }
    return { user: null, session: null, error: new Error("Invalid credentials") };
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }

  async getUser(): Promise<User | null> {
    const auth = this.getStorageData(STORAGE_KEY_AUTH);
    return auth?.user || null;
  }

  async checkRoles(userId: string): Promise<{ isAdmin: boolean; isEditor: boolean }> {
    return { isAdmin: true, isEditor: true }; // Local backend assumes full access for the mock user
  }

  async getReviews(): Promise<any[]> {
    return this.getStorageData(STORAGE_KEY_REVIEWS) || [];
  }

  async getReviewById(id: string): Promise<any> {
    const reviews = await this.getReviews();
    return reviews.find(r => r.id === id || r.slug === id) || null;
  }

  async saveReview(review: any): Promise<{ data: any; error: Error | null }> {
    const reviews = await this.getReviews();
    const existingIndex = reviews.findIndex(r => r.id === review.id);

    if (existingIndex >= 0) {
      reviews[existingIndex] = { ...reviews[existingIndex], ...review, updated_at: new Date().toISOString() };
    } else {
      const newReview = {
        ...review,
        id: review.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      reviews.push(newReview);
      review = newReview;
    }

    this.setStorageData(STORAGE_KEY_REVIEWS, reviews);
    return { data: review, error: null };
  }

  async deleteReview(id: string): Promise<{ error: Error | null }> {
    const reviews = await this.getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    this.setStorageData(STORAGE_KEY_REVIEWS, filtered);
    return { error: null };
  }

  async getMedia(): Promise<any[]> {
    return this.getStorageData(STORAGE_KEY_MEDIA) || [];
  }

  async uploadMedia(file: File, bucket: string): Promise<{ data: any; error: Error | null }> {
    // In local mode, we'll use a data URL to simulate upload
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const media = this.getMediaSync();
        const newMedia = {
          id: crypto.randomUUID(),
          url: reader.result as string,
          file_name: file.name,
          file_path: `local/${file.name}`,
          file_size: file.size,
          mime_type: file.type,
          bucket,
          created_at: new Date().toISOString(),
        };
        media.push(newMedia);
        this.setStorageData(STORAGE_KEY_MEDIA, media);
        resolve({ data: newMedia, error: null });
      };
      reader.readAsDataURL(file);
    });
  }

  private getMediaSync(): any[] {
    return this.getStorageData(STORAGE_KEY_MEDIA) || [];
  }

  async deleteMedia(id: string, path: string, bucket: string): Promise<{ error: Error | null }> {
    const media = this.getMediaSync();
    const filtered = media.filter(m => m.id !== id);
    this.setStorageData(STORAGE_KEY_MEDIA, filtered);
    return { error: null };
  }

  getMediaUrl(path: string, bucket: string): string {
    const media = this.getMediaSync();
    const item = media.find(m => m.file_path === path);
    return item?.url || "";
  }
}
