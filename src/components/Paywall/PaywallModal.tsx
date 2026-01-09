import { X, Lock, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';

export function PaywallModal() {
    const { paywallOpen, setPaywallOpen, setPremium } = useAppStore();
    const { t } = useTranslation();

    if (!paywallOpen) return null;

    const handlePurchase = () => {
        // Mock purchase for MVP
        setPremium(true);
        setPaywallOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-charcoal border border-foreground/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={() => setPaywallOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-purple-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Hero Content */}
                <div className="text-center mb-8 pt-4">
                    <div className="w-16 h-16 bg-gradient-to-tr from-purple-glow to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--foreground)] to-gray-400 bg-clip-text text-transparent mb-2">
                        {t('modal_title')}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {t('modal_desc')}
                    </p>
                </div>

                {/* Pricing Options */}
                <div className="space-y-3 mb-8">
                    {/* Annual Plan (Anchor) */}
                    <button
                        onClick={handlePurchase}
                        className="w-full relative group border-2 border-purple-500 bg-purple-500/10 rounded-2xl p-4 flex items-center justify-between hover:bg-purple-500/20 transition-all"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {t('best_value')}
                        </div>
                        <div className="text-left">
                            <div className="font-bold">{t('plan_annual')}</div>
                            <div className="text-xs text-purple-300">{t('plan_annual_sub')}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg">R$ 39,90<span className="text-xs font-normal">/yr</span></div>
                            <div className="text-xs text-gray-400 line-through">R$ 119,90</div>
                        </div>
                    </button>

                    {/* Monthly Plan */}
                    <button
                        onClick={handlePurchase}
                        className="w-full border border-foreground/10 bg-foreground/5 rounded-2xl p-4 flex items-center justify-between hover:border-foreground/30 transition-all"
                    >
                        <div className="text-left">
                            <div className="font-bold">{t('plan_monthly')}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg">R$ 9,90<span className="text-xs font-normal">/mo</span></div>
                        </div>
                    </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-600 border border-charcoal"></div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                        <span>{t('trusted_by')}</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handlePurchase}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
                >
                    {t('cta_continue')}
                </button>
                <p className="text-center text-[10px] text-gray-600 mt-4">
                    Recurring billing. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
