import { IAiSuggestion, IApiResponse, IErrorResponse } from "@/types";

const API_BASE_URL = "/api/doctor/suggestion";

export async function getAiDoctorSuggestionClient(
    symptoms: string,
    signal?: AbortSignal,
): Promise<IApiResponse<IAiSuggestion>> {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
        credentials: "include",
        signal,
    });

    const data = await response.json();

    if (!response.ok) {
        const errorResponse: IErrorResponse = {
            success: false,
            statusCode: response.status,
            message: data.message || "Failed to fetch AI suggestion",
            errorMessages: data.errorMessages,
        };
        throw errorResponse;
    }

    return data as IApiResponse<IAiSuggestion>;
}
