import { useLanguage, Language } from '@/lib/language-store';
import { translations, TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    // @ts-expect-error - translations[language] is valid but TS might complain about dynamic key
    let translation = translations[language][key] || translations['th'][key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, value.toString());
      });
    }

    return translation;
  };

  return { t, language, setLanguage, toggleLanguage };
}
