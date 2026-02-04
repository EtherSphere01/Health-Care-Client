"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Check } from "lucide-react";
import { ISchedule } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createDoctorSchedule } from "@/services/doctor-schedule";
import { toast } from "sonner";

interface SelectSchedulesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableSchedules: ISchedule[];
    assignedScheduleIds: string[];
}

export function SelectSchedulesModal({
    open,
    onOpenChange,
    availableSchedules,
    assignedScheduleIds,
}: SelectSchedulesModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>(
        [],
    );

    // Filter out already assigned schedules
    const unassignedSchedules = availableSchedules.filter(
        (s) => !assignedScheduleIds.includes(s.id),
    );

    // Group schedules by date
    const groupedSchedules = unassignedSchedules.reduce(
        (groups, schedule) => {
            const date = new Date(schedule.startDateTime).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(schedule);
            return groups;
        },
        {} as Record<string, ISchedule[]>,
    );

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateHeader = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleToggleSchedule = (scheduleId: string) => {
        setSelectedScheduleIds((prev) =>
            prev.includes(scheduleId)
                ? prev.filter((id) => id !== scheduleId)
                : [...prev, scheduleId],
        );
    };

    const handleSelectAll = () => {
        if (selectedScheduleIds.length === unassignedSchedules.length) {
            setSelectedScheduleIds([]);
        } else {
            setSelectedScheduleIds(unassignedSchedules.map((s) => s.id));
        }
    };

    const handleSubmit = async () => {
        if (selectedScheduleIds.length === 0) {
            toast.error("Please select at least one schedule");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createDoctorSchedule({
                scheduleIds: selectedScheduleIds,
            });

            if (response.success) {
                toast.success(
                    `${selectedScheduleIds.length} schedule(s) added successfully`,
                );
                onOpenChange(false);
                setSelectedScheduleIds([]);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to add schedules");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add schedules");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Schedules</DialogTitle>
                    <DialogDescription>
                        Choose the time slots you want to be available for
                        appointments
                    </DialogDescription>
                </DialogHeader>

                {unassignedSchedules.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        No available schedules to add. All schedules are already
                        assigned.
                    </div>
                ) : (
                    <>
                        {/* Select All */}
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">
                                {selectedScheduleIds.length} of{" "}
                                {unassignedSchedules.length} selected
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSelectAll}
                            >
                                {selectedScheduleIds.length ===
                                unassignedSchedules.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </Button>
                        </div>

                        {/* Schedules List */}
                        <div className="flex-1 overflow-y-auto space-y-4 py-4">
                            {Object.entries(groupedSchedules).map(
                                ([date, schedules]) => (
                                    <div key={date}>
                                        <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background py-1">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <h4 className="font-medium text-sm">
                                                {formatDateHeader(date)}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                                            {schedules.map((schedule) => (
                                                <button
                                                    key={schedule.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleSchedule(
                                                            schedule.id,
                                                        )
                                                    }
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                                        selectedScheduleIds.includes(
                                                            schedule.id,
                                                        )
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "hover:bg-muted"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="text-sm">
                                                            {formatTime(
                                                                schedule.startDateTime,
                                                            )}{" "}
                                                            -{" "}
                                                            {formatTime(
                                                                schedule.endDateTime,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {selectedScheduleIds.includes(
                                                        schedule.id,
                                                    ) && (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setSelectedScheduleIds([]);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            isSubmitting || selectedScheduleIds.length === 0
                        }
                    >
                        {isSubmitting
                            ? "Adding..."
                            : `Add ${selectedScheduleIds.length} Schedule${selectedScheduleIds.length !== 1 ? "s" : ""}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
