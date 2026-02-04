"use client";

import { IAppointment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Droplets, Heart, Calendar } from "lucide-react";

interface ViewPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: IAppointment;
}

export function ViewPatientModal({ open, onOpenChange, appointment }: ViewPatientModalProps) {
  const patient = appointment.patient;
  const healthData = patient?.patientHealthData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{patient?.name || "N/A"}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {patient?.gender?.toLowerCase() || "Not specified"}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-medium">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{patient?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium">{patient?.contactNumber || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <p className="text-sm font-medium">{patient?.address || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Data */}
          {healthData && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Health Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Blood Group</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium">{healthData.bloodGroup || "Not specified"}</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Marital Status</Label>
                  <p className="text-sm font-medium capitalize">
                    {healthData.maritalStatus?.toLowerCase() || "Not specified"}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <p className="text-sm font-medium">{healthData.height || "Not specified"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Weight</Label>
                  <p className="text-sm font-medium">{healthData.weight || "Not specified"}</p>
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="p-3 bg-amber-50 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Medical Conditions</h5>
                <div className="flex flex-wrap gap-2">
                  {healthData.hasAllergies && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      Has Allergies
                    </span>
                  )}
                  {healthData.hasDiabetes && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                      Has Diabetes
                    </span>
                  )}
                  {healthData.smokingStatus && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      Smoker
                    </span>
                  )}
                  {!healthData.hasAllergies && !healthData.hasDiabetes && !healthData.smokingStatus && (
                    <span className="text-sm text-muted-foreground">No known conditions</span>
                  )}
                </div>
              </div>

              {healthData.dietaryPreferences && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Dietary Preferences</Label>
                  <p className="text-sm font-medium">{healthData.dietaryPreferences}</p>
                </div>
              )}
            </div>
          )}

          {/* Medical History */}
          {patient?.medicalReports && patient.medicalReports.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Medical Reports</h4>
              <div className="space-y-2">
                {patient.medicalReports.map((report, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{report.reportName}</p>
                      <a
                        href={report.reportLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Report
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
