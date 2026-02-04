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
            revalidate: 30,
        },
    );
}

// Alias for backwards compatibility
export const getDoctorSchedules = getAllDoctorSchedules;

/**
 * Get logged-in doctor's schedules (Doctor only)
 */
export async function getMyDoctorSchedule(
    params?: Omit<IDoctorScheduleQueryParams, "doctorId">,
): Promise<IApiResponse<IDoctorSchedule[]> & { meta?: IMeta }> {
    return get<IDoctorSchedule[]>(
        "/doctor-schedule/my-schedule",
        params as Record<string, unknown>,
        {
            tags: [DOCTOR_SCHEDULES_TAG, "my-schedule"],
            revalidate: 30,
        },
    );
}

/**
 * Assign schedules to doctor (Doctor only)
 */
export async function createDoctorSchedule(
    data: ICreateDoctorScheduleRequest,
): Promise<IApiResponse<IDoctorSchedule[]>> {
    const response = await post<IDoctorSchedule[]>("/doctor-schedule", data);
    revalidateTag(DOCTOR_SCHEDULES_TAG, "max");
    revalidateTag("my-schedule", "max");
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
    revalidateTag(DOCTOR_SCHEDULES_TAG, "max");
    revalidateTag("my-schedule", "max");
    return response;
}
