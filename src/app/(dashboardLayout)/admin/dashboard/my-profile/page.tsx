import { Suspense } from "react";
import { getMyProfile } from "@/services/user";
import { AdminProfileContent } from "./AdminProfileContent";
import { Spinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/empty-state";

export default async function AdminProfilePage() {
    return (
        <Suspense fallback={<Spinner size="lg" text="Loading profile..." />}>
            <ProfileFetcher />
        </Suspense>
    );
}

async function ProfileFetcher() {
    try {
        const response = await getMyProfile();

        if (!response.success || !response.data) {
            return (
                <ErrorState
                    title="Failed to load profile"
                    description="Could not load your profile information."
                />
            );
        }

        return <AdminProfileContent user={response.data} />;
    } catch (error) {
        return (
            <ErrorState
                title="Failed to load profile"
                description="An error occurred while loading your profile."
            />
        );
    }
}
