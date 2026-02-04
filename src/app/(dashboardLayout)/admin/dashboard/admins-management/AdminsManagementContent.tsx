"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { IAdmin, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { Pagination, PaginationInfo, PageSizeSelector } from "@/components/ui/pagination";
import { SearchInput, FilterBar } from "@/components/ui/search";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { softDeleteAdmin } from "@/services/admin";
import { toast } from "sonner";
import { CreateAdminModal } from "./CreateAdminModal";

interface AdminsManagementContentProps {
  admins: IAdmin[];
  meta: IMeta | null;
  currentFilters: {
    page: number;
    limit: number;
    searchTerm: string;
  };
}

export function AdminsManagementContent({
  admins,
  meta,
  currentFilters,
}: AdminsManagementContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<IAdmin | null>(null);
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

  const handleSearch = () => {
    updateFilters({ searchTerm });
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    
    setIsDeleting(true);
    try {
      await softDeleteAdmin(adminToDelete.id);
      toast.success("Admin deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete admin");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const columns = [
    {
      id: "admin",
      header: "Admin",
      cell: (admin: IAdmin) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {admin.profilePhoto ? (
              <img
                src={admin.profilePhoto}
                alt={admin.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-primary">
                {admin.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium">{admin.name}</p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: (admin: IAdmin) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">{admin.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            {admin.contactNumber}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (admin: IAdmin) => (
        <StatusBadge status={admin.isDeleted ? "INACTIVE" : "ACTIVE"}>
          {admin.isDeleted ? "Deleted" : "Active"}
        </StatusBadge>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      cell: (admin: IAdmin) => (
        <span className="text-sm text-muted-foreground">
          {new Date(admin.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (admin: IAdmin) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/dashboard/admins-management/${admin.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setAdminToDelete(admin);
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
        title="Admins Management"
        description="Manage all administrators in the system"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        }
      />

      {/* Filters */}
      <FilterBar>
        <div className="flex-1 min-w-[200px]">
          <SearchInput
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => {
              setSearchTerm("");
              updateFilters({ searchTerm: "" });
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="outline" onClick={handleSearch} disabled={isPending}>
          Search
        </Button>
      </FilterBar>

      {/* Table */}
      {admins.length === 0 ? (
        <EmptyState
          title="No admins found"
          description="Get started by adding your first administrator."
          action={{
            label: "Add Admin",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <DataTable data={admins} columns={columns} />
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

      {/* Create Admin Modal */}
      <CreateAdminModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Admin"
        description={`Are you sure you want to delete ${adminToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
