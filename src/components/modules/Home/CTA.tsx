import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import React from "react";

export default function CTA() {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    Start your smart health journey
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    Join the platform that proactively manages your well-being
                    using the power of AI.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        className="h-14 px-10 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all"
                        //   onClick={onRegister}
                    >
                        Create Free Account
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-10 rounded-lg border-slate-300 hover:bg-white hover:scale-105 transition-all"
                    >
                        <Smartphone className="mr-2 h-5 w-5" /> Download App
                    </Button>
                </div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px]" />
            </div>
        </section>
    );
}
