/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const registerValidationSchema = z
    .object({
        name: z.string().nonempty({ message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z
            .string()
            .nonempty({ message: "Please confirm your password" }),
        otp: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const otpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z
        .string()
        .trim()
        .regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
});

export const registerPatient = async (
    _currentState: any,
    formData: any,
): Promise<any> => {
    try {
        const submittedValues = {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
            otp: String(formData.get("otp") ?? ""),
        };

        const hasOtp = Boolean(submittedValues.otp);

        if (hasOtp) {
            const otpValidated = otpSchema.safeParse({
                email: submittedValues.email,
                otp: submittedValues.otp,
            });

            if (!otpValidated.success) {
                return {
                    success: false,
                    step: "otp",
                    errors: otpValidated.error.issues.map((issue) => ({
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
                    body: JSON.stringify({
                        email: submittedValues.email,
                        otp: submittedValues.otp,
                    }),
                },
            ).then((res) => res.json());

            return {
                ...res,
                completed: Boolean(res?.success),
                step: "done",
                values: submittedValues,
            };
        }

        const validatedFields =
            registerValidationSchema.safeParse(submittedValues);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
                values: submittedValues,
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register-patient/request-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: submittedValues.name,
                    email: submittedValues.email,
                    password: submittedValues.password,
                }),
            },
        ).then((res) => res.json());

        return {
            ...res,
            step: res?.success ? "otp" : "form",
            completed: false,
            values: submittedValues,
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to register patient",
            values: {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                confirmPassword: String(formData.get("confirmPassword") ?? ""),
                otp: String(formData.get("otp") ?? ""),
            },
        };
    }
};
