"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon | React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    iconClassName?: string;
    variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
}

const variantStyles = {
    default: {
        icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-800",
    },
    primary: {
        icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
        border: "border-indigo-100 dark:border-indigo-900/50",
    },
    success: {
        icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        border: "border-emerald-100 dark:border-emerald-900/50",
    },
    warning: {
        icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        border: "border-amber-100 dark:border-amber-900/50",
    },
    danger: {
        icon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        border: "border-red-100 dark:border-red-900/50",
    },
    info: {
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/50",
    },
};

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
    iconClassName,
    variant = "default",
}: StatCardProps) {
    const styles = variantStyles[variant];

    // Check if Icon is a function (LucideIcon) or a ReactNode
    const isLucideIcon = typeof Icon === "function";

    return (
        <div
            className={cn(
                "rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow",
                styles.border,
                className,
            )}
        >
            <div className="flex items-center justify-between mb-4">
                {Icon && (
                    <div
                        className={cn(
                            "p-3 rounded-lg",
                            styles.icon,
                            iconClassName,
                        )}
                    >
                        {isLucideIcon ? <Icon className="h-5 w-5" /> : Icon}
                    </div>
                )}
                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                            trend.isPositive
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                        )}
                    >
                        {trend.isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trend.value}%
                    </div>
                )}
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
                <p className="text-xs text-muted-foreground mt-2">
                    {description}
                </p>
            )}
        </div>
    );
}

interface StatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

export function StatsGrid({
    children,
    columns = 4,
    className,
}: StatsGridProps) {
    const gridCols = {
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-2 lg:grid-cols-3",
        4: "sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4",
                gridCols[columns],
                className,
            )}
        >
            {children}
        </div>
    );
}

interface MiniStatProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    className?: string;
}

export function MiniStat({
    label,
    value,
    icon: Icon,
    className,
}: MiniStatProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {Icon && (
                <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    );
}

interface ProgressStatProps {
    label: string;
    current: number;
    total: number;
    showPercentage?: boolean;
    className?: string;
    variant?: "default" | "success" | "warning" | "danger";
}

const progressVariants = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
};

export function ProgressStat({
    label,
    current,
    total,
    showPercentage = true,
    className,
    variant = "default",
}: ProgressStatProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">
                    {current}/{total}
                    {showPercentage && (
                        <span className="text-muted-foreground ml-1">
                            ({percentage}%)
                        </span>
                    )}
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all",
                        progressVariants[variant],
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
