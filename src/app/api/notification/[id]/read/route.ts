import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function PATCH(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const accessToken = (await cookies()).get("accessToken")?.value;

        const headers: HeadersInit = {};
        if (accessToken) {
            headers.Authorization = accessToken;
        }

        const response = await fetch(
            `${API_BASE_URL}/notification/${id}/read`,
            {
                method: "PATCH",
                headers,
            },
        );

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
                        : "Failed to mark notification as read",
            },
            { status: 500 },
        );
    }
}
