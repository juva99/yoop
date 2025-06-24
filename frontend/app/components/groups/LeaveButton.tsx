"use client";
import React from "react";
import { Button } from "../ui/button";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  groupId: string;
};

async function leaveHandler(
  userId: string,
  groupId: string,
  router: ReturnType<typeof useRouter>,
) {
  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/leave/${userId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.message || "שגיאה ביציאה מהקבוצה";
      toast.error(message);
    } else {
      toast.success("יצאת מהקבוצה בהצלחה");
      router.refresh();
    }
  } catch (error: any) {
    console.error("Error leaving the group:", error);
  }
}
const LeaveButton: React.FC<Props> = ({ userId, groupId }) => {
  const router = useRouter();

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
      <Button
        type="button"
        onClick={() => leaveHandler(userId, groupId, router)}
        className="w-40 rounded-3xl bg-red-400"
      >
        עזוב קבוצה
      </Button>
    </div>
  );
};

export default LeaveButton;
