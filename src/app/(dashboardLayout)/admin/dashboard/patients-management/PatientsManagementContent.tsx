"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { IPatient, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PageSizeSelector,
} from "@/components/ui/pagination";
import { SearchInput, FilterBar } from "@/components/ui/search";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { softDeletePatient } from "@/services/patient";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/usePagination";

interface PatientsManagementContentProps {
    patients: IPatient[];
    meta: IMeta | null;
    currentFilters: {
        page: number;
        limit: number;
        searchTerm: string;
    };
}

export function PatientsManagementContent({
    patients,
    meta,
    currentFilters,
}: PatientsManagementContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<IPatient | null>(
        null,
    );
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

    useEffect(() => {
        setSearchTerm(currentFilters.searchTerm);
    }, [currentFilters.searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm === currentFilters.searchTerm) return;
        updateFilters({ searchTerm: debouncedSearchTerm });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, currentFilters.searchTerm]);

    const handleDelete = async () => {
        if (!patientToDelete) return;

        setIsDeleting(true);
        try {
            await softDeletePatient(patientToDelete.id);
            toast.success("Patient deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete patient");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setPatientToDelete(null);
        }
    };

    const columns = [
        {
            id: "patient",
            header: "Patient",
            cell: (patient: IPatient) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {patient.profilePhoto ? (
                            <img
                                src={patient.profilePhoto}
                                alt={patient.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-medium text-primary">
                                {patient.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {patient.patientHealthData?.gender?.toLowerCase() ||
                                "N/A"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "contact",
            header: "Contact",
            cell: (patient: IPatient) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-37.5">
                            {patient.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {patient.contactNumber || "N/A"}
                    </div>
                </div>
            ),
        },
        {
            id: "address",
            header: "Address",
            cell: (patient: IPatient) => (
                <div className="max-w-50 truncate text-sm text-muted-foreground">
                    {patient.address || "Not provided"}
                </div>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: (patient: IPatient) => (
                <StatusBadge
                    status={patient.isDeleted ? "INACTIVE" : "ACTIVE"}
                />
            ),
        },
        {
            id: "joined",
            header: "Joined",
            cell: (patient: IPatient) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(patient.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (patient: IPatient) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/patients-management/${patient.id}`,
                            )
                        }
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                            setPatientToDelete(patient);
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
                title="Patients Management"
                description="Manage all patients in the system"
            />

            {/* Filters */}
            <FilterBar>
                <div className="flex-1 min-w-50">
                    <SearchInput
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => {
                            setSearchTerm("");
                            updateFilters({ searchTerm: "" });
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={handleSearch}
                    disabled={isPending}
                >
                    Search
                </Button>
            </FilterBar>

            {/* Table */}
            {patients.length === 0 ? (
                <EmptyState
                    title="No patients found"
                    description="No patients have registered yet."
                />
            ) : (
                <>
                    <div className="rounded-lg border">
                        <DataTable data={patients} columns={columns} />
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

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Patient"
                description={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
