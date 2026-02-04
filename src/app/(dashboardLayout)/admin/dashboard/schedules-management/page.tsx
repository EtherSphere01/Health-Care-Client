import { Suspense } from "react";
import { getAllSchedules } from "@/services/schedule";
import { SchedulesManagementContent } from "./SchedulesManagementContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface SchedulesManagementPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
    }>;
}

export default async function SchedulesManagementPage({
    searchParams,
}: SchedulesManagementPageProps) {
    const params = await searchParams;

    return (
        <Suspense fallback={<Spinner size="lg" text="Loading schedules..." />}>
            <SchedulesFetcher searchParams={params} />
        </Suspense>
    );
}

async function SchedulesFetcher({
    searchParams,
}: {
    searchParams: {
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
    };
}) {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const startDate = searchParams.startDate || "";
    const endDate = searchParams.endDate || "";

    try {
        const response = await getAllSchedules({
            page,
            limit,
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
        });

        return (
            <SchedulesManagementContent
                schedules={response.data ?? []}
                meta={response.meta ?? null}
                currentFilters={{ page, limit, startDate, endDate }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load schedules"
                description="An error occurred while loading the schedules. Please try again."
            />
        );
    }
}
