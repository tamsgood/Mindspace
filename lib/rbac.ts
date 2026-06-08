import type { Role } from "@prisma/client";

/** Routes only mentors may access (teaching tools). Admins use /admin instead. */
export const MENTOR_ONLY_ROUTES = [
  "/assignments/new",
  "/materials/new",
  "/students",
  "/mentor",
] as const;

/** Admin oversight — no learning/submission flows. */
export const ADMIN_ONLY_ROUTES = ["/admin"] as const;

/** Student learning flows — mentors may also access; admins may not. */
export const LEARNING_ROUTES = [
  "/learn",
  "/progress",
  "/submissions",
  "/my-classes",
  "/schedule",
] as const;

export function isMentor(role: Role) {
  return role === "MENTOR";
}

export function isAdmin(role: Role) {
  return role === "ADMIN";
}

export function isStudent(role: Role) {
  return role === "STUDENT";
}

export function isStaff(role: Role) {
  return role === "MENTOR" || role === "ADMIN";
}

function matchesPrefix(pathname: string, routes: readonly string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function canAccessRoute(role: Role, pathname: string) {
  if (matchesPrefix(pathname, ADMIN_ONLY_ROUTES)) {
    return isAdmin(role);
  }

  if (matchesPrefix(pathname, MENTOR_ONLY_ROUTES)) {
    return isMentor(role);
  }

  if (matchesPrefix(pathname, LEARNING_ROUTES)) {
    return isStudent(role) || isMentor(role);
  }

  if (isAdmin(role)) {
    const adminAllowed = [
      "/dashboard",
      "/profile",
      "/settings",
      "/search",
      "/announcements",
      "/notifications",
    ];
    return adminAllowed.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  }

  return true;
}

export function roleLabel(role: Role) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "MENTOR":
      return "Mentor";
    default:
      return "Student";
  }
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
