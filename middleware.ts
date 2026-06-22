import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];
const authApiRoute = "/api/auth";

// Inline RBAC logic
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth API routes
  if (pathname.startsWith(authApiRoute)) {
    return NextResponse.next();
  }

  // Check session from cookie
  const sessionToken = req.cookies.get("authjs.session-token")?.value || 
                       req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // Root redirect
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Public routes
  if (isPublic) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For role-based checks, we'll defer to server-side in page components
  // since we can't decode JWT in Edge Runtime without bloating bundle
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
