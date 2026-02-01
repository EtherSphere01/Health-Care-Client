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

export default function PublicNavbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Consultation", href: "/consultation" },
        { name: "Health Plans", href: "/health-plans" },
        { name: "Diagnostics", href: "/diagnostics" },
        { name: "NGOs", href: "/ngos" },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

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

                <Link href="/auth/login">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer">
                        Login
                    </Button>
                </Link>
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

                                <Link href="/login">
                                    <Button className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer w-full text-center">
                                        Login
                                    </Button>
                                </Link>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
}
