import { Suspense } from "react";
import { getMyAppointments } from "@/services/appointment";
import { getPatientPrescriptions } from "@/services/prescription";
import { Loading } from "@/components/ui/loading";
import { PatientDashboardContent } from "./PatientDashboardContent";

export default function PatientDashboardPage() {
  return (
    <Suspense fallback={<Loading text="Loading dashboard..." />}>
      <PatientDashboardData />
    </Suspense>
  );
}

async function PatientDashboardData() {
  const [appointmentsRes, prescriptionsRes] = await Promise.all([
    getMyAppointments({ limit: 5 }),
    getPatientPrescriptions({ limit: 5 }),
  ]);

  return (
    <PatientDashboardContent
      appointments={appointmentsRes.data || []}
      prescriptions={prescriptionsRes.data || []}
    />
  );
}
