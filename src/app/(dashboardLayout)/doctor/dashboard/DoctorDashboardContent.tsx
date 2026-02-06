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
        "reviewCount" in meta &&
        "totalRevenue" in meta &&
        !("doctorCount" in meta)
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
                    value={doctorStats?.appointmentCount || 0}
                    icon={Calendar}
                    description="All-time appointments"
                />
                <StatCard
                    title="Total Patients"
                    value={doctorStats?.patientCount || 0}
                    icon={Users}
                    description="Unique patients"
                />
                <StatCard
                    title="Reviews"
                    value={doctorStats?.reviewCount || 0}
                    icon={Star}
                    description="Total reviews"
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
                            {doctorStats?.appointmentStatusDistribution
                                ?.scheduled || 0}
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
                            {doctorStats?.appointmentStatusDistribution
                                ?.completed || 0}
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
                            {doctorStats?.appointmentStatusDistribution
                                ?.inProgress || 0}
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
                        {doctorStats?.appointmentStatusDistribution ? (
                            <>
                                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Scheduled
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats
                                                .appointmentStatusDistribution
                                                .scheduled
                                        }
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        In Progress
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats
                                                .appointmentStatusDistribution
                                                .inProgress
                                        }
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats
                                                .appointmentStatusDistribution
                                                .completed
                                        }
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Canceled
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {
                                            doctorStats
                                                .appointmentStatusDistribution
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
