"use client";

import { IAppointment } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AppointmentStatusBadge,
    PaymentStatusBadge,
} from "@/components/ui/badge";
import {
    User,
    Stethoscope,
    Calendar,
    Clock,
    CreditCard,
    FileText,
} from "lucide-react";

interface ViewAppointmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: IAppointment;
}

export function ViewAppointmentModal({
    open,
    onOpenChange,
    appointment,
}: ViewAppointmentModalProps) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            time: date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label>Status:</Label>
                            <AppointmentStatusBadge status={appointment.status}>
                                {appointment.status}
                            </AppointmentStatusBadge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label>Payment:</Label>
                            <PaymentStatusBadge
                                status={appointment.paymentStatus}
                            >
                                {appointment.paymentStatus}
                            </PaymentStatusBadge>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-blue-700">
                            <User className="h-5 w-5" />
                            <h3 className="font-semibold">
                                Patient Information
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Label className="text-muted-foreground">
                                    Name
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Email
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.email || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Contact
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.contactNumber ||
                                        "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Address
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-4 bg-green-50 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-green-700">
                            <Stethoscope className="h-5 w-5" />
                            <h3 className="font-semibold">
                                Doctor Information
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Label className="text-muted-foreground">
                                    Name
                                </Label>
                                <p className="font-medium">
                                    {appointment.doctor?.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Designation
                                </Label>
                                <p className="font-medium">
                                    {appointment.doctor?.designation || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Email
                                </Label>
                                <p className="font-medium">
                                    {appointment.doctor?.email || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Consultation Fee
                                </Label>
                                <p className="font-medium">
                                    $
                                    {appointment.doctor?.appointmentFee ||
                                        "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    {appointment.schedule && (
                        <div className="p-4 bg-purple-50 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-purple-700">
                                <Calendar className="h-5 w-5" />
                                <h3 className="font-semibold">
                                    Schedule Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">
                                        Date
                                    </Label>
                                    <p className="font-medium">
                                        {
                                            formatDateTime(
                                                appointment.schedule
                                                    .startDateTime,
                                            ).date
                                        }
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Time
                                    </Label>
                                    <p className="font-medium">
                                        {
                                            formatDateTime(
                                                appointment.schedule
                                                    .startDateTime,
                                            ).time
                                        }{" "}
                                        -{" "}
                                        {
                                            formatDateTime(
                                                appointment.schedule
                                                    .endDateTime,
                                            ).time
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video Call Link */}
                    {appointment.videoCallingId && (
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <Label className="text-muted-foreground">
                                Video Call ID
                            </Label>
                            <p className="font-medium text-sm break-all">
                                {appointment.videoCallingId}
                            </p>
                        </div>
                    )}

                    {/* Prescription Info */}
                    {appointment.prescription && (
                        <div className="p-4 bg-amber-50 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-amber-700">
                                <FileText className="h-5 w-5" />
                                <h3 className="font-semibold">Prescription</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                {appointment.prescription.instructions && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Instructions
                                        </Label>
                                        <p className="font-medium">
                                            {
                                                appointment.prescription
                                                    .instructions
                                            }
                                        </p>
                                    </div>
                                )}
                                {appointment.prescription.followUpDate && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Follow-up Date
                                        </Label>
                                        <p className="font-medium">
                                            {new Date(
                                                appointment.prescription
                                                    .followUpDate,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="text-xs text-muted-foreground">
                        <p>
                            Created:{" "}
                            {new Date(appointment.createdAt).toLocaleString()}
                        </p>
                        <p>
                            Last Updated:{" "}
                            {new Date(appointment.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
