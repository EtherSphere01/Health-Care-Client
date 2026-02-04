"use server";

import { get, post } from "@/lib/api";
import {
    IPrescription,
    IPrescriptionQueryParams,
    ICreatePrescriptionRequest,
    IApiResponse,
    IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const PRESCRIPTIONS_TAG = "prescriptions";

/**
 * Get all prescriptions with pagination and filtering (Admin only)
 */
export async function getAllPrescriptions(
    params?: IPrescriptionQueryParams,
): Promise<IApiResponse<IPrescription[]> & { meta?: IMeta }> {
    return get<IPrescription[]>(
        "/prescription",
        params as Record<string, unknown>,
        {
            tags: [PRESCRIPTIONS_TAG],
            revalidate: 60,
        },
    );
}

/**
 * Get logged-in patient's prescriptions (Patient only)
 */
export async function getMyPrescriptions(params?: {
    page?: number;
    limit?: number;
}): Promise<IApiResponse<IPrescription[]> & { meta?: IMeta }> {
    return get<IPrescription[]>(
        "/prescription/my-prescription",
        params as Record<string, unknown>,
        {
            tags: [PRESCRIPTIONS_TAG, "my-prescriptions"],
            revalidate: 60,
        },
    );
}

// Alias for backwards compatibility
export const getPatientPrescriptions = getMyPrescriptions;

/**
 * Create prescription (Doctor only)
 */
export async function createPrescription(
    data: ICreatePrescriptionRequest,
): Promise<IApiResponse<IPrescription>> {
    const response = await post<IPrescription>("/prescription", data);
    revalidateTag(PRESCRIPTIONS_TAG);
    revalidateTag("my-prescriptions");
    revalidateTag("appointments");
    return response;
}
