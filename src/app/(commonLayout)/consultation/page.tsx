import { Suspense } from "react";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { LoadingState } from "@/components/ui/loading";
import { ConsultationContent } from "./ConsultationContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ConsultationPageProps {
    searchParams: Promise<{
        doctor?: string;
        specialty?: string;
    }>;
}

export default async function ConsultationPage({
    searchParams,
}: ConsultationPageProps) {
    const params = await searchParams;

    return (
        <Suspense fallback={<LoadingState message="Loading consultation..." />}>
            <ConsultationData
                doctorId={params.doctor}
                specialtyId={params.specialty}
            />
        </Suspense>
    );
}

async function ConsultationData({
    doctorId,
    specialtyId,
}: {
    doctorId?: string;
    specialtyId?: string;
}) {
    try {
        const specialtiesRes = await getAllSpecialties({});

        const specialtyTitle = specialtyId
            ? specialtiesRes.data?.find((s) => s.id === specialtyId)?.title
            : undefined;

        const doctorsRes = await getAllDoctors({
            ...(specialtyTitle ? { specialties: specialtyTitle } : {}),
            limit: 100,
        });

        // If API call succeeded but returned no success flag, show error
        if (!doctorsRes.success || !specialtiesRes.success) {
            return (
                <div className="min-h-screen flex items-center justify-center py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-destructive mb-4">
                            Error Loading Consultation Data
                        </h2>
                        <p className="text-muted-foreground">
                            {doctorsRes.message ||
                                specialtiesRes.message ||
                                "Failed to load doctors or specialties"}
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <ConsultationContent
                doctors={doctorsRes.data || []}
                specialties={specialtiesRes.data || []}
                selectedDoctorId={doctorId}
            />
        );
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-4">
                        Error Loading Consultation
                    </h2>
                    <p className="text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "An unexpected error occurred"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please try refreshing the page
                    </p>
                </div>
            </div>
        );
    }
}
