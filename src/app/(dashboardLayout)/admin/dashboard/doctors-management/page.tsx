import { Suspense } from "react";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import { TableSkeleton } from "@/components/ui/loading";
import { DoctorsManagementContent } from "./DoctorsManagementContent";
import { IDoctor, ISpecialty, IMeta } from "@/types";

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

    let doctors: IDoctor[] = [];
    let meta: IMeta | null = null;
    let specialties: ISpecialty[] = [];
    let error: string | null = null;

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

        if (!doctorsResponse.success || !specialtiesResponse.success) {
            error =
                doctorsResponse.message ||
                specialtiesResponse.message ||
                "Failed to load data";
        } else {
            doctors = doctorsResponse.data || [];
            meta = doctorsResponse.meta || null;
            specialties = specialtiesResponse.data || [];
        }
    } catch (e) {
        error = e instanceof Error ? e.message : "An unexpected error occurred";
    }

    // Show error UI if fetch failed
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-destructive mb-2">
                        Error Loading Doctors
                    </h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
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
