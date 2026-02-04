import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoutes,
    IUserInterface,
    userRole,
} from "./lib/auth.utils";
import { deleteCookie } from "./services/auth/tokenHandlers";

export default async function proxy(request: NextRequest) {
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
                await deleteCookie("accessToken");
                await deleteCookie("refreshToken");
                throw new Error("Invalid Token Structure");
            }

            const decodedToken = verified as IUserInterface;
            user = decodedToken.role;
        } catch (error) {
            // If the token is invalid or expired, clear cookies.
            // Avoid redirecting /login (or other auth routes) back to itself,
            // which can cause an infinite redirect loop when a bad token is present.
            const isAuthPath = isAuthRoutes(pathname);

            const response = isAuthPath
                ? NextResponse.next()
                : NextResponse.redirect(new URL("/login", request.url));

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
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
    ],
};
