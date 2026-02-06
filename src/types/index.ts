// ============================================
// ENUMS
// ============================================
export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    PATIENT = "PATIENT",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED",
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export enum BloodGroup {
    A_POSITIVE = "A_POSITIVE",
    B_POSITIVE = "B_POSITIVE",
    O_POSITIVE = "O_POSITIVE",
    AB_POSITIVE = "AB_POSITIVE",
    A_NEGATIVE = "A_NEGATIVE",
    B_NEGATIVE = "B_NEGATIVE",
    O_NEGATIVE = "O_NEGATIVE",
    AB_NEGATIVE = "AB_NEGATIVE",
}

export enum MaritalStatus {
    MARRIED = "MARRIED",
    UNMARRIED = "UNMARRIED",
}

export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    INPROGRESS = "INPROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
}

// ============================================
// BASE INTERFACES
// ============================================
export interface IUser {
    id: string;
    email: string;
    role: UserRole;
    needPasswordChange: boolean;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    admin?: IAdmin;
    doctor?: IDoctor;
    patient?: IPatient;
}

export interface IAdmin {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IDoctor {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    address?: string;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    averageRating: number;
    createdAt: string;
    updatedAt: string;
    doctorSpecialties?: IDoctorSpecialty[];
    doctorSchedules?: IDoctorSchedule[];
}

export interface IPatient {
    id: string;
    email: string;
    name: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    patientHealthData?: IPatientHealthData;
    medicalReports?: IMedicalReport[];
}

export interface IMedicalReport {
    reportName: string;
    reportLink: string;
}

export interface INotification {
    id: string;
    recipientEmail: string;
    recipientRole: UserRole;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export interface IPatientHealthData {
    id: string;
    patientId: string;
    dateOfBirth?: string;
    gender?: Gender;
    bloodGroup?: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    weight?: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: MaritalStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ISpecialty {
    id: string;
    title: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        doctorSpecialties?: number;
    };
}

export interface IDoctorSpecialty {
    specialtyId: string;
    doctorId: string;
    specialty: ISpecialty;
    specialities?: ISpecialty;
}

export interface ISchedule {
    id: string;
    startDateTime: string;
    endDateTime: string;
    createdAt: string;
    updatedAt: string;
    doctorSchedule?: IDoctorSchedule[];
}

export interface IDoctorSchedule {
    id?: string; // Optional for DataTable compatibility
    doctorId: string;
    scheduleId: string;
    isBooked: boolean;
    appointmentId?: string;
    createdAt: string;
    updatedAt: string;
    doctor?: IDoctor;
    schedule?: ISchedule;
}

export interface IAppointment {
    id: string;
    patientId: string;
    doctorId: string;
    scheduleId: string;
    videoCallingId: string;
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    patient?: IPatient;
    doctor?: IDoctor;
    schedule?: ISchedule;
    payment?: IPayment;
    prescription?: IPrescription;
    review?: IReview;
}

export interface IPayment {
    id: string;
    appointmentId: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
    paymentGatewayData?: Record<string, unknown>;
    stripeEventId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPrescription {
    id: string;
    appointmentId: string;
    doctorId: string;
    patientId: string;
    instructions: string;
    followUpDate?: string;
    createdAt: string;
    updatedAt: string;
    doctor?: IDoctor;
    patient?: IPatient;
    appointment?: IAppointment;
}

export interface IReview {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    patient?: IPatient;
    doctor?: IDoctor;
}

// ============================================
// API RESPONSE INTERFACES
// ============================================
export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: IMeta;
}

export interface IMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface IErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errorMessages?: { path: string; message: string }[];
}

// ============================================
// AUTH TYPES
// ============================================
export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    needPasswordChange: boolean;
}

export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface IDecodedToken {
    id: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

// ============================================
// USER TYPES
// ============================================
export interface ICreateAdminRequest {
    password: string;
    admin: {
        name: string;
        email: string;
        contactNumber: string;
    };
}

export interface ICreateDoctorRequest {
    password: string;
    doctor: {
        name: string;
        email: string;
        contactNumber: string;
        address?: string;
        registrationNumber: string;
        experience: number;
        gender: Gender;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
        specialties?: string[];
    };
}

export interface ICreatePatientRequest {
    password: string;
    patient: {
        name: string;
        email: string;
        contactNumber?: string;
        address?: string;
    };
}

export interface IUpdateUserStatusRequest {
    status: UserStatus;
}

export interface IUpdateProfileRequest {
    name?: string;
    contactNumber?: string;
    address?: string;
    // Doctor specific
    registrationNumber?: string;
    experience?: number;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
    specialties?: string[];
    removeSpecialties?: string[];

    // Patient specific
    patientHealthData?: Partial<
        Pick<
            IPatientHealthData,
            | "gender"
            | "dateOfBirth"
            | "bloodGroup"
            | "hasAllergies"
            | "hasDiabetes"
            | "height"
            | "weight"
            | "smokingStatus"
            | "dietaryPreferences"
            | "pregnancyStatus"
            | "mentalHealthHistory"
            | "immunizationStatus"
            | "hasPastSurgeries"
            | "recentAnxiety"
            | "recentDepression"
            | "maritalStatus"
        >
    >;
}

// ============================================
// QUERY PARAMS
// ============================================
export interface IUserQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface IAdminQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    email?: string;
    contactNumber?: string;
}

export interface IDoctorQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    specialties?: string;
    email?: string;
    gender?: Gender;
    appointmentFee?: number;
}

export interface IPatientQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    email?: string;
    contactNumber?: string;
}

export interface IScheduleQueryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

export interface IDoctorScheduleQueryParams {
    page?: number;
    limit?: number;
    doctorId?: string;
    isBooked?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface IAppointmentQueryParams {
    page?: number;
    limit?: number;
    status?: AppointmentStatus;
    paymentStatus?: PaymentStatus;
    patientEmail?: string;
    doctorEmail?: string;
}

export interface IPrescriptionQueryParams {
    page?: number;
    limit?: number;
    patientEmail?: string;
    doctorEmail?: string;
}

export interface IReviewQueryParams {
    page?: number;
    limit?: number;
    doctorId?: string;
    patientId?: string;
}

export interface ISpecialtyQueryParams {
    page?: number;
    limit?: number;
}

// ============================================
// CREATE/UPDATE TYPES
// ============================================
export interface ICreateScheduleRequest {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export interface ICreateDoctorScheduleRequest {
    scheduleIds: string[];
}

export interface ICreateAppointmentRequest {
    doctorId: string;
    scheduleId: string;
}

export interface IUpdateAppointmentStatusRequest {
    status: AppointmentStatus;
}

export interface ICreatePrescriptionRequest {
    appointmentId: string;
    instructions: string;
    followUpDate?: string;
}

export interface ICreateReviewRequest {
    appointmentId: string;
    rating: number;
    comment: string;
}

export interface ICreateSpecialtyRequest {
    title: string;
    icon?: string;
}

// ============================================
// META/DASHBOARD TYPES
// ============================================
export interface IAdminDashboardMeta {
    appointmentCount: number;
    patientCount: number;
    doctorCount: number;
    paymentCount: number;
    totalRevenue: number;
    appointmentStatusDistribution: {
        scheduled: number;
        inProgress: number;
        completed: number;
        canceled: number;
    };
}

export interface IDoctorDashboardMeta {
    appointmentCount: number;
    patientCount: number;
    reviewCount: number;
    totalRevenue: number;
    appointmentStatusDistribution: {
        scheduled: number;
        inProgress: number;
        completed: number;
        canceled: number;
    };
}

export interface IPatientDashboardMeta {
    appointmentCount: number;
    prescriptionCount: number;
    reviewCount: number;
    appointmentStatusDistribution: {
        scheduled: number;
        inProgress: number;
        completed: number;
        canceled: number;
    };
}

export interface IPatientDashboardSummary {
    nextAppointment: IAppointment | null;
    latestPrescription: IPrescription | null;
    outstandingPayments: number;
    profileCompletion: number;
}

export type IDashboardMeta =
    | IAdminDashboardMeta
    | IDoctorDashboardMeta
    | IPatientDashboardMeta;

// ============================================
// AI SUGGESTION TYPE
// ============================================
export interface IAiSuggestion {
    suggestedSpecialties: string[];
    suggestedDoctors?: string[];
    recommendations: string;
    urgencyLevel: "low" | "medium" | "high";
}

// ============================================
// PAYMENT TYPES
// ============================================
export interface IInitPaymentRequest {
    appointmentId: string;
    amount: number;
}

export interface IInitPaymentResponse {
    paymentUrl: string;
    transactionId: string;
}
