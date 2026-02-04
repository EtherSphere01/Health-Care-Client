"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";
import { ISchedule, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/table";
import { Pagination, PaginationInfo, PageSizeSelector } from "@/components/ui/pagination";
import { FilterBar } from "@/components/ui/search";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteSchedule } from "@/services/schedule";
import { toast } from "sonner";
import { CreateScheduleModal } from "./CreateScheduleModal";

interface SchedulesManagementContentProps {
  schedules: ISchedule[];
  meta: IMeta | null;
  currentFilters: {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
  };
}

export function SchedulesManagementContent({
  schedules,
  meta,
  currentFilters,
}: SchedulesManagementContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [startDate, setStartDate] = useState(currentFilters.startDate);
  const [endDate, setEndDate] = useState(currentFilters.endDate);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ISchedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      await deleteSchedule(scheduleToDelete.id);
      toast.success("Schedule deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete schedule");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      id: "date",
      header: "Date",
      cell: (schedule: ISchedule) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(schedule.startDateTime)}</span>
        </div>
      ),
    },
    {
      id: "time",
      header: "Time Slot",
      cell: (schedule: ISchedule) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatTime(schedule.startDateTime)} - {formatTime(schedule.endDateTime)}
          </span>
        </div>
      ),
    },
    {
      id: "doctors",
      header: "Assigned Doctors",
      cell: (schedule: ISchedule) => (
        <span className="text-sm">
          {schedule.doctorSchedule?.length || 0} doctor(s)
        </span>
      ),
    },
    {
      id: "created",
      header: "Created At",
      cell: (schedule: ISchedule) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(schedule.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (schedule: ISchedule) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setScheduleToDelete(schedule);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Schedules Management"
        description="Manage time slots for doctor appointments"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        }
      />

      {/* Filters */}
      <FilterBar>
        <div className="flex items-center gap-2">
          <Label htmlFor="startDate" className="text-sm text-muted-foreground whitespace-nowrap">
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
          <Label htmlFor="endDate" className="text-sm text-muted-foreground whitespace-nowrap">
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
        <Button variant="outline" onClick={handleFilter} disabled={isPending}>
          Filter
        </Button>
        {(startDate || endDate) && (
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear
          </Button>
        )}
      </FilterBar>

      {/* Table */}
      {schedules.length === 0 ? (
        <EmptyState
          title="No schedules found"
          description="Get started by creating your first schedule slot."
          action={{
            label: "Create Schedule",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <DataTable data={schedules} columns={columns} />
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

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule? This will also remove all doctor assignments for this time slot."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
