import { NextRequest, NextResponse } from "next/server";
import { getSession, isExpired } from "./lib/session";
import { refreshToken } from "./lib/auth";

export default async function middleware(req: NextRequest) {
  const session = await getSession();

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/mygames", "/game/create", "/games/create", "/search"],
};
