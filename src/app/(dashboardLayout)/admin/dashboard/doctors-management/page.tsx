import { Suspense } from "react";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { TableSkeleton } from "@/components/ui/loading";
import { DoctorsManagementContent } from "./DoctorsManagementContent";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        searchTerm?: string;
        specialties?: string;
    }>;
}

export default async function DoctorsManagementPage({
    searchParams,
}: PageProps) {
    return (
        <Suspense fallback={<TableSkeleton rows={10} columns={6} />}>
            <DoctorsManagementData searchParams={searchParams} />
        </Suspense>
    );
}

async function DoctorsManagementData({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    let doctors = [];
    let meta = null;
    let specialties = [];

    try {
        const [doctorsResponse, specialtiesResponse] = await Promise.all([
            getAllDoctors({
                page,
                limit,
                searchTerm: params.searchTerm,
                specialties: params.specialties,
            }),
            getAllSpecialties({ limit: 100 }),
        ]);

        doctors = doctorsResponse.data || [];
        meta = doctorsResponse.meta || null;
        specialties = specialtiesResponse.data || [];
    } catch (error) {
        console.error("Failed to fetch doctors:", error);
    }

    return (
        <DoctorsManagementContent
            doctors={doctors}
            meta={meta}
            specialties={specialties}
            currentFilters={{
                page,
                limit,
                searchTerm: params.searchTerm || "",
                specialties: params.specialties || "",
            }}
        />
    );
}
