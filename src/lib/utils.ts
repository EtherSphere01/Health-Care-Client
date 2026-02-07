import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getVideoCallUrl(videoCallingId?: string | null) {
    if (!videoCallingId) return null;
    const trimmed = videoCallingId.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://meet.jit.si/${encodeURIComponent(trimmed)}`;
}

export function playNotificationSound() {
    if (typeof window === "undefined") return;
    const AudioContextCtor =
        (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    try {
        const ctx = new AudioContextCtor();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.value = 0.03;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        osc.onended = () => {
            try {
                ctx.close();
            } catch {
                // ignore
            }
        };
    } catch {
        // ignore
    }
}
