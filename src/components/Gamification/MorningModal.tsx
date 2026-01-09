import { useState, useEffect } from 'react';
import { Sun, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function MorningModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Simple check: Show if it's morning (6-11am) and haven't shown today
        // For MVP/Demo: Just show it if not shown in this session (mock)
        const hasShown = sessionStorage.getItem('morning_shown');
        const hours = new Date().getHours();

        // Logic: If it is morning (or for demo purposes, always show once per session)
        if (!hasShown) {
            setTimeout(() => setIsOpen(true), 1000); // Delay for effect
        }
    }, []);

    const handleResponse = (good: boolean) => {
        setIsOpen(false);
        sessionStorage.setItem('morning_shown', 'true');
        // We could log this to metrics
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-charcoal border border-foreground/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sun className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">{t('morning_title')}</h2>
                <p className="text-gray-400 mb-6">{t('morning_desc')}</p>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleResponse(false)}
                        className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <ThumbsDown className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-bold">{t('morning_bad')}</span>
                    </button>

                    <button
                        onClick={() => handleResponse(true)}
                        className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl flex items-center justify-center gap-2"
                    >
                        <ThumbsUp className="w-4 h-4 text-white" />
                        <span className="text-white font-bold">{t('morning_good')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
