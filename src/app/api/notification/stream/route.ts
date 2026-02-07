import { cookies } from "next/headers";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatSseEvent(event: string, data: unknown) {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    return `event: ${event}\ndata: ${payload}\n\n`;
}

async function getLatestNotificationId(accessToken?: string) {
    const headers: HeadersInit = {};
    if (accessToken) headers.Authorization = accessToken;

    const url = `${API_BASE_URL}/notification/my-notifications?limit=1&page=1&sortBy=createdAt&sortOrder=desc`;
    const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
    });

    if (!response.ok) return null;

    const json = (await response.json()) as any;
    const first = Array.isArray(json?.data) ? json.data[0] : undefined;
    return typeof first?.id === "string" ? first.id : null;
}

export async function GET(request: Request) {
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) {
        return new Response("Unauthorized", { status: 401 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            let closed = false;
            let lastId: string | null = null;
            const cleanupFns: Array<() => void> = [];

            const write = (text: string) => {
                if (closed) return;
                controller.enqueue(encoder.encode(text));
            };

            const close = () => {
                if (closed) return;
                closed = true;
                for (const fn of cleanupFns) fn();
                controller.close();
            };

            const abortListener = () => close();
            request.signal.addEventListener("abort", abortListener);
            cleanupFns.push(() =>
                request.signal.removeEventListener("abort", abortListener),
            );

            // Prime lastId and let the client know we are ready.
            try {
                lastId = await getLatestNotificationId(accessToken);
            } catch {
                // ignore; keep lastId as null
            }

            write(formatSseEvent("ready", { lastId }));

            // Keep-alive ping so proxies don't close the connection.
            const pingId = setInterval(() => {
                write(formatSseEvent("ping", { t: Date.now() }));
            }, 25000);
            cleanupFns.push(() => clearInterval(pingId));

            // Poll the backend for the latest notification id.
            const pollId = setInterval(async () => {
                try {
                    const latestId = await getLatestNotificationId(accessToken);
                    if (!latestId) return;
                    if (latestId !== lastId) {
                        lastId = latestId;
                        write(formatSseEvent("new", { id: latestId }));
                    }
                } catch {
                    // ignore transient failures; EventSource will reconnect if the stream dies
                }
            }, 5000);
            cleanupFns.push(() => clearInterval(pollId));

            // Vercel/serverless friendly: close periodically; EventSource auto-reconnects.
            const ttlId = setTimeout(close, 55000);
            cleanupFns.push(() => clearTimeout(ttlId));
        },
        cancel() {
            // no-op; abort listener handles cleanup
        },
    });

    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
