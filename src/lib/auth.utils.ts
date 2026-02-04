export type userRole = "ADMIN" | "PATIENT" | "DOCTOR";
export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

export interface IUserInterface {
    id: string;
    email: string;
    role: userRole;
    iat: number;
    exp: number;
}

export const roleBasedRoutes = {
    ADMIN: ["/admin/dashboard/*"],
    DOCTOR: ["/doctor/dashboard/*"],
    PATIENT: ["/dashboard/*"],
};

export const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
];

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings"],
    pattern: [],
};

export const doctorProtectedRoutes: RouteConfig = {
    pattern: [/^\/doctor/, /^\/appointments/],
    exact: [], // /assistant
};
export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin/],
    exact: [],
};
export const patientProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: [],
};

export const isAuthRoutes = (pathname: string): boolean => {
    return authRoutes.some((route: string) => route === pathname);
};

export const isRoutesMatches = (
    pathname: string,
    routes: RouteConfig,
): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }

    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): userRole | "COMMON" | null => {
    if (isRoutesMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    } else if (isRoutesMatches(pathname, doctorProtectedRoutes)) {
        return "DOCTOR";
    } else if (isRoutesMatches(pathname, patientProtectedRoutes)) {
        return "PATIENT";
    } else if (isRoutesMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
};

export const getDefaultDashboardRoute = (role: userRole): string => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "DOCTOR") return "/doctor/dashboard";
    if (role === "PATIENT") return "/dashboard";
    return "/";
};
