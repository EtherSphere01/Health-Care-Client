"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showFirstLast?: boolean;
    siblingCount?: number;
    alwaysShow?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
    showFirstLast = true,
    siblingCount = 1,
    alwaysShow = false,
}: PaginationProps) {
    const generatePages = () => {
        const pages: (number | "...")[] = [];

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const leftSibling = Math.max(2, currentPage - siblingCount);
        const rightSibling = Math.min(
            totalPages - 1,
            currentPage + siblingCount,
        );

        // Add ellipsis if needed after first page
        if (leftSibling > 2) {
            pages.push("...");
        }

        // Add pages around current
        for (let i = leftSibling; i <= rightSibling; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        // Add ellipsis if needed before last page
        if (rightSibling < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1 && !alwaysShow) return null;

    const pages = generatePages();

    return (
        <nav
            className={cn("flex items-center justify-center gap-1", className)}
            aria-label="Pagination"
        >
            {showFirstLast && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
            )}

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {showFirstLast && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            )}
        </nav>
    );
}

interface PaginationInfoProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    className?: string;
}

export function PaginationInfo({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    className,
}: PaginationInfoProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <p className={cn("text-sm text-muted-foreground", className)}>
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
        </p>
    );
}

interface PageSizeSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    className?: string;
}

export function PageSizeSelector({
    value,
    onChange,
    options = [10, 25, 50, 100],
    className,
}: PageSizeSelectorProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <label className="text-sm text-muted-foreground">Show</label>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
        </div>
    );
}
