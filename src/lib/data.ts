export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type AppointmentStatus =
    | "SCHEDULED"
    | "INPROGRESS"
    | "COMPLETED"
    | "CANCELED";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string;
}

export interface Doctor extends User {
    specialty: string;
    rating: number;
    patientsCount: number;
    experience: number; // years
    about: string;
    availability: string[]; // e.g. ["Mon", "Wed", "Fri"]
}

export interface Patient extends User {
    dateOfBirth: string;
    phone: string;
    bloodGroup: string;
    address: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    date: string; // ISO date
    time: string; // "10:00 AM"
    status: AppointmentStatus;
    reason?: string;
    doctor?: Doctor;
    patient?: Patient;
}

export interface Specialty {
    id: string;
    name: string;
    icon: string;
}

export interface Prescription {
    id: string;
    appointmentId: string;
    medicines: { name: string; dosage: string; duration: string }[];
    notes: string;
    date: string;
    doctorName: string;
}

// Mock Data

export const specialties: Specialty[] = [
    { id: "1", name: "Cardiology", icon: "heart-pulse" },
    { id: "2", name: "Neurology", icon: "brain" },
    { id: "3", name: "Pediatrics", icon: "baby" },
    { id: "4", name: "Orthopedics", icon: "bone" },
    { id: "5", name: "Dermatology", icon: "activity" },
    { id: "6", name: "General", icon: "stethoscope" },
];

export const doctors: Doctor[] = [
    {
        id: "d1",
        name: "Dr. Sarah Wilson",
        email: "sarah@hospital.com",
        role: "DOCTOR",
        status: "ACTIVE",
        specialty: "Cardiology",
        rating: 4.9,
        patientsCount: 1200,
        experience: 12,
        about: "Expert in interventional cardiology with over 12 years of experience.",
        avatarUrl:
            "https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRvY3RvciUyMHBvcnRyYWl0JTIwZmVtYWxlfGVufDF8fHx8MTc2OTg0MTcwOHww&ixlib=rb-4.1.0&q=80&w=1080",
        availability: ["Mon", "Tue", "Thu", "Fri"],
    },
    {
        id: "d2",
        name: "Dr. James Carter",
        email: "james@hospital.com",
        role: "DOCTOR",
        status: "ACTIVE",
        specialty: "Neurology",
        rating: 4.8,
        patientsCount: 950,
        experience: 8,
        about: "Specialist in neurological disorders and stroke rehabilitation.",
        avatarUrl:
            "https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRvY3RvciUyMHBvcnRyYWl0JTIwbWFsZXxlbnwxfHx8fDE3Njk4NDE3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        availability: ["Wed", "Thu", "Sat"],
    },
    {
        id: "d3",
        name: "Dr. Emily Chen",
        email: "emily@hospital.com",
        role: "DOCTOR",
        status: "ACTIVE",
        specialty: "Pediatrics",
        rating: 4.9,
        patientsCount: 1500,
        experience: 10,
        about: "Compassionate pediatrician dedicated to child health and wellness.",
        avatarUrl:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200",
        availability: ["Mon", "Wed", "Fri"],
    },
];

export const patients: Patient[] = [
    {
        id: "p1",
        name: "John Doe",
        email: "john@example.com",
        role: "PATIENT",
        status: "ACTIVE",
        dateOfBirth: "1985-06-15",
        phone: "+1 234 567 8900",
        bloodGroup: "O+",
        address: "123 Main St, New York, NY",
    },
];

export const appointments: Appointment[] = [
    {
        id: "a1",
        patientId: "p1",
        doctorId: "d1",
        date: "2023-10-25",
        time: "10:00 AM",
        status: "COMPLETED",
        reason: "Regular Checkup",
        doctor: doctors[0],
        patient: patients[0],
    },
    {
        id: "a2",
        patientId: "p1",
        doctorId: "d2",
        date: "2023-11-02",
        time: "02:00 PM",
        status: "SCHEDULED",
        reason: "Headache and Dizziness",
        doctor: doctors[1],
        patient: patients[0],
    },
];

export const adminUser: User = {
    id: "admin1",
    name: "Super Admin",
    email: "admin@hospital.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
};
