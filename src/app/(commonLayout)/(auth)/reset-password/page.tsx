"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/services/auth";
import { toast } from "sonner";
import { NexusHealthBrand } from "@/components/shared/nexus-health-brand";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const token = searchParams.get("token") || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset link. Please request a new one.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await resetPassword({
                token,
                newPassword: password,
            });

            if (response.success) {
                setIsSuccess(true);
                toast.success("Password reset successfully!");
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 self-center font-medium"
                    >
                        <NexusHealthBrand />
                    </Link>

                    <Card className="border-primary/10 shadow-lg rounded-2xl bg-linear-to-br from-white to-indigo-50/40">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Invalid Reset Link
                            </CardTitle>
                            <CardDescription>
                                This password reset link is invalid or has
                                expired.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Link href="/forgot-password">
                                <Button className="w-full">
                                    Request New Reset Link
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <NexusHealthBrand />
                </Link>

                <Card className="border-primary/10 shadow-lg rounded-2xl bg-linear-to-br from-white to-indigo-50/40">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">
                            {isSuccess
                                ? "Password Reset"
                                : "Reset Your Password"}
                        </CardTitle>
                        <CardDescription>
                            {isSuccess
                                ? "Your password has been reset successfully"
                                : "Enter your new password below"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Your password has been reset successfully.
                                    You can now log in with your new password.
                                </p>
                                <Button
                                    className="w-full"
                                    onClick={() => router.push("/login")}
                                >
                                    Go to Login
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPasswords
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            minLength={6}
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
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showPasswords
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            minLength={6}
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
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Resetting..."
                                        : "Reset Password"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center gap-2 self-center font-medium">
                    <NexusHealthBrand />
                </div>
                <Card className="border-primary/10 shadow-lg rounded-2xl bg-linear-to-br from-white to-indigo-50/40">
                    <CardContent className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
