"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, X, Mail, Phone, MapPin, Calendar, Star, Award, Building } from "lucide-react";
import { IDoctor, ISpecialty, Gender } from "@/types";
import { DashboardHeader } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateDoctor } from "@/services/doctor";
import { toast } from "sonner";

interface DoctorDetailContentProps {
  doctor: IDoctor;
  specialties: ISpecialty[];
}

export function DoctorDetailContent({ doctor, specialties }: DoctorDetailContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: doctor.name,
    contactNumber: doctor.contactNumber,
    address: doctor.address || "",
    experience: doctor.experience,
    gender: doctor.gender,
    appointmentFee: doctor.appointmentFee,
    qualification: doctor.qualification,
    currentWorkingPlace: doctor.currentWorkingPlace,
    designation: doctor.designation,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await updateDoctor(doctor.id, formData);
      if (response.success) {
        toast.success("Doctor updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update doctor");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: doctor.name,
      contactNumber: doctor.contactNumber,
      address: doctor.address || "",
      experience: doctor.experience,
      gender: doctor.gender,
      appointmentFee: doctor.appointmentFee,
      qualification: doctor.qualification,
      currentWorkingPlace: doctor.currentWorkingPlace,
      designation: doctor.designation,
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
              onClick={() => router.push("/admin/dashboard/doctors-management")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span>Doctor Details</span>
          </div>
        }
        description={`Viewing details for ${doctor.name}`}
        actions={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Doctor
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
                {doctor.profilePhoto ? (
                  <img
                    src={doctor.profilePhoto}
                    alt={doctor.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-primary">
                    {doctor.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-muted-foreground">{doctor.designation}</p>
              
              <div className="flex items-center gap-2 mt-3">
                <StatusBadge status={doctor.isDeleted ? "INACTIVE" : "ACTIVE"}>
                  {doctor.isDeleted ? "Deleted" : "Active"}
                </StatusBadge>
              </div>

              <div className="flex items-center gap-1 mt-4">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{doctor.averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">rating</span>
              </div>

              {/* Contact Info */}
              <div className="w-full mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.contactNumber}</span>
                </div>
                {doctor.address && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doctor.address}</span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              <div className="w-full mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.doctorSpecialties?.map((ds) => (
                    <Badge key={ds.specialtyId} variant="secondary">
                      {ds.specialty?.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Basic personal details</CardDescription>
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
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.name}</p>
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
                      <option value="FEMALE">Female</option>
                    </select>
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md capitalize">
                      {doctor.gender.toLowerCase()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  {isEditing ? (
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.contactNumber}</p>
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
                      {doctor.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
              <CardDescription>Medical credentials and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.registrationNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
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
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.experience} years</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  {isEditing ? (
                    <Input
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.qualification}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  {isEditing ? (
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.designation}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentWorkingPlace">Current Working Place</Label>
                  {isEditing ? (
                    <Input
                      id="currentWorkingPlace"
                      name="currentWorkingPlace"
                      value={formData.currentWorkingPlace}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.currentWorkingPlace}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentFee">Appointment Fee ($)</Label>
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
                    <p className="text-sm p-2 bg-muted/50 rounded-md">${doctor.appointmentFee}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>User account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm p-2 bg-muted/50 rounded-md">{doctor.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <p className="text-sm p-2 bg-muted/50 rounded-md truncate">{doctor.userId}</p>
                </div>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <p className="text-sm p-2 bg-muted/50 rounded-md">
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm p-2 bg-muted/50 rounded-md">
                    {new Date(doctor.updatedAt).toLocaleDateString()}
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
