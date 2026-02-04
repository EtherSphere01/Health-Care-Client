/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { parse } from "cookie";
import z from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getDefaultDashboardRoute } from "@/lib/auth.utils";
import { setCookie } from "./tokenHandlers";

const loginValidationSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().nonempty({ message: "Password is required" }),
});

export const loginUser = async (
    _currentState: any,
    formData: any,
): Promise<any> => {
    try {
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        const loginData = {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
        };

        const validation = loginValidationSchema.safeParse(loginData);
        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
                values: loginData,
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            },
        );

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: data.message ?? "Password or email incorrect",
                values: loginData,
            };
        }

        const setCookieHeaders = res.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie) => {
                const parsedCookie = parse(cookie);
                if (parsedCookie["accessToken"]) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie["refreshToken"]) {
                    refreshTokenObject = parsedCookie;
                }
            });
        } else {
            throw new Error("No Set-Cookie headers found");
        }

        if (!accessTokenObject || !refreshTokenObject) {
            throw new Error("Tokens not found in Cookies");
        }

        // Normalize to root path so cookies are sent on all routes.
        const isProd = process.env.NODE_ENV === "production";
        const accessSameSite =
            isProd && accessTokenObject["SameSite"]
                ? accessTokenObject["SameSite"]
                : "lax";
        const refreshSameSite =
            isProd && refreshTokenObject["SameSite"]
                ? refreshTokenObject["SameSite"]
                : "lax";

        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: isProd,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject["Max-Age"]) || 86400,
            path: "/",
            sameSite: accessSameSite as any,
        });

        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: isProd,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject["Max-Age"]) || 2592000,
            path: "/",
            sameSite: refreshSameSite as any,
        });

        const verifiedToken: JwtPayload | string = jwt.verify(
            accessTokenObject.accessToken,
            process.env.JWT_SECRET as string,
        );
        if (typeof verifiedToken === "string") {
            console.log(
                "Token verification returned a string, expected JwtPayload",
            );
        }

        const dataToken = verifiedToken as JwtPayload;
        const defaultRedirect = getDefaultDashboardRoute(dataToken.role as any);

        let redirectTo = defaultRedirect;
        if (
            String(formData.get("redirect")) &&
            String(formData.get("redirect") !== "")
        ) {
            redirectTo = String(formData.get("redirect"));
        }

        // Login successful
        return {
            success: true,
            message: data.message ?? "Login successful",
            user: data.user ?? null,
            redirectTo: redirectTo,
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to login user",
            values: {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
            },
        };
    }
};
