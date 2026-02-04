"use server";

import { get, patch, del, post } from "@/lib/api";
import {
    IDoctor,
    IDoctorQueryParams,
    IApiResponse,
    IMeta,
    IAiSuggestion,
} from "@/types";
import { revalidateTag } from "next/cache";

const DOCTORS_TAG = "doctors";

/**
 * Get all doctors with pagination and filtering (Public)
 */
export async function getAllDoctors(
    params?: IDoctorQueryParams,
): Promise<IApiResponse<IDoctor[]> & { meta?: IMeta }> {
    return get<IDoctor[]>("/doctor", params as Record<string, unknown>, {
        tags: [DOCTORS_TAG],
        revalidate: 60,
        requireAuth: false,
    });
}

/**
 * Get doctor by ID (Public)
 */
export async function getDoctorById(
    id: string,
): Promise<IApiResponse<IDoctor>> {
    return get<IDoctor>(`/doctor/${id}`, undefined, {
        tags: [DOCTORS_TAG, `doctor-${id}`],
        requireAuth: false,
    });
}

/**
 * Get AI doctor suggestion based on symptoms (Public)
 */
export async function getAiDoctorSuggestion(
    symptoms: string,
): Promise<IApiResponse<IAiSuggestion>> {
    return post<IAiSuggestion>(
        "/doctor/suggestion",
        { symptoms },
        {
            requireAuth: false,
        },
    );
}

/**
 * Update doctor profile
 */
export async function updateDoctor(
    id: string,
    data: {
        name?: string;
        appointmentFee?: number;
        specialties?: string[];
        removeSpecialties?: string[];
        contactNumber?: string;
        address?: string;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
): Promise<IApiResponse<IDoctor>> {
    const response = await patch<IDoctor>(`/doctor/${id}`, data);
    revalidateTag(DOCTORS_TAG, "max");
    revalidateTag(`doctor-${id}`, "max");
    return response;
}

/**
 * Hard delete doctor (Admin only)
 */
export async function deleteDoctor(id: string): Promise<IApiResponse<IDoctor>> {
    const response = await del<IDoctor>(`/doctor/${id}`);
    revalidateTag(DOCTORS_TAG, "max");
    return response;
}

/**
 * Soft delete doctor (Admin only)
 */
export async function softDeleteDoctor(
    id: string,
): Promise<IApiResponse<IDoctor>> {
    const response = await del<IDoctor>(`/doctor/soft/${id}`);
    revalidateTag(DOCTORS_TAG, "max");
    return response;
}
