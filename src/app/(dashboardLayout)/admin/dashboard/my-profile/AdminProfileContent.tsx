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
    Shield,
    Calendar,
    Lock,
} from "lucide-react";
import { IUser } from "@/types";
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
import { RoleBadge, StatusBadge } from "@/components/ui/badge";
import { updateMyProfile } from "@/services/user";
import { changePassword } from "@/services/auth";
import { toast } from "sonner";

interface AdminProfileContentProps {
    user: IUser;
}

export function AdminProfileContent({ user }: AdminProfileContentProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const admin = user.admin;

    const [formData, setFormData] = useState({
        name: admin?.name || "",
        contactNumber: admin?.contactNumber || "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        admin?.profilePhoto || null,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            const response = await updateMyProfile(
                formData,
                profileImage || undefined,
            );
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
            name: admin?.name || "",
            contactNumber: admin?.contactNumber || "",
        });
        setProfileImage(null);
        setImagePreview(admin?.profilePhoto || null);
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
                description="Manage your account information"
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
                                            alt={admin?.name || "Profile"}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-semibold text-primary">
                                            {admin?.name?.charAt(0) || "A"}
                                        </span>
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
                                {admin?.name || "Admin"}
                            </h2>

                            <div className="flex items-center gap-2 mt-2">
                                <RoleBadge role={user.role} />
                                <StatusBadge status={user.status} />
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-6 space-y-3 text-left">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate">
                                        {user.email}
                                    </span>
                                </div>
                                {admin?.contactNumber && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {admin.contactNumber}
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
                                            {admin?.name || "N/A"}
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
                                            {admin?.contactNumber ||
                                                "Not provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                Your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {user.role}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {user.status}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Member Since</Label>
                                    <p className="text-sm p-2 bg-muted/50 rounded-md">
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
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
