"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
}

interface SidebarProps {
    items: NavItem[];
    title?: string;
    logo?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Sidebar({
    items,
    title,
    logo,
    footer,
    className,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card",
                className,
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center gap-3 border-b px-6">
                {logo}
                {title && <span className="font-bold text-lg">{title}</span>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {items.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="flex-1">{item.title}</span>
                                    {item.badge && (
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-0.5 text-xs font-semibold",
                                                isActive
                                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                                    : "bg-muted text-muted-foreground",
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {footer && <div className="border-t p-4">{footer}</div>}
        </aside>
    );
}

interface DashboardHeaderProps {
    title: string | React.ReactNode;
    description?: string;
    actions?: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    className?: string;
}

export function DashboardHeader({
    title,
    description,
    actions,
    breadcrumbs,
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn("mb-10", className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {index > 0 && <span>/</span>}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted-foreground mt-1">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </div>
        </div>
    );
}

interface DashboardShellProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
    return (
        <div className={cn("flex-1 space-y-6 p-6 md:p-8", className)}>
            {children}
        </div>
    );
}

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div className={cn("rounded-xl border bg-card", className)}>
            {children}
        </div>
    );
}

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between",
                className,
            )}
        >
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2">{actions}</div>
            )}
        </div>
    );
}

interface PageContentProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
    return <div className={cn("p-6", className)}>{children}</div>;
}
