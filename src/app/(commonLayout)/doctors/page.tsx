import { Suspense } from "react";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { LoadingState } from "@/components/ui/loading";
import { DoctorsListContent } from "./DoctorsListContent";

interface DoctorsPageProps {
    searchParams: Promise<{
        specialty?: string;
        search?: string;
        page?: string;
    }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
    const params = await searchParams;

    return (
        <Suspense fallback={<LoadingState message="Loading doctors..." />}>
            <DoctorsListData
                specialty={params.specialty}
                search={params.search}
                page={params.page}
            />
        </Suspense>
    );
}

async function DoctorsListData({
    specialty,
    search,
    page,
}: {
    specialty?: string;
    search?: string;
    page?: string;
}) {
    const [doctorsRes, specialtiesRes] = await Promise.all([
        getAllDoctors({
            specialties: specialty,
            searchTerm: search,
            page: page ? parseInt(page) : 1,
            limit: 12,
        }),
        getAllSpecialties({}),
    ]);

    return (
        <DoctorsListContent
            doctors={doctorsRes.data || []}
            specialties={specialtiesRes.data || []}
            meta={doctorsRes.meta}
            initialFilters={{
                specialty: specialty || "",
                search: search || "",
            }}
        />
    );
}
