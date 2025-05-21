"use client";
import { GameStatus } from "@/app/enums/game-status.enum";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import React from "react";
import { GoCheckCircle } from "react-icons/go";
import { GoXCircle } from "react-icons/go";

type Props = {
  gameId: string;
  onStatusChange: () => void;
};

const ApproveRejectGame: React.FC<Props> = ({ gameId, onStatusChange }) => {
  const approve = async () => {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to approve the game");
    }
    onStatusChange();
  };

  // const onAction = async (action: GameStatus) => {
  //   const response = await authFetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/${action}`,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );

  //   if (!response.ok) {
  //     console.error("Failed to approve the game");
  //   }
  //   onStatusChange();
  // };

  return (
    <div className="flex gap-2">
      <GoCheckCircle
        color="#25D366"
        size={22}
        // onClick={() => onAction(GameStatus.AVAILABLE)}
      />
      <GoXCircle
        color="red"
        size={22}
        // onClick={() => onAction(GameStatus.REJECTED)}
      />
    </div>
  );
};

export default ApproveRejectGame;
