"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Info,
    XCircle,
    FileQuestion,
} from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className,
            )}
        >
            {icon || (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileQuestion className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mt-4">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-6">
                    {action.label}
                </Button>
            )}
        </div>
    );
}

interface ErrorStateProps {
    title?: string;
    message?: string;
    description?: string; // alias for message
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = "Something went wrong",
    message,
    description,
    onRetry,
    className,
}: ErrorStateProps) {
    const displayMessage =
        message ||
        description ||
        "An error occurred while loading. Please try again.";
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className,
            )}
        >
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-4">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {displayMessage}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-6">
                    Try Again
                </Button>
            )}
        </div>
    );
}

interface AlertProps {
    variant?: "default" | "success" | "warning" | "error" | "info";
    title?: string;
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
}

const alertVariants = {
    default: {
        container: "bg-muted border-border",
        icon: Info,
        iconClass: "text-muted-foreground",
    },
    success: {
        container:
            "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900",
        icon: CheckCircle,
        iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    warning: {
        container:
            "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900",
        icon: AlertCircle,
        iconClass: "text-amber-600 dark:text-amber-400",
    },
    error: {
        container:
            "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
        icon: XCircle,
        iconClass: "text-red-600 dark:text-red-400",
    },
    info: {
        container:
            "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
        icon: Info,
        iconClass: "text-blue-600 dark:text-blue-400",
    },
};

export function Alert({
    variant = "default",
    title,
    children,
    className,
    onClose,
}: AlertProps) {
    const config = alertVariants[variant];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "relative rounded-lg border p-4",
                config.container,
                className,
            )}
            role="alert"
        >
            <div className="flex gap-3">
                <Icon
                    className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)}
                />
                <div className="flex-1">
                    {title && <h4 className="font-medium mb-1">{title}</h4>}
                    <div className="text-sm">{children}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        aria-label="Close alert"
                    >
                        <XCircle className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

interface StatusIndicatorProps {
    status: "active" | "inactive" | "pending" | "error";
    label?: string;
    className?: string;
}

const statusConfig = {
    active: { color: "bg-emerald-500", label: "Active" },
    inactive: { color: "bg-slate-400", label: "Inactive" },
    pending: { color: "bg-amber-500", label: "Pending" },
    error: { color: "bg-red-500", label: "Error" },
};

export function StatusIndicator({
    status,
    label,
    className,
}: StatusIndicatorProps) {
    const config = statusConfig[status];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className={cn("h-2 w-2 rounded-full", config.color)} />
            <span className="text-sm text-muted-foreground">
                {label || config.label}
            </span>
        </div>
    );
}
