import { Suspense } from "react";
import { getAllPatients } from "@/services/patient";
import { PatientsManagementContent } from "./PatientsManagementContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface PatientsManagementPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        searchTerm?: string;
    }>;
}

export default async function PatientsManagementPage({
    searchParams,
}: PatientsManagementPageProps) {
    const params = await searchParams;

    return (
        <Suspense fallback={<Spinner size="lg" text="Loading patients..." />}>
            <PatientsFetcher searchParams={params} />
        </Suspense>
    );
}

async function PatientsFetcher({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string; searchTerm?: string };
}) {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const searchTerm = searchParams.searchTerm || "";

    try {
        const response = await getAllPatients({ page, limit, searchTerm });

        return (
            <PatientsManagementContent
                patients={response.data ?? []}
                meta={response.meta ?? null}
                currentFilters={{ page, limit, searchTerm }}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load patients"
                description="An error occurred while loading the patients. Please try again."
            />
        );
    }
}
