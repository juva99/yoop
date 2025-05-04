"use client";
import { Game } from "@/app/types/Game";
import React, { useState } from "react";
import GameCard from "../GameCard";
import ExpandableGameCard from "../ExpandableGameCard";

type Props = {
  games: Game[];
};

const FilteredGames: React.FC<Props> = ({ games }) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>(games);
  const [availables, setAvailables] = useState<Game[]>([]);

  return (
    <div className="mt-4 w-[100%] items-center overflow-hidden">
      <p>
        <span className="text-title ml-2 text-xl">{games.length} נמצאו</span>
        <span className="text-subtitle">{availables.length} פנוים להרשמה</span>
      </p>
      <div className="filtered-games__list max-h-100 overflow-y-auto">
        {games.map((g, i) => (
          <div key={i} className="border-1">
            <ExpandableGameCard game={g} buttonTitle="הצטרף" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredGames;
