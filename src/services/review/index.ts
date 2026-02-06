"use server";

import { get, post } from "@/lib/api";
import {
    IReview,
    IReviewQueryParams,
    ICreateReviewRequest,
    IApiResponse,
    IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const REVIEWS_TAG = "reviews";

/**
 * Get all reviews with pagination and filtering (Public)
 */
export async function getAllReviews(
    params?: IReviewQueryParams,
): Promise<IApiResponse<IReview[]> & { meta?: IMeta }> {
    return get<IReview[]>("/review", params as Record<string, unknown>, {
        tags: [REVIEWS_TAG],
        revalidate: 0,
        requireAuth: false,
    });
}

/**
 * Create review for completed appointment (Patient only)
 */
export async function createReview(
    data: ICreateReviewRequest,
): Promise<IApiResponse<IReview>> {
    const response = await post<IReview>("/review", data);
    revalidateTag(REVIEWS_TAG, "default");
    revalidateTag("doctors", "default");
    revalidateTag("appointments", "default");
    return response;
}
