import { X, User, ArrowRight, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAppStore();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            login(name, email);
            setIsLoading(false);
            setStep('success');

            // Auto close after success
            setTimeout(() => {
                onClose();
                setStep('form'); // Reset for next time
            }, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-charcoal border border-foreground/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">

                {step === 'form' ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{t('auth_title')}</h2>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm mb-6">
                            {t('auth_desc')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder={t('auth_name_placeholder')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 flex items-center justify-center font-bold">@</div>
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('auth_email_placeholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {t('auth_submit')}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button className="text-xs text-gray-400 hover:text-purple-400 transition-colors">
                                {t('auth_login_alt')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Saved!</h3>
                        <p className="text-gray-400 text-sm">Welcome aboard, {name}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
