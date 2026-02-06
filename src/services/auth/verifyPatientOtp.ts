/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const otpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z
        .string()
        .trim()
        .regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
});

export const verifyPatientOtp = async (
    _currentState: any,
    formData: any,
): Promise<any> => {
    try {
        const submittedValues = {
            email: String(formData.get("email") ?? ""),
            otp: String(formData.get("otp") ?? ""),
        };

        const validated = otpSchema.safeParse(submittedValues);
        if (!validated.success) {
            return {
                success: false,
                errors: validated.error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
                values: submittedValues,
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register-patient/verify-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validated.data),
            },
        ).then((res) => res.json());

        return {
            ...res,
            completed: Boolean(res?.success),
            values: submittedValues,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to verify OTP",
        };
    }
};
