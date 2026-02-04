"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Clock,
    Stethoscope,
    Eye,
    Star,
    CreditCard,
} from "lucide-react";
import { IAppointment, IMeta, AppointmentStatus, PaymentStatus } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
    AppointmentStatusBadge,
    PaymentStatusBadge,
} from "@/components/ui/badge";
import { FilterSelect } from "@/components/ui/search";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createReview } from "@/services/review";
import { toast } from "sonner";

interface PatientAppointmentsContentProps {
    appointments: IAppointment[];
    meta?: IMeta;
}

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: AppointmentStatus.SCHEDULED, label: "Scheduled" },
    { value: AppointmentStatus.INPROGRESS, label: "In Progress" },
    { value: AppointmentStatus.COMPLETED, label: "Completed" },
    { value: AppointmentStatus.CANCELED, label: "Canceled" },
];

export function PatientAppointmentsContent({
    appointments,
    meta,
}: PatientAppointmentsContentProps) {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedAppointment, setSelectedAppointment] =
        useState<IAppointment | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAppointment, setReviewAppointment] =
        useState<IAppointment | null>(null);

    const formatDate = (date: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateTimeString: string) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const filteredAppointments = appointments.filter((appointment) => {
        if (statusFilter && appointment.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Appointments"
                description="View and manage your appointments"
                actions={
                    <Link href="/consultation">
                        <Button>
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Book Appointment
                        </Button>
                    </Link>
                }
            />

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <FilterSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            className="w-48"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <EmptyState
                    icon={<Calendar className="h-12 w-12" />}
                    title="No appointments found"
                    description={
                        statusFilter
                            ? "No appointments match your filter criteria."
                            : "You haven't booked any appointments yet."
                    }
                    action={{
                        label: "Book Your First Appointment",
                        onClick: () => router.push("/consultation"),
                    }}
                />
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                            {appointment.doctor
                                                ?.profilePhoto ? (
                                                <img
                                                    src={
                                                        appointment.doctor
                                                            .profilePhoto
                                                    }
                                                    alt={
                                                        appointment.doctor.name
                                                    }
                                                    className="h-16 w-16 object-cover"
                                                />
                                            ) : (
                                                <Stethoscope className="h-8 w-8 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                Dr.{" "}
                                                {appointment.doctor?.name ||
                                                    "Unknown"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    appointment.doctor
                                                        ?.designation
                                                }
                                            </p>
                                            {appointment.doctor
                                                ?.doctorSpecialties && (
                                                <p className="text-xs text-muted-foreground">
                                                    {appointment.doctor.doctorSpecialties
                                                        .map(
                                                            (ds) =>
                                                                ds.specialty
                                                                    ?.title,
                                                        )
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedule Info */}
                                    <div className="flex flex-col md:items-end gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {formatDate(
                                                    appointment.schedule
                                                        ?.startDateTime || "",
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {formatTime(
                                                    appointment.schedule
                                                        ?.startDateTime || "",
                                                )}{" "}
                                                -{" "}
                                                {formatTime(
                                                    appointment.schedule
                                                        ?.endDateTime || "",
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AppointmentStatusBadge
                                                status={appointment.status}
                                            />
                                            <PaymentStatusBadge
                                                status={
                                                    appointment.paymentStatus
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Video Call Link */}
                                {appointment.videoCallingId &&
                                    appointment.status ===
                                        AppointmentStatus.SCHEDULED && (
                                        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                                            <p className="text-sm font-medium text-blue-700">
                                                Video Call ID:{" "}
                                                {appointment.videoCallingId}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Join using this ID at your
                                                scheduled appointment time
                                            </p>
                                        </div>
                                    )}

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setSelectedAppointment(appointment)
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                    {appointment.status ===
                                        AppointmentStatus.COMPLETED &&
                                        !appointment.review && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setReviewAppointment(
                                                        appointment,
                                                    );
                                                    setShowReviewModal(true);
                                                }}
                                            >
                                                <Star className="h-4 w-4 mr-2" />
                                                Write Review
                                            </Button>
                                        )}
                                    {appointment.paymentStatus ===
                                        PaymentStatus.UNPAID && (
                                        <Button variant="default" size="sm">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Pay Now
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            <ViewAppointmentModal
                appointment={selectedAppointment}
                open={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
            />

            {/* Review Modal */}
            <WriteReviewModal
                appointment={reviewAppointment}
                open={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false);
                    setReviewAppointment(null);
                }}
                onSuccess={() => {
                    setShowReviewModal(false);
                    setReviewAppointment(null);
                    router.refresh();
                }}
            />
        </div>
    );
}

// View Appointment Details Modal
function ViewAppointmentModal({
    appointment,
    open,
    onClose,
}: {
    appointment: IAppointment | null;
    open: boolean;
    onClose: () => void;
}) {
    if (!appointment) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {appointment.doctor?.profilePhoto ? (
                                <img
                                    src={appointment.doctor.profilePhoto}
                                    alt={appointment.doctor.name}
                                    className="h-16 w-16 object-cover"
                                />
                            ) : (
                                <Stethoscope className="h-8 w-8 text-primary" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                Dr. {appointment.doctor?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.designation}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.qualification}
                            </p>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">
                                Date
                            </Label>
                            <p className="font-medium">
                                {formatDate(
                                    appointment.schedule?.startDateTime || "",
                                )}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Time
                            </Label>
                            <p className="font-medium">
                                {formatTime(
                                    appointment.schedule?.startDateTime || "",
                                )}{" "}
                                -{" "}
                                {formatTime(
                                    appointment.schedule?.endDateTime || "",
                                )}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Status
                            </Label>
                            <div className="mt-1">
                                <AppointmentStatusBadge
                                    status={appointment.status}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">
                                Payment
                            </Label>
                            <div className="mt-1">
                                <PaymentStatusBadge
                                    status={appointment.paymentStatus}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Video Call Info */}
                    {appointment.videoCallingId && (
                        <div>
                            <Label className="text-muted-foreground">
                                Video Call ID
                            </Label>
                            <p className="font-mono bg-muted p-2 rounded mt-1">
                                {appointment.videoCallingId}
                            </p>
                        </div>
                    )}

                    {/* Prescription */}
                    {appointment.prescription && (
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Prescription</h4>
                            {appointment.prescription.instructions && (
                                <div className="text-sm">
                                    <p className="text-muted-foreground mb-1">
                                        Instructions:
                                    </p>
                                    <p className="whitespace-pre-line">
                                        {appointment.prescription.instructions}
                                    </p>
                                </div>
                            )}
                            {appointment.prescription.followUpDate && (
                                <p className="text-sm mt-2 text-blue-600">
                                    Follow-up:{" "}
                                    {formatDate(
                                        appointment.prescription.followUpDate,
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Write Review Modal
function WriteReviewModal({
    appointment,
    open,
    onClose,
    onSuccess,
}: {
    appointment: IAppointment | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!appointment) return null;

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createReview({
                appointmentId: appointment.id,
                rating,
                comment,
            });

            if (response.success) {
                toast.success("Review submitted successfully");
                onSuccess();
            } else {
                toast.error(response.message || "Failed to submit review");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to submit review";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {appointment.doctor?.profilePhoto ? (
                                <img
                                    src={appointment.doctor.profilePhoto}
                                    alt={appointment.doctor.name}
                                    className="h-12 w-12 object-cover"
                                />
                            ) : (
                                <Stethoscope className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium">
                                Dr. {appointment.doctor?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.designation}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= rating
                                                ? "text-amber-500 fill-amber-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment</Label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
