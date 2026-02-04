"use server";

import { get } from "@/lib/api";
import {
    AppointmentStatus,
    IDashboardMeta,
    IApiResponse,
    IAdminDashboardMeta,
    IDoctorDashboardMeta,
    IPatientDashboardMeta,
} from "@/types";

type RawMetaResponse = Record<string, unknown> & {
    appointmentCount?: number;
    patientCount?: number;
    doctorCount?: number;
    paymentCount?: number;
    reviewCount?: number;
    prescriptionCount?: number;
    totalRevenue?:
        | number
        | {
              _sum?: {
                  amount?: number | null;
              };
          };
    pieCharData?: { status: AppointmentStatus | string; count: number }[];
    formattedAppointmentStatusDistribution?: {
        status: AppointmentStatus | string;
        count: number;
    }[];
};

const normalizeAppointmentStatus = (
    items?: { status: AppointmentStatus | string; count: number }[],
) => {
    const normalized = {
        scheduled: 0,
        inProgress: 0,
        completed: 0,
        canceled: 0,
    };

    if (!items) return normalized;

    items.forEach(({ status, count }) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED:
                normalized.scheduled = count;
                break;
            case AppointmentStatus.INPROGRESS:
                normalized.inProgress = count;
                break;
            case AppointmentStatus.COMPLETED:
                normalized.completed = count;
                break;
            case AppointmentStatus.CANCELED:
                normalized.canceled = count;
                break;
            default:
                break;
        }
    });

    return normalized;
};

const extractRevenue = (raw?: RawMetaResponse["totalRevenue"]) => {
    if (typeof raw === "number") return raw;
    return raw?._sum?.amount ?? 0;
};

const normalizeDashboardMeta = (raw: RawMetaResponse): IDashboardMeta => {
    if ("doctorCount" in raw || "adminCount" in raw) {
        const adminMeta: IAdminDashboardMeta = {
            appointmentCount: raw.appointmentCount ?? 0,
            patientCount: raw.patientCount ?? 0,
            doctorCount: raw.doctorCount ?? 0,
            paymentCount: raw.paymentCount ?? 0,
            totalRevenue: extractRevenue(raw.totalRevenue),
            appointmentStatusDistribution: normalizeAppointmentStatus(
                raw.pieCharData,
            ),
        };
        return adminMeta;
    }

    if (
        "formattedAppointmentStatusDistribution" in raw &&
        "reviewCount" in raw
    ) {
        const doctorMeta: IDoctorDashboardMeta = {
            appointmentCount: raw.appointmentCount ?? 0,
            patientCount: raw.patientCount ?? 0,
            reviewCount: raw.reviewCount ?? 0,
            totalRevenue: extractRevenue(raw.totalRevenue),
            appointmentStatusDistribution: normalizeAppointmentStatus(
                raw.formattedAppointmentStatusDistribution,
            ),
        };
        return doctorMeta;
    }

    const patientMeta: IPatientDashboardMeta = {
        appointmentCount: raw.appointmentCount ?? 0,
        prescriptionCount: raw.prescriptionCount ?? 0,
        reviewCount: raw.reviewCount ?? 0,
        appointmentStatusDistribution: normalizeAppointmentStatus(
            raw.formattedAppointmentStatusDistribution,
        ),
    };

    return patientMeta;
};

/**
 * Get dashboard metadata based on user role
 */
export async function getDashboardMeta(): Promise<
    IApiResponse<IDashboardMeta>
> {
    const response = await get<RawMetaResponse>("/meta", undefined, {
        tags: ["meta", "dashboard"],
        revalidate: 30,
    });

    return {
        ...response,
        data: normalizeDashboardMeta(response.data ?? {}),
    } as IApiResponse<IDashboardMeta>;
}
