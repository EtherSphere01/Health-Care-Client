"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Stethoscope,
    Star,
    Calendar,
    Clock,
    DollarSign,
    Check,
    ChevronRight,
    CreditCard,
    Sparkles,
    AlertTriangle,
} from "lucide-react";
import {
    IDoctor,
    ISpecialty,
    IDoctorSchedule,
    IAiSuggestion,
    UserRole,
} from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loading";
import { getDoctorSchedules } from "@/services/doctor-schedule";
import { createAppointment } from "@/services/appointment";
import { getAiDoctorSuggestionClient } from "@/services/doctor/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ConsultationContentProps {
    doctors: IDoctor[];
    specialties: ISpecialty[];
    selectedDoctorId?: string;
}

type Step = "specialty" | "doctor" | "schedule" | "confirm";

export function ConsultationContent({
    doctors,
    specialties,
    selectedDoctorId,
}: ConsultationContentProps) {
    const router = useRouter();
    const {
        isAuthenticated,
        isPatient,
        role,
        isLoading: isAuthLoading,
    } = useAuth();
    const [step, setStep] = useState<Step>(
        selectedDoctorId ? "schedule" : "specialty",
    );
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
    const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(
        doctors.find((d) => d.id === selectedDoctorId) || null,
    );
    const [selectedSchedule, setSelectedSchedule] =
        useState<IDoctorSchedule | null>(null);
    const [schedules, setSchedules] = useState<IDoctorSchedule[]>([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [symptoms, setSymptoms] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState<IAiSuggestion | null>(
        null,
    );
    const [aiError, setAiError] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Filter doctors by specialty
    const filteredDoctors = selectedSpecialty
        ? doctors.filter((d) =>
              d.doctorSpecialties?.some(
                  (ds) =>
                      (ds.specialtyId ??
                          // Backward-compatible field names from API
                          (ds as unknown as { specialitiesId?: string })
                              .specialitiesId ??
                          (ds as unknown as { specialityId?: string })
                              .specialityId) === selectedSpecialty,
              ),
          )
        : doctors;

    const loadSchedules = useCallback(async () => {
        if (!selectedDoctor) return;

        setIsLoadingSchedules(true);
        try {
            const response = await getDoctorSchedules({
                doctorId: selectedDoctor.id,
                startDate: new Date().toISOString().split("T")[0],
                isBooked: false,
            });

            setSchedules(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load schedules");
        } finally {
            setIsLoadingSchedules(false);
        }
    }, [selectedDoctor]);

    // Load doctor schedules when doctor is selected
    useEffect(() => {
        if (!selectedDoctor) return;
        loadSchedules();
    }, [selectedDoctor, loadSchedules]);

    const handleSelectSpecialty = (specialtyId: string) => {
        setSelectedSpecialty(specialtyId);
        setSelectedDoctor(null);
        setSelectedSchedule(null);
        setStep("doctor");
    };

    const handleSelectDoctor = (doctor: IDoctor) => {
        setSelectedDoctor(doctor);
        setSelectedSchedule(null);
        setStep("schedule");
    };

    const handleSelectSchedule = (schedule: IDoctorSchedule) => {
        setSelectedSchedule(schedule);
        setStep("confirm");
    };

    const handleAiSuggestion = async () => {
        const trimmed = symptoms.trim();
        if (trimmed.length < 5) {
            setAiError("Please describe symptoms in at least 5 characters.");
            return;
        }

        setAiError(null);
        setIsAiLoading(true);
        try {
            const response = await getAiDoctorSuggestionClient(trimmed);
            setAiSuggestion(response.data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to get AI suggestion";
            setAiError(message);
            setAiSuggestion(null);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedDoctor || !selectedSchedule) return;

        if (isAuthLoading) return;

        if (!isAuthenticated) {
            toast.error("Please login as a patient to book an appointment.");
            router.push(
                `/login?redirect=${encodeURIComponent("/consultation")}`,
            );
            return;
        }

        if (!isPatient) {
            toast.error("Only patients can book and pay for appointments.");
            if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
                router.push("/admin/dashboard");
            } else if (role === UserRole.DOCTOR) {
                router.push("/doctor/dashboard");
            } else {
                router.push("/");
            }
            return;
        }

        setIsBooking(true);
        try {
            // Create appointment
            const appointmentRes = await createAppointment({
                doctorId: selectedDoctor.id,
                scheduleId: selectedSchedule.scheduleId,
            });

            if (!appointmentRes.success) {
                toast.error(
                    appointmentRes.message || "Failed to create appointment",
                );
                return;
            }

            const paymentUrl = appointmentRes.data?.paymentUrl;
            if (paymentUrl) {
                window.location.href = paymentUrl;
                return;
            }

            toast.error("Failed to start payment session");
        } catch (error: unknown) {
            const message =
                (error as { message?: string })?.message ||
                (error instanceof Error ? error.message : undefined) ||
                "Failed to book appointment";
            toast.error(message);
        } finally {
            setIsBooking(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
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

    // Group schedules by date
    const groupedSchedules = schedules.reduce(
        (acc, schedule) => {
            const date = schedule.schedule?.startDateTime?.split("T")[0] || "";
            if (!acc[date]) acc[date] = [];
            acc[date].push(schedule);
            return acc;
        },
        {} as Record<string, IDoctorSchedule[]>,
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* AI Doctor Suggestion */}
                <Card
                    id="ai-suggestion"
                    className="mb-8 border-primary/10 bg-linear-to-br from-white to-indigo-50/40"
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Doctor Suggestion
                        </CardTitle>
                        <CardDescription>
                            Describe your symptoms to get specialty guidance
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="symptoms">Symptoms</Label>
                            <textarea
                                id="symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="E.g., persistent headache, blurred vision, fatigue"
                                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {aiError && (
                                <p className="text-sm text-destructive flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    {aiError}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <Button
                                onClick={handleAiSuggestion}
                                disabled={isAiLoading}
                            >
                                {isAiLoading
                                    ? "Analyzing..."
                                    : "Get AI Suggestion"}
                            </Button>
                            {aiSuggestion?.urgencyLevel && (
                                <Badge
                                    variant={
                                        aiSuggestion.urgencyLevel === "high"
                                            ? "destructive"
                                            : aiSuggestion.urgencyLevel ===
                                                "medium"
                                              ? "warning"
                                              : "success"
                                    }
                                >
                                    Urgency: {aiSuggestion.urgencyLevel}
                                </Badge>
                            )}
                        </div>

                        {aiSuggestion && (
                            <div className="rounded-lg border border-border bg-white p-4 space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        Suggested Specialties
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {aiSuggestion.suggestedSpecialties?.map(
                                            (specialty) => (
                                                <Badge
                                                    key={specialty}
                                                    variant="secondary"
                                                >
                                                    {specialty}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                                {Array.isArray(aiSuggestion.suggestedDoctors) &&
                                    aiSuggestion.suggestedDoctors.length >
                                        0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground">
                                                Suggested Doctors
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {aiSuggestion.suggestedDoctors.map(
                                                    (doctor) => (
                                                        <Badge
                                                            key={doctor}
                                                            variant="outline"
                                                        >
                                                            {doctor}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        Recommendations
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                        {aiSuggestion.recommendations}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {[
                            { key: "specialty", label: "Specialty" },
                            { key: "doctor", label: "Doctor" },
                            { key: "schedule", label: "Schedule" },
                            { key: "confirm", label: "Confirm" },
                        ].map((s, index) => (
                            <div key={s.key} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        step === s.key
                                            ? "bg-primary border-primary text-white"
                                            : [
                                                    "specialty",
                                                    "doctor",
                                                    "schedule",
                                                    "confirm",
                                                ].indexOf(step) >
                                                [
                                                    "specialty",
                                                    "doctor",
                                                    "schedule",
                                                    "confirm",
                                                ].indexOf(s.key)
                                              ? "bg-green-500 border-green-500 text-white"
                                              : "bg-white border-gray-300 text-gray-500"
                                    }`}
                                >
                                    {[
                                        "specialty",
                                        "doctor",
                                        "schedule",
                                        "confirm",
                                    ].indexOf(step) >
                                    [
                                        "specialty",
                                        "doctor",
                                        "schedule",
                                        "confirm",
                                    ].indexOf(s.key) ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className="ml-2 text-sm font-medium hidden sm:block">
                                    {s.label}
                                </span>
                                {index < 3 && (
                                    <ChevronRight className="h-5 w-5 mx-2 text-gray-400" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-4xl mx-auto">
                    {/* Step 1: Select Specialty */}
                    {step === "specialty" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Select a Specialty</CardTitle>
                                <CardDescription>
                                    Choose the medical specialty for your
                                    consultation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {specialties.map((specialty) => (
                                        <button
                                            key={specialty.id}
                                            onClick={() =>
                                                handleSelectSpecialty(
                                                    specialty.id,
                                                )
                                            }
                                            className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                                {specialty.icon ? (
                                                    <Image
                                                        src={specialty.icon}
                                                        alt={specialty.title}
                                                        width={24}
                                                        height={24}
                                                        unoptimized
                                                        className="h-6 w-6"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/images/default-specialty.svg"
                                                        alt={specialty.title}
                                                        width={24}
                                                        height={24}
                                                        className="h-6 w-6"
                                                    />
                                                )}
                                            </div>
                                            <h3 className="font-medium">
                                                {specialty.title}
                                            </h3>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Select Doctor */}
                    {step === "doctor" && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Select a Doctor</CardTitle>
                                    <CardDescription>
                                        Choose your preferred healthcare
                                        provider
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("specialty")}
                                >
                                    Back
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {filteredDoctors.length === 0 ? (
                                    <EmptyState
                                        icon={
                                            <Stethoscope className="h-12 w-12" />
                                        }
                                        title="No doctors available"
                                        description="No doctors found for this specialty."
                                        action={{
                                            label: "Choose Another Specialty",
                                            onClick: () => setStep("specialty"),
                                        }}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {filteredDoctors.map((doctor) => (
                                            <div
                                                key={doctor.id}
                                                onClick={() =>
                                                    handleSelectDoctor(doctor)
                                                }
                                                className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                        <Image
                                                            src={
                                                                doctor.profilePhoto ||
                                                                "/images/default-doctor.svg"
                                                            }
                                                            alt={doctor.name}
                                                            width={64}
                                                            height={64}
                                                            unoptimized
                                                            className="h-16 w-16 object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">
                                                            {doctor.name.startsWith(
                                                                "Dr.",
                                                            )
                                                                ? doctor.name
                                                                : `Dr. ${doctor.name}`}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {doctor.designation}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                                <span className="text-sm">
                                                                    {doctor.averageRating?.toFixed(
                                                                        1,
                                                                    ) || "0.0"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <DollarSign className="h-4 w-4" />
                                                                $
                                                                {
                                                                    doctor.appointmentFee
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Select Schedule */}
                    {step === "schedule" && selectedDoctor && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Select Date & Time</CardTitle>
                                    <CardDescription>
                                        Choose an available slot with Dr.{" "}
                                        {selectedDoctor.name}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setStep(
                                            selectedDoctorId
                                                ? "specialty"
                                                : "doctor",
                                        )
                                    }
                                >
                                    Back
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoadingSchedules ? (
                                    <div className="flex justify-center py-12">
                                        <Spinner size="lg" />
                                    </div>
                                ) : Object.keys(groupedSchedules).length ===
                                  0 ? (
                                    <EmptyState
                                        icon={
                                            <Calendar className="h-12 w-12" />
                                        }
                                        title="No available slots"
                                        description={`Dr. ${selectedDoctor.name} has no available appointment slots.`}
                                        action={{
                                            label: "Choose Another Doctor",
                                            onClick: () => setStep("doctor"),
                                        }}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(groupedSchedules).map(
                                            ([date, daySchedules]) => (
                                                <div key={date}>
                                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                        {formatDate(date)}
                                                    </h4>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                        {daySchedules.map(
                                                            (schedule) => (
                                                                <button
                                                                    key={
                                                                        schedule.scheduleId
                                                                    }
                                                                    onClick={() =>
                                                                        handleSelectSchedule(
                                                                            schedule,
                                                                        )
                                                                    }
                                                                    className={`p-3 rounded-lg border text-center transition-colors ${
                                                                        selectedSchedule?.scheduleId ===
                                                                        schedule.scheduleId
                                                                            ? "bg-primary text-white border-primary"
                                                                            : "hover:border-primary hover:bg-primary/5"
                                                                    }`}
                                                                >
                                                                    <Clock className="h-4 w-4 mx-auto mb-1" />
                                                                    <span className="text-sm font-medium">
                                                                        {formatTime(
                                                                            schedule
                                                                                .schedule
                                                                                ?.startDateTime ||
                                                                                "",
                                                                        )}
                                                                    </span>
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Confirm Booking */}
                    {step === "confirm" &&
                        selectedDoctor &&
                        selectedSchedule && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Confirm Your Appointment
                                        </CardTitle>
                                        <CardDescription>
                                            Review the details before confirming
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("schedule")}
                                    >
                                        Back
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Doctor Summary */}
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                    <Image
                                                        src={
                                                            selectedDoctor.profilePhoto ||
                                                            "/images/default-doctor.svg"
                                                        }
                                                        alt={
                                                            selectedDoctor.name
                                                        }
                                                        width={64}
                                                        height={64}
                                                        unoptimized
                                                        className="h-16 w-16 object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {selectedDoctor.name.startsWith(
                                                            "Dr.",
                                                        )
                                                            ? selectedDoctor.name
                                                            : `Dr. ${selectedDoctor.name}`}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {
                                                            selectedDoctor.designation
                                                        }
                                                    </p>
                                                    {selectedDoctor.doctorSpecialties && (
                                                        <div className="flex gap-1 mt-1">
                                                            {selectedDoctor.doctorSpecialties.map(
                                                                (ds) => (
                                                                    <Badge
                                                                        key={
                                                                            ds.specialtyId
                                                                        }
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            ds
                                                                                .specialty
                                                                                ?.title
                                                                        }
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">
                                                        Date
                                                    </span>
                                                </div>
                                                <p>
                                                    {formatDate(
                                                        selectedSchedule
                                                            .schedule
                                                            ?.startDateTime ||
                                                            "",
                                                    )}
                                                </p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">
                                                        Time
                                                    </span>
                                                </div>
                                                <p>
                                                    {formatTime(
                                                        selectedSchedule
                                                            .schedule
                                                            ?.startDateTime ||
                                                            "",
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        selectedSchedule
                                                            .schedule
                                                            ?.endDateTime || "",
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Fee */}
                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">
                                                        Consultation Fee
                                                    </span>
                                                </div>
                                                <span className="text-2xl font-bold">
                                                    $
                                                    {
                                                        selectedDoctor.appointmentFee
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* Book Button */}
                                        <Button
                                            onClick={handleBookAppointment}
                                            disabled={isBooking}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isBooking ? (
                                                <>
                                                    <Spinner className="mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="h-5 w-5 mr-2" />
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-sm text-center text-muted-foreground">
                                            You will be redirected to a secure
                                            payment page to complete your
                                            booking.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>
        </div>
    );
}
