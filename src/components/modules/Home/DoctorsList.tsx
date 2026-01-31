"use client";
import { Button } from "@/components/ui/button";
import { doctors } from "@/lib/data";
import {
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    Clock,
    GraduationCap,
    MapPin,
    MessageSquare,
    Star,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function DoctorsList() {
    const [showAllDoctors, setShowAllDoctors] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Enhanced mock data for display
    const enhancedDoctors = doctors.map((d) => ({
        ...d,
        degree: "MBBS, MD", // Mock degree
        experience: "10+ Years",
        nextAvailable: "Today, 2:00 PM",
        location: "Central Hospital, NY",
    }));
    const displayedDoctors = showAllDoctors
        ? enhancedDoctors
        : enhancedDoctors.slice(0, 3);
    return (
        <section
            id="doctors"
            className="py-24 bg-slate-50 relative overflow-hidden"
        >
            {/* Background blobs for depth */}
            <div className="absolute top-40 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-40 left-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold mb-4">
                            <CheckCircle2 className="h-3 w-3 mr-2" /> Verified
                            Specialists
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            World-Class Medical Team
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Access detailed profiles of our board-certified
                            doctors. Review their experience, credentials, and
                            real-time availability before you book.
                        </p>
                    </div>

                    {!showAllDoctors && (
                        <Button
                            onClick={() => setShowAllDoctors(true)}
                            variant="outline"
                            size="lg"
                            className="hidden sm:flex rounded-lg border-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            View All Specialists{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="group relative bg-white border border-slate-100 rounded-[16px] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Top Image Section */}
                            <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />

                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs font-bold text-slate-900 flex items-center shadow-lg">
                                    <Star className="h-3.5 w-3.5 text-amber-400 mr-1.5 fill-current" />{" "}
                                    {doctor.rating}{" "}
                                    <span className="text-slate-400 font-normal ml-1">
                                        (120+)
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4 z-20 bg-emerald-500/70 backdrop-blur px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold text-white flex items-center shadow-lg">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse" />{" "}
                                    Available Today
                                </div>

                                <Image
                                    src=""
                                    width={100}
                                    height={100}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Name Overlay */}
                                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                                    <h3 className="text-2xl font-bold mb-1">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-slate-200 font-medium opacity-90">
                                        {doctor.specialty}
                                    </p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="p-6">
                                {/* Info Grid */}
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
                                                {doctor.degree}
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
                                                {doctor.experience}
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
                                                {doctor.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Availability Strip */}
                                <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">
                                        Next Available Slot:
                                    </span>
                                    <span className="text-sm font-bold text-indigo-600">
                                        {doctor.nextAvailable}
                                    </span>
                                </div>

                                <Button
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-lg h-12"
                                    // onClick={onRegister}
                                >
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {!showAllDoctors && (
                    <div className="mt-12 text-center sm:hidden">
                        <Button
                            onClick={() => setShowAllDoctors(true)}
                            variant="outline"
                            size="lg"
                            className="rounded-lg w-full"
                        >
                            View All Specialists
                        </Button>
                    </div>
                )}

                {showAllDoctors && (
                    <div className="mt-12 text-center">
                        <Button
                            onClick={() => setShowAllDoctors(false)}
                            variant="ghost"
                            className="text-slate-500 hover:text-slate-900"
                        >
                            <ChevronDown className="mr-2 h-4 w-4 rotate-180" />{" "}
                            Show Less
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
