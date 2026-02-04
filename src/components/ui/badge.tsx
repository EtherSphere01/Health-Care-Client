"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                success:
                    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                warning:
                    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

// Status Badge for common statuses
interface StatusBadgeProps {
    status: "active" | "inactive" | "pending" | "blocked" | "deleted" | string;
    className?: string;
}

const statusVariants: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
> = {
    active: "success",
    inactive: "secondary",
    pending: "warning",
    blocked: "destructive",
    deleted: "destructive",
    ACTIVE: "success",
    INACTIVE: "secondary",
    PENDING: "warning",
    BLOCKED: "destructive",
    DELETED: "destructive",
};

function StatusBadge({ status, className }: StatusBadgeProps) {
    const variant = statusVariants[status] || "secondary";
    const displayStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
        <Badge variant={variant} className={className}>
            {displayStatus}
        </Badge>
    );
}

// Appointment Status Badge
interface AppointmentStatusBadgeProps {
    status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED" | string;
    className?: string;
}

const appointmentStatusVariants: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
> = {
    SCHEDULED: "info",
    INPROGRESS: "warning",
    COMPLETED: "success",
    CANCELED: "destructive",
};

const appointmentStatusLabels: Record<string, string> = {
    SCHEDULED: "Scheduled",
    INPROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELED: "Canceled",
};

function AppointmentStatusBadge({
    status,
    className,
}: AppointmentStatusBadgeProps) {
    const variant = appointmentStatusVariants[status] || "secondary";
    const label = appointmentStatusLabels[status] || status;

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}

// Payment Status Badge
interface PaymentStatusBadgeProps {
    status: "PAID" | "UNPAID" | string;
    className?: string;
}

function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
    const variant = status === "PAID" ? "success" : "warning";
    const label = status === "PAID" ? "Paid" : "Unpaid";

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}

// Role Badge
interface RoleBadgeProps {
    role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | string;
    className?: string;
}

const roleVariants: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
> = {
    SUPER_ADMIN: "destructive",
    ADMIN: "default",
    DOCTOR: "info",
    PATIENT: "secondary",
};

const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    DOCTOR: "Doctor",
    PATIENT: "Patient",
};

function RoleBadge({ role, className }: RoleBadgeProps) {
    const variant = roleVariants[role] || "secondary";
    const label = roleLabels[role] || role;

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}

export {
    Badge,
    badgeVariants,
    StatusBadge,
    AppointmentStatusBadge,
    PaymentStatusBadge,
    RoleBadge,
};
