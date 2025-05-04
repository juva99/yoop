"use client";

import { joinGame } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  gameId: string;
}

export default function JoinGameButton({ gameId }: Props) {
  const router = useRouter();

  async function clickedJoin(gameId: string) {
    await joinGame(gameId);
    router.refresh();
  }

  return (
    <button
      onClick={() => clickedJoin(gameId)}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      הצטרף למשחק
    </button>
  );
}
