import { Quote, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Patient",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
            text: "The AI diagnosis feature is mind-blowing. It correctly identified my symptoms before I even saw the doctor, saving so much time.",
            rating: 5,
        },
        {
            name: "Michael Chen",
            role: "Patient",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
            text: "Booking a specialist used to take weeks. With NexusHealth, I got an appointment with a top cardiologist in 2 days.",
            rating: 5,
        },
        {
            name: "Dr. Emily Weiss",
            role: "Neurologist",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100",
            text: "As a doctor, the AI scribe feature allows me to focus 100% on my patients instead of typing notes. It's a game changer.",
            rating: 5,
        },
    ];
    return (
        <section id="testimonials" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">
                        Community Stories
                    </h2>
                    <h3 className="text-4xl font-extrabold text-slate-900">
                        Trusted by 2 million+ users
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[#F8FAFC] p-8 rounded-[16px] border border-slate-100 hover:shadow-xl transition-shadow relative"
                        >
                            <Quote className="absolute top-8 right-8 h-8 w-8 text-indigo-200 fill-current" />
                            <div className="flex items-center gap-4 mb-6">
                                <Image
                                    src=""
                                    height={48}
                                    width={48}
                                    alt={t.name}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">
                                        {t.name}
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-current"
                                    />
                                ))}
                            </div>
                            <p className="text-slate-600 leading-relaxed italic">
                                {t.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
