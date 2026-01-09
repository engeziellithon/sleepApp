import translations from '@/data/translations.json';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

type Locale = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
    const { locale, setLocale } = useAppStore();

    useEffect(() => {
        // Initialize if needed, but Zustand persist handles it.
        // Maybe strict check?
    }, []);

    const t = (key: TranslationKey) => {
        return translations[locale][key] || key;
    };

    return { t, locale, setLocale };
}
