"use client";

import Link from "next/link";
import {
    Calendar,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Stethoscope,
    User,
} from "lucide-react";
import {
    IAppointment,
    IPrescription,
    AppointmentStatus,
    IPatientDashboardMeta,
    IPatientDashboardSummary,
} from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { StatsGrid, StatCard } from "@/components/ui/stat-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge } from "@/components/ui/badge";

interface PatientDashboardContentProps {
    appointments: IAppointment[];
    prescriptions: IPrescription[];
    meta: IPatientDashboardMeta | null;
    summary: IPatientDashboardSummary | null;
}

export function PatientDashboardContent({
    appointments,
    prescriptions,
    meta,
    summary,
}: PatientDashboardContentProps) {
    const patientMeta = meta && "prescriptionCount" in meta ? meta : null;
    const appointmentSummary = summary?.nextAppointment;
    const latestPrescription = summary?.latestPrescription;

    const totalAppointments =
        patientMeta?.appointmentCount ?? appointments.length;
    const upcomingAppointments =
        patientMeta?.appointmentStatusDistribution.scheduled ??
        appointments.filter((a) => a.status === AppointmentStatus.SCHEDULED)
            .length;
    const completedAppointments =
        patientMeta?.appointmentStatusDistribution.completed ??
        appointments.filter((a) => a.status === AppointmentStatus.COMPLETED)
            .length;
    const totalPrescriptions =
        patientMeta?.prescriptionCount ?? prescriptions.length;

    const formatDate = (date?: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateTime?: string) => {
        if (!dateTime) return "N/A";
        return new Date(dateTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-5">
            <DashboardHeader
                title="Patient Dashboard"
                description="Welcome back! Here's an overview of your health journey."
                actions={
                    <Link href="/consultation">
                        <Button>
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Book Appointment
                        </Button>
                    </Link>
                }
            />

            {/* Stats Grid */}
            <StatsGrid columns={4}>
                <StatCard
                    title="Total Appointments"
                    value={totalAppointments}
                    icon={<Calendar className="h-5 w-5" />}
                    description="All time"
                />
                <StatCard
                    title="Upcoming"
                    value={upcomingAppointments}
                    icon={<Clock className="h-5 w-5" />}
                    variant="warning"
                    description="Scheduled appointments"
                />
                <StatCard
                    title="Completed"
                    value={completedAppointments}
                    icon={<CheckCircle className="h-5 w-5" />}
                    variant="success"
                    description="Finished appointments"
                />
                <StatCard
                    title="Prescriptions"
                    value={totalPrescriptions}
                    icon={<FileText className="h-5 w-5" />}
                    variant="info"
                    description="Total prescriptions"
                />
            </StatsGrid>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                Recent Appointments
                            </CardTitle>
                            <CardDescription>
                                Your latest appointments
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/my-appointments">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {appointments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No appointments yet</p>
                                <Link href="/consultation">
                                    <Button variant="link" size="sm">
                                        Book your first appointment
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.slice(0, 5).map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 p-3 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                {appointment.doctor
                                                    ?.profilePhoto ? (
                                                    <img
                                                        src={
                                                            appointment.doctor
                                                                .profilePhoto
                                                        }
                                                        alt={
                                                            appointment.doctor
                                                                .name
                                                        }
                                                        className="h-10 w-10 object-cover"
                                                    />
                                                ) : (
                                                    <Stethoscope className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    Dr.{" "}
                                                    {appointment.doctor?.name ||
                                                        "Unknown"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        appointment.schedule
                                                            ?.startDateTime,
                                                    )}{" "}
                                                    •{" "}
                                                    {formatTime(
                                                        appointment.schedule
                                                            ?.startDateTime,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <AppointmentStatusBadge
                                            status={appointment.status}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Prescriptions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                Recent Prescriptions
                            </CardTitle>
                            <CardDescription>
                                Your latest prescriptions
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/my-prescriptions">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {prescriptions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No prescriptions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {prescriptions
                                    .slice(0, 5)
                                    .map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 p-3 shadow-sm"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">
                                                    Dr.{" "}
                                                    {prescription.doctor
                                                        ?.name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        prescription.createdAt,
                                                    )}
                                                </p>
                                                {prescription.followUpDate && (
                                                    <p className="text-xs text-blue-600">
                                                        Follow-up:{" "}
                                                        {formatDate(
                                                            prescription.followUpDate,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    {prescription.instructions
                                                        ?.length || 0}{" "}
                                                    medications
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Care Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Care Summary</CardTitle>
                    <CardDescription>
                        Key updates based on your latest activity
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    Next Appointment
                                </p>
                                <Calendar className="h-4 w-4 text-slate-400" />
                            </div>
                            {appointmentSummary ? (
                                <div className="mt-3 space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Dr. {appointmentSummary.doctor?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {formatDate(
                                            appointmentSummary.schedule
                                                ?.startDateTime,
                                        )}{" "}
                                        at{" "}
                                        {formatTime(
                                            appointmentSummary.schedule
                                                ?.startDateTime,
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-slate-500">
                                    No upcoming appointment
                                </p>
                            )}
                            <Link
                                href="/dashboard/my-appointments"
                                className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                View appointments
                            </Link>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    Latest Prescription
                                </p>
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            {latestPrescription ? (
                                <div className="mt-3 space-y-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Dr. {latestPrescription.doctor?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {formatDate(
                                            latestPrescription.createdAt,
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-slate-500">
                                    No prescriptions yet
                                </p>
                            )}
                            <Link
                                href="/dashboard/my-prescriptions"
                                className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                View prescriptions
                            </Link>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    Outstanding Payments
                                </p>
                                <AlertCircle className="h-4 w-4 text-slate-400" />
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">
                                {summary?.outstandingPayments ?? 0}
                            </p>
                            <p className="text-xs text-slate-500">
                                {summary?.outstandingPayments
                                    ? "Payments pending"
                                    : "All payments settled"}
                            </p>
                            <Link
                                href="/dashboard/my-appointments"
                                className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Review billing
                            </Link>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    Profile Completion
                                </p>
                                <User className="h-4 w-4 text-slate-400" />
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-900">
                                {summary?.profileCompletion ?? 0}%
                            </p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div
                                    className="h-2 rounded-full bg-indigo-500"
                                    style={{
                                        width: `${summary?.profileCompletion ?? 0}%`,
                                    }}
                                />
                            </div>
                            <Link
                                href="/dashboard/my-profile"
                                className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Update profile
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
