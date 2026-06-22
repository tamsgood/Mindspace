import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];

// Inline RBAC logic to reduce bundle size
const MENTOR_ONLY_ROUTES = ["/assignments/new", "/materials/new", "/students", "/mentor"];
const ADMIN_ONLY_ROUTES = ["/admin"];
const LEARNING_ROUTES = ["/learn", "/progress", "/submissions", "/my-classes", "/schedule"];

function matchesPrefix(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function canAccessRoute(role: string, pathname: string) {
  if (matchesPrefix(pathname, ADMIN_ONLY_ROUTES)) {
    return role === "ADMIN";
  }

  if (matchesPrefix(pathname, MENTOR_ONLY_ROUTES)) {
    return role === "MENTOR";
  }

  if (matchesPrefix(pathname, LEARNING_ROUTES)) {
    return role === "STUDENT" || role === "MENTOR";
  }

  if (role === "ADMIN") {
    const adminAllowed = ["/dashboard", "/profile", "/settings", "/search", "/announcements", "/notifications"];
    return adminAllowed.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  }

  return true;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthApi = pathname.startsWith("/api/auth");

  if (isAuthApi) return NextResponse.next();

  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublic) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle corrupt JWT or missing role
  if (!role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessRoute(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
