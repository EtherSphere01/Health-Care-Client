"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  Star, 
  Calendar, 
  Clock,
  DollarSign,
  Check,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { IDoctor, ISpecialty, ISchedule, IDoctorSchedule } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/loading";
import { getDoctorSchedules } from "@/services/doctor-schedule";
import { createAppointment } from "@/services/appointment";
import { initPayment } from "@/services/payment";
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
  const [step, setStep] = useState<Step>(selectedDoctorId ? "schedule" : "specialty");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(
    doctors.find((d) => d.id === selectedDoctorId) || null
  );
  const [selectedSchedule, setSelectedSchedule] = useState<IDoctorSchedule | null>(null);
  const [schedules, setSchedules] = useState<IDoctorSchedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Filter doctors by specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((d) =>
        d.doctorSpecialties?.some((ds) => ds.specialtyId === selectedSpecialty)
      )
    : doctors;

  // Load doctor schedules when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      loadSchedules();
    }
  }, [selectedDoctor]);

  const loadSchedules = async () => {
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
      toast.error("Failed to load schedules");
    } finally {
      setIsLoadingSchedules(false);
    }
  };

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

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSchedule) return;

    setIsBooking(true);
    try {
      // Create appointment
      const appointmentRes = await createAppointment({
        doctorId: selectedDoctor.id,
        scheduleId: selectedSchedule.scheduleId,
      });

      if (!appointmentRes.success) {
        toast.error(appointmentRes.message || "Failed to create appointment");
        return;
      }

      const appointment = appointmentRes.data;

      // Initialize payment
      const paymentRes = await initPayment({
        appointmentId: appointment!.id,
        amount: selectedDoctor.appointmentFee,
      });

      if (paymentRes.success && paymentRes.data?.paymentUrl) {
        // Redirect to Stripe payment
        window.location.href = paymentRes.data.paymentUrl;
      } else {
        toast.success("Appointment created successfully!");
        router.push("/dashboard/my-appointments");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = schedule.schedule?.scheduleDate || "";
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, IDoctorSchedule[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
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
                      : ["specialty", "doctor", "schedule", "confirm"].indexOf(step) >
                        ["specialty", "doctor", "schedule", "confirm"].indexOf(s.key)
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {["specialty", "doctor", "schedule", "confirm"].indexOf(step) >
                  ["specialty", "doctor", "schedule", "confirm"].indexOf(s.key) ? (
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
                  Choose the medical specialty for your consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => handleSelectSpecialty(specialty.id)}
                      className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        {specialty.icon ? (
                          <img
                            src={specialty.icon}
                            alt={specialty.title}
                            className="h-6 w-6"
                          />
                        ) : (
                          <Stethoscope className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <h3 className="font-medium">{specialty.title}</h3>
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
                    Choose your preferred healthcare provider
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setStep("specialty")}>
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                {filteredDoctors.length === 0 ? (
                  <EmptyState
                    icon={<Stethoscope className="h-12 w-12" />}
                    title="No doctors available"
                    description="No doctors found for this specialty."
                    action={
                      <Button onClick={() => setStep("specialty")}>
                        Choose Another Specialty
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleSelectDoctor(doctor)}
                        className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {doctor.profilePhoto ? (
                              <img
                                src={doctor.profilePhoto}
                                alt={doctor.name}
                                className="h-16 w-16 object-cover"
                              />
                            ) : (
                              <Stethoscope className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Dr. {doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doctor.designation}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm">
                                  {doctor.averageRating?.toFixed(1) || "0.0"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                ${doctor.appointmentFee}
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
                    Choose an available slot with Dr. {selectedDoctor.name}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep(selectedDoctorId ? "specialty" : "doctor")}
                >
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingSchedules ? (
                  <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : Object.keys(groupedSchedules).length === 0 ? (
                  <EmptyState
                    icon={<Calendar className="h-12 w-12" />}
                    title="No available slots"
                    description="Dr. {selectedDoctor.name} has no available appointment slots."
                    action={
                      <Button onClick={() => setStep("doctor")}>
                        Choose Another Doctor
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
                      <div key={date}>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatDate(date)}
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {daySchedules.map((schedule) => (
                            <button
                              key={schedule.id}
                              onClick={() => handleSelectSchedule(schedule)}
                              className={`p-3 rounded-lg border text-center transition-colors ${
                                selectedSchedule?.id === schedule.id
                                  ? "bg-primary text-white border-primary"
                                  : "hover:border-primary hover:bg-primary/5"
                              }`}
                            >
                              <Clock className="h-4 w-4 mx-auto mb-1" />
                              <span className="text-sm font-medium">
                                {formatTime(schedule.schedule?.startTime || "")}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirm Booking */}
          {step === "confirm" && selectedDoctor && selectedSchedule && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Confirm Your Appointment</CardTitle>
                  <CardDescription>
                    Review the details before confirming
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setStep("schedule")}>
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Doctor Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {selectedDoctor.profilePhoto ? (
                          <img
                            src={selectedDoctor.profilePhoto}
                            alt={selectedDoctor.name}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <Stethoscope className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Dr. {selectedDoctor.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedDoctor.designation}
                        </p>
                        {selectedDoctor.doctorSpecialties && (
                          <div className="flex gap-1 mt-1">
                            {selectedDoctor.doctorSpecialties.map((ds) => (
                              <Badge key={ds.specialtyId} variant="secondary" className="text-xs">
                                {ds.specialty?.title}
                              </Badge>
                            ))}
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
                        <span className="font-medium">Date</span>
                      </div>
                      <p>{formatDate(selectedSchedule.schedule?.scheduleDate || "")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-medium">Time</span>
                      </div>
                      <p>
                        {formatTime(selectedSchedule.schedule?.startTime || "")} -{" "}
                        {formatTime(selectedSchedule.schedule?.endTime || "")}
                      </p>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-medium">Consultation Fee</span>
                      </div>
                      <span className="text-2xl font-bold">
                        ${selectedDoctor.appointmentFee}
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
                    You will be redirected to a secure payment page to complete your booking.
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
