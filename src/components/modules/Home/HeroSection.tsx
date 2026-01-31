import { Button } from "@/components/ui/button";
import { Activity, Bot, Calendar, Shield, Sparkles, Zap } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F8FAFC]">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-70 h-70 sm:w-150 sm:h-150 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-70 h-70 sm:w-150 sm:h-150 bg-teal-500/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[40%] w-50 h-50 bg-violet-500/10 rounded-full blur-[80px]" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(128,128,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-bold">
                            New:
                        </span>
                        &nbsp;AI-Powered Diagnosis Assistant
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Healthcare reimagined <br />
                        with{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">
                            Artificial Intelligence
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        Experience the future of medicine. Our AI-driven
                        platform connects you with top specialists, predicts
                        health trends, and streamlines your care journey.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                        <Button
                            size="lg"
                            className="h-14 px-8 rounded-lg text-base bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 border-none hover:scale-105 transition-all"
                        >
                            Try AI Health Check
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 rounded-lg text-base bg-white/60 backdrop-blur-sm border-slate-200 hover:bg-white hover:scale-105 transition-all"
                        >
                            <Calendar className="text-indigo-600" />
                            <span className="text-indigo-600">
                                Book an Appointment
                            </span>
                        </Button>
                    </div>

                    {/* AI Interface Preview */}
                    <div className="mt-20 w-full relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <div className="relative rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                            <div className="relative rounded-xl overflow-hidden border border-slate-100 bg-white shadow-sm">
                                {/* Mock Browser Header */}
                                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 flex items-center gap-2 w-56 justify-center">
                                        <Shield className="h-3 w-3" />{" "}
                                        nexus-health.ai/dashboard
                                    </div>
                                </div>

                                {/* Mock Content */}
                                <div className="grid grid-cols-12 h-[420px] md:h-150 overflow-hidden">
                                    {/* Sidebar */}
                                    <div className="col-span-2 bg-slate-50/50 border-r border-slate-100 hidden md:flex flex-col p-4 gap-4">
                                        <div className="h-8 w-8 bg-indigo-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
                                            A
                                        </div>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="h-2 w-full bg-slate-200 rounded-full opacity-50"
                                            />
                                        ))}
                                    </div>

                                    {/* Main Content */}
                                    <div className="col-span-12 md:col-span-7 p-6 md:p-8 bg-white">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="min-h-16 min-w-16 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                                <Bot className="h-8 w-8 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    AI Health Assistant
                                                </h3>
                                                <p className="text-slate-500">
                                                    Analysis complete based on
                                                    your recent vitals.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4">
                                                <Activity className="h-6 w-6 text-emerald-500 mt-1" />
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">
                                                        Heart Rate Optimization
                                                    </h4>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        Your average resting
                                                        heart rate has improved
                                                        by 5% this week.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4">
                                                <Zap className="h-6 w-6 text-amber-500 mt-1" />
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">
                                                        Sleep Pattern Detected
                                                    </h4>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        AI suggests adjusting
                                                        your sleep schedule by
                                                        30 minutes.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel */}
                                    <div className="col-span-3 bg-slate-50/80 border-l border-slate-100 hidden md:block p-6">
                                        <h4 className="font-bold text-slate-900 mb-4">
                                            Upcoming
                                        </h4>
                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100" />
                                                <div className="h-3 w-20 bg-slate-200 rounded-full" />
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full mb-2" />
                                            <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
