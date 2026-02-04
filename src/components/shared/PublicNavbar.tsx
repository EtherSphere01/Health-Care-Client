"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";

export default function PublicNavbar() {
    const pathname = usePathname();
    const { isAuthenticated, isLoading, role, logout } = useAuth();

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Consultation", href: "/consultation" },
        { name: "Health Plans", href: "/health-plans" },
        { name: "Diagnostics", href: "/diagnostics" },
        { name: "NGOs", href: "/ngos" },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const dashboardHref =
        role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
            ? "/admin/dashboard"
            : role === UserRole.DOCTOR
              ? "/doctor/dashboard"
              : "/dashboard";

    const profileHref =
        role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
            ? "/admin/dashboard/my-profile"
            : role === UserRole.DOCTOR
              ? "/doctor/dashboard/my-profile"
              : "/dashboard/my-profile";

    return (
        <>
            {/* Desktop */}
            <header className="hidden container mx-auto lg:flex items-center justify-between py-4 px-6">
                <Link href="/">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-900 animate-gradient-x">
                        Nexus
                        <span className="font-semibold text-indigo-950">
                            Health
                        </span>
                    </span>
                </Link>

                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.name} className="inline-block mx-2">
                                <Link
                                    href={item.href}
                                    className={`
                                        px-4 py-2 rounded-lg transition-all
                                        ${
                                            isActive(item.href)
                                                ? "bg-indigo-100/70 backdrop-blur-md text-indigo-700 font-semibold"
                                                : "text-slate-700 hover:text-indigo-600"
                                        }
                                    `}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {!isLoading && (
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link href={dashboardHref}>
                                    <Button>Dashboard</Button>
                                </Link>
                                <Link href={profileHref}>
                                    <Button variant="outline">Profile</Button>
                                </Link>
                                <Button variant="ghost" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button>Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="outline">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile */}
            <header className="lg:hidden p-2 cursor-pointer flex items-center justify-between">
                <Link href="/">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-900 animate-gradient-x">
                        Nexus
                        <span className="font-semibold text-indigo-950">
                            Health
                        </span>
                    </span>
                </Link>
                <Sheet>
                    <SheetTrigger>
                        <Menu className="w-4 h-4 text-indigo-950 cursor-pointer" />
                    </SheetTrigger>

                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="font-bold text-xl ">
                                Menu
                            </SheetTitle>

                            <SheetDescription>
                                <nav>
                                    <ul>
                                        {navItems.map((item) => (
                                            <li
                                                key={item.name}
                                                className={`
                                                    py-2 px-4 rounded-md mb-2 transition-all
                                                    ${
                                                        isActive(item.href)
                                                            ? "bg-indigo-100/70 backdrop-blur-md text-indigo-700 font-semibold"
                                                            : "text-slate-800 hover:bg-slate-100"
                                                    }
                                                `}
                                            >
                                                <Link href={item.href}>
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {!isLoading && (
                                    <div className="mt-4 space-y-2">
                                        {isAuthenticated ? (
                                            <>
                                                <Link href={dashboardHref}>
                                                    <Button className="w-full">
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                                <Link href={profileHref}>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        Profile
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full"
                                                    onClick={logout}
                                                >
                                                    Logout
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/login">
                                                    <Button className="w-full">
                                                        Login
                                                    </Button>
                                                </Link>
                                                <Link href="/register">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        Register
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
}
