import CTA from "@/components/modules/Home/CTA";
import DoctorsList from "@/components/modules/Home/DoctorsList";
import { getAllDoctors } from "@/services/doctor";
import FAQs from "@/components/modules/Home/FAQs";
import Features from "@/components/modules/Home/Features";
import HeroSection from "@/components/modules/Home/HeroSection";
import Statistics from "@/components/modules/Home/Statistics";
import Testimonials from "@/components/modules/Home/Testimonials";
import type { IDoctor } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
    let doctors: IDoctor[] = [];
    let error: string | null = null;

    try {
        const doctorsResponse = await getAllDoctors({ limit: 6 });
        if (!doctorsResponse.success) {
            error = doctorsResponse.message || "Failed to fetch doctors";
        } else {
            doctors = doctorsResponse.data ?? [];
        }
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load doctors";
        doctors = [];
    }

    return (
        <div>
            <HeroSection />
            <Features />
            <DoctorsList doctors={doctors} error={error} />
            <Testimonials />
            <Statistics />
            <FAQs />
            <CTA />
        </div>
    );
}
