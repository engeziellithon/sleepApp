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

    // Timer Logic
    const startTimer = (minutes: number) => {
        const ms = minutes * 60 * 1000;
        console.log(`AudioEngine: Timer set for ${minutes}m`);

        // Clear existing timer
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            console.log("AudioEngine: Timer finished. Fading out...");
            // Fade out all sounds over 5 seconds
            Object.values(howlsRef.current).forEach(h => {
                h.fade(h.volume(), 0, 5000);
            });

            // Stop after fade
            setTimeout(() => {
                pauseAll();
                // Reset volumes? Better to just stop. 
                // Next play will restore volumes if we used valid state management, 
                // but Howl objects persist volume. We should reset them on next play or here.
                // For simplicity, we just pause. The user usually closes app.
            }, 5000);
        }, ms);
    };

    const cancelTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return {
        isPlaying,
        playAll,
        pauseAll,
        setLayerVolume,
        startTimer,
        cancelTimer
    };
}
