"use client";

import Link from "next/link";
import { Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle, Stethoscope } from "lucide-react";
import { IAppointment, IPrescription, AppointmentStatus, PaymentStatus } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { StatsGrid, StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";

interface PatientDashboardContentProps {
  appointments: IAppointment[];
  prescriptions: IPrescription[];
}

export function PatientDashboardContent({
  appointments,
  prescriptions,
}: PatientDashboardContentProps) {
  // Calculate stats
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    (a) => a.status === AppointmentStatus.SCHEDULED
  ).length;
  const completedAppointments = appointments.filter(
    (a) => a.status === AppointmentStatus.COMPLETED
  ).length;
  const totalPrescriptions = prescriptions.length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
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
              <CardTitle className="text-lg">Recent Appointments</CardTitle>
              <CardDescription>Your latest appointments</CardDescription>
            </div>
            <Link href="/dashboard/my-appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments yet</p>
                <Link href="/consultation">
                  <Button variant="link" size="sm">Book your first appointment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {appointment.doctor?.profilePhoto ? (
                          <img
                            src={appointment.doctor.profilePhoto}
                            alt={appointment.doctor.name}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <Stethoscope className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Dr. {appointment.doctor?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(appointment.schedule?.scheduleDate || "")} •{" "}
                          {formatTime(appointment.schedule?.startTime || "")}
                        </p>
                      </div>
                    </div>
                    <AppointmentStatusBadge status={appointment.status}>
                      {appointment.status}
                    </AppointmentStatusBadge>
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
              <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
              <CardDescription>Your latest prescriptions</CardDescription>
            </div>
            <Link href="/dashboard/my-prescriptions">
              <Button variant="outline" size="sm">View All</Button>
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
                {prescriptions.slice(0, 5).map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        Dr. {prescription.doctor?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(prescription.createdAt)}
                      </p>
                      {prescription.followUpDate && (
                        <p className="text-xs text-blue-600">
                          Follow-up: {formatDate(prescription.followUpDate)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {prescription.instructions?.length || 0} medications
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/consultation">
              <div className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-center cursor-pointer">
                <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Book Appointment</p>
              </div>
            </Link>
            <Link href="/dashboard/my-appointments">
              <div className="p-4 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-center cursor-pointer">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">View Appointments</p>
              </div>
            </Link>
            <Link href="/dashboard/my-prescriptions">
              <div className="p-4 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors text-center cursor-pointer">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">View Prescriptions</p>
              </div>
            </Link>
            <Link href="/dashboard/my-profile">
              <div className="p-4 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-center cursor-pointer">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <p className="text-sm font-medium">Update Profile</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
