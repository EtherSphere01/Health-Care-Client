import * as React from "react";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function NexusHealthIcon({
    className,
}: {
    className?: string;
}): React.JSX.Element {
    return <HeartPulse className={cn("h-4 w-4", className)} />;
}

export function NexusHealthBrand({
    className,
    iconContainerClassName,
    iconClassName,
    textClassName,
}: {
    className?: string;
    iconContainerClassName?: string;
    iconClassName?: string;
    textClassName?: string;
}): React.JSX.Element {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <span
                className={cn(
                    "bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md",
                    iconContainerClassName,
                )}
                aria-hidden="true"
            >
                <NexusHealthIcon className={cn("size-4", iconClassName)} />
            </span>
            <span className={cn("font-medium", textClassName)}>
                Nexus Health
            </span>
        </span>
    );
}
