import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { Loading } from "@/components/ui/loading";
import { PatientAppointmentsContent } from "./PatientAppointmentsContent";

export default function PatientAppointmentsPage() {
    return (
        <Suspense fallback={<Loading text="Loading appointments..." />}>
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
