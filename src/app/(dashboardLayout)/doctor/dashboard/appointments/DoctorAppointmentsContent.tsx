"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Eye,
    Video,
    FileText,
    CheckCircle,
    Calendar,
    Clock,
    User,
} from "lucide-react";
import { IAppointment, IMeta, AppointmentStatus } from "@/types";
import { getVideoCallUrl } from "@/lib/utils";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PageSizeSelector,
} from "@/components/ui/pagination";
import { FilterSelect, FilterBar } from "@/components/ui/search";
import {
    AppointmentStatusBadge,
    PaymentStatusBadge,
} from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { updateAppointmentStatus } from "@/services/appointment";
import { toast } from "sonner";
import { ViewPatientModal } from "./ViewPatientModal";
import { CreatePrescriptionModal } from "./CreatePrescriptionModal";

interface DoctorAppointmentsContentProps {
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

export function DoctorAppointmentsContent({
    appointments,
    meta,
    currentFilters,
}: DoctorAppointmentsContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [viewingPatient, setViewingPatient] = useState<IAppointment | null>(
        null,
    );
    const [prescriptionAppointment, setPrescriptionAppointment] =
        useState<IAppointment | null>(null);
    const [statusUpdateAppointment, setStatusUpdateAppointment] =
        useState<IAppointment | null>(null);
    const [newStatus, setNewStatus] = useState<AppointmentStatus | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleStatusUpdate = async () => {
        if (!statusUpdateAppointment || !newStatus) return;

        setIsUpdating(true);
        try {
            const response = await updateAppointmentStatus(
                statusUpdateAppointment.id,
                { status: newStatus },
            );
            if (response.success) {
                toast.success(`Appointment status updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to update status");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update status";
            toast.error(message);
        } finally {
            setIsUpdating(false);
            setStatusUpdateAppointment(null);
            setNewStatus(null);
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            time: date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
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
                        <p className="font-medium">
                            {appointment.patient?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {appointment.patient?.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "schedule",
            header: "Schedule",
            cell: (appointment: IAppointment) => {
                if (!appointment.schedule) return "N/A";
                const { date, time } = formatDateTime(
                    appointment.schedule.startDateTime,
                );
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
                <AppointmentStatusBadge status={appointment.status} />
            ),
        },
        {
            id: "payment",
            header: "Payment",
            cell: (appointment: IAppointment) => (
                <PaymentStatusBadge status={appointment.paymentStatus} />
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (appointment: IAppointment) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingPatient(appointment)}
                        title="View Patient"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {appointment.videoCallingId &&
                        appointment.status === "INPROGRESS" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    const url = getVideoCallUrl(
                                        appointment.videoCallingId,
                                    );
                                    if (!url) {
                                        toast.error(
                                            "Video call link is missing",
                                        );
                                        return;
                                    }
                                    window.open(
                                        url,
                                        "_blank",
                                        "noopener,noreferrer",
                                    );
                                }}
                                title="Join Video Call"
                            >
                                <Video className="h-4 w-4 text-blue-600" />
                            </Button>
                        )}
                    {appointment.status !== AppointmentStatus.COMPLETED &&
                        appointment.status !== AppointmentStatus.CANCELED && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setStatusUpdateAppointment(appointment);
                                    setNewStatus(
                                        appointment.status ===
                                            AppointmentStatus.SCHEDULED
                                            ? AppointmentStatus.INPROGRESS
                                            : AppointmentStatus.COMPLETED,
                                    );
                                }}
                                title={
                                    appointment.status ===
                                    AppointmentStatus.SCHEDULED
                                        ? "Start Appointment"
                                        : "Complete Appointment"
                                }
                            >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                    {(appointment.status === AppointmentStatus.INPROGRESS ||
                        appointment.status === AppointmentStatus.COMPLETED) &&
                        !appointment.prescription && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setPrescriptionAppointment(appointment)
                                }
                                title="Write Prescription"
                            >
                                <FileText className="h-4 w-4 text-amber-600" />
                            </Button>
                        )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Appointments"
                description="Manage your patient appointments"
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
                    onChange={(value) =>
                        updateFilters({ paymentStatus: value })
                    }
                    options={paymentStatusOptions}
                    placeholder="All Payment Status"
                />
            </FilterBar>

            {/* Table */}
            {appointments.length === 0 ? (
                <EmptyState
                    title="No appointments found"
                    description="You don't have any appointments matching your filters."
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
                                    onChange={(value) =>
                                        updateFilters({ limit: value })
                                    }
                                />
                                <Pagination
                                    currentPage={meta.page}
                                    totalPages={meta.totalPage}
                                    onPageChange={(page) =>
                                        updateFilters({ page })
                                    }
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* View Patient Modal */}
            {viewingPatient && (
                <ViewPatientModal
                    open={!!viewingPatient}
                    onOpenChange={(open) => !open && setViewingPatient(null)}
                    appointment={viewingPatient}
                />
            )}

            {/* Create Prescription Modal */}
            {prescriptionAppointment && (
                <CreatePrescriptionModal
                    open={!!prescriptionAppointment}
                    onOpenChange={(open) =>
                        !open && setPrescriptionAppointment(null)
                    }
                    appointment={prescriptionAppointment}
                />
            )}

            {/* Status Update Confirmation */}
            <ConfirmDialog
                open={!!statusUpdateAppointment}
                onOpenChange={(open) => {
                    if (!open) {
                        setStatusUpdateAppointment(null);
                        setNewStatus(null);
                    }
                }}
                title={
                    newStatus === "INPROGRESS"
                        ? "Start Appointment"
                        : "Complete Appointment"
                }
                description={
                    newStatus === "INPROGRESS"
                        ? "Are you sure you want to start this appointment? The patient will be notified."
                        : "Are you sure you want to mark this appointment as completed?"
                }
                confirmLabel={newStatus === "INPROGRESS" ? "Start" : "Complete"}
                onConfirm={handleStatusUpdate}
                isLoading={isUpdating}
            />
        </div>
    );
}
