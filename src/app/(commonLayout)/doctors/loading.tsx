import { LoadingState } from "@/components/ui/loading";

export default function LoadingDoctors() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-center py-16">
                <LoadingState message="Loading doctors..." />
            </div>
        </div>
    );
}
