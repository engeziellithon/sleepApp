import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export function ThemeController() {
    const { theme } = useAppStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return null;
}
