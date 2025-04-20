import React from "react";
import { PiBasketball, PiPlus, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
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
          <div className="players mt-2 flex items-center justify-end gap-3">
            <div className="flex gap-x-1">
              {players.slice(0, 4).map((player, index) => (
                <img
                  key={index}
                  src={player.image}
                  alt={player.name}
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
              ))}
            </div>

            {players.length > 4 && <span>+{players.length - 4}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
