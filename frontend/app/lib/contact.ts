// lib/getContactRequests.ts
import { authFetch } from "@/lib/authFetch";

export async function getContactRequests() {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manager-signup`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!response.ok) {
    console.error("Failed to fetch contact requests");
    return [];
  }

  return response.json();
}
