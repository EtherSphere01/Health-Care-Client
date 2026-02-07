import { notFound } from "next/navigation";
import { getDoctorById } from "@/services/doctor";
import { DoctorDetailContent } from "./DoctorDetailContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DoctorDetailPageProps {
    params: Promise<{ doctorId: string }>;
}

export default async function DoctorDetailPage({
    params,
}: DoctorDetailPageProps) {
    const { doctorId } = await params;
    const response = await getDoctorById(doctorId);

    if (!response.success || !response.data) {
        notFound();
    }

    return <DoctorDetailContent doctor={response.data} />;
}
