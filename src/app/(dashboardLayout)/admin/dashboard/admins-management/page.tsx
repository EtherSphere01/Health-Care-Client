import { Suspense } from "react";
import { getAllAdmins } from "@/services/admin";
import { AdminsManagementContent } from "./AdminsManagementContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface AdminsManagementPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
  }>;
}

export default async function AdminsManagementPage({ searchParams }: AdminsManagementPageProps) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<Spinner size="lg" text="Loading admins..." />}>
      <AdminsFetcher searchParams={params} />
    </Suspense>
  );
}

async function AdminsFetcher({ searchParams }: { searchParams: { page?: string; limit?: string; searchTerm?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);
  const searchTerm = searchParams.searchTerm || "";

  try {
    const response = await getAllAdmins({ page, limit, searchTerm });

    return (
      <AdminsManagementContent
        admins={response.data ?? []}
        meta={response.meta ?? null}
        currentFilters={{ page, limit, searchTerm }}
      />
    );
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load admins"
        description="An error occurred while loading the admins. Please try again."
      />
    );
  }
}
