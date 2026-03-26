import { useLanguageStore } from '@/lib/language-store';
import { translations, TranslationKeys } from '@/lib/translations';

export const useTranslation = () => {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations['th'][key] || key;
  };

  return { t, language, setLanguage, toggleLanguage };
};
