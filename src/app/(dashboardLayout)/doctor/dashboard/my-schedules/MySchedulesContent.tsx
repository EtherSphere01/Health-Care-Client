"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Clock, Calendar, Check } from "lucide-react";
import { ISchedule, IDoctorSchedule, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PageSizeSelector,
} from "@/components/ui/pagination";
import { FilterBar } from "@/components/ui/search";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
    createDoctorSchedule,
    deleteDoctorSchedule,
} from "@/services/doctor-schedule";
import { toast } from "sonner";
import { SelectSchedulesModal } from "./SelectSchedulesModal";

interface MySchedulesContentProps {
    mySchedules: IDoctorSchedule[];
    availableSchedules: ISchedule[];
    meta: IMeta | null;
    currentFilters: {
        page: number;
        limit: number;
        startDate: string;
        endDate: string;
    };
}

export function MySchedulesContent({
    mySchedules,
    availableSchedules,
    meta,
    currentFilters,
}: MySchedulesContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [startDate, setStartDate] = useState(currentFilters.startDate);
    const [endDate, setEndDate] = useState(currentFilters.endDate);
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] =
        useState<IDoctorSchedule | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get schedule IDs that are already assigned to this doctor
    const assignedScheduleIds = mySchedules.map((ds) => ds.scheduleId);

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

    const handleFilter = () => {
        updateFilters({ startDate, endDate });
    };

    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        updateFilters({ startDate: "", endDate: "" });
    };

    const handleDelete = async () => {
        if (!scheduleToDelete) return;

        setIsDeleting(true);
        try {
            await deleteDoctorSchedule(scheduleToDelete.scheduleId);
            toast.success("Schedule removed successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to remove schedule");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setScheduleToDelete(null);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        if (!dateString || Number.isNaN(date.getTime())) return "—";
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (!dateString || Number.isNaN(date.getTime())) return "—";
        return date.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
        });
    };

    const columns = [
        {
            id: "date",
            header: "Date",
            cell: (doctorSchedule: IDoctorSchedule) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {formatDate(
                            doctorSchedule.schedule?.startDateTime || "",
                        )}
                    </span>
                </div>
            ),
        },
        {
            id: "time",
            header: "Time Slot",
            cell: (doctorSchedule: IDoctorSchedule) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {formatTime(
                            doctorSchedule.schedule?.startDateTime || "",
                        )}{" "}
                        -{" "}
                        {formatTime(doctorSchedule.schedule?.endDateTime || "")}
                    </span>
                </div>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: (doctorSchedule: IDoctorSchedule) => (
                <Badge
                    variant={
                        doctorSchedule.isBooked ? "destructive" : "success"
                    }
                >
                    {doctorSchedule.isBooked ? "Booked" : "Available"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (doctorSchedule: IDoctorSchedule) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                        setScheduleToDelete(doctorSchedule);
                        setDeleteDialogOpen(true);
                    }}
                    disabled={doctorSchedule.isBooked}
                    title={
                        doctorSchedule.isBooked
                            ? "Cannot remove booked schedule"
                            : "Remove schedule"
                    }
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Schedules"
                description="Manage your availability for patient appointments"
                actions={
                    <Button onClick={() => setShowSelectModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Schedule
                    </Button>
                }
            />

            {/* Filters */}
            <FilterBar>
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="startDate"
                        className="text-sm text-muted-foreground whitespace-nowrap"
                    >
                        From:
                    </Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-auto"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="endDate"
                        className="text-sm text-muted-foreground whitespace-nowrap"
                    >
                        To:
                    </Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-auto"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={handleFilter}
                    disabled={isPending}
                >
                    Filter
                </Button>
                {(startDate || endDate) && (
                    <Button variant="ghost" onClick={handleClearFilters}>
                        Clear
                    </Button>
                )}
            </FilterBar>

            {/* Table */}
            {mySchedules.length === 0 ? (
                <EmptyState
                    title="No schedules found"
                    description="Add your availability to start accepting appointments."
                    action={{
                        label: "Add Schedule",
                        onClick: () => setShowSelectModal(true),
                    }}
                />
            ) : (
                <>
                    <div className="rounded-lg border">
                        <DataTable data={mySchedules} columns={columns} />
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

            {/* Select Schedules Modal */}
            <SelectSchedulesModal
                open={showSelectModal}
                onOpenChange={setShowSelectModal}
                availableSchedules={availableSchedules}
                assignedScheduleIds={assignedScheduleIds}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Remove Schedule"
                description="Are you sure you want to remove this schedule from your availability?"
                confirmLabel="Remove"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
