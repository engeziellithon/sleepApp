import { Flame } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function StreakCounter() {
    const { streakDays, checkStreak } = useAppStore();
    const { t } = useTranslation();

    useEffect(() => {
        checkStreak();
    }, [checkStreak]);

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-charcoal/50 rounded-full border border-white/5 backdrop-blur-md">
            <Flame className={`w-5 h-5 ${streakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-500'}`} />
            <span className="font-bold text-lg font-mono">
                {streakDays} <span className="text-xs font-normal text-gray-400">{t('streak_days')}</span>
            </span>
        </div>
    );
}
