import { Suspense } from "react";
import { getMyProfile } from "@/services/user";
import { Loading } from "@/components/ui/loading";
import { PatientProfileContent } from "./PatientProfileContent";

export default function PatientProfilePage() {
    return (
        <Suspense fallback={<Loading text="Loading profile..." />}>
            <PatientProfileData />
        </Suspense>
    );
}

async function PatientProfileData() {
    const response = await getMyProfile();

    return <PatientProfileContent user={response.data!} />;
}
