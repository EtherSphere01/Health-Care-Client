"use client";

import { useEffect, useState } from "react";
import PublicNavbar from "./PublicNavbar";

export default function PublicNavbarWrapper() {
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setShowNav(false); // scrolling down
            } else {
                setShowNav(true); // scrolling up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [lastScrollY]);

    return (
        <>
            <nav
                className={`
                fixed top-4  left-1/2 -translate-x-1/2
                z-50 w-full max-w-7xl
                lg:rounded-xl rounded-lg
                bg-background/70 backdrop-blur-md border border-border/60
                transition-all duration-300 ease-in-out
                ${showNav ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}
            `}
            >
                <PublicNavbar />
            </nav>
        </>
    );
}
