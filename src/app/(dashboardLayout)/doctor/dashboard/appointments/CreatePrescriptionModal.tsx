"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IAppointment } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPrescription } from "@/services/prescription";
import { toast } from "sonner";

interface CreatePrescriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: IAppointment;
}

export function CreatePrescriptionModal({
    open,
    onOpenChange,
    appointment,
}: CreatePrescriptionModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        instructions: "",
        followUpDate: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.instructions.trim()) {
            toast.error("Please enter prescription instructions");
            return;
        }

        setIsSubmitting(true);

        try {
            const prescriptionData = {
                appointmentId: appointment.id,
                instructions: formData.instructions,
                ...(formData.followUpDate && {
                    followUpDate: new Date(formData.followUpDate).toISOString(),
                }),
            };

            const response = await createPrescription(prescriptionData);

            if (response.success) {
                toast.success("Prescription created successfully");
                onOpenChange(false);
                resetForm();
                router.refresh();
            } else {
                toast.error(
                    response.message || "Failed to create prescription",
                );
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create prescription");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            instructions: "",
            followUpDate: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Prescription</DialogTitle>
                    <DialogDescription>
                        Write a prescription for{" "}
                        {appointment.patient?.name || "the patient"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Info */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Label className="text-xs text-muted-foreground">
                                    Patient
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">
                                    Email
                                </Label>
                                <p className="font-medium">
                                    {appointment.patient?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions">
                            Prescription Instructions *
                        </Label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter medication details, dosage, timing, and any special instructions..."
                        />
                    </div>

                    {/* Follow Up Date */}
                    <div className="space-y-2">
                        <Label htmlFor="followUpDate">
                            Follow-up Date (optional)
                        </Label>
                        <Input
                            id="followUpDate"
                            name="followUpDate"
                            type="date"
                            value={formData.followUpDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Creating..."
                                : "Create Prescription"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
