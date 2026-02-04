import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDoctorById } from "@/services/doctor";
import { LoadingState } from "@/components/ui/loading";
import { DoctorDetailContent } from "./DoctorDetailContent";

interface DoctorDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function DoctorDetailPage({
    params,
}: DoctorDetailPageProps) {
    const { id } = await params;

    return (
        <Suspense
            fallback={<LoadingState message="Loading doctor profile..." />}
        >
            <DoctorDetailData id={id} />
        </Suspense>
    );
}

async function DoctorDetailData({ id }: { id: string }) {
    const response = await getDoctorById(id);

    if (!response.success || !response.data) {
        notFound();
    }

    return <DoctorDetailContent doctor={response.data} />;
}
