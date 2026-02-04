"use client";

import {
    Calendar,
    Users,
    ClipboardList,
    Clock,
    CheckCircle,
    DollarSign,
    Star,
    TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { StatsGrid, StatCard } from "@/components/ui/stat-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IDoctorDashboardMeta, IDashboardMeta } from "@/types";

interface DoctorDashboardContentProps {
    stats: IDashboardMeta | null;
}

// Type guard for doctor dashboard meta
function isDoctorMeta(
    meta: IDashboardMeta | null,
): meta is IDoctorDashboardMeta {
    return (
        meta !== null &&
        "totalPrescriptions" in meta &&
        "totalRevenue" in meta &&
        !("totalDoctors" in meta)
    );
}

export function DoctorDashboardContent({ stats }: DoctorDashboardContentProps) {
    const doctorStats = isDoctorMeta(stats) ? stats : null;

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Doctor Dashboard"
                description="Welcome back! Here's an overview of your practice"
            />

            {/* Stats Grid */}
            <StatsGrid columns={4}>
                <StatCard
                    title="Total Appointments"
                    value={doctorStats?.totalAppointments || 0}
                    icon={Calendar}
                    description="All-time appointments"
                />
                <StatCard
                    title="Total Patients"
                    value={doctorStats?.totalPatients || 0}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    description="Unique patients"
                />
                <StatCard
                    title="Prescriptions"
                    value={doctorStats?.totalPrescriptions || 0}
                    icon={Star}
                    description="Total prescriptions"
                />
                <StatCard
                    title="Total Earnings"
                    value={`$${(doctorStats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    description="Lifetime revenue"
                />
            </StatsGrid>

            {/* Quick Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Today's Appointments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today&apos;s Schedule
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {doctorStats?.appointmentByStatus?.scheduled || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            appointments scheduled for today
                        </p>
                    </CardContent>
                </Card>

                {/* Completed Today */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completed Today
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {doctorStats?.appointmentByStatus?.completed || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            appointments completed
                        </p>
                    </CardContent>
                </Card>

                {/* In Progress */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            In Progress
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {doctorStats?.appointmentByStatus?.inProgress || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            currently active
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Appointment Status Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Status Distribution</CardTitle>
                    <CardDescription>
                        Overview of all appointment statuses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {doctorStats?.appointmentByStatus ? (
                            <>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">
                                        Scheduled
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats.appointmentByStatus
                                                .scheduled
                                        }
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">
                                        In Progress
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats.appointmentByStatus
                                                .inProgress
                                        }
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats.appointmentByStatus
                                                .completed
                                        }
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">
                                        Canceled
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats.appointmentByStatus
                                                .canceled
                                        }
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground col-span-full">
                                No appointment data available
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href="/doctor/dashboard/appointments"
                            className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                        >
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">View Appointments</p>
                        </a>
                        <a
                            href="/doctor/dashboard/my-schedules"
                            className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                        >
                            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">My Schedules</p>
                        </a>
                        <a
                            href="/doctor/dashboard/prescriptions"
                            className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                        >
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Prescriptions</p>
                        </a>
                        <a
                            href="/doctor/dashboard/my-profile"
                            className="p-4 rounded-lg border hover:bg-muted/50 transition-colors text-center"
                        >
                            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">My Profile</p>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
