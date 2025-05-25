"use client";

import { leaveGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

interface Props {
  gameId: string;
}

export default function LeaveGameButton({ gameId }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function clickedLeave(gameId: string) {
    try {
      await leaveGame(gameId);
    } catch (error) {
      setError((error as Error).message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="submit"
        onClick={() => clickedLeave(gameId)}
        className="bg-red-500"
      >
        עזוב משחק
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
