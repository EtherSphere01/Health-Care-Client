"use client";

import { useEffect, useState, useRef } from "react";
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
    User,
    Heart,
} from "lucide-react";
import {
    IUser,
    Gender,
    MaritalStatus,
    BloodGroup,
    IUpdateProfileRequest,
} from "@/types";
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
import { updateMyProfileWithProgress } from "@/services/user/client";
import { changePassword } from "@/services/auth";
import { toast } from "sonner";

interface PatientProfileContentProps {
    user: IUser;
}

export function PatientProfileContent({ user }: PatientProfileContentProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentUser, setCurrentUser] = useState<IUser>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const patient = currentUser.patient;

    const inputLikeClassName =
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

    const buildFormStateFromUser = (u: IUser) => {
        const p = u.patient;
        return {
            name: p?.name || "",
            contactNumber: p?.contactNumber || "",
            address: p?.address || "",
            patientHealthData: {
                gender: p?.patientHealthData?.gender,
                dateOfBirth: p?.patientHealthData?.dateOfBirth || "",
                bloodGroup: p?.patientHealthData?.bloodGroup,
                maritalStatus: p?.patientHealthData?.maritalStatus,
                height: p?.patientHealthData?.height || "",
                weight: p?.patientHealthData?.weight || "",
                smokingStatus: Boolean(p?.patientHealthData?.smokingStatus),
                hasAllergies: Boolean(p?.patientHealthData?.hasAllergies),
                hasDiabetes: Boolean(p?.patientHealthData?.hasDiabetes),
                hasPastSurgeries: Boolean(
                    p?.patientHealthData?.hasPastSurgeries,
                ),
                dietaryPreferences:
                    p?.patientHealthData?.dietaryPreferences || "",
            },
        };
    };

    const [formData, setFormData] = useState(() =>
        buildFormStateFromUser(user),
    );

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        patient?.profilePhoto || null,
    );

    useEffect(() => {
        setCurrentUser(user);
        if (!isEditing) {
            setFormData(buildFormStateFromUser(user));
            setImagePreview(user.patient?.profilePhoto || null);
            setProfileImage(null);
            setUploadError(null);
            setUploadProgress(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const buildUpdatePayload = (): IUpdateProfileRequest => {
        const baseline = currentUser.patient;
        const payload: IUpdateProfileRequest = {};

        if ((baseline?.name || "") !== formData.name)
            payload.name = formData.name;
        if ((baseline?.contactNumber || "") !== formData.contactNumber)
            payload.contactNumber = formData.contactNumber;
        if ((baseline?.address || "") !== formData.address)
            payload.address = formData.address;

        const baselineHealth = baseline?.patientHealthData;
        const changedHealth: NonNullable<
            IUpdateProfileRequest["patientHealthData"]
        > = {};

        const bool = (v: unknown) => Boolean(v);
        const str = (v: unknown) => (typeof v === "string" ? v : "");

        if (baselineHealth?.gender !== formData.patientHealthData.gender)
            changedHealth.gender = formData.patientHealthData.gender;
        if (
            str(baselineHealth?.dateOfBirth) !==
            formData.patientHealthData.dateOfBirth
        )
            changedHealth.dateOfBirth = formData.patientHealthData.dateOfBirth;
        if (
            baselineHealth?.bloodGroup !== formData.patientHealthData.bloodGroup
        )
            changedHealth.bloodGroup = formData.patientHealthData.bloodGroup;
        if (
            baselineHealth?.maritalStatus !==
            formData.patientHealthData.maritalStatus
        )
            changedHealth.maritalStatus =
                formData.patientHealthData.maritalStatus;
        if (str(baselineHealth?.height) !== formData.patientHealthData.height)
            changedHealth.height = formData.patientHealthData.height;
        if (str(baselineHealth?.weight) !== formData.patientHealthData.weight)
            changedHealth.weight = formData.patientHealthData.weight;
        if (
            bool(baselineHealth?.smokingStatus) !==
            formData.patientHealthData.smokingStatus
        )
            changedHealth.smokingStatus =
                formData.patientHealthData.smokingStatus;
        if (
            bool(baselineHealth?.hasAllergies) !==
            formData.patientHealthData.hasAllergies
        )
            changedHealth.hasAllergies =
                formData.patientHealthData.hasAllergies;
        if (
            bool(baselineHealth?.hasDiabetes) !==
            formData.patientHealthData.hasDiabetes
        )
            changedHealth.hasDiabetes = formData.patientHealthData.hasDiabetes;
        if (
            bool(baselineHealth?.hasPastSurgeries) !==
            formData.patientHealthData.hasPastSurgeries
        )
            changedHealth.hasPastSurgeries =
                formData.patientHealthData.hasPastSurgeries;
        if (
            str(baselineHealth?.dietaryPreferences) !==
            formData.patientHealthData.dietaryPreferences
        )
            changedHealth.dietaryPreferences =
                formData.patientHealthData.dietaryPreferences;

        if (Object.keys(changedHealth).length > 0) {
            payload.patientHealthData = changedHealth;
        }

        return payload;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        const checked =
            e.target instanceof HTMLInputElement && e.target.type === "checkbox"
                ? e.target.checked
                : undefined;

        if (name.startsWith("patientHealthData.")) {
            const key = name.replace("patientHealthData.", "");
            setFormData((prev) => ({
                ...prev,
                patientHealthData: {
                    ...prev.patientHealthData,
                    [key]: checked ?? value,
                },
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, or WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            toast.error("Image size must be under 2MB.");
            e.target.value = "";
            return;
        }

        setUploadError(null);
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        const payload = buildUpdatePayload();

        const hasAnyChange =
            Object.keys(payload).length > 0 || Boolean(profileImage);

        if (!hasAnyChange) {
            toast.message("No changes to save");
            setIsEditing(false);
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        try {
            const response = await updateMyProfileWithProgress(
                payload,
                profileImage || undefined,
                setUploadProgress,
            );
            if (response.success) {
                toast.success("Profile updated successfully");
                if (response.data) {
                    setCurrentUser(response.data);

                    const nextPatient = response.data.patient;
                    if (nextPatient) {
                        setFormData(buildFormStateFromUser(response.data));
                        setImagePreview(nextPatient?.profilePhoto || null);
                    }
                }
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update profile";
            setUploadError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: patient?.name || "",
            contactNumber: patient?.contactNumber || "",
            address: patient?.address || "",
            patientHealthData: {
                gender: patient?.patientHealthData?.gender,
                dateOfBirth: patient?.patientHealthData?.dateOfBirth || "",
                bloodGroup: patient?.patientHealthData?.bloodGroup,
                maritalStatus: patient?.patientHealthData?.maritalStatus,
                height: patient?.patientHealthData?.height || "",
                weight: patient?.patientHealthData?.weight || "",
                smokingStatus: Boolean(
                    patient?.patientHealthData?.smokingStatus,
                ),
                hasAllergies: Boolean(patient?.patientHealthData?.hasAllergies),
                hasDiabetes: Boolean(patient?.patientHealthData?.hasDiabetes),
                hasPastSurgeries: Boolean(
                    patient?.patientHealthData?.hasPastSurgeries,
                ),
                dietaryPreferences:
                    patient?.patientHealthData?.dietaryPreferences || "",
            },
        });
        setProfileImage(null);
        setImagePreview(patient?.profilePhoto || null);
        setUploadProgress(0);
        setUploadError(null);
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
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to change password";
            toast.error(message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const formatDate = (date: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="My Profile"
                description="Manage your personal and health information"
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
                                            alt={patient?.name || "Profile"}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 text-primary" />
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
                            {isSubmitting && uploadProgress > 0 && (
                                <div className="mt-3 w-full">
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Uploading: {uploadProgress}%
                                    </p>
                                </div>
                            )}
                            {uploadError && (
                                <p className="mt-3 text-xs text-destructive">
                                    {uploadError}
                                </p>
                            )}
                            <h2 className="text-xl font-semibold mt-4">
                                {patient?.name || "Patient"}
                            </h2>

                            <div className="flex items-center gap-2 mt-2">
                                <RoleBadge role={currentUser.role} />
                                <StatusBadge status={currentUser.status} />
                            </div>

                            {/* Contact Info */}
                            <div className="w-full mt-6 space-y-3 text-left">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate">
                                        {patient?.email || currentUser.email}
                                    </span>
                                </div>
                                {patient?.contactNumber && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {patient.contactNumber}
                                        </span>
                                    </div>
                                )}
                                {patient?.address && (
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
                                Your basic personal details
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
                                            {patient?.name || "N/A"}
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
                                            {patient?.contactNumber ||
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
                                            {patient?.address || "Not provided"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    {isEditing ? (
                                        <select
                                            name="patientHealthData.gender"
                                            value={
                                                formData.patientHealthData
                                                    .gender ?? ""
                                            }
                                            onChange={handleChange}
                                            className={inputLikeClassName}
                                        >
                                            <option value="">
                                                Not specified
                                            </option>
                                            {Object.values(Gender).map((g) => (
                                                <option key={g} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.gender || "Not specified"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Health Information
                            </CardTitle>
                            <CardDescription>
                                Your medical profile details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Blood Group</Label>
                                    {isEditing ? (
                                        <select
                                            name="patientHealthData.bloodGroup"
                                            value={
                                                formData.patientHealthData
                                                    .bloodGroup ?? ""
                                            }
                                            onChange={handleChange}
                                            className={inputLikeClassName}
                                        >
                                            <option value="">
                                                Not specified
                                            </option>
                                            {Object.values(BloodGroup).map(
                                                (bg) => (
                                                    <option key={bg} value={bg}>
                                                        {bg}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.bloodGroup || "Not specified"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Marital Status</Label>
                                    {isEditing ? (
                                        <select
                                            name="patientHealthData.maritalStatus"
                                            value={
                                                formData.patientHealthData
                                                    .maritalStatus ?? ""
                                            }
                                            onChange={handleChange}
                                            className={inputLikeClassName}
                                        >
                                            <option value="">
                                                Not specified
                                            </option>
                                            {Object.values(MaritalStatus).map(
                                                (ms) => (
                                                    <option key={ms} value={ms}>
                                                        {ms}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.maritalStatus ||
                                                "Not specified"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            name="patientHealthData.dateOfBirth"
                                            value={
                                                formData.patientHealthData
                                                    .dateOfBirth
                                            }
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {formatDate(
                                                patient?.patientHealthData
                                                    ?.dateOfBirth || "",
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Height</Label>
                                    {isEditing ? (
                                        <Input
                                            name="patientHealthData.height"
                                            value={
                                                formData.patientHealthData
                                                    .height
                                            }
                                            onChange={handleChange}
                                            placeholder="cm"
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.height || "N/A"}{" "}
                                            cm
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Weight</Label>
                                    {isEditing ? (
                                        <Input
                                            name="patientHealthData.weight"
                                            value={
                                                formData.patientHealthData
                                                    .weight
                                            }
                                            onChange={handleChange}
                                            placeholder="kg"
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.weight || "N/A"}{" "}
                                            kg
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Smoker</Label>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-transparent">
                                            <input
                                                type="checkbox"
                                                name="patientHealthData.smokingStatus"
                                                checked={Boolean(
                                                    formData.patientHealthData
                                                        .smokingStatus,
                                                )}
                                                onChange={handleChange}
                                            />
                                            <span className="text-sm">
                                                Smoker
                                            </span>
                                        </label>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.smokingStatus
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Allergies</Label>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-transparent">
                                            <input
                                                type="checkbox"
                                                name="patientHealthData.hasAllergies"
                                                checked={Boolean(
                                                    formData.patientHealthData
                                                        .hasAllergies,
                                                )}
                                                onChange={handleChange}
                                            />
                                            <span className="text-sm">
                                                Has allergies
                                            </span>
                                        </label>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.hasAllergies
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Diabetes</Label>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-transparent">
                                            <input
                                                type="checkbox"
                                                name="patientHealthData.hasDiabetes"
                                                checked={Boolean(
                                                    formData.patientHealthData
                                                        .hasDiabetes,
                                                )}
                                                onChange={handleChange}
                                            />
                                            <span className="text-sm">
                                                Has diabetes
                                            </span>
                                        </label>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.hasDiabetes
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Past Surgeries</Label>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-transparent">
                                            <input
                                                type="checkbox"
                                                name="patientHealthData.hasPastSurgeries"
                                                checked={Boolean(
                                                    formData.patientHealthData
                                                        .hasPastSurgeries,
                                                )}
                                                onChange={handleChange}
                                            />
                                            <span className="text-sm">
                                                Past surgeries
                                            </span>
                                        </label>
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {patient?.patientHealthData
                                                ?.hasPastSurgeries
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {isEditing ||
                            patient?.patientHealthData?.dietaryPreferences ? (
                                <div className="space-y-2">
                                    <Label>Dietary Preferences</Label>
                                    {isEditing ? (
                                        <Input
                                            name="patientHealthData.dietaryPreferences"
                                            value={
                                                formData.patientHealthData
                                                    .dietaryPreferences
                                            }
                                            onChange={handleChange}
                                            placeholder="Optional"
                                        />
                                    ) : (
                                        <p className="text-sm p-2 bg-muted/50 rounded-md">
                                            {
                                                patient?.patientHealthData
                                                    ?.dietaryPreferences
                                            }
                                        </p>
                                    )}
                                </div>
                            ) : null}
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
