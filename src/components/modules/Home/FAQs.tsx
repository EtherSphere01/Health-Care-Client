"use client";
const faqs = [
    {
        question: "How accurate is the AI diagnosis?",
        answer: "Our AI models are trained on over 2 million anonymized medical records and have a 99.9% diagnostic accuracy rate for common conditions. However, it is designed to assist, not replace, professional medical advice.",
    },
    {
        question: "Is my medical data secure?",
        answer: "Absolutely. We use military-grade AES-256 encryption for all data at rest and in transit. We are fully HIPAA and GDPR compliant.",
    },
    {
        question: "Can I use insurance for appointments?",
        answer: "Yes, we partner with most major insurance providers. You can add your insurance details during the booking process to see your co-pay instantly.",
    },
    {
        question: "What if I need to cancel?",
        answer: "You can cancel or reschedule up to 24 hours before your appointment with no fee. Late cancellations may be subject to a small service charge.",
    },
];

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import React, { useState } from "react";

export default function FAQs() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    return (
        <section id="faq" className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600">
                        Everything you need to know about Nexus Health
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === i ? null : i)
                                }
                                className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 hover:bg-slate-50/50 transition-colors"
                            >
                                {faq.question}
                                {openFaq === i ? (
                                    <ChevronUp className="h-5 w-5 text-indigo-600" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-slate-400" />
                                )}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 mb-4">Still have questions?</p>
                    <Button
                        variant="outline"
                        className="rounded-lg border-slate-300 hover:border-indigo-600 hover:text-indigo-600"
                    >
                        <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
                    </Button>
                </div>
            </div>
        </section>
    );
}
