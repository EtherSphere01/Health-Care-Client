"use server";

import { get, post } from "@/lib/api";
import {
    getCookie,
    setCookie,
    deleteCookie,
} from "@/services/auth/tokenHandlers";
import {
    ILoginResponse,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
    IUser,
    IDecodedToken,
} from "@/types";
import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<{
    success: boolean;
    message?: string;
}> {
    try {
        const refreshTokenValue = await getCookie("refreshToken");

        if (!refreshTokenValue) {
            return { success: false, message: "No refresh token found" };
        }

        const response = await post<ILoginResponse>(
            "/auth/refresh-token",
            undefined,
            {
                requireAuth: false,
                headers: {
                    Cookie: `refreshToken=${refreshTokenValue}`,
                },
            },
        );

        if (response.success && response.data.accessToken) {
            await setCookie("accessToken", response.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400, // 1 day
                path: "/",
                sameSite: "lax",
            });
            return { success: true };
        }

        return { success: false, message: "Failed to refresh token" };
    } catch (error) {
        console.error("Refresh token error:", error);
        return { success: false, message: "Failed to refresh token" };
    }
}

/**
 * Change password for authenticated user
 */
export async function changePassword(
    data: IChangePasswordRequest,
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await post<null>("/auth/change-password", data);
        revalidateTag("user", "max");
        return { success: true, message: response.message };
    } catch (error) {
        const errorMessage =
            (error as { message?: string })?.message ||
            "Failed to change password";
        return { success: false, message: errorMessage };
    }
}

/**
 * Send forgot password email
 */
export async function forgotPassword(
    data: IForgotPasswordRequest,
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await post<null>("/auth/forgot-password", data, {
            requireAuth: false,
        });
        return { success: true, message: response.message };
    } catch (error) {
        const errorMessage =
            (error as { message?: string })?.message ||
            "Failed to send reset email";
        return { success: false, message: errorMessage };
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(
    data: IResetPasswordRequest,
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await post<null>(
            "/auth/reset-password",
            { password: data.newPassword },
            {
                requireAuth: false,
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            },
        );
        return { success: true, message: response.message };
    } catch (error) {
        const errorMessage =
            (error as { message?: string })?.message ||
            "Failed to reset password";
        return { success: false, message: errorMessage };
    }
}

/**
 * Get current authenticated user
 */
export async function getMe(): Promise<IUser | null> {
    try {
        const accessToken = await getCookie("accessToken");
        const response = await get<IUser>("/auth/me", undefined, {
            tags: ["user", "me"],
            headers: accessToken
                ? {
                      Cookie: `accessToken=${accessToken}`,
                  }
                : undefined,
        });
        return response.data;
    } catch {
        return null;
    }
}

/**
 * Logout user by clearing cookies
 */
export async function logout(): Promise<void> {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    revalidateTag("user", "max");
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<IDecodedToken | null> {
    try {
        const token = await getCookie("accessToken");
        if (!token) return null;
        return jwtDecode<IDecodedToken>(token);
    } catch {
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}
