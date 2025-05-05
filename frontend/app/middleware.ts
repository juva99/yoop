import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession(); 
  if (!session || !session.user) {
    console.log("user is not signed in - redirecting to login page")
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  NextResponse.next();
}

export const config = {
  matcher: ["/", "/mygames", "/game/create", "/games/create", "/search"]
}