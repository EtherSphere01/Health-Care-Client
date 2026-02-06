import { NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(`${API_BASE_URL}/doctor/ai-suggestion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                statusCode: 500,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch AI suggestion",
            },
            { status: 500 },
        );
    }
}
