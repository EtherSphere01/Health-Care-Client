"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, ArrowLeft, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await forgotPassword({ email });

            if (response.success) {
                setIsSubmitted(true);
                toast.success("Password reset email sent!");
            } else {
                toast.error(response.message || "Failed to send reset email");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Bot className="size-4" />
                    </div>
                    Nexus Health
                </Link>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">
                            Forgot Password
                        </CardTitle>
                        <CardDescription>
                            {isSubmitted
                                ? "Check your email for the reset link"
                                : "Enter your email address to reset your password"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitted ? (
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a password reset link to{" "}
                                    <span className="font-medium">{email}</span>
                                    . Please check your inbox and follow the
                                    instructions to reset your password.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the email?{" "}
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-primary underline hover:no-underline"
                                    >
                                        Try again
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Reset Link"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
