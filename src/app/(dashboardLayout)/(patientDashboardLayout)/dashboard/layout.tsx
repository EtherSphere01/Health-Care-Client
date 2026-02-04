import { DashboardLayout } from "@/components/shared/DashboardNavigation";

export default function PatientDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout role="PATIENT">{children}</DashboardLayout>;
}
