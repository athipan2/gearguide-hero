import React, { Component, ErrorInfo, ReactNode } from "react";
import { translations } from "@/lib/translations";
import { Language } from "@/lib/language-store";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Manual translation since we can't use hooks in Class Components
      const stored = localStorage.getItem("language-storage");
      const lang: Language = stored ? (JSON.parse(stored).state?.language || 'th') : 'th';
      const t = (key: string) => {
        const parts = key.split('.');
        let result: unknown = translations[lang];
        for (const part of parts) {
          result = (result as Record<string, unknown>)?.[part];
        }
        return (result as string) || key;
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-background bg-noise p-4">
          <div className="max-w-md w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-destructive/5 rounded-full border-2 border-destructive/10">
                <svg className="h-12 w-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-primary uppercase tracking-tight">{t('error.title')}</h1>
              <p className="text-muted-foreground font-medium">
                {t('error.subtitle')} <br />
                {this.state.error?.message || t('error.try_again')}
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                {t('error.reload')}
              </button>
              <a
                href="/"
                className="text-primary font-bold hover:underline"
              >
                {t('error.back_home')}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
