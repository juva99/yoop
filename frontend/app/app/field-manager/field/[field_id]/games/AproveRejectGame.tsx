"use client";
import { authFetch } from "@/lib/authFetch";
import React from "react";
import { GoCheckCircle } from "react-icons/go";
import { GoXCircle } from "react-icons/go";
import { toast } from "sonner";
type Props = {
  gameId: string;
};

const ApproveRejectGame: React.FC<Props> = ({ gameId }) => {
  const onAction = async (action: "decline" | "approve") => {
    const method = action === "approve" ? "PATCH" : "DELETE";
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/${action}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      toast.error("אירעה שגיאה");
    } else {
      if (action === "approve") {
        toast.success("המשחק אושר");
      } else {
        toast.error("בקשת המשחק נדחתה");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <GoCheckCircle
        color="#25D366"
        size={22}
        onClick={() => onAction("approve")}
      />
      <GoXCircle color="red" size={22} onClick={() => onAction("decline")} />
    </div>
  );
};

export default ApproveRejectGame;
