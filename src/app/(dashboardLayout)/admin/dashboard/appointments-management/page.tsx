import { Suspense } from "react";
import { getAllAppointments } from "@/services/appointment";
import { AppointmentsManagementContent } from "./AppointmentsManagementContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";
import { AppointmentStatus, PaymentStatus } from "@/types";

interface AppointmentsManagementPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        status?: string;
        paymentStatus?: string;
    }>;
}

export default async function AppointmentsManagementPage({
    searchParams,
}: AppointmentsManagementPageProps) {
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
        const response = await getAllAppointments({
            page,
            limit,
            ...(status && { status: status as AppointmentStatus }),
            ...(paymentStatus && {
                paymentStatus: paymentStatus as PaymentStatus,
            }),
        });

        return (
            <AppointmentsManagementContent
                appointments={response.data ?? []}
                meta={response.meta ?? null}
                currentFilters={{ page, limit, status, paymentStatus }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load appointments"
                description="An error occurred while loading the appointments. Please try again."
            />
        );
    }
}
