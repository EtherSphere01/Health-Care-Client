import DoctorsList from "@/components/modules/Home/DoctorsList";
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
        </div>
    );
}
