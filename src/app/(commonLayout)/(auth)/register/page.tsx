import { RegisterForm } from "@/components/register-form";
import Link from "next/link";
import { NexusHealthBrand } from "@/components/shared/nexus-health-brand";

export default function page() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 pt-28 lg:pt-32">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <NexusHealthBrand />
                </Link>
                <RegisterForm />
            </div>
        </div>
    );
}
