import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { DoctorPrescriptionsContent } from "./DoctorPrescriptionsContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface DoctorPrescriptionsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

export default async function DoctorPrescriptionsPage({
    searchParams,
}: DoctorPrescriptionsPageProps) {
    const params = await searchParams;

    return (
        <Suspense
            fallback={<Spinner size="lg" text="Loading prescriptions..." />}
        >
            <PrescriptionsFetcher searchParams={params} />
        </Suspense>
    );
}

async function PrescriptionsFetcher({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string };
}) {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);

    try {
        const response = await getMyAppointments({ page, limit });

        const prescriptions = (response.data ?? [])
            .map((appointment) => appointment.prescription)
            .filter(
                (
                    prescription,
                ): prescription is NonNullable<typeof prescription> =>
                    Boolean(prescription),
            );

        return (
            <DoctorPrescriptionsContent
                prescriptions={prescriptions}
                meta={response.meta ?? null}
                currentFilters={{ page, limit }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load prescriptions"
                description="An error occurred while loading your prescriptions. Please try again."
            />
        );
    }
}
