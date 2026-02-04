import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setCookie = async (
    key: string,
    value: string,
    cookie?: Partial<ResponseCookie>,
) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, cookie);
};

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(key);
};

export const getCookie = async (key: string): Promise<string | null> => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie ? cookie.value : null;
};
