import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useAppStore } from '@/store/useAppStore';

interface SoundLayer {
    id: string;
    src: string;
    volume: number;
}

export function useAudioEngine(currentLayers: SoundLayer[] = []) {
    const { isPremium, setPaywallOpen } = useAppStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const howlsRef = useRef<Record<string, Howl>>({});
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Howls
    useEffect(() => {
        // Cleanup old howls if layers change significantly (naive implementation)
        // For now, we assume layers acts as the source of truth
        currentLayers.forEach((layer) => {
            if (!howlsRef.current[layer.id]) {
                howlsRef.current[layer.id] = new Howl({
                    src: [layer.src],
                    loop: true,
                    volume: layer.volume,
                    html5: true, // For streaming larger files if needed, but loops prefer WebAudio
                });
            }
        });

        return () => {
            // Cleanup? Not necessarily, we want to keep them cached.
        };
    }, [currentLayers]);

    // Trap Logic
    useEffect(() => {
        if (isPlaying && !isPremium) {
            console.log("AudioEngine: Trap Active. 15s countdown.");
            timerRef.current = setTimeout(() => {
                console.log("AudioEngine: TRAP TRIGGERED!");
                pauseAll();
                setPaywallOpen(true);
            }, 15000); // 15 seconds free
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPlaying, isPremium, setPaywallOpen]);

    const playAll = () => {
        Object.values(howlsRef.current).forEach(h => h.play());
        setIsPlaying(true);
    };

    const pauseAll = () => {
        Object.values(howlsRef.current).forEach(h => h.pause());
        setIsPlaying(false);
    };

    const setLayerVolume = (id: string, vol: number) => {
        if (howlsRef.current[id]) {
            howlsRef.current[id].volume(vol);
        }
    };

    return {
        isPlaying,
        playAll,
        pauseAll,
        setLayerVolume
    };
}
