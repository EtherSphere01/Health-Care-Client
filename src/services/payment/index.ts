"use server";

import { post } from "@/lib/api";
import {
    IInitPaymentRequest,
    IInitPaymentResponse,
    IApiResponse,
} from "@/types";
import { revalidateTag } from "next/cache";

/**
 * Initialize payment for an appointment (Patient)
 */
export async function initializePayment(
    appointmentId: string,
): Promise<IApiResponse<IInitPaymentResponse>> {
    const response = await post<IInitPaymentResponse>(
        `/payment/init-payment/${appointmentId}`,
    );
    revalidateTag("appointments");
    revalidateTag("my-appointments");
    return response;
}

/**
 * Initialize payment with amount (Patient)
 */
export async function initPayment(
    data: IInitPaymentRequest,
): Promise<IApiResponse<IInitPaymentResponse>> {
    const response = await post<IInitPaymentResponse>(
        `/payment/init-payment/${data.appointmentId}`,
        {
            amount: data.amount,
        },
    );
    revalidateTag("appointments");
    revalidateTag("my-appointments");
    return response;
}

/**
 * Note: IPN callback is handled by backend only
 * No frontend implementation needed for /payment/ipn
 */
