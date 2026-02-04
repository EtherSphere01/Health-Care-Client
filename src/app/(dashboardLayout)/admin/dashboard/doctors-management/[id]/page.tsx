import { Suspense } from "react";
import { getDoctorById } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { DoctorDetailContent } from "./DoctorDetailContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface DoctorDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function DoctorDetailPage({
    params,
}: DoctorDetailPageProps) {
    const { id } = await params;

    return (
        <Suspense
            fallback={<Spinner size="lg" text="Loading doctor details..." />}
        >
            <DoctorDetailFetcher doctorId={id} />
        </Suspense>
    );
}

async function DoctorDetailFetcher({ doctorId }: { doctorId: string }) {
    try {
        const [doctorResponse, specialtiesResponse] = await Promise.all([
            getDoctorById(doctorId),
            getAllSpecialties(),
        ]);

        if (!doctorResponse.success || !doctorResponse.data) {
            return (
                <ErrorState
                    title="Doctor not found"
                    description="The doctor you're looking for doesn't exist or has been removed."
                />
            );
        }

        return (
            <DoctorDetailContent
                doctor={doctorResponse.data}
                specialties={specialtiesResponse.data ?? []}
            />
        );
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load doctor"
                description="An error occurred while loading doctor details. Please try again."
            />
        );
    }
}
