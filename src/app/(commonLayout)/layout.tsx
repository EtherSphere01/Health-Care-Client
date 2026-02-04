import Footer from "@/components/shared/Footer";
import PublicNavbarWrapper from "@/components/shared/PublicNavbarWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicNavbarWrapper />
            <div className="">{children}</div>
            <Footer />
        </>
    );
}
