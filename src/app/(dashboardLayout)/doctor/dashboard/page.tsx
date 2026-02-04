import { Suspense } from "react";
import { getDashboardMeta } from "@/services/meta";
import { DoctorDashboardContent } from "./DoctorDashboardContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

export default function DoctorDashboardPage() {
    return (
        <Suspense fallback={<Spinner size="lg" text="Loading dashboard..." />}>
            <DoctorDashboardFetcher />
        </Suspense>
    );
}

async function DoctorDashboardFetcher() {
    try {
        const response = await getDashboardMeta();

        return <DoctorDashboardContent stats={response.data ?? null} />;
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load dashboard"
                description="An error occurred while loading your dashboard. Please try again."
            />
        );
    }
}
