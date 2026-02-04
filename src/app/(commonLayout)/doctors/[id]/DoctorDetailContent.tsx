"use client";

import Link from "next/link";
import {
    Stethoscope,
    Star,
    MapPin,
    Phone,
    Mail,
    DollarSign,
    Award,
    Clock,
    Building,
    ArrowLeft,
    Calendar,
} from "lucide-react";
import { IDoctor } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorDetailContentProps {
    doctor: IDoctor;
}

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 py-8">
                <div className="container mx-auto px-4">
                    <Link
                        href="/doctors"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Doctors
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    {/* Photo */}
                                    <div className="h-32 w-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mb-4">
                                        {doctor.profilePhoto ? (
                                            <img
                                                src={doctor.profilePhoto}
                                                alt={doctor.name}
                                                className="h-32 w-32 object-cover"
                                            />
                                        ) : (
                                            <Stethoscope className="h-16 w-16 text-primary" />
                                        )}
                                    </div>

                                    <h1 className="text-2xl font-bold">
                                        Dr. {doctor.name}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {doctor.designation}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center justify-center gap-2 mt-3">
                                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                        <span className="font-semibold text-lg">
                                            {doctor.averageRating?.toFixed(1) ||
                                                "0.0"}
                                        </span>
                                    </div>

                                    {/* Specialties */}
                                    {doctor.doctorSpecialties &&
                                        doctor.doctorSpecialties.length > 0 && (
                                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                                {doctor.doctorSpecialties.map(
                                                    (ds) => (
                                                        <Badge
                                                            key={ds.specialtyId}
                                                            variant="secondary"
                                                        >
                                                            {
                                                                ds.specialty
                                                                    ?.title
                                                            }
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                    {/* Quick Info */}
                                    <div className="mt-6 space-y-3 text-left">
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Consultation Fee
                                                </p>
                                                <p className="font-semibold">
                                                    ${doctor.appointmentFee}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Clock className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Experience
                                                </p>
                                                <p className="font-semibold">
                                                    {doctor.experience} years
                                                </p>
                                            </div>
                                        </div>
                                        {doctor.currentWorkingPlace && (
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Building className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Currently at
                                                    </p>
                                                    <p className="font-semibold">
                                                        {
                                                            doctor.currentWorkingPlace
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Appointment Button */}
                                    <Link
                                        href={`/consultation?doctor=${doctor.id}`}
                                        className="block mt-6"
                                    >
                                        <Button className="w-full" size="lg">
                                            <Calendar className="h-5 w-5 mr-2" />
                                            Book Appointment
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Card */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {doctor.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm">
                                            {doctor.email}
                                        </span>
                                    </div>
                                )}
                                {doctor.contactNumber && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm">
                                            {doctor.contactNumber}
                                        </span>
                                    </div>
                                )}
                                {doctor.address && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm">
                                            {doctor.address}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Qualifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Qualifications & Experience
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Qualification
                                        </p>
                                        <p className="font-medium">
                                            {doctor.qualification || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Designation
                                        </p>
                                        <p className="font-medium">
                                            {doctor.designation || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Registration Number
                                        </p>
                                        <p className="font-medium">
                                            {doctor.registrationNumber || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Years of Experience
                                        </p>
                                        <p className="font-medium">
                                            {doctor.experience} years
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500" />
                                    Patient Reviews
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No reviews yet</p>
                                    <p className="text-sm">
                                        Be the first to review Dr. {doctor.name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
