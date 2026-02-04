import CTA from "@/components/modules/Home/CTA";
import DoctorsList from "@/components/modules/Home/DoctorsList";
import { getAllDoctors } from "@/services/doctor";
import FAQs from "@/components/modules/Home/FAQs";
import Features from "@/components/modules/Home/Features";
import HeroSection from "@/components/modules/Home/HeroSection";
import Statistics from "@/components/modules/Home/Statistics";
import Testimonials from "@/components/modules/Home/Testimonials";

export default async function Home() {
    let doctors = [];
    try {
        const doctorsResponse = await getAllDoctors({ limit: 6 });
        doctors = doctorsResponse.data ?? [];
    } catch {
        doctors = [];
    }

    return (
        <div>
            <HeroSection />
            <Features />
            <DoctorsList doctors={doctors} />
            <Testimonials />
            <Statistics />
            <FAQs />
            <CTA />
        </div>
    );
}
