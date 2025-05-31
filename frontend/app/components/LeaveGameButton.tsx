"use client";

import { leaveGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  gameId: string;
}

export default function LeaveGameButton({ gameId }: Props) {
  const router = useRouter();

  async function clickedLeave(gameId: string) {
    let res = await leaveGame(gameId);
    if (!res.ok) {
      toast.error(res.message || "אירעה שגיאה");
      return;
    }
    toast.success("יצאת מהמשחק בהצלחה");
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Button
        variant="submit"
        onClick={() => clickedLeave(gameId)}
        className="w-40 bg-red-400"
      >
        עזוב משחק
      </Button>
    </div>
  );
}
