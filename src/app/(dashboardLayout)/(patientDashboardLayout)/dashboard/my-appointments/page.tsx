import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { LoadingState } from "@/components/ui/loading";
import { PatientAppointmentsContent } from "./PatientAppointmentsContent";

export default function PatientAppointmentsPage() {
    return (
        <Suspense fallback={<LoadingState message="Loading appointments..." />}>
            <PatientAppointmentsData />
        </Suspense>
    );
}

async function PatientAppointmentsData() {
    const response = await getMyAppointments({ limit: 100 });

    return (
        <PatientAppointmentsContent
            appointments={response.data || []}
            meta={response.meta}
        />
    );
}
