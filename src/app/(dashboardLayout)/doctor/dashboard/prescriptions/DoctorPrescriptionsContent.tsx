"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, FileText, User, Calendar } from "lucide-react";
import { IPrescription, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PageSizeSelector,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

interface DoctorPrescriptionsContentProps {
    prescriptions: IPrescription[];
    meta: IMeta | null;
    currentFilters: {
        page: number;
        limit: number;
    };
}

export function DoctorPrescriptionsContent({
    prescriptions,
    meta,
    currentFilters,
}: DoctorPrescriptionsContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [viewingPrescription, setViewingPrescription] =
        useState<IPrescription | null>(null);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const columns = [
        {
            id: "patient",
            header: "Patient",
            cell: (prescription: IPrescription) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-medium">
                            {prescription.patient?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {prescription.patient?.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "date",
            header: "Date",
            cell: (prescription: IPrescription) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(prescription.createdAt)}</span>
                </div>
            ),
        },
        {
            id: "instructions",
            header: "Instructions",
            cell: (prescription: IPrescription) => (
                <div className="max-w-[300px] truncate text-sm">
                    {prescription.instructions}
                </div>
            ),
        },
        {
            id: "followUp",
            header: "Follow-up",
            cell: (prescription: IPrescription) => (
                <span className="text-sm">
                    {prescription.followUpDate
                        ? formatDate(prescription.followUpDate)
                        : "Not set"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: (prescription: IPrescription) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingPrescription(prescription)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Prescriptions"
                description="View all prescriptions you've written"
            />

            {/* Table */}
            {prescriptions.length === 0 ? (
                <EmptyState
                    title="No prescriptions found"
                    description="You haven't written any prescriptions yet."
                    icon={
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    }
                />
            ) : (
                <>
                    <div className="rounded-lg border">
                        <DataTable data={prescriptions} columns={columns} />
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

            {/* View Prescription Modal */}
            {viewingPrescription && (
                <ViewPrescriptionModal
                    open={!!viewingPrescription}
                    onOpenChange={(open) =>
                        !open && setViewingPrescription(null)
                    }
                    prescription={viewingPrescription}
                />
            )}
        </div>
    );
}

// View Prescription Modal Component
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function ViewPrescriptionModal({
    open,
    onOpenChange,
    prescription,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    prescription: IPrescription;
}) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Prescription Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {prescription.patient?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {prescription.patient?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Prescribed on {formatDate(prescription.createdAt)}
                        </span>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label>Prescription Instructions</Label>
                        <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                            {prescription.instructions}
                        </div>
                    </div>

                    {/* Follow-up Date */}
                    {prescription.followUpDate && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <Label className="text-amber-700">
                                Follow-up Date
                            </Label>
                            <p className="font-medium">
                                {formatDate(prescription.followUpDate)}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
