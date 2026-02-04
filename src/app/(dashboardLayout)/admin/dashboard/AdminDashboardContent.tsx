"use client";

import {
    Users,
    Stethoscope,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { StatCard, StatsGrid } from "@/components/ui/stat-card";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { IAdminDashboardMeta, IDashboardMeta } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ProgressStat } from "@/components/ui/stat-card";

interface AdminDashboardContentProps {
    meta: IDashboardMeta | null;
}

function isAdminMeta(meta: IDashboardMeta | null): meta is IAdminDashboardMeta {
    return meta !== null && "totalPatients" in meta && "totalDoctors" in meta;
}

export function AdminDashboardContent({ meta }: AdminDashboardContentProps) {
    const adminMeta = isAdminMeta(meta) ? meta : null;

    return (
        <div className="space-y-8">
            <DashboardHeader
                title="Admin Dashboard"
                description="Overview of the healthcare system"
            />

            {/* Stats Grid */}
            <StatsGrid columns={4}>
                <StatCard
                    title="Total Patients"
                    value={adminMeta?.totalPatients?.toLocaleString() ?? "0"}
                    icon={Users}
                    variant="primary"
                    description="Registered patients"
                />
                <StatCard
                    title="Active Doctors"
                    value={adminMeta?.totalDoctors?.toLocaleString() ?? "0"}
                    icon={Stethoscope}
                    variant="success"
                    description="Available for consultations"
                />
                <StatCard
                    title="Total Appointments"
                    value={
                        adminMeta?.totalAppointments?.toLocaleString() ?? "0"
                    }
                    icon={Calendar}
                    variant="warning"
                    description="All-time appointments"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${adminMeta?.totalRevenue?.toLocaleString() ?? "0"}`}
                    icon={DollarSign}
                    variant="danger"
                    description="Lifetime earnings"
                />
            </StatsGrid>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Status</CardTitle>
                        <CardDescription>
                            Breakdown by current status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ProgressStat
                            label="Scheduled"
                            current={
                                adminMeta?.appointmentByStatus?.scheduled ?? 0
                            }
                            total={adminMeta?.totalAppointments ?? 1}
                            variant="default"
                        />
                        <ProgressStat
                            label="In Progress"
                            current={
                                adminMeta?.appointmentByStatus?.inProgress ?? 0
                            }
                            total={adminMeta?.totalAppointments ?? 1}
                            variant="warning"
                        />
                        <ProgressStat
                            label="Completed"
                            current={
                                adminMeta?.appointmentByStatus?.completed ?? 0
                            }
                            total={adminMeta?.totalAppointments ?? 1}
                            variant="success"
                        />
                        <ProgressStat
                            label="Canceled"
                            current={
                                adminMeta?.appointmentByStatus?.canceled ?? 0
                            }
                            total={adminMeta?.totalAppointments ?? 1}
                            variant="danger"
                        />
                    </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Overview</CardTitle>
                        <CardDescription>
                            Payment status summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                                        Paid
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                                    {adminMeta?.totalPaidAppointments ?? 0}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-5 w-5 text-amber-600" />
                                    <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                                        Unpaid
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                                    {adminMeta?.totalUnpaidAppointments ?? 0}
                                </p>
                            </div>
                        </div>
                        <ProgressStat
                            label="Payment Completion Rate"
                            current={adminMeta?.totalPaidAppointments ?? 0}
                            total={
                                (adminMeta?.totalPaidAppointments ?? 0) +
                                    (adminMeta?.totalUnpaidAppointments ?? 0) ||
                                1
                            }
                            variant="success"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common administrative tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href="/admin/dashboard/doctors-management"
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Manage Doctors</p>
                        </a>
                        <a
                            href="/admin/dashboard/patients-management"
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Manage Patients</p>
                        </a>
                        <a
                            href="/admin/dashboard/appointments-management"
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">View Appointments</p>
                        </a>
                        <a
                            href="/admin/dashboard/schedules-management"
                            className="p-4 rounded-lg border hover:bg-muted transition-colors text-center"
                        >
                            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Manage Schedules</p>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
