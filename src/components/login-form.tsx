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
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Stethoscope, User } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { loginUser } from "@/services/auth/loginUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({ redirect }: { redirect?: string }) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginUser, null);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const demoUsers = useMemo(
        () => [
            {
                label: "Admin",
                icon: ShieldCheck,
                email: "admin@gmail.com",
                password: "123456",
            },
            {
                label: "Doctor",
                icon: Stethoscope,
                email: "doctor01@example.com",
                password: "123456",
            },
            {
                label: "Patient",
                icon: User,
                email: "patient01@example.com",
                password: "123456",
            },
        ],
        [],
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
            toast.success(state.message ?? "Login successfully", {
                position: "top-right",
            });
            if (state.redirectTo) {
                router.push(state.redirectTo);
            }
            return;
        }

        if (state.success == false) {
            toast.warning(state.message ?? "Password or email incorrect", {
                position: "top-right",
            });
        } else {
            toast.error("Something went wrong", {
                position: "top-right",
            });
        }
    }, [state, isPending, router]);

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card className="border-primary/10 shadow-lg rounded-2xl bg-linear-to-br from-white to-indigo-50/40">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl tracking-tight">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Sign in to continue to your dashboard
                    </CardDescription>
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                            Demo access
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {demoUsers.map((u) => (
                                <Button
                                    key={u.label}
                                    type="button"
                                    variant="outline"
                                    className="h-9 rounded-xl"
                                    onClick={() => {
                                        setEmail(u.email);
                                        setPassword(u.password);
                                    }}
                                >
                                    <u.icon className="h-4 w-4 mr-2" />
                                    {u.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <input
                            type="hidden"
                            name="redirect"
                            value={redirect ? redirect : ""}
                        ></input>
                        <FieldGroup>
                            <Field>
                                <Button variant="outline" type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Apple
                                </Button>
                                <Button variant="outline" type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <FieldDescription className="text-red-600">
                                    {getFieldError("email")}
                                </FieldDescription>
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <FieldDescription className="text-red-600">
                                    {getFieldError("password")}
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Logging in..." : "Login"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register">Sign up</Link>
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
