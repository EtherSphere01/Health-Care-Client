"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { IMeta } from "@/types";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalFromServer?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  updateFromMeta: (meta: IMeta) => void;
  getQueryParams: () => { page: number; limit: number };
}

/**
 * Custom hook for pagination management
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, totalFromServer = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(totalFromServer);

  const totalPages = Math.ceil(total / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage((p) => p - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const updateFromMeta = useCallback((meta: IMeta) => {
    setTotal(meta.total);
    setPage(meta.page);
    setLimit(meta.limit);
  }, []);

  const getQueryParams = useCallback(() => ({ page, limit }), [page, limit]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit: handleSetLimit,
    setTotal,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
    updateFromMeta,
    getQueryParams,
  };
}

/**
 * Custom hook for search with debounce
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for search functionality
 */
export function useSearch(defaultValue = "") {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
    clearSearch,
    setSearchTerm,
  };
}

/**
 * Custom hook for filters
 */
export function useFilters<T extends Record<string, unknown>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const getActiveFilters = useCallback(() => {
    return Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    clearFilter,
    setFilters,
    getActiveFilters,
  };
}
