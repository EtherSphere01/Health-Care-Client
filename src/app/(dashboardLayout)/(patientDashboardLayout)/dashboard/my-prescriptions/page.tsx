import { Suspense } from "react";
import { getPatientPrescriptions } from "@/services/prescription";
import { Loading } from "@/components/ui/loading";
import { PatientPrescriptionsContent } from "./PatientPrescriptionsContent";

export default function PatientPrescriptionsPage() {
  return (
    <Suspense fallback={<Loading text="Loading prescriptions..." />}>
      <PatientPrescriptionsData />
    </Suspense>
  );
}

async function PatientPrescriptionsData() {
  const response = await getPatientPrescriptions({ limit: 100 });

  return (
    <PatientPrescriptionsContent
      prescriptions={response.data || []}
      meta={response.meta}
    />
  );
}
