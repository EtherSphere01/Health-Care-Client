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
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { registerPatient } from "@/services/auth/registerPatient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const hasRedirected = useRef(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [state, formAction, isPending] = useActionState(
        registerPatient,
        null,
    );

    const getFieldError = (fieldName: string) => {
        const errors = state?.errors;
        if (!errors) return null;

        const error = errors.find((err: any) => err.field === fieldName);
        return error ? error.message : null;
    };

    useEffect(() => {
        if (!state || isPending) return;

        if (state.success) {
            if (state?.step === "otp" && !hasRedirected.current) {
                hasRedirected.current = true;
                const email = encodeURIComponent(state?.data?.email ?? "");
                router.push(`/verify-otp?email=${email}&sent=1`);
                return;
            }

            toast.success(state.message ?? "Success");
            return;
        }

        if (state.error) {
            toast.error(state.message ?? "Something went wrong");
        }
    }, [state, isPending, router]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border-primary/10 shadow-lg rounded-2xl bg-linear-to-br from-white to-indigo-50/40">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl tracking-tight">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    defaultValue={state?.values?.name}
                                    required
                                />
                                {getFieldError("name") && (
                                    <FieldDescription className="text-red-600">
                                        {getFieldError("name")}
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    defaultValue={state?.values?.email}
                                    required
                                />
                                {getFieldError("email") && (
                                    <FieldDescription className="text-red-600">
                                        {getFieldError("email")}
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-1 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPasswords
                                                        ? "text"
                                                        : "password"
                                                }
                                                defaultValue={
                                                    state?.values?.password
                                                }
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPasswords((v) => !v)
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                aria-label={
                                                    showPasswords
                                                        ? "Hide passwords"
                                                        : "Show passwords"
                                                }
                                            >
                                                {showPasswords ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {getFieldError("password") && (
                                            <FieldDescription className="text-red-600">
                                                {getFieldError("password")}
                                            </FieldDescription>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={
                                                    showPasswords
                                                        ? "text"
                                                        : "password"
                                                }
                                                defaultValue={
                                                    state?.values
                                                        ?.confirmPassword
                                                }
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPasswords((v) => !v)
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                aria-label={
                                                    showPasswords
                                                        ? "Hide passwords"
                                                        : "Show passwords"
                                                }
                                            >
                                                {showPasswords ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {getFieldError("confirmPassword") && (
                                            <FieldDescription className="text-red-600">
                                                {getFieldError(
                                                    "confirmPassword",
                                                )}
                                            </FieldDescription>
                                        )}
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending
                                        ? "Sending OTP..."
                                        : "Create Account"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
