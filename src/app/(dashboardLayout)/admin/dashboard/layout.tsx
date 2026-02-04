import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { DashboardLayout } from "@/components/shared/DashboardNavigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        if (user.role === "DOCTOR") {
            redirect("/doctor/dashboard");
        } else if (user.role === "PATIENT") {
            redirect("/dashboard");
        }
    }

    return <DashboardLayout role="ADMIN">{children}</DashboardLayout>;
}
