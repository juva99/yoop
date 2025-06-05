import React from "react";
import { PiPlus } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import GameCard from "./GameCard";

interface Props {
  game: Game;
}

const GameOverview: React.FC<Props> = ({ game }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border-1 border-[#e5e5e6] bg-white p-4 shadow-xl">
      <GameCard game={game} />
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2">
          <PiPlus className="text-blue-400" />
        </button>
      </div>
    </div>
  );
};

export default GameOverview;
