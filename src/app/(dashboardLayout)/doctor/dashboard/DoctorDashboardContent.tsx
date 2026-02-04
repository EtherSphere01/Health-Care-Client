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
import { IDoctorMeta } from "@/types";

interface DoctorDashboardContentProps {
    stats: IDoctorMeta | null;
}

export function DoctorDashboardContent({ stats }: DoctorDashboardContentProps) {
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
                    value={stats?.appointmentCount || 0}
                    icon={Calendar}
                    description="All-time appointments"
                />
                <StatCard
                    title="Total Patients"
                    value={stats?.patientCount || 0}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    description="Unique patients"
                />
                <StatCard
                    title="Pending Reviews"
                    value={stats?.reviewCount || 0}
                    icon={Star}
                    description="Patient reviews"
                />
                <StatCard
                    title="Total Earnings"
                    value={`$${(stats?.revenue || 0).toLocaleString()}`}
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
                            Today's Schedule
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.appointmentStatusDistribution?.find(
                                (s) => s.status === "SCHEDULED",
                            )?.count || 0}
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
                            {stats?.appointmentStatusDistribution?.find(
                                (s) => s.status === "COMPLETED",
                            )?.count || 0}
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
                            {stats?.appointmentStatusDistribution?.find(
                                (s) => s.status === "INPROGRESS",
                            )?.count || 0}
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
                        {stats?.appointmentStatusDistribution?.map((status) => (
                            <div
                                key={status.status}
                                className="p-4 rounded-lg bg-muted/50"
                            >
                                <p className="text-sm text-muted-foreground capitalize">
                                    {status.status
                                        .toLowerCase()
                                        .replace("_", " ")}
                                </p>
                                <p className="text-2xl font-bold mt-1">
                                    {status.count}
                                </p>
                            </div>
                        )) || (
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
