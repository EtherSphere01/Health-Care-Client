"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ISpecialty, Gender } from "@/types";
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
import { createDoctor } from "@/services/user";
import { toast } from "sonner";

interface CreateDoctorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    specialties: ISpecialty[];
}

export function CreateDoctorModal({
    open,
    onOpenChange,
    specialties,
}: CreateDoctorModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        contactNumber: "",
        address: "",
        registrationNumber: "",
        experience: 0,
        gender: "MALE" as Gender,
        appointmentFee: 0,
        qualification: "",
        currentWorkingPlace: "",
        designation: "",
        specialties: [] as string[],
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSpecialtyChange = (specialtyId: string) => {
        setFormData((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter((id) => id !== specialtyId)
                : [...prev.specialties, specialtyId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const doctorData = {
                password: formData.password,
                doctor: {
                    email: formData.email,
                    name: formData.name,
                    contactNumber: formData.contactNumber,
                    address: formData.address,
                    registrationNumber: formData.registrationNumber,
                    experience: formData.experience,
                    gender: formData.gender,
                    appointmentFee: formData.appointmentFee,
                    qualification: formData.qualification,
                    currentWorkingPlace: formData.currentWorkingPlace,
                    designation: formData.designation,
                },
            };

            const response = await createDoctor(doctorData);

            if (response.success) {
                toast.success("Doctor created successfully");
                onOpenChange(false);
                resetForm();
                router.refresh();
            } else {
                toast.error(response.message || "Failed to create doctor");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to create doctor";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: "",
            password: "",
            name: "",
            contactNumber: "",
            address: "",
            registrationNumber: "",
            experience: 0,
            gender: Gender.MALE,
            appointmentFee: 0,
            qualification: "",
            currentWorkingPlace: "",
            designation: "",
            specialties: [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                    <DialogDescription>
                        Create a new doctor account. Fill in all the required
                        information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="doctor@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Dr. John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">
                                    Contact Number *
                                </Label>
                                <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1234567890"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Medical Center Dr"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">
                                    Registration Number *
                                </Label>
                                <Input
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="REG-12345"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">
                                    Experience (years) *
                                </Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="qualification">
                                    Qualification *
                                </Label>
                                <Input
                                    id="qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    required
                                    placeholder="MBBS, MD"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="designation">
                                    Designation *
                                </Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                    placeholder="Senior Consultant"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentWorkingPlace">
                                    Current Working Place *
                                </Label>
                                <Input
                                    id="currentWorkingPlace"
                                    name="currentWorkingPlace"
                                    value={formData.currentWorkingPlace}
                                    onChange={handleChange}
                                    required
                                    placeholder="City Hospital"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appointmentFee">
                                    Appointment Fee ($) *
                                </Label>
                                <Input
                                    id="appointmentFee"
                                    name="appointmentFee"
                                    type="number"
                                    min="0"
                                    value={formData.appointmentFee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty) => (
                                <label
                                    key={specialty.id}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                                        formData.specialties.includes(
                                            specialty.id,
                                        )
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.specialties.includes(
                                            specialty.id,
                                        )}
                                        onChange={() =>
                                            handleSpecialtyChange(specialty.id)
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-sm">
                                        {specialty.title}
                                    </span>
                                </label>
                            ))}
                        </div>
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
                            {isSubmitting ? "Creating..." : "Create Doctor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
