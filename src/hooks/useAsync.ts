"use client";

import { useState, useCallback } from "react";
import { IErrorResponse } from "@/types";

interface UseAsyncState<T> {
    data: T | null;
    error: IErrorResponse | null;
    isLoading: boolean;
}

interface UseAsyncReturn<T, P extends unknown[]> extends UseAsyncState<T> {
    execute: (...params: P) => Promise<T | null>;
    reset: () => void;
    setData: (data: T | null) => void;
}

/**
 * Custom hook for handling async operations with loading and error states
 */
export function useAsync<T, P extends unknown[] = []>(
    asyncFunction: (...params: P) => Promise<{ data: T; success: boolean }>,
    immediate = false,
): UseAsyncReturn<T, P> {
    const [state, setState] = useState<UseAsyncState<T>>({
        data: null,
        error: null,
        isLoading: immediate,
    });

    const execute = useCallback(
        async (...params: P): Promise<T | null> => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const response = await asyncFunction(...params);
                setState({
                    data: response.data,
                    error: null,
                    isLoading: false,
                });
                return response.data;
            } catch (error) {
                const errorResponse = error as IErrorResponse;
                setState({
                    data: null,
                    error: errorResponse,
                    isLoading: false,
                });
                return null;
            }
        },
        [asyncFunction],
    );

    const reset = useCallback(() => {
        setState({ data: null, error: null, isLoading: false });
    }, []);

    const setData = useCallback((data: T | null) => {
        setState((prev) => ({ ...prev, data }));
    }, []);

    return { ...state, execute, reset, setData };
}

/**
 * Custom hook for handling form submissions
 */
export function useFormSubmit<T, P extends unknown[] = [FormData]>(
    submitFunction: (
        ...params: P
    ) => Promise<{ success: boolean; message?: string; data?: T }>,
) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = useCallback(
        async (...params: P): Promise<{ success: boolean; data?: T }> => {
            setIsSubmitting(true);
            setError(null);
            setSuccess(false);

            try {
                const response = await submitFunction(...params);
                if (response.success) {
                    setSuccess(true);
                    return { success: true, data: response.data };
                } else {
                    setError(response.message || "An error occurred");
                    return { success: false };
                }
            } catch (err) {
                const errorMessage =
                    (err as { message?: string })?.message ||
                    "An error occurred";
                setError(errorMessage);
                return { success: false };
            } finally {
                setIsSubmitting(false);
            }
        },
        [submitFunction],
    );

    const reset = useCallback(() => {
        setIsSubmitting(false);
        setError(null);
        setSuccess(false);
    }, []);

    return { submit, isSubmitting, error, success, reset };
}
