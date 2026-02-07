"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    ShieldCheck,
    Star,
} from "lucide-react";
import type { IDoctor, IDoctorSchedule } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getDepartmentTitle(doctor: IDoctor): string {
    return (
        doctor.doctorSpecialties?.[0]?.specialty?.title ||
        doctor.doctorSpecialties?.[0]?.specialities?.title ||
        "General"
    );
}

function formatSlot(startDateTime: string) {
    const d = new Date(startDateTime);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function getNextAvailableSchedules(doctor: IDoctor, max = 6) {
    const schedules = (doctor.doctorSchedules ?? [])
        .filter((ds) => !ds.isBooked)
        .filter((ds) => Boolean(ds.schedule?.startDateTime))
        .slice();

    schedules.sort((a, b) => {
        const aTime = new Date(a.schedule!.startDateTime).getTime();
        const bTime = new Date(b.schedule!.startDateTime).getTime();
        return aTime - bTime;
    });

    return schedules.slice(0, max);
}

function buildAboutText(doctor: IDoctor) {
    const department = getDepartmentTitle(doctor);
    const parts: string[] = [];

    if (doctor.designation && doctor.currentWorkingPlace) {
        parts.push(
            `${doctor.name} is a ${doctor.designation} in ${department} at ${doctor.currentWorkingPlace}.`,
        );
    } else if (doctor.designation) {
        parts.push(
            `${doctor.name} is a ${doctor.designation} in ${department}.`,
        );
    } else {
        parts.push(`${doctor.name} practices in ${department}.`);
    }

    if (doctor.qualification) {
        parts.push(`Qualification: ${doctor.qualification}.`);
    }

    parts.push(`Experience: ${doctor.experience ?? 0}+ years.`);

    return parts.join(" ");
}

export function DoctorDetailContent({ doctor }: { doctor: IDoctor }) {
    const department = getDepartmentTitle(doctor);
    const nextSchedules = getNextAvailableSchedules(doctor);
    const about = buildAboutText(doctor);
    const profilePhotoSrc = doctor.profilePhoto || "/images/default-doctor.svg";

    return (
        <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        href="/doctors"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Doctors
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                        <Image
                                            src={profilePhotoSrc}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                                                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                                                Verified
                                            </div>
                                            <div className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                                                <Star className="h-4 w-4 text-amber-400 fill-current" />
                                                {(
                                                    doctor.averageRating || 0
                                                ).toFixed(1)}
                                            </div>
                                        </div>

                                        <h1 className="text-2xl font-extrabold text-slate-900 truncate">
                                            {doctor.name}
                                        </h1>
                                        <p className="text-slate-600 font-medium">
                                            {department}
                                        </p>
                                        {doctor.designation ? (
                                            <p className="text-sm text-slate-500 mt-1">
                                                {doctor.designation}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {(doctor.doctorSpecialties ?? [])
                                        .slice(0, 6)
                                        .map((ds) => {
                                            const title =
                                                ds.specialty?.title ||
                                                ds.specialities?.title;
                                            if (!title) return null;
                                            return (
                                                <Badge
                                                    key={`${doctor.id}-${ds.specialtyId}`}
                                                    variant="secondary"
                                                >
                                                    {title}
                                                </Badge>
                                            );
                                        })}
                                </div>

                                <div className="mt-6 space-y-3">
                                    {doctor.currentWorkingPlace ? (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                                    Current Workplace
                                                </p>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {doctor.currentWorkingPlace}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                                Experience
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {doctor.experience ?? 0}+ years
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button asChild className="w-full h-12">
                                        <Link
                                            href={`/consultation?doctor=${doctor.id}`}
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Book Appointment
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed">
                                    {about}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Availability
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {nextSchedules.length === 0 ? (
                                    <p className="text-slate-600">
                                        No upcoming availability is listed yet.
                                    </p>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {nextSchedules.map((ds) => (
                                            <AvailabilitySlot
                                                key={ds.scheduleId}
                                                schedule={ds}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AvailabilitySlot({ schedule }: { schedule: IDoctorSchedule }) {
    const label = schedule.schedule?.startDateTime
        ? formatSlot(schedule.schedule.startDateTime)
        : "";

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                    {label || "Upcoming slot"}
                </p>
                <p className="text-xs text-slate-500">Not booked</p>
            </div>
            <div className="shrink-0">
                <Badge
                    className="bg-emerald-50 text-emerald-700 border-emerald-100"
                    variant="outline"
                >
                    Available
                </Badge>
            </div>
        </div>
    );
}
