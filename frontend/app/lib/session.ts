"use server"

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Session = {
  user: {
    uid: string,
    name: string,
  };
  // accessToken: string;
  // refreshToken: string;
} 

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  
  const cookieStore = await cookies();
  
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/"
  });
}

export async function getSession() {
  const cookieStore = await cookies(); 
  
  const cookie = cookieStore.get("session")?.value;

  if (!cookie)
    return null;
  
  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"]
    });

    return payload as Session
  }
  catch (error) {
    console.error("Failed to verify the session", error);
    redirect("/auth/login");
  }
}