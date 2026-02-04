import { Suspense } from "react";
import { getAllSchedules } from "@/services/schedule";
import { getMyDoctorSchedule } from "@/services/doctor-schedule";
import { MySchedulesContent } from "./MySchedulesContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface MySchedulesPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
    }>;
}

export default async function MySchedulesPage({
    searchParams,
}: MySchedulesPageProps) {
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
        const [mySchedulesResponse, allSchedulesResponse] = await Promise.all([
            getMyDoctorSchedule({
                page,
                limit,
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
            }),
            getAllSchedules({ page: 1, limit: 100 }), // Get available schedules
        ]);

        return (
            <MySchedulesContent
                mySchedules={mySchedulesResponse.data ?? []}
                availableSchedules={allSchedulesResponse.data ?? []}
                meta={mySchedulesResponse.meta ?? null}
                currentFilters={{ page, limit, startDate, endDate }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load schedules"
                description="An error occurred while loading your schedules. Please try again."
            />
        );
    }
}
