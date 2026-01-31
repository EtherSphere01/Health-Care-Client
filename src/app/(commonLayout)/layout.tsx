import PublicNavbarWrapper from "@/components/shared/PublicNavbarWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicNavbarWrapper />
            {children}
            <footer />
        </>
    );
}
