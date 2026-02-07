import DoctorCard from "@/components/modules/Doctors/DoctorCard";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllDoctors } from "@/services/doctor";
import { getAllSpecialties } from "@/services/specialty";
import type { IDoctor, ISpecialty } from "@/types";
import DoctorsListControls from "./DoctorsListControls";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Record<string, string | string[] | undefined>;

function parsePage(value: unknown): number {
    const raw = Array.isArray(value) ? value[0] : value;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.floor(n);
}

function parseString(value: unknown): string {
    const raw = Array.isArray(value) ? value[0] : value;
    return typeof raw === "string" ? raw : "";
}

function getDoctorPrimarySpecialty(doctor: IDoctor): string {
    return (
        doctor.doctorSpecialties?.[0]?.specialty?.title ||
        doctor.doctorSpecialties?.[0]?.specialities?.title ||
        "General"
    );
}

export default async function DoctorsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const page = parsePage(params?.page);
    const limit = 9;
    const selectedSpecialtyTitle = parseString(params?.specialties);

    const [doctorsResponse, specialtiesResponse] = await Promise.all([
        getAllDoctors({
            page,
            limit,
            ...(selectedSpecialtyTitle
                ? { specialties: selectedSpecialtyTitle }
                : null),
        }),
        getAllSpecialties({ limit: 200 }),
    ]);

    const doctors = doctorsResponse.success ? (doctorsResponse.data ?? []) : [];
    const meta = doctorsResponse.meta;
    const totalItems = meta?.total ?? doctors.length;
    const totalPages = meta?.totalPage
        ? Math.max(1, meta.totalPage)
        : meta?.limit
          ? Math.max(1, Math.ceil((meta?.total ?? 0) / meta.limit))
          : 1;

    const specialties: ISpecialty[] = specialtiesResponse.success
        ? (specialtiesResponse.data ?? [])
        : [];

    const specialtyOptions = specialties
        .filter((s) => Boolean(s?.title))
        .map((s) => ({ value: s.title, label: s.title }));

    const grouped = new Map<string, IDoctor[]>();
    if (selectedSpecialtyTitle) {
        // When filtered by a department, show results under that department
        // to avoid the appearance that filtering is "not working".
        grouped.set(selectedSpecialtyTitle, doctors);
    } else {
        for (const doctor of doctors) {
            const key = getDoctorPrimarySpecialty(doctor);
            const existing = grouped.get(key);
            if (existing) existing.push(doctor);
            else grouped.set(key, [doctor]);
        }
    }

    const groups = Array.from(grouped.entries()).sort(([a], [b]) =>
        a.localeCompare(b),
    );

    return (
        <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Find a Doctor
                    </h1>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                        Browse our specialists by department and explore their
                        profiles, experience, and availability.
                    </p>
                </div>

                <DoctorsListControls
                    totalItems={totalItems}
                    totalPages={totalPages}
                    itemsPerPage={limit}
                    specialties={specialtyOptions}
                />

                {!doctorsResponse.success ? (
                    <div className="mt-10">
                        <EmptyState
                            title="Failed to load doctors"
                            description={
                                doctorsResponse.message ||
                                "Please try again in a moment."
                            }
                        />
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="No doctors found"
                            description={
                                selectedSpecialtyTitle
                                    ? `No doctors found for “${selectedSpecialtyTitle}”.`
                                    : "Please try another department."
                            }
                        />
                    </div>
                ) : (
                    <div className="mt-8 space-y-10">
                        {groups.map(([department, deptDoctors]) => (
                            <section key={department} className="space-y-5">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                            {department}
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            {deptDoctors.length} doctor
                                            {deptDoctors.length === 1
                                                ? ""
                                                : "s"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {deptDoctors.map((doctor) => (
                                        <DoctorCard
                                            key={doctor.id}
                                            doctor={doctor}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
