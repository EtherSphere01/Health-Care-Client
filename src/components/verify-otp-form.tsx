/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyPatientOtp } from "@/services/auth/verifyPatientOtp";

export function VerifyOtpForm({
    className,
    defaultEmail,
    showOtpSentToast,
    ...props
}: React.ComponentProps<"div"> & {
    defaultEmail?: string;
    showOtpSentToast?: boolean;
}) {
    const router = useRouter();
    const hasRedirected = useRef(false);
    const hasShownSentToast = useRef(false);
    const [state, formAction, isPending] = useActionState(
        verifyPatientOtp,
        null,
    );

    const getFieldError = (fieldName: string) => {
        const errors = state?.errors;
        if (!errors) return null;

        const error = errors.find((err: any) => err.field === fieldName);
        return error ? error.message : null;
    };

    useEffect(() => {
        if (showOtpSentToast && !hasShownSentToast.current) {
            hasShownSentToast.current = true;
            toast.success("OTP sent");
        }
    }, [showOtpSentToast]);

    useEffect(() => {
        if (!state || isPending) return;

        if (state.success) {
            toast.success(state.message ?? "Verified");
            if (state.completed && !hasRedirected.current) {
                hasRedirected.current = true;
                router.push("/login");
            }
            return;
        }

        if (state.message) {
            toast.error(state.message);
        }
    }, [state, isPending, router]);

    return (
        <div
            className={cn(
                "flex min-h-[calc(100vh-6rem)] items-start justify-center px-4 py-8",
                className,
            )}
            {...props}
        >
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Verify your email</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={
                                        state?.values?.email ??
                                        defaultEmail ??
                                        ""
                                    }
                                    required
                                />
                                {getFieldError("email") && (
                                    <FieldDescription className="text-red-600">
                                        {getFieldError("email")}
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">OTP Code</FieldLabel>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    placeholder="6-digit code"
                                    defaultValue={state?.values?.otp}
                                    onInput={(e) => {
                                        const input = e.currentTarget;
                                        input.value = input.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);
                                    }}
                                    required
                                />
                                {getFieldError("otp") && (
                                    <FieldDescription className="text-red-600">
                                        {getFieldError("otp")}
                                    </FieldDescription>
                                )}
                                <FieldDescription>
                                    Didn&apos;t get a code? Go back to{" "}
                                    <Link
                                        href="/register"
                                        className="underline"
                                    >
                                        register
                                    </Link>
                                    .
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full"
                                >
                                    {isPending ? "Verifying..." : "Verify"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
