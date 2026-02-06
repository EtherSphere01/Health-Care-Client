"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    Users,
    UserCog,
    Stethoscope,
    Calendar,
    ClipboardList,
    Clock,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Heart,
    Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

// Admin Navigation Items
export const adminNavItems: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
        title: "Doctors",
        href: "/admin/dashboard/doctors-management",
        icon: Stethoscope,
    },
    {
        title: "Patients",
        href: "/admin/dashboard/patients-management",
        icon: Users,
    },
    {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: UserCog,
    },
    {
        title: "Appointments",
        href: "/admin/dashboard/appointments-management",
        icon: Calendar,
    },
    {
        title: "Specialties",
        href: "/admin/dashboard/specialities-management",
        icon: Heart,
    },
    {
        title: "Schedules",
        href: "/admin/dashboard/schedules-management",
        icon: Clock,
    },
    { title: "My Profile", href: "/admin/dashboard/my-profile", icon: User },
];

// Doctor Navigation Items
export const doctorNavItems: NavItem[] = [
    { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    {
        title: "Appointments",
        href: "/doctor/dashboard/appointments",
        icon: Calendar,
    },
    {
        title: "My Schedules",
        href: "/doctor/dashboard/my-schedules",
        icon: Clock,
    },
    {
        title: "Prescriptions",
        href: "/doctor/dashboard/prescriptions",
        icon: ClipboardList,
    },
    { title: "My Profile", href: "/doctor/dashboard/my-profile", icon: User },
];

// Patient Navigation Items
export const patientNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
        title: "My Appointments",
        href: "/dashboard/my-appointments",
        icon: Calendar,
    },
    {
        title: "My Prescriptions",
        href: "/dashboard/my-prescriptions",
        icon: ClipboardList,
    },
    { title: "My Profile", href: "/dashboard/my-profile", icon: User },
];

interface DashboardSidebarProps {
    navItems: NavItem[];
    isOpen: boolean;
    onClose: () => void;
}

export function DashboardSidebar({
    navItems,
    isOpen,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, isLoading } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/60 bg-white/90 backdrop-blur-xl supports-backdrop-filter:bg-white/80 shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/60">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
                            <Bot className="h-4 w-4" />
                        </span>
                        <span className="font-semibold text-lg tracking-tight text-slate-900">
                            Nexus Health
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md hover:bg-slate-100"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/admin/dashboard" &&
                                    item.href !== "/doctor/dashboard" &&
                                    item.href !== "/dashboard" &&
                                    pathname.startsWith(item.href));

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary border border-primary/15"
                                                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-slate-500 group-hover:text-slate-900",
                                            )}
                                        />
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="border-t border-slate-200/60 p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 hover:text-slate-900"
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
}

interface DashboardTopbarProps {
    onMenuClick: () => void;
    title?: string;
}

type DashboardBreadcrumbContextValue = {
    currentPageLabel?: string;
    setCurrentPageLabel: (label?: string) => void;
};

const DashboardBreadcrumbContext =
    React.createContext<DashboardBreadcrumbContextValue | null>(null);

export function useDashboardBreadcrumbs() {
    const context = React.useContext(DashboardBreadcrumbContext);
    if (!context) {
        throw new Error(
            "useDashboardBreadcrumbs must be used within DashboardLayoutWrapper",
        );
    }
    return context;
}

function humanizeBreadcrumbLabel(value: string) {
    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildBreadcrumbs(pathname: string) {
    const base = pathname.startsWith("/admin/dashboard")
        ? "/admin/dashboard"
        : pathname.startsWith("/doctor/dashboard")
          ? "/doctor/dashboard"
          : pathname.startsWith("/dashboard")
            ? "/dashboard"
            : "/";

    const rest = pathname.slice(base.length).split("/").filter(Boolean);

    const crumbs: Array<{ label: string; href?: string }> = [];

    if (base !== "/") {
        crumbs.push({ label: "Dashboard", href: base });
    }

    let acc = base === "/" ? "" : base;
    for (const segment of rest) {
        acc = `${acc}/${segment}`;
        crumbs.push({ label: humanizeBreadcrumbLabel(segment), href: acc });
    }

    return crumbs;
}

export function DashboardTopbar({ onMenuClick, title }: DashboardTopbarProps) {
    const { user } = useAuth();
    const pathname = usePathname();
    const breadcrumbCtx = React.useContext(DashboardBreadcrumbContext);
    const breadcrumbs = React.useMemo(
        () => buildBreadcrumbs(pathname),
        [pathname],
    );

    const effectiveBreadcrumbs = React.useMemo(() => {
        const override = breadcrumbCtx?.currentPageLabel;
        if (!override || breadcrumbs.length === 0) return breadcrumbs;

        return breadcrumbs.map((crumb, index) => {
            if (index !== breadcrumbs.length - 1) return crumb;
            return { ...crumb, label: override, href: undefined };
        });
    }, [breadcrumbs, breadcrumbCtx?.currentPageLabel]);

    return (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl supports-backdrop-filter:bg-white/80 lg:left-64">
            <div className="flex h-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md hover:bg-slate-100"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {title ? (
                        <h1 className="text-lg font-semibold hidden sm:block text-slate-900">
                            {title}
                        </h1>
                    ) : effectiveBreadcrumbs.length > 0 ? (
                        <nav
                            aria-label="Breadcrumb"
                            className="hidden sm:flex items-center gap-2 text-sm text-slate-600"
                        >
                            {effectiveBreadcrumbs.map((crumb, index) => {
                                const isLast =
                                    index === effectiveBreadcrumbs.length - 1;
                                const content = crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className={cn(
                                            "transition-colors",
                                            isLast
                                                ? "text-slate-900 font-medium"
                                                : "hover:text-slate-900",
                                        )}
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={cn(
                                            isLast
                                                ? "text-slate-900 font-medium"
                                                : undefined,
                                        )}
                                    >
                                        {crumb.label}
                                    </span>
                                );

                                return (
                                    <React.Fragment
                                        key={`${crumb.label}-${crumb.href ?? index}`}
                                    >
                                        {index > 0 && (
                                            <span className="text-slate-400">
                                                /
                                            </span>
                                        )}
                                        {content}
                                    </React.Fragment>
                                );
                            })}
                        </nav>
                    ) : null}
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button
                        className="relative p-2 rounded-full hover:bg-slate-100"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-50 to-violet-100 border border-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-slate-900">
                                {user?.email}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                                {user?.role?.toLowerCase().replace("_", " ")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    navItems: NavItem[];
}

export function DashboardLayoutWrapper({
    children,
    navItems,
}: DashboardLayoutWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [currentPageLabel, setCurrentPageLabel] = React.useState<
        string | undefined
    >(undefined);

    return (
        <DashboardBreadcrumbContext.Provider
            value={{ currentPageLabel, setCurrentPageLabel }}
        >
            <div className="h-screen overflow-hidden bg-[#F6F8FB] text-foreground relative">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(99,102,241,0.12),transparent),radial-gradient(900px_600px_at_90%_-20%,rgba(14,165,233,0.12),transparent)]" />
                <div className="relative flex h-full">
                    <DashboardSidebar
                        navItems={navItems}
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <div className="flex-1 lg:pl-64">
                        <DashboardTopbar
                            onMenuClick={() => setSidebarOpen(true)}
                        />
                        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto px-4 pb-8 pt-6 md:px-6 lg:px-8">
                            <div className="w-full max-w-none space-y-4">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </DashboardBreadcrumbContext.Provider>
    );
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
    sidebar?: React.ReactNode; // Optional custom sidebar, not used currently
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const navItems =
        role === "ADMIN"
            ? adminNavItems
            : role === "DOCTOR"
              ? doctorNavItems
              : role === "PATIENT"
                ? patientNavItems
                : [];

    return (
        <DashboardLayoutWrapper navItems={navItems}>
            {children}
        </DashboardLayoutWrapper>
    );
}
