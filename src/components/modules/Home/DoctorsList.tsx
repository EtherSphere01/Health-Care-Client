"use client";

import DoctorCard from "@/components/modules/Doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { IDoctor } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DoctorsListProps {
    doctors: IDoctor[];
    error?: string | null;
}

export default function DoctorsList({ doctors, error }: DoctorsListProps) {
    const router = useRouter();
    const displayedDoctors = doctors.slice(0, 3);

    if (error) {
        return (
            <section id="doctors" className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-foreground">
                            Failed to load doctors
                        </h2>
                        <p className="mt-2 text-muted-foreground">{error}</p>
                        <Button
                            onClick={() => router.refresh()}
                            variant="outline"
                            className="mt-6"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    if (doctors.length === 0) {
        return (
            <section id="doctors" className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-foreground">
                            No doctors available
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Check back soon for updates.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="doctors" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold text-foreground">
                            Our Doctors
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Meet our experienced medical professionals.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="hidden sm:inline-flex"
                    >
                        <Link href="/doctors">
                            View All Doctors
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Button asChild variant="outline">
                        <Link href="/doctors">
                            View All Doctors
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
