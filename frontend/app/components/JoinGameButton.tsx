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
    await joinGame(gameId);
    toast.success("הצטרפת לרשימת ההמתנה");
    router.refresh();
  }

  return (
    <Button onClick={() => clickedJoin(gameId)} variant={"submit"}>
      הצטרף למשחק
    </Button>
  );
}
