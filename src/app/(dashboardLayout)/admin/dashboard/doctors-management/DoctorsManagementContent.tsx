"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    UserX,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { IDoctor, IMeta, ISpecialty, Gender } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable, TableCell, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PageSizeSelector,
} from "@/components/ui/pagination";
import { SearchInput, FilterSelect, FilterBar } from "@/components/ui/search";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { softDeleteDoctor, deleteDoctor } from "@/services/doctor";
import { toast } from "sonner";
import { CreateDoctorModal } from "./CreateDoctorModal";
import { useDebounce } from "@/hooks/usePagination";

interface DoctorsManagementContentProps {
    doctors: IDoctor[];
    meta: IMeta | null;
    specialties: ISpecialty[];
    currentFilters: {
        page: number;
        limit: number;
        searchTerm: string;
        specialties: string;
    };
}

export function DoctorsManagementContent({
    doctors,
    meta,
    specialties,
    currentFilters,
}: DoctorsManagementContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<IDoctor | null>(null);
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
            // Reset to page 1 when filters change (except when changing page)
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
        if (!doctorToDelete) return;

        setIsDeleting(true);
        try {
            await softDeleteDoctor(doctorToDelete.id);
            toast.success("Doctor deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete doctor");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDoctorToDelete(null);
        }
    };

    const columns = [
        {
            id: "doctor",
            header: "Doctor",
            cell: (doctor: IDoctor) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {doctor.profilePhoto ? (
                            <img
                                src={doctor.profilePhoto}
                                alt={doctor.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-medium text-primary">
                                {doctor.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {doctor.designation}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "contact",
            header: "Contact",
            cell: (doctor: IDoctor) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-37.5">
                            {doctor.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {doctor.contactNumber}
                    </div>
                </div>
            ),
        },
        {
            id: "specialties",
            header: "Specialties",
            cell: (doctor: IDoctor) => (
                <div className="flex flex-wrap gap-1">
                    {doctor.doctorSpecialties?.slice(0, 2).map((ds) => (
                        <Badge
                            key={ds.specialtyId}
                            variant="secondary"
                            className="text-xs"
                        >
                            {ds.specialty?.title}
                        </Badge>
                    ))}
                    {(doctor.doctorSpecialties?.length ?? 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{(doctor.doctorSpecialties?.length ?? 0) - 2}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: "experience",
            header: "Experience",
            cell: (doctor: IDoctor) => <span>{doctor.experience} years</span>,
        },
        {
            id: "fee",
            header: "Fee",
            cell: (doctor: IDoctor) => (
                <span className="font-medium">${doctor.appointmentFee}</span>
            ),
        },
        {
            id: "rating",
            header: "Rating",
            cell: (doctor: IDoctor) => (
                <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>{doctor.averageRating.toFixed(1)}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (doctor: IDoctor) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                                `/admin/dashboard/doctors-management/${doctor.id}`,
                            );
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDoctorToDelete(doctor);
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
                title="Doctors Management"
                description="Manage all doctors in the system"
                actions={
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Doctor
                    </Button>
                }
            />

            {/* Filters */}
            <FilterBar>
                <div className="flex-1 min-w-50">
                    <SearchInput
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => {
                            setSearchTerm("");
                            updateFilters({ searchTerm: "" });
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <FilterSelect
                    value={currentFilters.specialties}
                    onChange={(value) => updateFilters({ specialties: value })}
                    options={specialties.map((s) => ({
                        value: s.title,
                        label: s.title,
                    }))}
                    placeholder="All Specialties"
                />
                <Button
                    variant="outline"
                    onClick={handleSearch}
                    disabled={isPending}
                >
                    Search
                </Button>
            </FilterBar>

            {/* Table */}
            {doctors.length === 0 ? (
                <EmptyState
                    title="No doctors found"
                    description="Get started by adding your first doctor to the system."
                    action={{
                        label: "Add Doctor",
                        onClick: () => setShowCreateModal(true),
                    }}
                />
            ) : (
                <>
                    <div className="rounded-lg border">
                        <DataTable
                            data={doctors}
                            columns={columns}
                            onRowClick={(doctor) =>
                                router.push(
                                    `/admin/dashboard/doctors-management/${doctor.id}`,
                                )
                            }
                        />
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

            {/* Create Doctor Modal */}
            <CreateDoctorModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                specialties={specialties}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Doctor"
                description={`Are you sure you want to delete ${doctorToDelete?.name}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
