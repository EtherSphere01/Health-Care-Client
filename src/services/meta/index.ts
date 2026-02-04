"use server";

import { get } from "@/lib/api";
import { IDashboardMeta, IApiResponse } from "@/types";

/**
 * Get dashboard metadata based on user role
 */
export async function getDashboardMeta(): Promise<
    IApiResponse<IDashboardMeta>
> {
    return get<IDashboardMeta>("/meta", undefined, {
        tags: ["meta", "dashboard"],
        revalidate: 30,
    });
}
