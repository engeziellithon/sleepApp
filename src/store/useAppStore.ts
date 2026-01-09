import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
}

interface AppState {
    isPremium: boolean;
    onboardingComplete: boolean;
    streakDays: number;
    lastVisit: string | null;
    paywallOpen: boolean;
    theme: 'dark' | 'light';
    locale: 'en' | 'pt';
    user: User | null;

    setPremium: (status: boolean) => void;
    setOnboardingComplete: () => void;
    incrementStreak: () => void;
    setPaywallOpen: (isOpen: boolean) => void;
    checkStreak: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
    setLocale: (locale: 'en' | 'pt') => void;
    login: (name: string, email: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            isPremium: false,
            onboardingComplete: false,
            streakDays: 0,
            lastVisit: null,
            paywallOpen: false,
            theme: 'dark',
            locale: 'en',
            user: null,

            setPremium: (status) => set({ isPremium: status }),
            setOnboardingComplete: () => set({ onboardingComplete: true }),
            setPaywallOpen: (isOpen) => set({ paywallOpen: isOpen }),
            setTheme: (theme) => set({ theme }),
            setLocale: (locale) => set({ locale }),
            login: (name, email) => set({ user: { name, email } }),
            logout: () => set({ user: null }),

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
