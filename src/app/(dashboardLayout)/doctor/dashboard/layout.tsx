import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { DashboardLayout } from "@/components/shared/DashboardNavigation";

interface DoctorDashboardLayoutProps {
    children: React.ReactNode;
}

export default async function DoctorDashboardLayout({
    children,
}: DoctorDashboardLayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "DOCTOR") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            redirect("/admin/dashboard");
        } else if (user.role === "PATIENT") {
            redirect("/patient/dashboard");
        }
    }

    return <DashboardLayout role="DOCTOR">{children}</DashboardLayout>;
}
