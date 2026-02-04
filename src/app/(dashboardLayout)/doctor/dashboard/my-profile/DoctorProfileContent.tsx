"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Edit2,
    Save,
    X,
    Upload,
    Mail,
    Phone,
    MapPin,
    Lock,
    Star,
    Award,
    Building,
    Stethoscope,
} from "lucide-react";
import { IUser, ISpecialty, Gender } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge, RoleBadge, StatusBadge } from "@/components/ui/badge";
import { updateMyProfile } from "@/services/user";
import { changePassword } from "@/services/auth";
import { toast } from "sonner";

interface DoctorProfileContentProps {
    user: IUser;
    specialties: ISpecialty[];
}

export function DoctorProfileContent({
    user,
    specialties,
}: DoctorProfileContentProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const doctor = user.doctor;

    const [formData, setFormData] = useState({
        name: doctor?.name || "",
        contactNumber: doctor?.contactNumber || "",
        address: doctor?.address || "",
        experience: doctor?.experience || 0,
        appointmentFee: doctor?.appointmentFee || 0,
        qualification: doctor?.qualification || "",
        currentWorkingPlace: doctor?.currentWorkingPlace || "",
        designation: doctor?.designation || "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        doctor?.profilePhoto || null,
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("data", JSON.stringify(formData));
            if (profileImage) {
                formDataToSend.append("file", profileImage);
            }

            const response = await updateMyProfile(formDataToSend);
            if (response.success) {
                toast.success("Profile updated successfully");
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: doctor?.name || "",
            contactNumber: doctor?.contactNumber || "",
            address: doctor?.address || "",
            experience: doctor?.experience || 0,
            appointmentFee: doctor?.appointmentFee || 0,
            qualification: doctor?.qualification || "",
            currentWorkingPlace: doctor?.currentWorkingPlace || "",
            designation: doctor?.designation || "",
        });
        setProfileImage(null);
        setImagePreview(doctor?.profilePhoto || null);
        setIsEditing(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.success) {
                toast.success("Password changed successfully");
                setShowPasswordForm(false);
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(response.message || "Failed to change password");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Profile"
                description="Manage your account and professional information"
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
                            Edit Profile
                        </Button>
                    )
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={doctor?.name || "Profile"}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Stethoscope className="h-10 w-10 text-primary" />
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold mt-4">
                                {doctor?.name || "Doctor"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {doctor?.designation}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                <RoleBadge role={user.role} />
                                <StatusBadge status={user.status} />
                            </div>

                            <div className="flex items-center gap-1 mt-4">
                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                <span className="font-semibold">
                                    {doctor?.averageRating?.toFixed(1) || "0.0"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    rating
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-6 space-y-3 text-left">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate">
                                        {doctor?.email || user.email}
                                    </span>
                                </div>
                                {doctor?.contactNumber && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {doctor.contactNumber}
                                        </span>
                                    </div>
                                )}
                                {doctor?.address && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {doctor.address}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Specialties */}
                            {doctor?.doctorSpecialties &&
                                doctor.doctorSpecialties.length > 0 && (
                                    <div className="w-full mt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                            Specialties
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.doctorSpecialties.map(
                                                (ds) => (
                                                    <Badge
                                                        key={ds.specialtyId}
                                                        variant="secondary"
                                                    >
                                                        {ds.specialty?.title ||
                                                            "Unknown"}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                Your personal details
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
                                            {doctor?.name || "N/A"}
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
                                            {doctor?.contactNumber ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 col-span-2">
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
                                            {doctor?.address || "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Professional Information
                            </CardTitle>
                            <CardDescription>
                                Your medical credentials and experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Registration Number</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {doctor?.registrationNumber || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">
                                        Experience (years)
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="experience"
                                            name="experience"
                                            type="number"
                                            min="0"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {doctor?.experience || 0} years
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">
                                        Qualification
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="qualification"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {doctor?.qualification || "N/A"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">
                                        Designation
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="designation"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {doctor?.designation || "N/A"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentWorkingPlace">
                                        Current Working Place
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="currentWorkingPlace"
                                            name="currentWorkingPlace"
                                            value={formData.currentWorkingPlace}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {doctor?.currentWorkingPlace ||
                                                "N/A"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="appointmentFee">
                                        Appointment Fee ($)
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="appointmentFee"
                                            name="appointmentFee"
                                            type="number"
                                            min="0"
                                            value={formData.appointmentFee}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            ${doctor?.appointmentFee || 0}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Security
                            </CardTitle>
                            <CardDescription>
                                Manage your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {showPasswordForm ? (
                                <form
                                    onSubmit={handleChangePassword}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="oldPassword">
                                            Current Password
                                        </Label>
                                        <Input
                                            id="oldPassword"
                                            name="oldPassword"
                                            type="password"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">
                                            New Password
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Confirm New Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setPasswordData({
                                                    oldPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: "",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isChangingPassword}
                                        >
                                            {isChangingPassword
                                                ? "Changing..."
                                                : "Change Password"}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    Change Password
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
