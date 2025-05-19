"use client";
import { GameStatus } from "@/app/enums/game-status.enum";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import React from "react";

type Props = {
  gameId: string;
};

const AproveRejectGame: React.FC<Props> = ({ gameId }) => {
  const setStatus = async (status: GameStatus) => {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/setStatus`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to approve the game");
    }
    console.log(response);
  };

  return (
    <div>
      <Button
        onClick={() => setStatus(GameStatus.AVAILABLE)}
        className="h-7 rounded-none rounded-tr-lg rounded-br-lg bg-green-300 p-2"
      >
        אשר
      </Button>
      <Button
        onClick={() => setStatus(GameStatus.REJECTED)}
        className="h-7 rounded-none rounded-tl-lg rounded-bl-lg bg-red-300 p-2"
      >
        דחה
      </Button>
    </div>
  );
};

export default AproveRejectGame;
