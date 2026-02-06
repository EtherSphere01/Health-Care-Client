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
    let error: string | null = null;

    try {
        const response = await getDashboardMeta();
        if (!response.success) {
            error = response.message || "Failed to load dashboard metrics";
        } else {
            meta = response.data;
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
                        Error Loading Dashboard
                    </h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return <AdminDashboardContent meta={meta} />;
}
