import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { backend } from "@/lib/backend";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  resendConfirmation: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  const checkRoles = async (userId: string) => {
    const roles = await backend.checkRoles(userId);
    setIsAdmin(roles.isAdmin);
    setIsEditor(roles.isEditor);
  };

  useEffect(() => {
    // Keep Supabase subscription for real-time features if needed,
    // but check roles via backend service
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => checkRoles(session.user.id), 0);
        } else {
          // If Supabase session is gone, check backend service for user (fallback)
          const localUser = await backend.getUser();
          if (localUser) {
              setUser(localUser);
              checkRoles(localUser.id);
          } else {
              setIsAdmin(false);
              setIsEditor(false);
          }
        }
        setLoading(false);
      }
    );

    const initAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setSession(session);
            setUser(session.user);
            await checkRoles(session.user.id);
        } else {
            const localUser = await backend.getUser();
            if (localUser) {
                setUser(localUser);
                await checkRoles(localUser.id);
            }
        }
        setLoading(false);
    };

    initAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await backend.signIn(email, password);
    if (!result.error && result.user) {
        setUser(result.user);
        setSession(result.session);
        await checkRoles(result.user.id);
    }
    return { error: result.error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await backend.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isEditor, signIn, signUp, resendConfirmation, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
