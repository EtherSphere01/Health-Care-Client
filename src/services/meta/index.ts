"use server";

import { get } from "@/lib/api";
import {
  IDashboardMeta,
  IAdminDashboardMeta,
  IDoctorDashboardMeta,
  IPatientDashboardMeta,
  IApiResponse,
} from "@/types";

/**
 * Get dashboard metadata based on user role
 */
export async function getDashboardMeta(): Promise<IApiResponse<IDashboardMeta>> {
  return get<IDashboardMeta>("/meta", undefined, {
    tags: ["meta", "dashboard"],
    revalidate: 30,
  });
}

/**
 * Type guard for Admin dashboard meta
 */
export function isAdminMeta(meta: IDashboardMeta): meta is IAdminDashboardMeta {
  return "totalPatients" in meta && "totalDoctors" in meta && "totalRevenue" in meta;
}

/**
 * Type guard for Doctor dashboard meta
 */
export function isDoctorMeta(meta: IDashboardMeta): meta is IDoctorDashboardMeta {
  return "totalPatients" in meta && "totalPrescriptions" in meta && !("totalDoctors" in meta);
}

/**
 * Type guard for Patient dashboard meta
 */
export function isPatientMeta(meta: IDashboardMeta): meta is IPatientDashboardMeta {
  return "totalCompletedAppointments" in meta && !("totalPatients" in meta);
}
