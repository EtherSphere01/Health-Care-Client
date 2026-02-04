"use server";

import { get, post, patch } from "@/lib/api";
import {
    IAppointment,
    IAppointmentQueryParams,
    ICreateAppointmentRequest,
    IUpdateAppointmentStatusRequest,
    IApiResponse,
    IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const APPOINTMENTS_TAG = "appointments";

/**
 * Get all appointments with pagination and filtering (Admin only)
 */
export async function getAllAppointments(
    params?: IAppointmentQueryParams,
): Promise<IApiResponse<IAppointment[]> & { meta?: IMeta }> {
    return get<IAppointment[]>(
        "/appointment",
        params as Record<string, unknown>,
        {
            tags: [APPOINTMENTS_TAG],
            revalidate: 30,
        },
    );
}

/**
 * Get logged-in user's appointments (Patient/Doctor)
 */
export async function getMyAppointments(
    params?: Omit<IAppointmentQueryParams, "patientEmail" | "doctorEmail">,
): Promise<IApiResponse<IAppointment[]> & { meta?: IMeta }> {
    return get<IAppointment[]>(
        "/appointment/my-appointment",
        params as Record<string, unknown>,
        {
            tags: [APPOINTMENTS_TAG, "my-appointments"],
            revalidate: 30,
        },
    );
}

/**
 * Create appointment (Patient only)
 */
export async function createAppointment(
    data: ICreateAppointmentRequest,
): Promise<IApiResponse<IAppointment>> {
    const response = await post<IAppointment>("/appointment", data);
    revalidateTag(APPOINTMENTS_TAG, "max");
    revalidateTag("my-appointments", "max");
    revalidateTag("doctor-schedules", "max");
    return response;
}

/**
 * Update appointment status (Admin/Doctor)
 */
export async function updateAppointmentStatus(
    appointmentId: string,
    data: IUpdateAppointmentStatusRequest,
): Promise<IApiResponse<IAppointment>> {
    const response = await patch<IAppointment>(
        `/appointment/status/${appointmentId}`,
        data,
    );
    revalidateTag(APPOINTMENTS_TAG, "max");
    revalidateTag("my-appointments", "max");
    return response;
}
