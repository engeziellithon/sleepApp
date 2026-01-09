import { Volume2, VolumeX } from 'lucide-react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { isPlaying, playAll, pauseAll, setLayerVolume } = useAudioEngine(layers);
    const { t } = useTranslation();

    // Auto-play when opened
    useEffect(() => {
        // Small delay to ensure layers are loaded? Howler handles it.
        playAll();
        return () => {
            pauseAll();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-foreground/10 p-6 pb-12 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl">{t('mixer_playing')}</h3>
                <button onClick={onClose} className="text-gray-400 text-sm hover:text-purple-500 transition-colors">{t('mixer_close')}</button>
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
                            defaultValue={layer.volume}
                            onChange={(e) => setLayerVolume(layer.id, parseFloat(e.target.value))}
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
