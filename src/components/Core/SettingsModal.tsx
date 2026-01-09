import { X, Moon, Sun, Globe } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { theme, setTheme, locale, setLocale, user, logout } = useAppStore();
    const { t } = useTranslation();

    // Apply theme effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-charcoal border border-foreground/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* User Profile */}
                    {user && (
                        <div className="bg-foreground/5 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-xs text-purple-500 font-bold uppercase tracking-wider">{t('profile_hello')}</div>
                                <div className="font-bold text-lg">{user.name}</div>
                                <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
                            </div>
                            <span className="font-bold">Dark Mode</span>
                        </div>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`w-12 h-7 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="font-bold">Language</span>
                        </div>

                        <div className="flex bg-foreground/5 rounded-lg p-1">
                            <button
                                onClick={() => setLocale('en')}
                                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${locale === 'en' ? 'bg-foreground/20' : 'text-gray-500 hover:text-purple-500'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLocale('pt')}
                                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${locale === 'pt' ? 'bg-foreground/20' : 'text-gray-500 hover:text-purple-500'}`}
                            >
                                PT
                            </button>
                        </div>
                    </div>

                    {/* Logout */}
                    {user && (
                        <button
                            onClick={() => logout()}
                            className="w-full py-3 text-red-500 text-sm font-bold hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            {t('auth_logout')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
