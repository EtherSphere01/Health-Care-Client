import { Suspense } from "react";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { Loading } from "@/components/ui/loading";
import { ConsultationContent } from "./ConsultationContent";

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
        <Suspense fallback={<Loading text="Loading consultation..." />}>
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
    const [doctorsRes, specialtiesRes] = await Promise.all([
        getAllDoctors({
            specialties: specialtyId,
            limit: 100,
        }),
        getAllSpecialties({}),
    ]);

    return (
        <ConsultationContent
            doctors={doctorsRes.data || []}
            specialties={specialtiesRes.data || []}
            selectedDoctorId={doctorId}
        />
    );
}
