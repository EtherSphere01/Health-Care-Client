import { Suspense } from "react";
import { getMyProfile } from "@/services/user";
import { getAllSpecialties } from "@/services/specialty";
import { DoctorProfileContent } from "./DoctorProfileContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

export default async function DoctorProfilePage() {
  return (
    <Suspense fallback={<Spinner size="lg" text="Loading profile..." />}>
      <ProfileFetcher />
    </Suspense>
  );
}

async function ProfileFetcher() {
  try {
    const [profileResponse, specialtiesResponse] = await Promise.all([
      getMyProfile(),
      getAllSpecialties(),
    ]);

    if (!profileResponse.success || !profileResponse.data) {
      return (
        <ErrorState
          title="Failed to load profile"
          description="Could not load your profile information."
        />
      );
    }

    return (
      <DoctorProfileContent
        user={profileResponse.data}
        specialties={specialtiesResponse.data ?? []}
      />
    );
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load profile"
        description="An error occurred while loading your profile."
      />
    );
  }
}
