import { Suspense } from "react";
import { getDashboardMeta } from "@/services/meta";
import { DashboardSkeleton } from "@/components/ui/loading";
import { AdminDashboardContent } from "./AdminDashboardContent";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <AdminDashboardData />
        </Suspense>
    );
}

async function AdminDashboardData() {
    let meta = null;
    try {
        const response = await getDashboardMeta();
        meta = response.data;
    } catch (error) {
        console.error("Failed to fetch dashboard meta:", error);
    }

    return <AdminDashboardContent meta={meta} />;
}
