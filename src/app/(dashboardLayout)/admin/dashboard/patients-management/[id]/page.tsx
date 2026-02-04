import { Suspense } from "react";
import { getPatientById } from "@/services/patient";
import { PatientDetailContent } from "./PatientDetailContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface PatientDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({
    params,
}: PatientDetailPageProps) {
    const { id } = await params;

    return (
        <Suspense
            fallback={<Spinner size="lg" text="Loading patient details..." />}
        >
            <PatientDetailFetcher patientId={id} />
        </Suspense>
    );
}

async function PatientDetailFetcher({ patientId }: { patientId: string }) {
    try {
        const response = await getPatientById(patientId);

        if (!response.success || !response.data) {
            return (
                <ErrorState
                    title="Patient not found"
                    description="The patient you're looking for doesn't exist or has been removed."
                />
            );
        }

        return <PatientDetailContent patient={response.data} />;
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load patient"
                description="An error occurred while loading patient details. Please try again."
            />
        );
    }
}
