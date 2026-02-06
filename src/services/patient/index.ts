"use server";

import { get, patch, del } from "@/lib/api";
import { IPatient, IPatientQueryParams, IApiResponse, IMeta } from "@/types";
import { revalidateTag } from "next/cache";

const PATIENTS_TAG = "patients";

/**
 * Get all patients with pagination and filtering
 */
export async function getAllPatients(
    params?: IPatientQueryParams,
): Promise<IApiResponse<IPatient[]> & { meta?: IMeta }> {
    return get<IPatient[]>("/patient", params as Record<string, unknown>, {
        tags: [PATIENTS_TAG],
        revalidate: 0,
    });
}

/**
 * Get patient by ID
 */
export async function getPatientById(
    id: string,
): Promise<IApiResponse<IPatient>> {
    return get<IPatient>(`/patient/${id}`, undefined, {
        tags: [PATIENTS_TAG, `patient-${id}`],
    });
}

/**
 * Update patient profile
 */
export async function updatePatient(
    id: string,
    data: Partial<Pick<IPatient, "name" | "contactNumber" | "address">>,
): Promise<IApiResponse<IPatient>> {
    const response = await patch<IPatient>(`/patient/${id}`, data);
    revalidateTag(PATIENTS_TAG, "default");
    revalidateTag(`patient-${id}`, "default");
    return response;
}

/**
 * Hard delete patient (Admin only)
 */
export async function deletePatient(
    id: string,
): Promise<IApiResponse<IPatient>> {
    const response = await del<IPatient>(`/patient/${id}`);
    revalidateTag(PATIENTS_TAG, "default");
    return response;
}

/**
 * Soft delete patient (Admin only)
 */
export async function softDeletePatient(
    id: string,
): Promise<IApiResponse<IPatient>> {
    const response = await del<IPatient>(`/patient/soft/${id}`);
    revalidateTag(PATIENTS_TAG, "default");
    return response;
}
