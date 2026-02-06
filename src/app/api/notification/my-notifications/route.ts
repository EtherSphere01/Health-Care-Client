import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accessToken = (await cookies()).get("accessToken")?.value;

        const headers: HeadersInit = {};
        if (accessToken) {
            headers.Authorization = accessToken;
        }

        const qs = searchParams.toString();
        const url = `${API_BASE_URL}/notification/my-notifications${qs ? `?${qs}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            headers,
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
                        : "Failed to fetch notifications",
            },
            { status: 500 },
        );
    }
}
