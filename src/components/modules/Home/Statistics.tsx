"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

export default function Statistics() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCount(true);
                    observer.disconnect(); // run once
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-20 bg-slate-900 text-white relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { value: "99.9%", label: "Diagnostic Accuracy" },
                        { value: "2M+", label: "Patient Records Analyzed" },
                        { value: "24/7", label: "AI Monitoring" },
                        { value: "150+", label: "Partner Hospitals" },
                    ].map((stat, i) => {
                        const number = parseFloat(stat.value);
                        const suffix = stat.value.replace(/^[\d.]+/, "");

                        return (
                            <div key={i}>
                                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-2">
                                    {startCount ? (
                                        <CountUp
                                            end={number}
                                            duration={2}
                                            suffix={suffix}
                                            decimals={
                                                stat.value.includes(".") ? 1 : 0
                                            }
                                        />
                                    ) : (
                                        "0"
                                    )}
                                </div>
                                <div className="text-indigo-200 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
