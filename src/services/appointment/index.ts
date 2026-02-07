"use server";

import { get, post, patch } from "@/lib/api";
import { headers } from "next/headers";
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
            revalidate: 0,
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
            revalidate: 0,
        },
    );
}

/**
 * Create appointment (Patient only)
 */
export async function createAppointment(
    data: ICreateAppointmentRequest,
): Promise<IApiResponse<{ paymentUrl: string }>> {
    const requestHeaders = await headers();
    const directOrigin = requestHeaders.get("origin")?.trim();
    const host =
        requestHeaders.get("x-forwarded-host")?.trim() ||
        requestHeaders.get("host")?.trim();
    const proto =
        requestHeaders.get("x-forwarded-proto")?.trim() ||
        (process.env.NODE_ENV === "development" ? "http" : "https");
    const derivedOrigin = host ? `${proto}://${host}` : undefined;
    const frontendOrigin = directOrigin || derivedOrigin;

    const response = await post<{ paymentUrl: string }>("/appointment", data, {
        headers: frontendOrigin
            ? { "x-frontend-origin": frontendOrigin }
            : undefined,
    });
    revalidateTag(APPOINTMENTS_TAG, "default");
    revalidateTag("my-appointments", "default");
    revalidateTag("doctor-schedules", "default");
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
    revalidateTag(APPOINTMENTS_TAG, "default");
    revalidateTag("my-appointments", "default");
    return response;
}
