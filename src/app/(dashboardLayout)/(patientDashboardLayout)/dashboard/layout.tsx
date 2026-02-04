import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { DashboardNavigation } from "@/components/shared/DashboardNavigation";

export default function PatientDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout
            role="PATIENT"
            sidebar={<DashboardNavigation role="PATIENT" />}
        >
            {children}
        </DashboardLayout>
    );
}
