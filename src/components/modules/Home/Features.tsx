import { ArrowRight, Brain, Globe, ScanFace } from "lucide-react";

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">
                        Intelligence First
                    </h2>
                    <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
                        Powered by advanced neural networks
                    </h3>
                    <p className="text-lg text-slate-600">
                        We don&apos;t just store your records. We analyze them
                        to provide actionable insights.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: "Predictive Diagnostics",
                            desc: "Our AI models cross-reference symptoms with millions of medical cases to suggest potential conditions early.",
                            gradient: "from-indigo-500 to-violet-500",
                        },
                        {
                            icon: ScanFace,
                            title: "Smart Triage",
                            desc: "Automated urgency assessment ensures critical cases get immediate attention from specialists.",
                            gradient: "from-emerald-400 to-teal-500",
                        },
                        {
                            icon: Globe,
                            title: "Global Medical Knowledge",
                            desc: "Access treatment protocols and research from top institutions worldwide, translated instantly.",
                            gradient: "from-blue-500 to-cyan-500",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group relative p-8 rounded-3xl bg-[#F8FAFC] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                <feature.icon className="h-40 w-40 text-slate-900" />
                            </div>
                            <div
                                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}
                            >
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed z-10 relative">
                                {feature.desc}
                            </p>

                            <div className="mt-8 flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
                                Learn more{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
