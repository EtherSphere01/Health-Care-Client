"use server";

import { get, post, del } from "@/lib/api";
import {
    IDoctorSchedule,
    IDoctorScheduleQueryParams,
    ICreateDoctorScheduleRequest,
    IApiResponse,
    IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const DOCTOR_SCHEDULES_TAG = "doctor-schedules";

/**
 * Get all doctor schedules with filtering (All authenticated users)
 */
export async function getAllDoctorSchedules(
    params?: IDoctorScheduleQueryParams,
): Promise<IApiResponse<IDoctorSchedule[]> & { meta?: IMeta }> {
    return get<IDoctorSchedule[]>(
        "/doctor-schedule",
        params as Record<string, unknown>,
        {
            tags: [DOCTOR_SCHEDULES_TAG],
            revalidate: 0,
        },
    );
}

/**
 * Get public doctor schedules with filtering (no authentication required)
 * Used by public/common pages like Consultation.
 */
export async function getPublicDoctorSchedules(
    params?: IDoctorScheduleQueryParams,
): Promise<IApiResponse<IDoctorSchedule[]> & { meta?: IMeta }> {
    return get<IDoctorSchedule[]>(
        "/doctor-schedule/public",
        params as Record<string, unknown>,
        {
            requireAuth: false,
            tags: [DOCTOR_SCHEDULES_TAG],
            revalidate: 0,
        },
    );
}

// Alias used by Consultation
export const getDoctorSchedules = getPublicDoctorSchedules;

/**
 * Get logged-in doctor's schedules (Doctor only)
 */
export async function getMyDoctorSchedule(
    params?: Omit<IDoctorScheduleQueryParams, "doctorId">,
): Promise<IApiResponse<IDoctorSchedule[]> & { meta?: IMeta }> {
    const response = await get<
        IDoctorSchedule[] | { data: IDoctorSchedule[]; meta?: IMeta }
    >("/doctor-schedule/my-schedule", params as Record<string, unknown>, {
        tags: [DOCTOR_SCHEDULES_TAG, "my-schedule"],
        revalidate: 0,
    });

    const normalizedData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

    const normalizedMeta = Array.isArray(response.data)
        ? response.meta
        : response.data?.meta;

    return {
        ...response,
        data: normalizedData,
        meta: normalizedMeta,
    } as IApiResponse<IDoctorSchedule[]> & { meta?: IMeta };
}

/**
 * Assign schedules to doctor (Doctor only)
 */
export async function createDoctorSchedule(
    data: ICreateDoctorScheduleRequest,
): Promise<IApiResponse<IDoctorSchedule[]>> {
    const response = await post<IDoctorSchedule[]>("/doctor-schedule", data);
    revalidateTag(DOCTOR_SCHEDULES_TAG);
    revalidateTag("my-schedule");
    return response;
}

/**
 * Remove schedule from doctor (Doctor only)
 */
export async function deleteDoctorSchedule(
    scheduleId: string,
): Promise<IApiResponse<IDoctorSchedule>> {
    const response = await del<IDoctorSchedule>(
        `/doctor-schedule/${scheduleId}`,
    );
    revalidateTag(DOCTOR_SCHEDULES_TAG);
    revalidateTag("my-schedule");
    return response;
}
