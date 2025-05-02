"use client";
import { Game } from "@/app/types/Game";
import React, { useState } from "react";
import GameCard from "../GameCard";

type Props = {
  games: Game[];
};

const FilteredGames: React.FC<Props> = ({ games }) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>(games);
  const [availables, setAvailables] = useState<Game[]>([]);

  return (
    <div className="mt-4 h-70 w-[100%] items-center overflow-hidden">
      <p>
        <span className="text-title ml-2 text-xl">{games.length} נמצאו</span>
        <span className="text-subtitle">{availables.length} פנוים להרשמה</span>
      </p>
      <div className="filtered-games__list max-h-100 overflow-y-auto">
        {filteredGames.map((g) => (
          <div className="border-1">
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredGames;
