/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const registerValidationSchema = z
    .object({
        name: z.string().nonempty({ message: "Name is required" }),
        email: z.email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z
            .string()
            .nonempty({ message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
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
        };

        const registerDate = {
            password: submittedValues.password,
            patient: {
                name: submittedValues.name,
                email: submittedValues.email,
            },
        };

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

        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(registerDate));
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`,
            {
                method: "POST",
                body: newFormData,
            },
        ).then((res) => res.json());
        return res;
    } catch (error) {
        return {
            success: false,
            error: "Failed to register patient",
            values: {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                confirmPassword: String(formData.get("confirmPassword") ?? ""),
            },
        };
    }
};
