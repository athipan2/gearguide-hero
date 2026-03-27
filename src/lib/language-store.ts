import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'th' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'th',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({
        language: state.language === 'th' ? 'en' : 'th'
      })),
    }),
    {
      name: 'language-storage',
    }
  )
);
