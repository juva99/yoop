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
    try {
      await leaveGame(gameId);
      toast.success("יצאת מהמשחק בהצלחה");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message || "אירעה שגיאה");
    }
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
