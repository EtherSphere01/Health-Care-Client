"use server";

import { get, patch, del } from "@/lib/api";
import {
  IAdmin,
  IAdminQueryParams,
  IApiResponse,
  IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const ADMINS_TAG = "admins";

/**
 * Get all admins with pagination and filtering
 */
export async function getAllAdmins(
  params?: IAdminQueryParams
): Promise<IApiResponse<IAdmin[]> & { meta?: IMeta }> {
  return get<IAdmin[]>("/admin", params as Record<string, unknown>, {
    tags: [ADMINS_TAG],
    revalidate: 60,
  });
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: string): Promise<IApiResponse<IAdmin>> {
  return get<IAdmin>(`/admin/${id}`, undefined, { tags: [ADMINS_TAG, `admin-${id}`] });
}

/**
 * Update admin
 */
export async function updateAdmin(
  id: string,
  data: Partial<Pick<IAdmin, "name" | "contactNumber">>
): Promise<IApiResponse<IAdmin>> {
  const response = await patch<IAdmin>(`/admin/${id}`, data);
  revalidateTag(ADMINS_TAG);
  revalidateTag(`admin-${id}`);
  return response;
}

/**
 * Hard delete admin
 */
export async function deleteAdmin(id: string): Promise<IApiResponse<IAdmin>> {
  const response = await del<IAdmin>(`/admin/${id}`);
  revalidateTag(ADMINS_TAG);
  return response;
}

/**
 * Soft delete admin
 */
export async function softDeleteAdmin(id: string): Promise<IApiResponse<IAdmin>> {
  const response = await del<IAdmin>(`/admin/soft/${id}`);
  revalidateTag(ADMINS_TAG);
  return response;
}
