import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { getPatientPrescriptions } from "@/services/prescription";
import { getDashboardMeta, getPatientDashboardSummary } from "@/services/meta";
import { LoadingState } from "@/components/ui/loading";
import { PatientDashboardContent } from "./PatientDashboardContent";
import { ErrorState } from "@/components/ui/empty-state";

export default function PatientDashboardPage() {
    return (
        <Suspense fallback={<LoadingState message="Loading dashboard..." />}>
            <PatientDashboardData />
        </Suspense>
    );
}

async function PatientDashboardData() {
    try {
        const [appointmentsRes, prescriptionsRes, metaRes, summaryRes] =
            await Promise.all([
                getMyAppointments({ limit: 5 }),
                getPatientPrescriptions({ limit: 5 }),
                getDashboardMeta(),
                getPatientDashboardSummary(),
            ]);

        return (
            <PatientDashboardContent
                appointments={appointmentsRes.data || []}
                prescriptions={prescriptionsRes.data || []}
                meta={metaRes.data ?? null}
                summary={summaryRes.data ?? null}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load dashboard"
                description="An error occurred while loading your dashboard. Please try again."
            />
        );
    }
}
