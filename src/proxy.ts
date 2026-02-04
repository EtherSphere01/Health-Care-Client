import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

type userRole = "ADMIN" | "PATIENT" | "DOCTOR";
type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

interface IUserInterface {
    id: string;
    email: string;
    role: userRole;
    iat: number;
    exp: number;
}

const roleBasedRoutes = {
    ADMIN: ["/admin/dashboard/*"],
    DOCTOR: ["/doctor/dashboard/*"],
    PATIENT: ["/dashboard/*"],
};

const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
];

const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings"],
    pattern: [],
};

const doctorProtectedRoutes: RouteConfig = {
    pattern: [/^\/doctor/, /^\/appointments/],
    exact: [], // /assistant
};
const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin/],
    exact: [],
};
const patientProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: [],
};

const isAuthRoutes = (pathname: string): boolean => {
    return authRoutes.some((route: string) => route === pathname);
};

const isRoutesMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }

    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

const getRouteOwner = (pathname: string): userRole | "COMMON" | null => {
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

const getDefaultDashboardRoute = (role: userRole): string => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "DOCTOR") return "/doctor/dashboard";
    if (role === "PATIENT") return "/dashboard";
    return "/";
};

export default async function proxy(request: NextRequest) {
    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value || null;
    const refreshToken = request.cookies.get("refreshToken")?.value || null;
    // console.log("accessToken:", accessToken);
    // console.log("refreshToken:", refreshToken);

    let user: userRole | null = null;
    if (accessToken) {
        try {
            const verified: JwtPayload | string = jwt.verify(
                accessToken,
                process.env.JWT_SECRET as string,
                { algorithms: ["HS256"] },
            );

            if (typeof verified === "string") {
                cookieStore.delete("accessToken");
                cookieStore.delete("refreshToken");
                throw new Error("Invalid Token Structure");
            }

            const decodedToken = verified as IUserInterface;
            user = decodedToken.role;
        } catch (error) {
            const response = NextResponse.redirect(
                new URL("/login", request.url),
            );

            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");

            return response;
        }
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoutes(pathname);

    if (accessToken && isAuth) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(user as userRole), request.url),
        );
    }

    if (routerOwner === null) {
        return NextResponse.next();
    }

    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    if (
        routerOwner === "ADMIN" ||
        routerOwner === "DOCTOR" ||
        routerOwner === "PATIENT"
    ) {
        if (user !== routerOwner) {
            return NextResponse.redirect(
                new URL(
                    getDefaultDashboardRoute(user as userRole),
                    request.url,
                ),
            );
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
    ],
};
