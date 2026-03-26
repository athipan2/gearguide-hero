import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'th' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'th';
  const navLang = navigator.language.toLowerCase();
  return navLang.startsWith('en') ? 'en' : 'th';
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'th' ? 'en' : 'th' })),
    }),
    {
      name: 'geartrail-language-storage',
    }
  )
);
