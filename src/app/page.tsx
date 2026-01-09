"use client";

import { useState } from 'react';
import { StreakCounter } from '@/components/Gamification/StreakCounter';
import { PaywallModal } from '@/components/Paywall/PaywallModal';
import { AudioMixer } from '@/components/Core/AudioMixer';
import { MorningModal } from '@/components/Gamification/MorningModal';
import { Play, Lock, Settings, User } from 'lucide-react';
import { SettingsModal } from '@/components/Core/SettingsModal';
import { ThemeController } from '@/components/Core/ThemeController';
import { useAppStore } from '@/store/useAppStore';
import content from '@/data/content.json';
import { useTranslation } from '@/hooks/useTranslation';
import { AuthModal } from '@/components/Auth/AuthModal';

export default function Home() {
  const { isPremium, setPaywallOpen, user } = useAppStore();
  const { t } = useTranslation();
  const [activeScenario, setActiveScenario] = useState<typeof content[0] | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleScenarioClick = (scenario: typeof content[0]) => {
    // If scenario is premium and user is NOT premium
    // We allow them to open it BUT the AudioEngine inside handles the Trap logic (15s limit).
    // Wait, the standard "Trap" strategy is: Let them play, then interrupt.
    // So we DON'T block initially. We let them in.

    // However, we want to visually indicate premium status.
    setActiveScenario(scenario);
  };

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--foreground)] to-gray-500 bg-clip-text text-transparent">
            {t('app_title')}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* User Button */}
          <button
            onClick={() => user ? setSettingsOpen(true) : setAuthOpen(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${user ? 'bg-purple-500/20 border-purple-500/50 text-purple-500' : 'bg-foreground/5 border-foreground/10 text-gray-400 hover:text-purple-500'}`}
          >
            {user ? (
              <span className="font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>

          <button onClick={() => setSettingsOpen(true)} className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
          <StreakCounter />
        </div>
      </header>

      {/* Scenarios Grid */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">{t('home_subtitle')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {content.map((item) => (
              <div
                key={item.id}
                onClick={() => handleScenarioClick(item)}
                className="group relative h-48 rounded-3xl bg-charcoal border border-foreground/5 overflow-hidden transition-all active:scale-[0.98] cursor-pointer"
              >
                {/* Bg Gradient Mock */}
                <div className={`absolute inset-0 bg-gradient-to-br from-charcoal to-obsidian`}></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 text-xs">{item.description}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-purple-500 group-hover:text-white transition-all">
                      {item.premium ? (
                        isPremium ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Premium Tag */}
                {item.premium && !isPremium && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gold/20 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-gold" />
                    <span className="text-[10px] font-bold text-gold uppercase">Premium</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Mixer Sheet */}
      {activeScenario && (
        <AudioMixer
          layers={activeScenario.layers}
          onClose={() => setActiveScenario(null)}
        />
      )}

      {/* Global Paywall */}
      <PaywallModal />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <MorningModal />
      <ThemeController />
    </main>
  );
}
