import CTA from "@/components/modules/Home/CTA";
import DoctorsList from "@/components/modules/Home/DoctorsList";
import FAQs from "@/components/modules/Home/FAQs";
import Features from "@/components/modules/Home/Features";
import HeroSection from "@/components/modules/Home/HeroSection";
import Statistics from "@/components/modules/Home/Statistics";
import Testimonials from "@/components/modules/Home/Testimonials";

export default function Home() {
    return (
        <div>
            <HeroSection />
            <Features />
            <DoctorsList />
            <Testimonials />
            <Statistics />
            <FAQs />
            <CTA />
        </div>
    );
}
