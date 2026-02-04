import { getCookie } from "@/services/auth/tokenHandlers";
import { IApiResponse, IErrorResponse } from "@/types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method: HttpMethod;
    body?: unknown;
    isFormData?: boolean;
    requireAuth?: boolean;
    cache?: RequestCache;
    revalidate?: number;
    tags?: string[];
}

interface FetchOptions extends RequestInit {
    next?: {
        revalidate?: number;
        tags?: string[];
    };
}

/**
 * Build query string from params object
 */
export function buildQueryString(params?: Record<string, unknown>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
}

/**
 * Core API request handler
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = { method: "GET" },
): Promise<IApiResponse<T>> {
    const {
        method,
        body,
        isFormData,
        requireAuth = true,
        cache,
        revalidate,
        tags,
    } = options;

    const headers: HeadersInit = {};

    // Add auth header if required
    if (requireAuth) {
        const token = await getCookie("accessToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    // Set content type for JSON
    if (!isFormData && body) {
        headers["Content-Type"] = "application/json";
    }

    const fetchOptions: FetchOptions = {
        method,
        headers,
        credentials: "include",
    };

    // Handle body
    if (body) {
        if (isFormData && body instanceof FormData) {
            fetchOptions.body = body;
        } else {
            fetchOptions.body = JSON.stringify(body);
        }
    }

    // Handle caching options
    if (cache) {
        fetchOptions.cache = cache;
    }

    if (revalidate !== undefined || tags) {
        fetchOptions.next = {};
        if (revalidate !== undefined) {
            fetchOptions.next.revalidate = revalidate;
        }
        if (tags) {
            fetchOptions.next.tags = tags;
        }
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            fetchOptions,
        );

        const data = await response.json();

        if (!response.ok) {
            const errorResponse: IErrorResponse = {
                success: false,
                statusCode: response.status,
                message: data.message || "An error occurred",
                errorMessages: data.errorMessages,
            };
            throw errorResponse;
        }

        return data as IApiResponse<T>;
    } catch (error) {
        if ((error as IErrorResponse).statusCode) {
            throw error;
        }

        throw {
            success: false,
            statusCode: 500,
            message:
                error instanceof Error
                    ? error.message
                    : "Network error occurred",
        } as IErrorResponse;
    }
}

/**
 * GET request
 */
export async function get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: Omit<RequestOptions, "method" | "body">,
): Promise<IApiResponse<T>> {
    const queryString = buildQueryString(params);
    return apiRequest<T>(`${endpoint}${queryString}`, {
        method: "GET",
        ...options,
    });
}

/**
 * POST request
 */
export async function post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
): Promise<IApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "POST", body, ...options });
}

/**
 * PUT request
 */
export async function put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
): Promise<IApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "PUT", body, ...options });
}

/**
 * PATCH request
 */
export async function patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
): Promise<IApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "PATCH", body, ...options });
}

/**
 * DELETE request
 */
export async function del<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
): Promise<IApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: "DELETE", ...options });
}

/**
 * Upload file with FormData
 */
export async function uploadFormData<T>(
    endpoint: string,
    formData: FormData,
    method: "POST" | "PATCH" = "POST",
): Promise<IApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        method,
        body: formData,
        isFormData: true,
    });
}
