import { NextRequest, NextResponse } from "next/server";
import { getSession, isExpired } from "./lib/session";
import { refreshToken } from "./lib/auth";
import { Role } from "./app/enums/role.enum";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  const url = req.nextUrl.clone();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  const isTokenExpired = await isExpired();
  if (isTokenExpired) {
    try {
      const refreshed_token = await refreshToken(session.refreshToken);
      if (!refreshed_token) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }
  }

  if (session.user.role === Role.ADMIN && !url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    session.user.role === Role.FIELD_MANAGER &&
    !url.pathname.startsWith("/field-manager")
  ) {
    return NextResponse.redirect(new URL("/field-manager", req.nextUrl));
  }

  if (
    session.user.role === Role.USER &&
    (url.pathname.startsWith("/field-manager") ||
      url.pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except API routes, auth routes, contact page, and static files
    "/((?!api|auth|contact|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
