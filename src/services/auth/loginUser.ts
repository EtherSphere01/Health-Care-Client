/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const loginValidationSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().nonempty({ message: "Password is required" }),
});

export const loginUser = async (
    _currentState: any,
    formData: any,
): Promise<any> => {
    try {
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
        ).then((res) => res.json());
        return res;
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
