"use client";

import { leaveGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <button
        onClick={() => clickedLeave(gameId)}
        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        >
        עזוב משחק
      </button>
      {error && 
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
      }
    </div>
  );
}
