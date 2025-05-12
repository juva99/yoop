"use server"

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '../app/enums/role.enum';

export type Session = {
  user: {
    uid: string,
    name: string,
    role: Role,
  };
  accessToken: string;
  refreshToken: string;
} 

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(payload: Session): Promise<void> {
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

export async function getSession(): Promise<Session | null> {
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


export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function updateTokens({accessToken, refreshToken}: {
  accessToken: string;
  refreshToken: string;
}): Promise<void | null> { 
  const cookieStore = await cookies(); 
  const cookie = cookieStore.get("session")?.value;
  if (!cookie)
    return null;
  
  try {
    const { payload } = await jwtVerify(cookie, encodedKey);

    if (!payload)
      throw new Error("Session not found");

    const newPayload: Session = {
      user: {
        uid: (payload.user as Session['user']).uid,
        name: (payload.user as Session['user']).name,
        role: (payload.user as Session['user']).role,
      },
      accessToken,
      refreshToken
    }

    await createSession(newPayload);
  }
  catch (error) {
    console.error("Failed to update the tokens", error);
    redirect("/auth/login");
  }
  
}