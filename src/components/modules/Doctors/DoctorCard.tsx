"use client";

import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type { IDoctor } from "@/types";

function getPrimarySpecialtyTitle(doctor: IDoctor): string {
    return (
        doctor.doctorSpecialties?.[0]?.specialty?.title ||
        doctor.doctorSpecialties?.[0]?.specialities?.title ||
        "General"
    );
}

function formatNextAvailableSlot(doctor: IDoctor): string {
    const nextSchedule = doctor.doctorSchedules?.[0]?.schedule;
    if (!nextSchedule?.startDateTime) return "View Schedule";

    const date = new Date(nextSchedule.startDateTime);
    if (Number.isNaN(date.getTime())) return "View Schedule";

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

type DoctorCardProps = {
    doctor: IDoctor;
    className?: string;
};

export default function DoctorCard({ doctor, className }: DoctorCardProps) {
    const router = useRouter();

    const specialtyTitle = getPrimarySpecialtyTitle(doctor);
    const degree = doctor.qualification || "MBBS";
    const experience = `${doctor.experience || 0}+ Years`;
    const nextAvailable = formatNextAvailableSlot(doctor);
    const location = doctor.currentWorkingPlace || "Not specified";

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/doctors/${doctor.id}`)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/doctors/${doctor.id}`);
                }
            }}
            className={
                "group relative bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 " +
                (className ?? "")
            }
            aria-label={`View details for ${doctor.name}`}
        >
            <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent z-10" />

                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs font-bold text-slate-900 flex items-center shadow-lg">
                    <Star className="h-3.5 w-3.5 text-amber-400 mr-1.5 fill-current" />
                    {(doctor.averageRating || 0).toFixed(1)}
                    <span className="text-slate-400 font-normal ml-1">
                        (Reviews)
                    </span>
                </div>

                <div className="absolute top-4 left-4 z-20 bg-emerald-500/70 backdrop-blur px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold text-white flex items-center shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse" />
                    Available Today
                </div>

                {doctor.profilePhoto ? (
                    <Image
                        src={doctor.profilePhoto}
                        width={100}
                        height={100}
                        alt={doctor.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                ) : null}

                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                    <h3 className="text-2xl font-bold mb-1">{doctor.name}</h3>
                    <p className="text-slate-200 font-medium opacity-90">
                        {specialtyTitle}
                    </p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                Degree
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                {degree}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                Experience
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                {experience}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 col-span-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                Location
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                {location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                        Next Available Slot:
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                        {nextAvailable}
                    </span>
                </div>

                <Button
                    asChild
                    className="w-full h-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link href={`/consultation?doctor=${doctor.id}`}>
                        Book Appointment
                    </Link>
                </Button>
            </div>
        </div>
    );
}
