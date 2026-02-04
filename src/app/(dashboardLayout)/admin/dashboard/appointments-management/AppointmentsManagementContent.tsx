"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { IAppointment, IMeta, AppointmentStatus, PaymentStatus } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { Pagination, PaginationInfo, PageSizeSelector } from "@/components/ui/pagination";
import { FilterSelect, FilterBar } from "@/components/ui/search";
import { AppointmentStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ViewAppointmentModal } from "./ViewAppointmentModal";

interface AppointmentsManagementContentProps {
  appointments: IAppointment[];
  meta: IMeta | null;
  currentFilters: {
    page: number;
    limit: number;
    status: string;
    paymentStatus: string;
  };
}

const appointmentStatusOptions = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "INPROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
];

const paymentStatusOptions = [
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
];

export function AppointmentsManagementContent({
  appointments,
  meta,
  currentFilters,
}: AppointmentsManagementContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [viewingAppointment, setViewingAppointment] = useState<IAppointment | null>(null);

  const updateFilters = (updates: Record<string, string | number>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      if (!("page" in updates)) {
        params.set("page", "1");
      }
      router.push(`?${params.toString()}`);
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const columns = [
    {
      id: "patient",
      header: "Patient",
      cell: (appointment: IAppointment) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{appointment.patient?.name || "N/A"}</p>
            <p className="text-xs text-muted-foreground">{appointment.patient?.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "doctor",
      header: "Doctor",
      cell: (appointment: IAppointment) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{appointment.doctor?.name || "N/A"}</p>
            <p className="text-xs text-muted-foreground">{appointment.doctor?.designation}</p>
          </div>
        </div>
      ),
    },
    {
      id: "schedule",
      header: "Schedule",
      cell: (appointment: IAppointment) => {
        if (!appointment.schedule) return "N/A";
        const { date, time } = formatDateTime(appointment.schedule.startDateTime);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {date}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {time}
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (appointment: IAppointment) => (
        <AppointmentStatusBadge status={appointment.status}>
          {appointment.status}
        </AppointmentStatusBadge>
      ),
    },
    {
      id: "payment",
      header: "Payment",
      cell: (appointment: IAppointment) => (
        <PaymentStatusBadge status={appointment.paymentStatus}>
          {appointment.paymentStatus}
        </PaymentStatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (appointment: IAppointment) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewingAppointment(appointment)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Appointments Management"
        description="View and manage all appointments in the system"
      />

      {/* Filters */}
      <FilterBar>
        <FilterSelect
          value={currentFilters.status}
          onChange={(value) => updateFilters({ status: value })}
          options={appointmentStatusOptions}
          placeholder="All Status"
        />
        <FilterSelect
          value={currentFilters.paymentStatus}
          onChange={(value) => updateFilters({ paymentStatus: value })}
          options={paymentStatusOptions}
          placeholder="All Payment Status"
        />
      </FilterBar>

      {/* Table */}
      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="No appointments match your current filters."
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <DataTable data={appointments} columns={columns} />
          </div>

          {/* Pagination */}
          {meta && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <PaginationInfo
                currentPage={meta.page}
                totalPages={meta.totalPage}
                totalItems={meta.total}
                itemsPerPage={meta.limit}
              />
              <div className="flex items-center gap-4">
                <PageSizeSelector
                  value={currentFilters.limit}
                  onChange={(value) => updateFilters({ limit: value })}
                />
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPage}
                  onPageChange={(page) => updateFilters({ page })}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* View Appointment Modal */}
      {viewingAppointment && (
        <ViewAppointmentModal
          open={!!viewingAppointment}
          onOpenChange={(open) => !open && setViewingAppointment(null)}
          appointment={viewingAppointment}
        />
      )}
    </div>
  );
}
