"use server";

import { get, post } from "@/lib/api";
import { headers } from "next/headers";
import {
    IInitPaymentRequest,
    IInitPaymentResponse,
    IApiResponse,
    PaymentStatus,
} from "@/types";
import { revalidateTag } from "next/cache";

/**
 * Initialize payment for an appointment (Patient)
 */
export async function initializePayment(
    appointmentId: string,
): Promise<IApiResponse<IInitPaymentResponse>> {
    const requestHeaders = await headers();
    const directOrigin = requestHeaders.get("origin")?.trim();
    const host =
        requestHeaders.get("x-forwarded-host")?.trim() ||
        requestHeaders.get("host")?.trim();
    const proto =
        requestHeaders.get("x-forwarded-proto")?.trim() ||
        (process.env.NODE_ENV === "development" ? "http" : "https");
    const derivedOrigin = host ? `${proto}://${host}` : undefined;
    const frontendOrigin = directOrigin || derivedOrigin;

    // Backend initiates Stripe checkout via Appointment module
    const response = await post<IInitPaymentResponse>(
        `/appointment/${appointmentId}/initiate-payment`,
        undefined,
        {
            headers: frontendOrigin
                ? { "x-frontend-origin": frontendOrigin }
                : undefined,
        },
    );
    revalidateTag("appointments", "default");
    revalidateTag("my-appointments", "default");
    return response;
}

/**
 * Initialize payment with amount (Patient)
 */
export async function initPayment(
    data: IInitPaymentRequest,
): Promise<IApiResponse<IInitPaymentResponse>> {
    const requestHeaders = await headers();
    const directOrigin = requestHeaders.get("origin")?.trim();
    const host =
        requestHeaders.get("x-forwarded-host")?.trim() ||
        requestHeaders.get("host")?.trim();
    const proto =
        requestHeaders.get("x-forwarded-proto")?.trim() ||
        (process.env.NODE_ENV === "development" ? "http" : "https");
    const derivedOrigin = host ? `${proto}://${host}` : undefined;
    const frontendOrigin = directOrigin || derivedOrigin;

    // Amount is derived server-side from appointment/payment records.
    const response = await post<IInitPaymentResponse>(
        `/appointment/${data.appointmentId}/initiate-payment`,
        undefined,
        {
            headers: frontendOrigin
                ? { "x-frontend-origin": frontendOrigin }
                : undefined,
        },
    );
    revalidateTag("appointments", "default");
    revalidateTag("my-appointments", "default");
    return response;
}

/**
 * Validate Stripe checkout session on return (Patient)
 */
export async function validateStripeCheckoutSession(sessionId: string): Promise<
    IApiResponse<{
        appointmentId: string;
        paymentId: string;
        status: PaymentStatus;
    }>
> {
    const response = await get<{
        appointmentId: string;
        paymentId: string;
        status: PaymentStatus;
    }>("/payment/stripe/validate", { session_id: sessionId });
    revalidateTag("appointments", "default");
    revalidateTag("my-appointments", "default");
    return response;
}

/**
 * Note: IPN callback is handled by backend only
 * No frontend implementation needed for /payment/ipn
 */
