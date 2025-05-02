import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
  const {
    gameId,
    gameType,
    startDate,
    endDate,
    maxParticipants,
    status,
    gameParticipants,
    creator,
    field,
    price,
  } = game;

  return (
    <Link href={`/game/${gameId}`}>
      <div className="flex h-[130px] items-center pr-5 text-right">
        <div className="game-details">
          <span className="flex items-center gap-3 text-[24px] font-medium text-blue-400">
            {gameType.toLowerCase() === "basketball" ? (
              <PiBasketball />
            ) : gameType.toLowerCase() === "soccer" ? (
              <PiSoccerBall />
            ) : null}
            {field.fieldName}
          </span>
          <p className="text-gray-500">
            {startDate.getDay()} | {startDate.getHours()}{" "}
            {price && "|" + price + "₪"}
          </p>
          <AvatarGroup players={gameParticipants} />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
