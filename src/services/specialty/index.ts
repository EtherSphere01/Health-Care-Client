"use server";

import { get, del, uploadFormData } from "@/lib/api";
import {
  ISpecialty,
  ISpecialtyQueryParams,
  ICreateSpecialtyRequest,
  IApiResponse,
  IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const SPECIALTIES_TAG = "specialties";

/**
 * Get all specialties with pagination (Public)
 */
export async function getAllSpecialties(
  params?: ISpecialtyQueryParams
): Promise<IApiResponse<ISpecialty[]> & { meta?: IMeta }> {
  return get<ISpecialty[]>("/specialties", params as Record<string, unknown>, {
    tags: [SPECIALTIES_TAG],
    revalidate: 300, // Cache for 5 minutes
    requireAuth: false,
  });
}

/**
 * Create specialty (Admin only)
 */
export async function createSpecialty(
  data: ICreateSpecialtyRequest,
  file?: File
): Promise<IApiResponse<ISpecialty>> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (file) {
    formData.append("file", file);
  }
  
  const response = await uploadFormData<ISpecialty>("/specialties", formData);
  revalidateTag(SPECIALTIES_TAG);
  return response;
}

/**
 * Delete specialty (Admin only)
 */
export async function deleteSpecialty(id: string): Promise<IApiResponse<ISpecialty>> {
  const response = await del<ISpecialty>(`/specialties/${id}`);
  revalidateTag(SPECIALTIES_TAG);
  return response;
}
