"use client";
import { Game } from "@/app/types/Game";
import React from "react";
import GameCard from "../games/GameCard";
type Props = {
  games: Game[];
};

const FilteredGames: React.FC<Props> = ({ games }) => {
  return (
    <div className="mt-4 w-[100%] items-center overflow-hidden">
      <div className="filtered-games__list max-h-100 overflow-y-auto">
        {games.map((g, i) => (
          <div key={i}>
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredGames;
