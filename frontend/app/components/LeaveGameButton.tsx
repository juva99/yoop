"use client";

import { leaveGame } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  gameId: string;
}

export default function LeaveGameButton({ gameId }: Props) {
  const router = useRouter();

  async function clickedLeave(gameId: string) {
    await leaveGame(gameId);
    router.refresh();
  }

  return (
    <button
      onClick={() => clickedLeave(gameId)}
      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
      עזוב משחק
    </button>
  );
}
