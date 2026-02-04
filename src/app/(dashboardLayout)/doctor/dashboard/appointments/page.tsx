import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { DoctorAppointmentsContent } from "./DoctorAppointmentsContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface DoctorAppointmentsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        status?: string;
        paymentStatus?: string;
    }>;
}

export default async function DoctorAppointmentsPage({
    searchParams,
}: DoctorAppointmentsPageProps) {
    const params = await searchParams;

    return (
        <Suspense
            fallback={<Spinner size="lg" text="Loading appointments..." />}
        >
            <AppointmentsFetcher searchParams={params} />
        </Suspense>
    );
}

async function AppointmentsFetcher({
    searchParams,
}: {
    searchParams: {
        page?: string;
        limit?: string;
        status?: string;
        paymentStatus?: string;
    };
}) {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const status = searchParams.status || "";
    const paymentStatus = searchParams.paymentStatus || "";

    try {
        const response = await getMyAppointments({
            page,
            limit,
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
        });

        return (
            <DoctorAppointmentsContent
                appointments={response.data ?? []}
                meta={response.meta ?? null}
                currentFilters={{ page, limit, status, paymentStatus }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load appointments"
                description="An error occurred while loading your appointments. Please try again."
            />
        );
    }
}
