"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar, FilterSelect } from "@/components/ui/search";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

type DoctorsListControlsProps = {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    specialties: { value: string; label: string }[];
};

function buildUrl(
    pathname: string,
    searchParams: URLSearchParams,
    updates: Record<string, string | null>,
) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}

export default function DoctorsListControls({
    totalItems,
    totalPages,
    itemsPerPage,
    specialties,
}: DoctorsListControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlPage = Number(searchParams.get("page") ?? 1);
    const safeUrlPage = Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1;
    const selectedSpecialties = searchParams.get("specialties") ?? "";

    const [optimisticPage, setOptimisticPage] = React.useState(safeUrlPage);
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        setOptimisticPage(safeUrlPage);
    }, [safeUrlPage]);

    const currentPage = isPending ? optimisticPage : safeUrlPage;

    const onPageChange = (page: number) => {
        const nextPage = Math.min(Math.max(1, page), totalPages);
        setOptimisticPage(nextPage);

        startTransition(() => {
            router.push(
                buildUrl(pathname, searchParams, {
                    page: String(nextPage),
                }),
            );
        });
    };

    const onSpecialtyChange = (value: string) => {
        setOptimisticPage(1);
        startTransition(() => {
            router.push(
                buildUrl(pathname, searchParams, {
                    specialties: value || null,
                    page: "1",
                }),
            );
        });
    };

    return (
        <div className="space-y-4">
            <FilterBar className="bg-muted/20">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Department
                    </p>
                    <FilterSelect
                        value={selectedSpecialties}
                        onChange={onSpecialtyChange}
                        options={specialties}
                        placeholder="All departments"
                        className="min-w-55"
                    />
                </div>
            </FilterBar>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <PaginationInfo
                    currentPage={safeUrlPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    alwaysShow
                />
            </div>
        </div>
    );
}
