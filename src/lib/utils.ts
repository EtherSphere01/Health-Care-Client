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
