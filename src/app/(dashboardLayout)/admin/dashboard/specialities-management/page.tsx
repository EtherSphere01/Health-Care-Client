import { Suspense } from "react";
import { getAllSpecialties } from "@/services/specialty";
import { SpecialtiesManagementContent } from "./SpecialtiesManagementContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

interface SpecialtiesManagementPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function SpecialtiesManagementPage({ searchParams }: SpecialtiesManagementPageProps) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<Spinner size="lg" text="Loading specialties..." />}>
      <SpecialtiesFetcher searchParams={params} />
    </Suspense>
  );
}

async function SpecialtiesFetcher({ searchParams }: { searchParams: { page?: string; limit?: string } }) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  try {
    const response = await getAllSpecialties({ page, limit });

    return (
      <SpecialtiesManagementContent
        specialties={response.data ?? []}
        meta={response.meta ?? null}
        currentFilters={{ page, limit }}
      />
    );
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load specialties"
        description="An error occurred while loading the specialties. Please try again."
      />
    );
  }
}
