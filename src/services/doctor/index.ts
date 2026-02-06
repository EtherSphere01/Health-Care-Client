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

type BackendDoctorSpecialty = {
    specialtyId?: string;
    specialitiesId?: string;
    specialityId?: string;
    doctorId?: string;
    specialty?: Partial<{ id: string; title: string }>;
    specialities?: Partial<{ id: string; title: string }>;
} & Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeDoctor<T extends IDoctor>(doctor: unknown): T {
    const raw = isRecord(doctor) ? doctor : ({} as Record<string, unknown>);
    const rawDoctorSpecialties = raw.doctorSpecialties;

    const doctorSpecialties = Array.isArray(rawDoctorSpecialties)
        ? rawDoctorSpecialties.map((dsUnknown) => {
              const ds: BackendDoctorSpecialty = isRecord(dsUnknown)
                  ? (dsUnknown as BackendDoctorSpecialty)
                  : ({} as BackendDoctorSpecialty);

              const specialtyId =
                  ds.specialtyId ?? ds.specialitiesId ?? ds.specialityId;
              const specialities = ds.specialities;
              const specialty =
                  ds.specialty ??
                  (specialities
                      ? {
                            ...specialities,
                            id:
                                (specialities as { id?: string }).id ??
                                specialtyId,
                        }
                      : specialtyId
                        ? { id: specialtyId, title: "" }
                        : undefined);

              return {
                  ...ds,
                  specialtyId,
                  specialitiesId: ds.specialitiesId ?? specialtyId,
                  specialty,
                  specialities,
              };
          })
        : undefined;

    return {
        ...(raw as Record<string, unknown>),
        ...(doctorSpecialties ? { doctorSpecialties } : null),
    } as T;
}

/**
 * Get all doctors with pagination and filtering (Public)
 */
export async function getAllDoctors(
    params?: IDoctorQueryParams,
): Promise<IApiResponse<IDoctor[]> & { meta?: IMeta }> {
    const response = await get<IDoctor[]>(
        "/doctor",
        params as Record<string, unknown>,
        {
            tags: [DOCTORS_TAG],
            revalidate: 0,
            requireAuth: false,
        },
    );

    if (response.success && Array.isArray(response.data)) {
        response.data = response.data.map((d) => normalizeDoctor(d));
    }

    return response;
}

/**
 * Get doctor by ID (Public)
 */
export async function getDoctorById(
    id: string,
): Promise<IApiResponse<IDoctor>> {
    const response = await get<IDoctor>(`/doctor/${id}`, undefined, {
        tags: [DOCTORS_TAG, `doctor-${id}`],
        requireAuth: false,
    });

    if (response.success && response.data) {
        response.data = normalizeDoctor(response.data);
    }

    return response;
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
    revalidateTag(DOCTORS_TAG, "default");
    revalidateTag(`doctor-${id}`, "default");
    return response;
}

/**
 * Hard delete doctor (Admin only)
 */
export async function deleteDoctor(id: string): Promise<IApiResponse<IDoctor>> {
    const response = await del<IDoctor>(`/doctor/${id}`);
    revalidateTag(DOCTORS_TAG, "default");
    return response;
}

/**
 * Soft delete doctor (Admin only)
 */
export async function softDeleteDoctor(
    id: string,
): Promise<IApiResponse<IDoctor>> {
    const response = await del<IDoctor>(`/doctor/soft/${id}`);
    revalidateTag(DOCTORS_TAG, "default");
    return response;
}
