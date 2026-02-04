"use server";

import {
    get,
    post,
    patch,
    del,
    uploadFormData,
    buildQueryString,
} from "@/lib/api";
import {
    IUser,
    IUserQueryParams,
    ICreateAdminRequest,
    ICreateDoctorRequest,
    ICreatePatientRequest,
    IUpdateUserStatusRequest,
    IUpdateProfileRequest,
    IApiResponse,
    IMeta,
} from "@/types";
import { revalidateTag } from "next/cache";

const USERS_TAG = "users";

/**
 * Get all users with pagination and filtering (Admin only)
 */
export async function getAllUsers(
    params?: IUserQueryParams,
): Promise<IApiResponse<IUser[]> & { meta?: IMeta }> {
    return get<IUser[]>("/user", params as Record<string, unknown>, {
        tags: [USERS_TAG],
        revalidate: 60,
    });
}

/**
 * Get current user's profile
 */
export async function getMyProfile(): Promise<IApiResponse<IUser>> {
    return get<IUser>("/user/me", undefined, { tags: ["user", "profile"] });
}

/**
 * Create admin user (Admin only)
 */
export async function createAdmin(
    data: ICreateAdminRequest,
    file?: File,
): Promise<IApiResponse<IUser>> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file) {
        formData.append("file", file);
    }

    const response = await uploadFormData<IUser>(
        "/user/create-admin",
        formData,
    );
    revalidateTag(USERS_TAG);
    revalidateTag("admins");
    return response;
}

/**
 * Create doctor user (Admin only)
 */
export async function createDoctor(
    data: ICreateDoctorRequest,
    file?: File,
): Promise<IApiResponse<IUser>> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file) {
        formData.append("file", file);
    }

    const response = await uploadFormData<IUser>(
        "/user/create-doctor",
        formData,
    );
    revalidateTag(USERS_TAG);
    revalidateTag("doctors");
    return response;
}

/**
 * Create patient user (Public)
 */
export async function createPatient(
    data: ICreatePatientRequest,
    file?: File,
): Promise<IApiResponse<IUser>> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file) {
        formData.append("file", file);
    }

    const response = await uploadFormData<IUser>(
        "/user/create-patient",
        formData,
    );
    revalidateTag(USERS_TAG);
    revalidateTag("patients");
    return response;
}

/**
 * Update user status (Admin only)
 */
export async function updateUserStatus(
    userId: string,
    data: IUpdateUserStatusRequest,
): Promise<IApiResponse<IUser>> {
    const response = await patch<IUser>(`/user/${userId}/status`, data);
    revalidateTag(USERS_TAG);
    return response;
}

/**
 * Update own profile
 */
export async function updateMyProfile(
    data: IUpdateProfileRequest,
    file?: File,
): Promise<IApiResponse<IUser>> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (file) {
        formData.append("file", file);
    }

    const response = await uploadFormData<IUser>(
        "/user/update-my-profile",
        formData,
        "PATCH",
    );
    revalidateTag("user");
    revalidateTag("profile");
    return response;
}
