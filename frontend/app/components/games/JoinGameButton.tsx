"use client";

import { joinGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  gameId: string;
}

export default function JoinGameButton({ gameId }: Props) {
  const router = useRouter();

  async function clickedJoin(gameId: string) {
    let res = await joinGame(gameId);
    if (!res.ok) {
      toast.error(res.message || "אירעה שגיאה");
      return;
    }
    toast.success("הצטרפת לרשימת ההמתנה בהצלחה");
    router.refresh();
  }

  return (
    <Button
      variant="submit"
      onClick={() => clickedJoin(gameId)}
      className="w-40 bg-blue-500"
    >
      הצטרף למשחק
    </Button>
  );
}
