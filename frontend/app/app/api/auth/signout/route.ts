import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "../../../../lib/constants";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) {
    await deleteSession();
  }

  //redirect to welcomepage
  revalidatePath("/");
  return redirect("/");
}
