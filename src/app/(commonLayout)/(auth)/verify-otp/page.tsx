import { VerifyOtpForm } from "@/components/verify-otp-form";

export default async function VerifyOtpPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; sent?: string }>;
}) {
    const params = await searchParams;
    const email = typeof params?.email === "string" ? params.email : "";
    const showOtpSentToast = params?.sent === "1";

    return (
        <VerifyOtpForm
            defaultEmail={email}
            showOtpSentToast={showOtpSentToast}
        />
    );
}
