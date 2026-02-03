/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useActionState, useEffect } from "react";
import { registerPatient } from "@/services/auth/registerPatient";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
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

    const formatMessage = (value: unknown) => {
        if (!value) return "Something went wrong";
        if (typeof value === "string") return value;
        try {
            return JSON.stringify(value);
        } catch (_err) {
            return "Unexpected error";
        }
    };

    useEffect(() => {
        if (!state || isPending) return;

        if (state.success) {
            toast.success(
                formatMessage(state.message ?? "Account created successfully"),
                {
                    position: "top-right",
                },
            );
            return;
        }

        if (state.errors?.length) {
            toast.error(
                formatMessage(
                    state.errors[0].message ?? "Please fix the errors",
                ),
                {
                    position: "top-right",
                },
            );
            return;
        }

        if (state.error) {
            toast.error(formatMessage(state.error), {
                position: "top-right",
            });
        }
    }, [state, isPending]);

    useEffect(() => {
        if (!state) return;
        if (state.success && !isPending) {
            redirect("/login");
        }
    }, [state, isPending]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
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
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            defaultValue={
                                                state?.values?.password
                                            }
                                            required
                                        />
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
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            defaultValue={
                                                state?.values?.confirmPassword
                                            }
                                            required
                                        />
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
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Creating..."
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
