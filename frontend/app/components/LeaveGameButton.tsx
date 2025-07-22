"use client";

import { leaveGame } from "@/lib/actions";
import { redirect, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  gameId: string;
  text: string;
  isCreator: boolean;
}

export default function LeaveGameButton({ gameId, text, isCreator }: Props) {
  const router = useRouter();

  async function clickedLeave(gameId: string) {
    let res = await leaveGame(gameId);
    if (!res.ok) {
      toast.error(res.message || "אירעה שגיאה");
      return;
    }
    toast.success("יצאת מהמשחק בהצלחה");
    if (isCreator) {
      redirect("/");
    }
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Button
        variant="submit"
        onClick={() => clickedLeave(gameId)}
        className="w-40 bg-red-400"
      >
        {text}
      </Button>
    </div>
  );
}
