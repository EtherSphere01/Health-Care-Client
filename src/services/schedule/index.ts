"use server";

import { get, post, del } from "@/lib/api";
import {
  ISchedule,
  IScheduleQueryParams,
  ICreateScheduleRequest,
  IApiResponse,
  IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const SCHEDULES_TAG = "schedules";

/**
 * Get all schedules with pagination and filtering (Doctor only)
 */
export async function getAllSchedules(
  params?: IScheduleQueryParams
): Promise<IApiResponse<ISchedule[]> & { meta?: IMeta }> {
  return get<ISchedule[]>("/schedule", params as Record<string, unknown>, {
    tags: [SCHEDULES_TAG],
    revalidate: 60,
  });
}

/**
 * Get schedule by ID
 */
export async function getScheduleById(id: string): Promise<IApiResponse<ISchedule>> {
  return get<ISchedule>(`/schedule/${id}`, undefined, { tags: [SCHEDULES_TAG, `schedule-${id}`] });
}

/**
 * Create schedule slots (Admin only)
 */
export async function createSchedule(data: ICreateScheduleRequest): Promise<IApiResponse<ISchedule[]>> {
  const response = await post<ISchedule[]>("/schedule", data);
  revalidateTag(SCHEDULES_TAG);
  return response;
}

/**
 * Delete schedule (Admin only)
 */
export async function deleteSchedule(id: string): Promise<IApiResponse<ISchedule>> {
  const response = await del<ISchedule>(`/schedule/${id}`);
  revalidateTag(SCHEDULES_TAG);
  return response;
}
