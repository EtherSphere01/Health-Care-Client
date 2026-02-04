"use client";

import { useState } from "react";
import {
    FileText,
    Stethoscope,
    Calendar,
    Eye,
    Printer,
    Download,
} from "lucide-react";
import { IPrescription, IMeta } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PatientPrescriptionsContentProps {
    prescriptions: IPrescription[];
    meta?: IMeta;
}

export function PatientPrescriptionsContent({
    prescriptions,
    meta,
}: PatientPrescriptionsContentProps) {
    const [selectedPrescription, setSelectedPrescription] =
        useState<IPrescription | null>(null);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Prescriptions"
                description="View all your prescriptions"
            />

            {/* Prescriptions List */}
            {prescriptions.length === 0 ? (
                <EmptyState
                    icon={<FileText className="h-12 w-12" />}
                    title="No prescriptions found"
                    description="You don't have any prescriptions yet. They will appear here after your doctor appointments."
                />
            ) : (
                <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                        <Card key={prescription.id}>
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                            {prescription.doctor
                                                ?.profilePhoto ? (
                                                <img
                                                    src={
                                                        prescription.doctor
                                                            .profilePhoto
                                                    }
                                                    alt={
                                                        prescription.doctor.name
                                                    }
                                                    className="h-14 w-14 object-cover"
                                                />
                                            ) : (
                                                <Stethoscope className="h-7 w-7 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Dr.{" "}
                                                {prescription.doctor?.name ||
                                                    "Unknown"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    prescription.doctor
                                                        ?.designation
                                                }
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {formatDate(
                                                        prescription.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prescription Summary */}
                                    <div className="flex flex-col md:items-end gap-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                Medications:{" "}
                                            </span>
                                            <span className="font-medium">
                                                {prescription.instructions
                                                    ?.length || 0}
                                            </span>
                                        </div>
                                        {prescription.followUpDate && (
                                            <div className="text-sm text-blue-600">
                                                Follow-up:{" "}
                                                {formatDate(
                                                    prescription.followUpDate,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setSelectedPrescription(
                                                prescription,
                                            )
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.print()}
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Prescription Modal */}
            <ViewPrescriptionModal
                prescription={selectedPrescription}
                open={!!selectedPrescription}
                onClose={() => setSelectedPrescription(null)}
            />
        </div>
    );
}

// View Prescription Details Modal
function ViewPrescriptionModal({
    prescription,
    open,
    onClose,
}: {
    prescription: IPrescription | null;
    open: boolean;
    onClose: () => void;
}) {
    if (!prescription) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Prescription Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {prescription.doctor?.profilePhoto ? (
                                <img
                                    src={prescription.doctor.profilePhoto}
                                    alt={prescription.doctor.name}
                                    className="h-14 w-14 object-cover"
                                />
                            ) : (
                                <Stethoscope className="h-7 w-7 text-primary" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                Dr. {prescription.doctor?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {prescription.doctor?.designation}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {prescription.doctor?.qualification}
                            </p>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">
                                Prescribed On
                            </Label>
                            <p className="font-medium">
                                {formatDate(prescription.createdAt)}
                            </p>
                        </div>
                        {prescription.followUpDate && (
                            <div>
                                <Label className="text-muted-foreground">
                                    Follow-up Date
                                </Label>
                                <p className="font-medium text-blue-600">
                                    {formatDate(prescription.followUpDate)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    {prescription.instructions && (
                        <div>
                            <Label className="text-muted-foreground mb-2 block">
                                Medications & Instructions
                            </Label>
                            <div className="bg-muted/30 rounded-lg p-4">
                                <p className="whitespace-pre-line text-sm">
                                    {prescription.instructions}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
