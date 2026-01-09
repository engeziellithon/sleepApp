import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    favorites: string[];
}

interface AppState {
    isPremium: boolean;
    onboardingComplete: boolean;
    streakDays: number;
    lastVisit: string | null;
    paywallOpen: boolean;
    paywallTrigger: 'default' | 'timer' | 'preset' | 'favorite' | 'streak';
    theme: 'dark' | 'light';
    locale: 'en' | 'pt';
    user: User | null;

    setPremium: (status: boolean) => void;
    setOnboardingComplete: () => void;
    incrementStreak: () => void;
    setPaywallOpen: (isOpen: boolean, trigger?: 'default' | 'timer' | 'preset' | 'favorite' | 'streak') => void;
    checkStreak: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
    setLocale: (locale: 'en' | 'pt') => void;
    login: (name: string, email: string) => void;
    logout: () => void;
    toggleFavorite: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            isPremium: false,
            onboardingComplete: false,
            streakDays: 0,
            lastVisit: null,
            paywallOpen: false,
            paywallTrigger: 'default',
            theme: 'dark',
            locale: 'en',
            user: null,

            setPremium: (status) => set({ isPremium: status }),
            setOnboardingComplete: () => set({ onboardingComplete: true }),
            setPaywallOpen: (isOpen, trigger = 'default') => set({ paywallOpen: isOpen, paywallTrigger: trigger }),
            setTheme: (theme) => set({ theme }),
            setLocale: (locale) => set({ locale }),
            login: (name, email) => set({ user: { name, email, favorites: [] } }),
            logout: () => set({ user: null }),

            toggleFavorite: (id) => {
                const user = get().user;
                if (!user) return;

                const exists = user.favorites.includes(id);
                const newFavs = exists
                    ? user.favorites.filter(f => f !== id)
                    : [...user.favorites, id];

                set({ user: { ...user, favorites: newFavs } });
            },

            incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),

            checkStreak: () => {
                const today = new Date().toDateString();
                const last = get().lastVisit;

                if (last === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (last === yesterday.toDateString()) {
                    set({ streakDays: get().streakDays + 1, lastVisit: today });
                } else {
                    set({ streakDays: 1, lastVisit: today });
                }
            }
        }),
        {
            name: 'sleep-app-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isPremium: state.isPremium,
                streakDays: state.streakDays,
                lastVisit: state.lastVisit,
                onboardingComplete: state.onboardingComplete,
                theme: state.theme,
                locale: state.locale,
                user: state.user
            }),
        }
    )
);
