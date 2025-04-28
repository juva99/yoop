import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "../../../../lib/constants";


export async function GET(req: NextRequest) {
  const response = await authFetch(
    `${BACKEND_URL}/auth/signout`,
    {
      method: "POST",
    }
  );
  
  if (response.ok) {
    await deleteSession();
  }
 
  //redirect to welcomepage
  revalidatePath("/")
  return NextResponse.redirect(new URL("/", req.nextUrl));
}