import { Facebook, Globe, Instagram, Twitter } from "lucide-react";
import React from "react";
import { NexusHealthIcon } from "@/components/shared/nexus-health-brand";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <NexusHealthIcon className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">
                                Nexus Health
                            </span>
                        </div>
                        <p className="text-slate-500 max-w-xs mb-6">
                            Pioneering the future of AI-driven healthcare.
                            Accessible, accurate, and always available.
                        </p>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer">
                                <Facebook className="h-5 w-5" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer">
                                <Instagram className="h-5 w-5" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer">
                                <Twitter className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="hover:text-indigo-600 cursor-pointer">
                                AI Diagnosis
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Find Doctors
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Video Consult
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Lab Results
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="hover:text-indigo-600 cursor-pointer">
                                About Us
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Careers
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Security
                            </li>
                            <li className="hover:text-indigo-600 cursor-pointer">
                                Help Center
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>
                        © {new Date().getFullYear()} Nexus Health. All rights
                        reserved.
                    </p>
                    <div className="flex gap-8">
                        <span className="hover:text-slate-900 cursor-pointer">
                            Privacy
                        </span>
                        <span className="hover:text-slate-900 cursor-pointer">
                            Terms
                        </span>
                        <span className="hover:text-slate-900 cursor-pointer">
                            Cookies
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
