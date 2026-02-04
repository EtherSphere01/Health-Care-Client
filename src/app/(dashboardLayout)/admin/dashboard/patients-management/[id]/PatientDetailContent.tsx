"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Edit2,
    Save,
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Heart,
    Droplets,
} from "lucide-react";
import { IPatient, Gender, MaritalStatus } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { updatePatient } from "@/services/patient";
import { toast } from "sonner";

interface PatientDetailContentProps {
    patient: IPatient;
}

export function PatientDetailContent({ patient }: PatientDetailContentProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: patient.name,
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
        gender: patient.patientHealthData?.gender || Gender.MALE,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const response = await updatePatient(patient.id, formData);
            if (response.success) {
                toast.success("Patient updated successfully");
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to update patient");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update patient";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: patient.name,
            contactNumber: patient.contactNumber || "",
            address: patient.address || "",
            gender: patient.patientHealthData?.gender || Gender.MALE,
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                router.push(
                                    "/admin/dashboard/patients-management",
                                )
                            }
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <span>Patient Details</span>
                    </div>
                }
                description={`Viewing details for ${patient.name}`}
                actions={
                    isEditing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Patient
                        </Button>
                    )
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                {patient.profilePhoto ? (
                                    <img
                                        src={patient.profilePhoto}
                                        alt={patient.name}
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-semibold text-primary">
                                        {patient.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold">
                                {patient.name}
                            </h2>
                            <p className="text-sm text-muted-foreground capitalize">
                                {patient.patientHealthData?.gender?.toLowerCase() ||
                                    "Not specified"}
                            </p>

                            <div className="flex items-center gap-2 mt-3">
                                <StatusBadge
                                    status={
                                        patient.isDeleted
                                            ? "INACTIVE"
                                            : "ACTIVE"
                                    }
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-6 space-y-3 text-left">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate">
                                        {patient.email}
                                    </span>
                                </div>
                                {patient.contactNumber && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {patient.contactNumber}
                                        </span>
                                    </div>
                                )}
                                {patient.address && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {patient.address}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Basic personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    {isEditing ? (
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    {isEditing ? (
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">
                                                Female
                                            </option>
                                        </select>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md capitalize">
                                            {patient.patientHealthData?.gender?.toLowerCase() ||
                                                "Not specified"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">
                                        Contact Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="contactNumber"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.contactNumber ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    {isEditing ? (
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.address || "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Information */}
                    {patient.patientHealthData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Health Information
                                </CardTitle>
                                <CardDescription>
                                    Medical health data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Blood Group</Label>
                                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                            <Droplets className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">
                                                {patient.patientHealthData
                                                    .bloodGroup ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Marital Status</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md capitalize">
                                            {patient.patientHealthData.maritalStatus?.toLowerCase() ||
                                                "Not specified"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Height</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData.height ||
                                                "Not specified"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weight</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData.weight ||
                                                "Not specified"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Has Allergies</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData
                                                .hasAllergies
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Has Diabetes</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData
                                                .hasDiabetes
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Smoking Status</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData
                                                .smokingStatus
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Diet Preference</Label>
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient.patientHealthData
                                                .dietaryPreferences ||
                                                "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                User account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {patient.email}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Patient ID</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md truncate">
                                        {patient.id}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Created At</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {new Date(
                                            patient.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Updated</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {new Date(
                                            patient.updatedAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
