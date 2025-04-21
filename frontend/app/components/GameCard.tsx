import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
  const { id, field_name, type, date, time, players, price } = game;

  return (
    <Link href={`/game/${id}`}>
      <div className="flex h-[130px] items-center pr-5 text-right">
        <div className="game-details">
          <span className="flex items-center gap-3 text-[24px] font-medium text-blue-400">
            {type.toLowerCase() === "basketball" ? (
              <PiBasketball />
            ) : type.toLowerCase() === "soccer" ? (
              <PiSoccerBall />
            ) : null}
            {field_name}
          </span>
          <p className="text-gray-500">
            {date} | {time} {price && "|" + price + "₪"}
          </p>
          <AvatarGroup players={players} />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
