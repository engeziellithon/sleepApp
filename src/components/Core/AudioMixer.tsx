import { Volume2, VolumeX, Clock, Heart, Sliders, Check } from 'lucide-react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

interface Layer {
    id: string;
    src: string;
    volume: number;
}

interface AudioMixerProps {
    layers: Layer[];
    onClose: () => void;
}

export function AudioMixer({ layers, onClose }: AudioMixerProps) {
    const { isPlaying, playAll, pauseAll, setLayerVolume, startTimer, cancelTimer } = useAudioEngine(layers);
    const { t } = useTranslation();
    const { isPremium, setPaywallOpen } = useAppStore();

    const [timerOpen, setTimerOpen] = useState(false);
    const [activeTimer, setActiveTimer] = useState<number | null>(null);
    const [volumes, setVolumes] = useState<Record<string, number>>(() =>
        layers.reduce((acc, l) => ({ ...acc, [l.id]: l.volume }), {})
    );

    // Auto-play when opened
    useEffect(() => {
        playAll();
        return () => {
            pauseAll();
            cancelTimer();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTimerClick = (minutes: number) => {
        if (!isPremium) {
            setPaywallOpen(true);
            return;
        }
        setActiveTimer(minutes);
        startTimer(minutes);
        setTimerOpen(false);
    };

    const handlePreset = (type: 'focus' | 'sleep' | 'relax') => {
        if (!isPremium) {
            setPaywallOpen(true);
            return;
        }

        let multiplier = 1;
        // Simple logic:
        // Focus: Low volume, consistent
        // Sleep: Very low volume, background heavy
        // Relax: Balanced

        const newVols = { ...volumes };

        layers.forEach(l => {
            // Mock preset logic based on ID keywords or just random variance for MVP
            // In real app, presets would be in content.json
            if (type === 'sleep') {
                newVols[l.id] = l.volume * 0.5; // Quieter
            } else if (type === 'focus') {
                newVols[l.id] = l.volume * 0.8;
            } else {
                newVols[l.id] = l.volume; // Reset
            }
            setLayerVolume(l.id, newVols[l.id]);
        });
        setVolumes(newVols);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-foreground/10 p-6 pb-12 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl">{t('mixer_playing')}</h3>
                <div className="flex items-center gap-4">
                    {/* Smart Presets (Icons) */}
                    <div className="flex gap-2 mr-2">
                        <button onClick={() => handlePreset('sleep')} className="p-2 text-gray-400 hover:text-purple-500 rounded-full bg-foreground/5" title="Sleep Mode">
                            {!isPremium && <div className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full"></div>}
                            <span className="text-xs font-bold">💤</span>
                        </button>
                        <button onClick={() => handlePreset('focus')} className="p-2 text-gray-400 hover:text-purple-500 rounded-full bg-foreground/5" title="Focus Mode">
                            <span className="text-xs font-bold">🧠</span>
                        </button>
                    </div>

                    {/* Timer Button */}
                    <div className="relative">
                        <button
                            onClick={() => setTimerOpen(!timerOpen)}
                            className={`p-2 rounded-full transition-colors ${activeTimer ? 'text-purple-500 bg-purple-500/10' : 'text-gray-400 hover:text-purple-500'}`}
                        >
                            <Clock className="w-5 h-5" />
                            {activeTimer && <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-purple-500 text-white w-4 h-4 rounded-full flex items-center justify-center">{activeTimer}</span>}
                        </button>

                        {/* Timer Dropdown */}
                        {timerOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-32 bg-charcoal border border-foreground/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                {[15, 30, 60].map(min => (
                                    <button
                                        key={min}
                                        onClick={() => handleTimerClick(min)}
                                        className="w-full text-left px-4 py-3 hover:bg-foreground/5 text-sm font-bold flex items-center justify-between"
                                    >
                                        <span>{min} min</span>
                                        {activeTimer === min && <Check className="w-3 h-3 text-purple-500" />}
                                    </button>
                                ))}
                                {activeTimer && (
                                    <button
                                        onClick={() => { setActiveTimer(null); cancelTimer(); setTimerOpen(false); }}
                                        className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 text-xs border-t border-foreground/5"
                                    >
                                        Stop Timer
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <button onClick={onClose} className="text-gray-400 text-sm hover:text-purple-500 transition-colors">{t('mixer_close')}</button>
                </div>
            </div>

            <div className="space-y-6">
                {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center gap-4">
                        <div className="w-8 text-gray-400 text-xs truncate">{layer.id.split('-')[0]}</div>
                        <Volume2 className="w-4 h-4 text-gray-500" />
                        <input
                            type="range"
                            className="flex-1 accent-purple-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volumes[layer.id] || 0}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setVolumes(v => ({ ...v, [layer.id]: val }));
                                setLayerVolume(layer.id, val);
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={isPlaying ? pauseAll : playAll}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                    {isPlaying ? (
                        <div className="flex gap-1">
                            <div className="w-1.5 h-6 bg-black rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-6 bg-black rounded-full animate-pulse delay-75"></div>
                        </div>
                    ) : (
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
                    )}
                </button>
            </div>
        </div>
    );
}
