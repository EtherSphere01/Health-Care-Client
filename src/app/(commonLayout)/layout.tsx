import Footer from "@/components/shared/Footer";
import PublicNavbarWrapper from "@/components/shared/PublicNavbarWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicNavbarWrapper />
            <main className="pt-28 lg:pt-32">{children}</main>
            <Footer />
        </>
    );
}
