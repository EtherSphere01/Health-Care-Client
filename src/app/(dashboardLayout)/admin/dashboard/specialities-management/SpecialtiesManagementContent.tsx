"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { ISpecialty, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { Pagination, PaginationInfo, PageSizeSelector } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteSpecialty } from "@/services/specialty";
import { toast } from "sonner";
import { CreateSpecialtyModal } from "./CreateSpecialtyModal";
import { EditSpecialtyModal } from "./EditSpecialtyModal";

interface SpecialtiesManagementContentProps {
  specialties: ISpecialty[];
  meta: IMeta | null;
  currentFilters: {
    page: number;
    limit: number;
  };
}

export function SpecialtiesManagementContent({
  specialties,
  meta,
  currentFilters,
}: SpecialtiesManagementContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<ISpecialty | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<ISpecialty | null>(null);
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
      router.push(`?${params.toString()}`);
    });
  };

  const handleDelete = async () => {
    if (!specialtyToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSpecialty(specialtyToDelete.id);
      toast.success("Specialty deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete specialty");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSpecialtyToDelete(null);
    }
  };

  const columns = [
    {
      id: "specialty",
      header: "Specialty",
      cell: (specialty: ISpecialty) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {specialty.icon ? (
              <img
                src={specialty.icon}
                alt={specialty.title}
                className="h-12 w-12 object-cover"
              />
            ) : (
              <Image className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{specialty.title}</p>
          </div>
        </div>
      ),
    },
    {
      id: "doctors",
      header: "Doctors",
      cell: (specialty: ISpecialty) => (
        <span className="text-sm">
          {specialty._count?.doctorSpecialties || 0} doctors
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (specialty: ISpecialty) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingSpecialty(specialty)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setSpecialtyToDelete(specialty);
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
        title="Specialties Management"
        description="Manage medical specialties in the system"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Specialty
          </Button>
        }
      />

      {/* Table */}
      {specialties.length === 0 ? (
        <EmptyState
          title="No specialties found"
          description="Get started by adding your first medical specialty."
          action={{
            label: "Add Specialty",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <DataTable data={specialties} columns={columns} />
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

      {/* Create Specialty Modal */}
      <CreateSpecialtyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Edit Specialty Modal */}
      {editingSpecialty && (
        <EditSpecialtyModal
          open={!!editingSpecialty}
          onOpenChange={(open) => !open && setEditingSpecialty(null)}
          specialty={editingSpecialty}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Specialty"
        description={`Are you sure you want to delete "${specialtyToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
